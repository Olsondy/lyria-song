# Task Sync Service (V2 API)

## Overview

The Task Sync Service provides a generic task synchronization mechanism for Suno V2 API. It handles multiple task types (extend, lyrics, and future tasks like generate, replace, merge) with robust error handling, timeout fallback, and idempotent operations.

## Architecture

### Directory Structure

```
src/lib/task-sync/server/
├── index.ts           # Public API exports
├── types.ts           # Type definitions
├── task-sync.ts       # Main sync orchestrator
├── status-fetcher.ts  # V2 API status fetching
├── result-mapper.ts   # Map V2 results to DB format
├── error-handler.ts   # Error classification
├── timeout-handler.ts # Timeout logic with CDN fallback
└── db-updater.ts      # Database update operations
```

### Core Components

| Component | Responsibility |
|-----------|---------------|
| `task-sync.ts` | Main orchestrator - coordinates the sync flow |
| `status-fetcher.ts` | Fetches task status from V2 API |
| `result-mapper.ts` | Maps V2 results to database format using task handlers |
| `error-handler.ts` | Classifies API errors as permanent or transient |
| `timeout-handler.ts` | Handles 10-minute timeout with CDN fallback |
| `db-updater.ts` | Updates clips and generation status in database |

## Task Types

The service supports multiple task types through a handler pattern:

```typescript
type TaskType = "extend" | "lyrics" | "generate" | "replace" | "merge";
```

### Extend Handler
- Maps V2 results to `music_clips` with audio URLs
- Supports CDN fallback on timeout
- Used for song extension tasks

### Lyrics Handler
- Maps V2 results to `music_clips` with `audio_url = null`
- Text-based results only
- No CDN fallback needed

## Usage

### Basic Sync

```typescript
import { syncTask, syncTasksList } from "@/lib/task-sync/server";

// Sync a single task
const result = await syncTask(supabase, generation, userId);

// Sync multiple tasks
const updatedGenerations = await syncTasksList(supabase, generations, userId);
```

### Sync Result

```typescript
interface TaskSyncResult {
  status: "synced" | "skipped" | "failed";
  reason?: string;        // Why skipped/failed
  newStatus?: GenerationStatus;
  itemsUpdated?: number;
}
```

## Sync Flow

1. **Fetch Status** - Call V2 API to get task status
2. **Error Classification** - Classify as permanent or transient
3. **Timeout Check** - Apply CDN fallback if timed out
4. **Result Mapping** - Map V2 results to DB format using task handler
5. **Update Clips** - Update clips FIRST (data consistency)
6. **Update Generation** - Update generation status SECOND

### Data Consistency Pattern

The service always updates clips before generation status:

```typescript
// 1. Update clips (FIRST)
const clipResult = await updateClipsFromV2Results(supabase, generation, clipData);

if (!clipResult.success) {
  // Keep generation pending for retry
  return { status: "failed", reason: "clips_update_failed" };
}

// 2. Update generation status (SECOND) - only if clips succeeded
await updateGenerationStatus(supabase, generationId, newStatus);
```

## Error Handling

### Permanent Errors (Immediate Failure)

These errors mark the generation as failed immediately:
- Producer tag error (artist reference)
- Copyrighted material
- Inappropriate content
- Moderation flagged
- Malformed prompt

### Transient Errors (Retry)

Non-permanent errors keep the generation pending for retry on next poll.

### Timeout Handling

After 10 minutes without completion:
- **With results**: Apply CDN fallback and mark complete
- **Without results**: Mark as failed

```typescript
if (isTimedOut(created_at)) {
  if (results.length > 0) {
    // Apply CDN fallback for extend tasks
    const resultsWithFallback = applyTimeoutFallback(taskType, results);
    // Update and mark complete
  } else {
    // Mark as failed
    return markAsFailed(supabase, generationId, userId, taskId, {
      code: MusicGenerationErrorCode.API_ERROR,
      message: "Task timed out after 10 minutes."
    });
  }
}
```

## API Endpoint

### POST /api/music/v2/sync

Sync pending V2 task generations for the current user.

