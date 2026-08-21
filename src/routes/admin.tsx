import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { Layout } from "@/components/Layout";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { Trash2, Upload, Pencil, LogOut, MapPin, Mail, Save, X, FileText } from "lucide-react";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Admin — Inga Nguse" }] }),
  component: () => (<Layout><Admin /></Layout>),
});

type Cert = { id: string; title: string; provider: string; file_url: string; file_path: string | null; sort_order: number; category: string | null; issued_on: string | null };

const CERT_CATEGORIES = ["AI Bootcamp", "YES", "Professional Development", "Service Operations Practitioner"] as const;

type Msg = { id: string; name: string; email: string; message: string; read: boolean; created_at: string };

function Admin() {
  const { user, isAdmin, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) navigate({ to: "/auth" });
  }, [user, isAdmin, loading, navigate]);

  if (loading || !user || !isAdmin) {
    return <div className="p-10 text-sm text-muted-foreground">Checking access…</div>;
  }

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-primary uppercase tracking-wider">Admin</p>
          <h1 className="mt-1 text-3xl font-bold">Dashboard</h1>
          <p className="mt-1 text-sm text-muted-foreground">Signed in as {user.email}</p>
        </div>
        <button
          onClick={async () => { await supabase.auth.signOut(); navigate({ to: "/" }); }}
          className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-4 py-2 text-sm font-medium hover:bg-muted"
        >
          <LogOut size={14} /> Sign out
        </button>
      </div>

      <div className="mt-10 space-y-10">
        <LocationEditor />
        <CvEditor />

        <CertificateManager />
        <Messages />
      </div>

      <div className="mt-12 text-center">
        <Link to="/" className="text-xs text-muted-foreground hover:text-primary">← Back to public site</Link>
      </div>
    </div>
  );
}

function LocationEditor() {
  const [value, setValue] = useState("");
  const [saving, setSaving] = useState(false);
  const [savedAt, setSavedAt] = useState<number | null>(null);

  useEffect(() => {
    supabase.from("site_settings").select("value").eq("key", "location").maybeSingle().then(({ data }) => {
      setValue(data?.value ?? "");
    });
  }, []);

  async function save() {
    setSaving(true);
    await supabase.from("site_settings").upsert({ key: "location", value });
    setSaving(false);
    setSavedAt(Date.now());
    setTimeout(() => setSavedAt(null), 2000);
  }

  return (
    <section className="bg-card border border-border rounded-2xl p-6 shadow-soft">
      <h2 className="font-semibold flex items-center gap-2"><MapPin size={16} className="text-primary" /> Location</h2>
      <div className="mt-4 flex flex-col sm:flex-row gap-2">
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="flex-1 rounded-lg border border-input bg-background px-3.5 py-2.5 text-sm"
        />
        <button
          onClick={save}
          disabled={saving}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary text-primary-foreground px-4 py-2.5 text-sm font-semibold disabled:opacity-60"
        >
          <Save size={14} /> {saving ? "Saving…" : savedAt ? "Saved" : "Save"}
        </button>
      </div>
    </section>
  );
}

