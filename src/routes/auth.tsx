import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { Layout } from "@/components/Layout";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";

export const Route = createFileRoute("/auth")({
  head: () => ({ meta: [{ title: "Admin Sign In — Inga Nguse" }] }),
  component: () => (<Layout><Auth /></Layout>),
});

function Auth() {
  const navigate = useNavigate();
  const { user, isAdmin, loading } = useAuth();
  const [mode, setMode] = useState<"signin" | "signup" | "forgot">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!loading && user && isAdmin) navigate({ to: "/admin" });
  }, [user, isAdmin, loading, navigate]);

  async function handle(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setInfo(null);
    setBusy(true);
    if (mode === "signin") {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) setError(error.message);
    } else if (mode === "signup") {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: window.location.origin + "/admin" },
      });
      if (error) setError(error.message);
      else setInfo("Account created. You can now sign in.");
    } else {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin + "/reset-password",
      });
      if (error) setError(error.message);
      else setInfo("Password reset link sent to your email.");
    }
    setBusy(false);
  }

  return (
    <div className="mx-auto max-w-md px-4 sm:px-6 py-20">
      <div className="bg-card border border-border rounded-2xl p-7 shadow-card">
        <h1 className="text-2xl font-bold text-foreground">
          {mode === "signin" ? "Admin sign in" : mode === "signup" ? "Create admin account" : "Reset password"}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {mode === "signup"
            ? "Use the owner email to be granted admin access automatically."
            : "Restricted area. Authorised access only."}
        </p>
        <form onSubmit={handle} className="mt-6 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1.5">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-input bg-background px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          {mode !== "forgot" && (
            <div>
              <label className="block text-sm font-medium mb-1.5">Password</label>
              <input
                type="password"
                required
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg border border-input bg-background px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
          )}
          {error && <div className="text-sm text-destructive">{error}</div>}
          {info && <div className="text-sm text-primary">{info}</div>}
          <button
            type="submit"
            disabled={busy}
            className="w-full rounded-full bg-primary text-primary-foreground px-5 py-3 text-sm font-semibold hover:opacity-95 disabled:opacity-60"
          >
            {busy ? "Please wait…" : mode === "signin" ? "Sign in" : mode === "signup" ? "Create account" : "Send reset link"}
          </button>
        </form>
        <div className="mt-5 flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
          {mode === "signin" ? (
            <>
              <button onClick={() => { setMode("signup"); setError(null); setInfo(null); }} className="hover:text-primary">Create account</button>
              <button onClick={() => { setMode("forgot"); setError(null); setInfo(null); }} className="hover:text-primary">Forgot password?</button>
            </>
          ) : (
            <button onClick={() => { setMode("signin"); setError(null); setInfo(null); }} className="hover:text-primary">← Back to sign in</button>
          )}
        </div>
        <div className="mt-6 text-center">
          <Link to="/" className="text-xs text-muted-foreground hover:text-primary">Back to site</Link>
        </div>
      </div>
    </div>
  );
}