**Request Body (optional):**
```json
{
  "taskIds": ["task-id-1", "task-id-2"]
}
```

**Response:**
```json
{
  "generations": [...],
  "syncedCount": 5
}
```

### GET /api/music/v2/sync

Get pending V2 task generations without syncing.

**Response:**
```json
{
  "generations": [...],
  "count": 3
}
```

## Database Schema

### music_generations.task_type Column

```sql
ALTER TABLE music_generations
ADD COLUMN task_type TEXT NULL;

-- Index for filtering by task type
CREATE INDEX idx_music_generations_task_type
ON music_generations(task_type)
WHERE task_type IS NOT NULL;

-- Index for pending V2 tasks
CREATE INDEX idx_music_generations_v2_pending
ON music_generations(task_type, status)
WHERE task_type IS NOT NULL
  AND status IN ('submitted', 'queued', 'processing', 'streaming');
```

### Setting task_type

When creating a V2 generation, set the `task_type`:

```typescript
const { data: generation } = await supabase
  .from("music_generations")
  .insert({
    user_id: user.id,
    task_id: taskId,
    task_type: "extend", // V2 task type
    status: "submitted",
    // ... other fields
  });
```

## Placeholder Clip Pattern

The service handles placeholder clips created during initial generation:

### Placeholder Formats
- V1: `${taskId}-clip-1`, `${taskId}-clip-2`
- V2: `${taskId}-extend-0`, `${taskId}-lyrics-0`

### Update Modes

1. **Placeholder Mode** (first sync): Update by array position
2. **Non-Placeholder Mode** (subsequent syncs): Update by exact `clip_id` match

```typescript
function isPlaceholderClipId(clipId: string): boolean {
  return /-clip-\d+$/.test(clipId) ||
         /-extend-\d+$/.test(clipId) ||
         /-lyrics-\d+$/.test(clipId);
}
```

## Logging

All operations use the `[TaskSync]` prefix for easy filtering:

```
[TaskSync] Syncing task { userId, generationId, taskId, taskType }
[TaskSync] Fetching status from V2 API { taskId }
[TaskSync] V2 API status fetched { taskId, status, resultCount }
[TaskSync] Placeholder mode - updating by position { generationId, count }
[TaskSync] Updated generation status { generationId, status }
```

## Extending for New Task Types

To add a new task type:

1. Add to `TaskType` union in `types.ts`
2. Create handler in `result-mapper.ts`:

```typescript
const newTaskHandler: TaskResultHandler = {
  taskType: "new-task",
  mapToClips(results, generation) {
    // Map results to MappedClipData[]
  },
  deriveStatus(results) {
    // Derive GenerationStatus from results
  },
  supportsTimeoutFallback() {
    return true; // or false for text-only tasks
  }
};

// Register in handlers
const handlers: Record<TaskType, TaskResultHandler> = {
  // ... existing handlers
  "new-task": newTaskHandler,
};
```

3. Update `timeout-handler.ts` if needed for fallback logic

## V1 vs V2 Sync

| Aspect | V1 Sync | V2 Sync |
|--------|---------|---------|
| Location | `lib/sync/` | `lib/task-sync/server/` |
| API | V1 (`getMusicStatus`) | V2 (`getStatusV2`) |
| Task Type | Inferred | Stored in `task_type` column |
| Endpoint | `/api/music/clips/sync` | `/api/music/v2/sync` |
| Generation Filter | `task_type IS NULL` | `task_type IS NOT NULL` |

Both sync services run in parallel - V1 for legacy generations, V2 for new tasks.

## Related Files

- [src/lib/suno-api/server/suno-v2.ts](../src/lib/suno-api/server/suno-v2.ts) - V2 API client
- [src/app/api/music/v2/sync/route.ts](../src/app/api/music/v2/sync/route.ts) - Sync endpoint
- [src/app/api/music/extend/route.ts](../src/app/api/music/extend/route.ts) - Extend API
- [supabase/migrations/20260122_add_task_type_to_music_generations.sql](../supabase/migrations/20260122_add_task_type_to_music_generations.sql) - Migration
