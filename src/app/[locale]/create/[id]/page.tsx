interface CreateTaskPageProps {
  params: Promise<{ id: string }>;
}

export default async function CreateTaskPage({ params }: CreateTaskPageProps) {
  const { id } = await params;
  const progress = 62;

  return (
    <>
      <section className="panel hero">
        <p className="kicker">/create/{id}</p>
        <h1 className="title">Generation Task Dashboard</h1>
        <p className="subtitle">
          Dynamic route for generation progress, realtime preview status, stems
          export readiness, and parameter tuning.
        </p>
      </section>

      <section className="panel">
        <h2>Task ID</h2>
        <p className="mono">{id}</p>
        <div
          className="progress"
          role="progressbar"
          aria-valuenow={progress}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <span style={{ width: `${progress}%` }} />
        </div>
        <p className="song-meta">
          Pipeline status: Melody Drafting ({progress}%)
        </p>
      </section>

      <section className="card-grid">
        <article className="card">
          <h3>Realtime Preview</h3>
          <p>Waveform and low-latency preview stream placeholder.</p>
        </article>
        <article className="card">
          <h3>Stems Export</h3>
          <p>Bass, drums, vocals, and FX export section placeholder.</p>
        </article>
        <article className="card">
          <h3>Parameter Tuning</h3>
          <p>
            Energy, structure, and arrangement re-generation controls
            placeholder.
          </p>
        </article>
      </section>
    </>
  );
}
