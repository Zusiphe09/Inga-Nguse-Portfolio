import { createFileRoute } from "@tanstack/react-router";
import { Layout } from "@/components/Layout";
import { useCallback, useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  ExternalLink,
  Award,
  Search,
  Brain,
  Briefcase,
  GraduationCap,
  Headset,
  Network,
  Folder,
  ArrowLeft,
  Download,
  X,
  ZoomIn,
  ZoomOut,
  FileText,
  Sparkles,
} from "lucide-react";

export const Route = createFileRoute("/certifications")({
  head: () => ({
    meta: [
      { title: "Certifications — Inga Nguse" },
      { name: "description", content: "Certifications earned by Inga Nguse across AI, Google AI Essentials, professional development, service operations, CISCO networking and the YES programme." },
      { property: "og:title", content: "Certifications — Inga Nguse" },
      { property: "og:description", content: "Browse certificates by folder: AI Bootcamp, Google AI Essentials, Professional Development, YES, Service Operations Practitioner and CISCO." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => (<Layout><Certifications /></Layout>),
});

type Cert = {
  id: string;
  title: string;
  provider: string;
  file_url: string;
  file_path: string | null;
  category: string | null;
  issued_on: string | null;
};

const CATEGORIES = [
  { name: "AI Bootcamp", icon: Brain, desc: "Artificial intelligence, machine learning and data skills." },
  { name: "Google AI Essentials", icon: Sparkles, desc: "Google AI fundamentals, prompt engineering and responsible AI practices." },
  { name: "Professional Development", icon: GraduationCap, desc: "Communication, productivity and workplace skills." },
  { name: "YES", icon: Briefcase, desc: "Youth Employment Service programme credentials." },
  { name: "Service Operations Practitioner", icon: Headset, desc: "IT support and service operations." },
  { name: "CISCO", icon: Network, desc: "Networking, cybersecurity and CCNA credentials." },
] as const;

function categoryOf(c: Cert) {
  const match = CATEGORIES.find((k) => k.name === (c.category ?? ""));
  return match ? match.name : "Professional Development";
}

function formatDate(d: string | null) {
  if (!d) return null;
  const parsed = new Date(d);
  if (Number.isNaN(parsed.getTime())) return null;
  return parsed.toLocaleDateString(undefined, { month: "short", year: "numeric" });
}

function isImage(path: string | null | undefined) {
  return !!path && /\.(png|jpe?g|webp|gif|avif)$/i.test(path);
}

function Certifications() {
  const [certs, setCerts] = useState<Cert[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [openFolder, setOpenFolder] = useState<string | null>(null);
  const [preview, setPreview] = useState<{ cert: Cert; url: string } | null>(null);
  const [zoom, setZoom] = useState(1);

  useEffect(() => {
    supabase
      .from("certificates")
      .select("id, title, provider, file_url, file_path, category, issued_on")
      .order("provider", { ascending: true })
      .order("sort_order", { ascending: true })
      .then(({ data }) => {
        setCerts((data ?? []) as Cert[]);
        setLoading(false);
      });
  }, []);

  const resolveUrl = useCallback(async (c: Cert) => {
    if (c.file_path) {
      const { data, error } = await supabase.storage.from("certificates").createSignedUrl(c.file_path, 3600);
      if (!error && data?.signedUrl) return data.signedUrl;
    }
    return c.file_url || null;
  }, []);

  async function openPreview(c: Cert) {
    const url = await resolveUrl(c);
    if (!url) return;
    setZoom(1);
    setPreview({ cert: c, url });
  }

  async function openInNewTab(c: Cert) {
    const url = await resolveUrl(c);
    if (url) window.open(url, "_blank", "noopener,noreferrer");
  }

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key !== "Escape") return;
      if (preview) setPreview(null);
      else if (openFolder) setOpenFolder(null);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [preview, openFolder]);

  const counts = useMemo(() => {
    const map: Record<string, number> = {};
    for (const c of certs) map[categoryOf(c)] = (map[categoryOf(c)] ?? 0) + 1;
    return map;
  }, [certs]);

  const folderItems = useMemo(() => {
    if (!openFolder) return [];
    const q = query.trim().toLowerCase();
    return certs.filter(
      (c) =>
        categoryOf(c) === openFolder &&
        (!q || c.title.toLowerCase().includes(q) || c.provider.toLowerCase().includes(q)),
    );
  }, [certs, openFolder, query]);

  const activeCat = CATEGORIES.find((c) => c.name === openFolder);

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
      <div className="max-w-2xl">
        <p className="text-sm font-semibold text-primary uppercase tracking-wider">Certifications</p>
        <h1 className="mt-2 text-4xl sm:text-5xl font-bold tracking-tight text-foreground">Continuous learning</h1>
        <p className="mt-4 text-muted-foreground">
          Certificates are organised into folders. Open a folder to browse and preview its credentials.
        </p>
      </div>

      {loading ? (
        <div className="mt-12 text-sm text-muted-foreground">Loading certifications…</div>
      ) : !openFolder ? (
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            const count = counts[cat.name] ?? 0;
            return (
              <button
                key={cat.name}
                type="button"
                onClick={() => { setQuery(""); setOpenFolder(cat.name); }}
                aria-label={`Open ${cat.name} folder with ${count} certificates`}
                className="group relative overflow-hidden rounded-2xl border border-border bg-card p-6 text-left shadow-soft transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-elevated focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <span className="pointer-events-none absolute -right-8 -top-8 size-28 rounded-full bg-primary-soft opacity-60 transition-transform duration-500 group-hover:scale-125" />
                <span className="relative grid size-12 place-items-center rounded-xl bg-primary-soft text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  <Folder size={22} />
                </span>
                <h2 className="relative mt-4 font-semibold text-foreground">{cat.name}</h2>
                <p className="relative mt-1 text-sm text-muted-foreground">{cat.desc}</p>
                <span className="relative mt-4 flex items-center justify-between">
                  <span className="inline-flex items-center gap-2 text-xs font-semibold text-muted-foreground">
                    <Icon size={14} /> {count} certificate{count === 1 ? "" : "s"}
                  </span>
                  <span className="text-xs font-semibold text-primary opacity-0 transition-opacity group-hover:opacity-100">
                    Open →
                  </span>
                </span>
              </button>
            );
          })}
        </div>
      ) : (
        <section className="mt-12" aria-label={`${openFolder} certificates`}>
          <div className="grid grid-cols-[auto_minmax(0,1fr)] items-center gap-4 sm:flex sm:justify-between">
            <button
              type="button"
              onClick={() => setOpenFolder(null)}
              className="inline-flex shrink-0 items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <ArrowLeft size={14} /> All folders
            </button>
            <div className="relative min-w-0 sm:w-72">
              <Search size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search this folder…"
                aria-label={`Search ${openFolder} certificates`}
                className="w-full rounded-full border border-input bg-card pl-10 pr-4 py-2 text-sm text-foreground placeholder:text-muted-foreground shadow-soft focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
          </div>

          <div className="mt-8 flex items-center gap-3">
            {activeCat ? <activeCat.icon size={20} className="shrink-0 text-primary" /> : null}
            <h2 className="min-w-0 truncate text-2xl font-bold text-foreground">{openFolder}</h2>
            <span className="shrink-0 rounded-full bg-muted px-2.5 py-1 text-xs font-semibold text-muted-foreground">
              {folderItems.length}
            </span>
          </div>

          {folderItems.length === 0 ? (
            <div className="mt-8 rounded-2xl border border-dashed border-border bg-card p-10 text-center">
              <Award size={28} className="mx-auto text-muted-foreground" />
              <p className="mt-3 text-sm text-muted-foreground">Nothing in this folder yet.</p>
            </div>
          ) : (
            <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {folderItems.map((c) => (
                <article
                  key={c.id}
                  className="flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-card"
                >
                  <div className="grid h-32 place-items-center bg-gradient-to-br from-primary-soft to-muted">
                    {isImage(c.file_path ?? c.file_url) ? (
                      <Award size={30} className="text-primary" aria-hidden />
                    ) : (
                      <FileText size={30} className="text-primary" aria-hidden />
                    )}
                  </div>
                  <div className="flex flex-1 flex-col p-4">
                    <h3 className="font-semibold leading-snug text-foreground">{c.title}</h3>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {c.provider}
                      {formatDate(c.issued_on) ? ` · ${formatDate(c.issued_on)}` : ""}
                    </p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => openPreview(c)}
                        aria-label={`Preview ${c.title}`}
                        className="inline-flex items-center gap-1.5 rounded-full bg-primary px-3.5 py-1.5 text-xs font-semibold text-primary-foreground transition-opacity hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      >
                        View <ZoomIn size={12} />
                      </button>
                      <button
                        type="button"
                        onClick={() => openInNewTab(c)}
                        aria-label={`Download ${c.title}`}
                        className="inline-flex items-center gap-1.5 rounded-full border border-border px-3.5 py-1.5 text-xs font-semibold text-foreground transition-colors hover:bg-muted focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      >
                        Download <Download size={12} />
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      )}

      {preview && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`Preview of ${preview.cert.title}`}
          className="fixed inset-0 z-50 flex flex-col bg-foreground/70 p-3 sm:p-6 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setPreview(null)}
        >
          <div
            className="mx-auto flex h-full w-full max-w-5xl flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-elevated"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 border-b border-border p-4">
              <div className="min-w-0">
                <h3 className="truncate font-semibold text-foreground">{preview.cert.title}</h3>
                <p className="truncate text-xs text-muted-foreground">
                  {preview.cert.provider}
                  {formatDate(preview.cert.issued_on) ? ` · ${formatDate(preview.cert.issued_on)}` : ""}
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <button
                  type="button"
                  aria-label="Zoom out"
                  onClick={() => setZoom((z) => Math.max(0.5, +(z - 0.25).toFixed(2)))}
                  className="grid size-9 place-items-center rounded-full border border-border text-foreground hover:bg-muted"
                >
                  <ZoomOut size={16} />
                </button>
                <button
                  type="button"
                  aria-label="Zoom in"
                  onClick={() => setZoom((z) => Math.min(3, +(z + 0.25).toFixed(2)))}
                  className="grid size-9 place-items-center rounded-full border border-border text-foreground hover:bg-muted"
                >
                  <ZoomIn size={16} />
                </button>
                <a
                  href={preview.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Open or download certificate"
                  className="inline-flex items-center gap-1.5 rounded-full bg-primary px-3.5 py-2 text-xs font-semibold text-primary-foreground hover:opacity-90"
                >
                  <ExternalLink size={12} /> Download
                </a>
                <button
                  type="button"
                  aria-label="Close preview"
                  onClick={() => setPreview(null)}
                  className="grid size-9 place-items-center rounded-full border border-border text-foreground hover:bg-muted"
                >
                  <X size={16} />
                </button>
              </div>
            </div>
            <div className="flex-1 overflow-auto bg-muted/40 p-4">
              {isImage(preview.cert.file_path ?? preview.cert.file_url) ? (
                <img
                  src={preview.url}
                  alt={`${preview.cert.title} certificate`}
                  style={{ width: `${zoom * 100}%` }}
                  className="mx-auto rounded-lg shadow-card transition-[width] duration-200"
                />
              ) : (
                <iframe
                  title={`${preview.cert.title} certificate`}
                  src={preview.url}
                  style={{ width: `${zoom * 100}%` }}
                  className="mx-auto h-full min-h-[60vh] rounded-lg border border-border bg-background"
                />
              )}
            </div>
          </div>
        </div>
      )}

      <div className="mt-20">
        <h2 className="text-2xl font-bold text-foreground">Certification focus areas</h2>
        <div className="mt-6 grid grid-cols-2 lg:grid-cols-6 gap-5">
          {CATEGORIES.map((cat) => (
            <div key={cat.name} className="bg-card border border-border rounded-2xl p-6 text-center shadow-soft">
              <div className="text-4xl font-bold text-primary">{counts[cat.name] ?? 0}</div>
              <div className="mt-1 text-sm text-muted-foreground">{cat.name}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
