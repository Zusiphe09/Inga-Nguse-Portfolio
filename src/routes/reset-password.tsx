import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { Layout } from "@/components/Layout";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/reset-password")({
  head: () => ({ meta: [{ title: "Reset password — Inga Nguse" }] }),
  component: () => (<Layout><Reset /></Layout>),
});

function Reset() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY" || event === "SIGNED_IN") setReady(true);
    });
    supabase.auth.getSession().then(({ data }) => { if (data.session) setReady(true); });
    return () => sub.subscription.unsubscribe();
  }, []);

  async function handle(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    const { error } = await supabase.auth.updateUser({ password });
    setBusy(false);
    if (error) setError(error.message);
    else navigate({ to: "/admin" });
  }

  return (
    <div className="mx-auto max-w-md px-4 sm:px-6 py-20">
      <div className="bg-card border border-border rounded-2xl p-7 shadow-card">
        <h1 className="text-2xl font-bold">Set a new password</h1>
        {!ready ? (
          <p className="mt-4 text-sm text-muted-foreground">
            Waiting for recovery link… Open this page from the email link you received.
          </p>
        ) : (
          <form onSubmit={handle} className="mt-6 space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1.5">New password</label>
              <input
                type="password"
                required
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg border border-input bg-background px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            {error && <div className="text-sm text-destructive">{error}</div>}
            <button disabled={busy} className="w-full rounded-full bg-primary text-primary-foreground px-5 py-3 text-sm font-semibold disabled:opacity-60">
              {busy ? "Updating…" : "Update password"}
            </button>
          </form>
        )}
        <div className="mt-6 text-center">
          <Link to="/auth" className="text-xs text-muted-foreground hover:text-primary">Back to sign in</Link>
        </div>
      </div>
    </div>
  );
}
