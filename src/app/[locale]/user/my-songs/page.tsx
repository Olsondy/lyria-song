import { desc, eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { routing } from "@/i18n/routing";
import { getServerSession } from "@/lib/auth/session";
import { getDb } from "@/lib/db";
import { songs } from "@/lib/db/schema";

interface MySongsPageProps {
  params: Promise<{ locale: string }>;
}

export default async function MySongsPage({ params }: MySongsPageProps) {
  const { locale } = await params;
  const session = await getServerSession();
  const userId = session?.user?.id;

  if (!userId) {
    const nextPath =
      locale === routing.defaultLocale
        ? "/user/my-songs"
        : `/${locale}/user/my-songs`;
    const loginPath =
      locale === routing.defaultLocale
        ? "/auth/login"
        : `/${locale}/auth/login`;
    redirect(`${loginPath}?next=${encodeURIComponent(nextPath)}`);
  }

  let mySongs: Array<typeof songs.$inferSelect> = [];
  let dbError: string | null = null;

  try {
    const db = getDb();
    mySongs = await db
      .select()
      .from(songs)
      .where(eq(songs.userId, userId))
      .orderBy(desc(songs.createdAt))
      .limit(50);
  } catch (error) {
    dbError =
      error instanceof Error ? error.message : "Unknown database error.";
  }

  return (
    <>
      <section className="panel hero">
        <p className="kicker">/user/my-songs</p>
        <h1 className="title">My Songs Vault</h1>
        <p className="subtitle">
          Private history library scoped to the authenticated user. Data is read
          with Drizzle ORM.
        </p>
      </section>

      <section className="panel">
        {dbError ? (
          <div className="error">{dbError}</div>
        ) : mySongs.length === 0 ? (
          <p className="subtitle">
            No songs yet. Start in <span className="mono">/create</span> and
            this list will fill as records are created.
          </p>
        ) : (
          <div className="song-list">
            {mySongs.map((song) => (
              <article className="song-item" key={song.id}>
                <strong>{song.title}</strong>
                <span className="song-meta">Status: {song.status}</span>
                <span className="song-meta">Prompt: {song.prompt}</span>
                <span className="song-meta mono">ID: {song.id}</span>
              </article>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
