"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { type FormEvent, useMemo, useState } from "react";
import { type Locale, routing } from "@/i18n/routing";
import { authClient } from "@/lib/auth/client";

type SocialProvider = "google" | "github";
type EmailSignInPayload = {
  email: string;
  password: string;
  callbackURL: string;
};
type SocialSignInPayload = {
  provider: SocialProvider;
  callbackURL: string;
};
type AuthClientShape = {
  signIn?: {
    email?: (
      payload: EmailSignInPayload,
    ) => Promise<{ error?: { message?: string } } | undefined>;
    social?: (payload: SocialSignInPayload) => Promise<unknown>;
  };
};

export function LoginForm() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const defaultNextPath = useMemo(() => {
    const firstSegment = pathname.split("/").filter(Boolean)[0];
    const locale = routing.locales.includes(firstSegment as Locale)
      ? firstSegment
      : null;

    if (locale && locale !== routing.defaultLocale) {
      return `/${locale}/user/my-songs`;
    }

    return "/user/my-songs";
  }, [pathname]);

  const nextPath = useMemo(
    () => searchParams.get("next") ?? defaultNextPath,
    [defaultNextPath, searchParams],
  );

  const handleCredentialsSignIn = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setIsPending(true);

    try {
      const client = authClient as unknown as AuthClientShape;

      if (!client?.signIn?.email) {
        throw new Error("Auth email sign-in is not available.");
      }

      const result = await client.signIn.email({
        email,
        password,
        callbackURL: nextPath,
      });

      if (result?.error) {
        throw new Error(result.error.message ?? "Unable to sign in.");
      }

      router.push(nextPath);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sign-in failed.");
    } finally {
      setIsPending(false);
    }
  };

  const handleSocialSignIn = async (provider: SocialProvider) => {
    setError(null);
    setIsPending(true);

    try {
      const client = authClient as unknown as AuthClientShape;

      if (client?.signIn?.social) {
        await client.signIn.social({ provider, callbackURL: nextPath });
        return;
      }

      window.location.href = `/api/auth/sign-in/social?provider=${provider}&callbackURL=${encodeURIComponent(nextPath)}`;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Social sign-in failed.");
      setIsPending(false);
    }
  };

  return (
    <div className="auth-form">
      <form className="auth-form" onSubmit={handleCredentialsSignIn}>
        <label htmlFor="email">
          Email
          <input
            autoComplete="email"
            id="email"
            name="email"
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@lyriasong.com"
            required
            type="email"
            value={email}
          />
        </label>

        <label htmlFor="password">
          Password
          <input
            autoComplete="current-password"
            id="password"
            minLength={8}
            name="password"
            onChange={(event) => setPassword(event.target.value)}
            placeholder="At least 8 characters"
            required
            type="password"
            value={password}
          />
        </label>

        {error ? <div className="error">{error}</div> : null}

        <div className="button-row">
          <button className="button" type="submit" disabled={isPending}>
            {isPending ? "Signing in..." : "Sign In"}
          </button>
          <button
            className="button-ghost"
            type="button"
            disabled={isPending}
            onClick={() => handleSocialSignIn("google")}
          >
            Continue with Google
          </button>
          <button
            className="button-ghost"
            type="button"
            disabled={isPending}
            onClick={() => handleSocialSignIn("github")}
          >
            Continue with GitHub
          </button>
        </div>
      </form>

      <p className="auth-note">
        Auth endpoints are served by{" "}
        <span className="mono">/api/auth/[...all]</span>. Configure{" "}
        <span className="mono">BETTER_AUTH_SECRET</span>, OAuth credentials, and{" "}
        <span className="mono">DATABASE_URL</span> before testing login.
      </p>
    </div>
  );
}