function CvEditor() {
  const [value, setValue] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [savedAt, setSavedAt] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function previewCv() {
    if (!value) return;
    if (value.startsWith("/") || /^https?:\/\//i.test(value)) {
      window.open(value, "_blank", "noopener,noreferrer");
      return;
    }
    const { data, error: signedError } = await supabase.storage.from("certificates").createSignedUrl(value, 3600);
    if (signedError) {
      setError(signedError.message);
      return;
    }
    if (data?.signedUrl) window.open(data.signedUrl, "_blank", "noopener,noreferrer");
  }

  useEffect(() => {
    supabase.from("site_settings").select("value").eq("key", "cv_url").maybeSingle().then(({ data }) => {
      setValue(data?.value ?? "");
    });
  }, []);

  async function save(newValue?: string) {
    const v = newValue ?? value;
    setSaving(true);
    await supabase.from("site_settings").upsert({ key: "cv_url", value: v });
    setSaving(false);
    setSavedAt(Date.now());
    setTimeout(() => setSavedAt(null), 2000);
  }

  async function uploadCv() {
    setError(null);
    if (!file) { setError("Choose a PDF file first."); return; }
    setUploading(true);
    const path = `cv/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, "_")}`;
    const { error: upErr } = await supabase.storage.from("certificates").upload(path, file, { upsert: true });
    if (upErr) { setError(upErr.message); setUploading(false); return; }
    setValue(path);
    await save(path);

    setFile(null);
    const input = document.getElementById("cv-file") as HTMLInputElement | null;
    if (input) input.value = "";
    setUploading(false);
  }

  return (
    <section className="bg-card border border-border rounded-2xl p-6 shadow-soft">
      <h2 className="font-semibold flex items-center gap-2"><FileText size={16} className="text-primary" /> CV (Download link)</h2>
      <p className="mt-1 text-xs text-muted-foreground">Paste a public URL or upload a PDF. Leave blank to hide the Download CV button.</p>
      <div className="mt-4 flex flex-col sm:flex-row gap-2">
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="https://…/inga-nguse-cv.pdf"
          className="flex-1 rounded-lg border border-input bg-background px-3.5 py-2.5 text-sm"
        />
        <button
          onClick={() => save()}
          disabled={saving}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary text-primary-foreground px-4 py-2.5 text-sm font-semibold disabled:opacity-60"
        >
          <Save size={14} /> {saving ? "Saving…" : savedAt ? "Saved" : "Save"}
        </button>
      </div>
      <div className="mt-4 flex flex-col sm:flex-row gap-2">
        <input
          id="cv-file"
          type="file"
          accept="application/pdf"
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          className="flex-1 rounded-lg border border-input bg-background px-3.5 py-2.5 text-sm"
        />
        <button
          onClick={uploadCv}
          disabled={uploading || !file}
          className="inline-flex items-center justify-center gap-2 rounded-lg border border-border bg-background px-4 py-2.5 text-sm font-semibold disabled:opacity-60"
        >
          <Upload size={14} /> {uploading ? "Uploading…" : "Upload PDF"}
        </button>
      </div>
      {error && <div className="mt-2 text-sm text-destructive">{error}</div>}
      {value && (
        <button type="button" onClick={previewCv} className="mt-3 inline-block text-xs text-primary hover:underline">
          Preview current CV →
        </button>
      )}
    </section>
  );
}


