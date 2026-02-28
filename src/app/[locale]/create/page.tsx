import { Link } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";

interface CreatePageProps {
  params: Promise<{ locale: string }>;
}

const flow = [
  { step: "Prompt Draft", detail: "Describe mood, tempo, and reference feel." },
  {
    step: "Generate Task",
    detail: "Submit generation request and get task id.",
  },
  {
    step: "Realtime Progress",
    detail: "Track status and preview output while processing.",
  },
  { step: "Post Process", detail: "Export stems and fine-tune parameters." },
];

export default async function CreatePage({ params }: CreatePageProps) {
  const { locale } = await params;
  const demoTaskId = "task-demo-001";
  const nextPath =
    locale === routing.defaultLocale ? "/create" : `/${locale}/create`;
  const loginHref = `/auth/login?next=${encodeURIComponent(nextPath)}`;

  return (
    <>
      <section className="panel hero">
        <p className="kicker">/create</p>
        <h1 className="title">Creation Workspace</h1>
        <p className="subtitle">
          This workspace is mapped to your MVP workbench layer and links to
          dynamic task progress via <span className="mono">/create/[id]</span>.
        </p>
        <div className="button-row">
          <Link className="button" href={`/create/${demoTaskId}`}>
            Open Demo Task
          </Link>
          <Link className="button-ghost" href={loginHref}>
            Login to Start
          </Link>
        </div>
      </section>

      <section className="card-grid">
        {flow.map((item) => (
          <article className="card" key={item.step}>
            <h3>{item.step}</h3>
            <p>{item.detail}</p>
          </article>
        ))}
      </section>
    </>
  );
}
