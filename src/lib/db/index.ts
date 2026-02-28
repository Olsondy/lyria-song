import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

let dbInstance: ReturnType<typeof drizzle> | null = null;
let sqlInstance: ReturnType<typeof postgres> | null = null;

export function getDb() {
  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    throw new Error(
      "DATABASE_URL is not configured. Set DATABASE_URL before using Drizzle.",
    );
  }

  if (!sqlInstance) {
    sqlInstance = postgres(connectionString, { prepare: false });
  }

  if (!dbInstance) {
    dbInstance = drizzle(sqlInstance, { schema });
  }

  return dbInstance;
}