function CertificateManager() {
  const [certs, setCerts] = useState<Cert[]>([]);
  const [title, setTitle] = useState("");
  const [provider, setProvider] = useState("");
  const [category, setCategory] = useState<string>("Professional Development");
  const [issuedOn, setIssuedOn] = useState("");

  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState<Cert | null>(null);

  async function refresh() {
    const { data } = await supabase.from("certificates").select("*").order("provider").order("sort_order");
    setCerts((data ?? []) as Cert[]);
  }
  useEffect(() => { refresh(); }, []);

  async function upload(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!file || !title.trim() || !provider.trim()) { setError("Title, provider, and file are required."); return; }
    setUploading(true);
    const path = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, "_")}`;
    const { error: upErr } = await supabase.storage.from("certificates").upload(path, file, { upsert: false });
    if (upErr) { setError(upErr.message); setUploading(false); return; }
    const { data: pub } = supabase.storage.from("certificates").getPublicUrl(path);
    const { error: insErr } = await supabase.from("certificates").insert({
      title: title.trim(), provider: provider.trim(), file_url: pub.publicUrl, file_path: path,
      category, issued_on: issuedOn || null,
    });
    setUploading(false);
    if (insErr) { setError(insErr.message); return; }
    setTitle(""); setProvider(""); setFile(null); setIssuedOn("");

    (document.getElementById("cert-file") as HTMLInputElement | null)?.value && ((document.getElementById("cert-file") as HTMLInputElement).value = "");
    refresh();
  }

  async function remove(c: Cert) {
    if (!confirm(`Delete "${c.title}"?`)) return;
    if (c.file_path) await supabase.storage.from("certificates").remove([c.file_path]);
    await supabase.from("certificates").delete().eq("id", c.id);
    refresh();
  }

  async function saveEdit() {
    if (!editing) return;
    await supabase.from("certificates").update({
      title: editing.title, provider: editing.provider,
      category: editing.category, issued_on: editing.issued_on || null,
    }).eq("id", editing.id);

    setEditing(null);
    refresh();
  }

  return (
    <section className="bg-card border border-border rounded-2xl p-6 shadow-soft">
      <h2 className="font-semibold">Certificates</h2>
      <form onSubmit={upload} className="mt-4 grid sm:grid-cols-2 gap-3">
        <input
          placeholder="Certificate title"
          value={title} onChange={(e) => setTitle(e.target.value)}
          className="rounded-lg border border-input bg-background px-3.5 py-2.5 text-sm"
        />
        <input
          placeholder="Provider (e.g. Cisco, Microsoft)"
          value={provider} onChange={(e) => setProvider(e.target.value)}
          className="rounded-lg border border-input bg-background px-3.5 py-2.5 text-sm"
        />
        <input
          id="cert-file"
          type="file"
          accept="application/pdf,image/*"
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          className="sm:col-span-2 rounded-lg border border-input bg-background px-3.5 py-2.5 text-sm"
        />
        {error && <div className="sm:col-span-2 text-sm text-destructive">{error}</div>}
        <button
          type="submit" disabled={uploading}
          className="sm:col-span-2 inline-flex items-center justify-center gap-2 rounded-lg bg-primary text-primary-foreground px-4 py-2.5 text-sm font-semibold disabled:opacity-60"
        >
          <Upload size={14} /> {uploading ? "Uploading…" : "Upload certificate"}
        </button>
      </form>

      <div className="mt-6 divide-y divide-border">
        {certs.length === 0 && <div className="py-6 text-sm text-muted-foreground">No certificates yet.</div>}
        {certs.map((c) => (
          <div key={c.id} className="py-3 flex items-center justify-between gap-3">
            {editing?.id === c.id ? (
              <div className="flex-1 grid sm:grid-cols-2 gap-2">
                <input value={editing.title} onChange={(e) => setEditing({ ...editing, title: e.target.value })} className="rounded border border-input bg-background px-2 py-1.5 text-sm" />
                <input value={editing.provider} onChange={(e) => setEditing({ ...editing, provider: e.target.value })} className="rounded border border-input bg-background px-2 py-1.5 text-sm" />
              </div>
            ) : (
              <div className="min-w-0">
                <a href={c.file_url} target="_blank" rel="noopener noreferrer" className="font-medium text-foreground hover:text-primary truncate block">{c.title}</a>
                <div className="text-xs text-muted-foreground">{c.provider}</div>
              </div>
            )}
            <div className="flex items-center gap-1 flex-none">
              {editing?.id === c.id ? (
                <>
                  <button onClick={saveEdit} className="p-2 rounded-md hover:bg-primary-soft text-primary"><Save size={15} /></button>
                  <button onClick={() => setEditing(null)} className="p-2 rounded-md hover:bg-muted"><X size={15} /></button>
                </>
              ) : (
                <>
                  <button onClick={() => setEditing(c)} className="p-2 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground"><Pencil size={15} /></button>
                  <button onClick={() => remove(c)} className="p-2 rounded-md hover:bg-destructive/10 text-destructive"><Trash2 size={15} /></button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function Messages() {
  const [msgs, setMsgs] = useState<Msg[]>([]);

  async function refresh() {
    const { data } = await supabase.from("contact_messages").select("*").order("created_at", { ascending: false });
    setMsgs((data ?? []) as Msg[]);
  }
  useEffect(() => { refresh(); }, []);

  async function del(id: string) {
    if (!confirm("Delete this message?")) return;
    await supabase.from("contact_messages").delete().eq("id", id);
    refresh();
  }

  return (
    <section className="bg-card border border-border rounded-2xl p-6 shadow-soft">
      <h2 className="font-semibold flex items-center gap-2"><Mail size={16} className="text-primary" /> Messages</h2>
      <div className="mt-4 space-y-3">
        {msgs.length === 0 && <div className="text-sm text-muted-foreground">No messages yet.</div>}
        {msgs.map((m) => (
          <div key={m.id} className="rounded-lg border border-border p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="font-medium text-sm">{m.name} <span className="text-muted-foreground font-normal">· {m.email}</span></div>
                <div className="text-xs text-muted-foreground">{new Date(m.created_at).toLocaleString()}</div>
              </div>
              <button onClick={() => del(m.id)} className="p-1.5 rounded hover:bg-destructive/10 text-destructive"><Trash2 size={14} /></button>
            </div>
            <p className="mt-2 text-sm whitespace-pre-wrap">{m.message}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
