import { LoginForm } from "@/components/login-form";

export default function LoginPage() {
  return (
    <>
      <section className="panel hero">
        <p className="kicker">/auth/login</p>
        <h1 className="title">Account Access</h1>
        <p className="subtitle">
          Authentication is rebuilt with Better Auth and stored in your own
          PostgreSQL database via Drizzle ORM.
        </p>
      </section>
      <section className="panel">
        <LoginForm />
      </section>
    </>
  );
}
