const resources = [
  {
    title: "Prompt Engineering Handbook",
    type: "Manual",
    description: "Structured templates for controllable generation quality.",
  },
  {
    title: "Audio Generation Evaluation Whitepaper",
    type: "Whitepaper",
    description:
      "Evaluation metrics, benchmark datasets, and failure taxonomies.",
  },
  {
    title: "Commercial Licensing Guide",
    type: "Guide",
    description:
      "Rights, ownership boundaries, and production-safe usage patterns.",
  },
];

export default function ResourcesPage() {
  return (
    <>
      <section className="panel hero">
        <p className="kicker">/resources</p>
        <h1 className="title">Authority Resource Center</h1>
        <p className="subtitle">
          GEO-oriented content hub for manuals, whitepapers, and long-form
          educational assets.
        </p>
      </section>

      <section className="card-grid">
        {resources.map((item) => (
          <article key={item.title} className="card">
            <h3>{item.title}</h3>
            <p className="song-meta">{item.type}</p>
            <p>{item.description}</p>
          </article>
        ))}
      </section>
    </>
  );
}
