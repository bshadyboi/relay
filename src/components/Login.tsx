"use client";

import { useState } from "react";
import { authenticate } from "@/lib/auth";
import { DEFAULT_EMAIL, DEMO_ACCOUNTS, OFFICE } from "@/lib/data";
import { useWorkspace } from "@/lib/workspace";

export function Login() {
  const { login } = useWorkspace();
  const [email, setEmail] = useState(DEFAULT_EMAIL);
  const [password, setPassword] = useState("demo1234");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    window.setTimeout(() => {
      const user = authenticate(email, password);
      if (user) login(user);
      else {
        setError("Invalid email or password. Use a demo Zoox account.");
        setLoading(false);
      }
    }, 700);
  }

  return (
    <div className="flex min-h-dvh flex-col bg-black text-ink">
      <header className="border-b border-border px-6 py-4">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <div className="font-bold tracking-[0.35em] text-white">ZOOX</div>
          <span className="font-mono text-[10px] uppercase tracking-wider text-ink-muted">
            Internal · {OFFICE.address}
          </span>
        </div>
      </header>

      <main className="flex flex-1 items-center justify-center px-4 py-12">
        <div className="w-full max-w-md animate-[fade-up_0.4s_ease-out]">
          <div className="mb-8 text-center">
            <h1 className="text-2xl font-light tracking-wide text-white">
              Fleet Operations Workspace
            </h1>
            <p className="mt-2 text-sm text-ink-muted">
              Sign in to ops chat at {OFFICE.address}, {OFFICE.city}.
            </p>
          </div>

          <div className="rounded-lg border border-border bg-surface p-8">
            {loading ? (
              <div className="flex flex-col items-center gap-4 py-8">
                <div className="size-10 animate-spin rounded-full border-2 border-white/10 border-t-white" />
                <p className="text-sm text-ink-muted">
                  Authenticating via Okta SSO…
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                {error && (
                  <div className="mb-4 rounded-md border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs text-red-300">
                    {error}
                  </div>
                )}
                <label className="mb-2 block text-[10px] font-semibold uppercase tracking-wider text-ink-muted">
                  Zoox email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="mb-4 w-full rounded-md border border-border bg-black px-4 py-3 text-sm text-white outline-none placeholder:text-zinc-600 focus:border-white/30"
                />
                <label className="mb-2 block text-[10px] font-semibold uppercase tracking-wider text-ink-muted">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="mb-6 w-full rounded-md border border-border bg-black px-4 py-3 text-sm text-white outline-none focus:border-white/30"
                />
                <button
                  type="submit"
                  className="w-full rounded-md bg-white py-3 text-sm font-semibold text-black hover:bg-zinc-200"
                >
                  Sign in with SSO
                </button>
              </form>
            )}
          </div>

          <div className="mt-4 rounded-lg border border-border bg-black/40 p-3 font-mono text-[10px] text-ink-muted">
            <p className="mb-1 text-white/70">Demo accounts · password demo1234</p>
            {DEMO_ACCOUNTS.map((a) => (
              <button
                key={a.email}
                type="button"
                className="block w-full truncate py-0.5 text-left hover:text-white"
                onClick={() => {
                  setEmail(a.email);
                  setPassword(a.password);
                }}
              >
                {a.email}
              </button>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
