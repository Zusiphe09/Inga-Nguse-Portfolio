import { createFileRoute } from "@tanstack/react-router";
import { Layout } from "@/components/Layout";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ExternalLink, Award, Search, ChevronDown, Brain, Briefcase, GraduationCap, Headset, FolderOpen } from "lucide-react";

export const Route = createFileRoute("/certifications")({
  head: () => ({
    meta: [
      { title: "Certifications — Inga Nguse" },
      { name: "description", content: "Certifications earned by Inga Nguse across AI, professional development, service operations, and the YES programme." },
      { property: "og:title", content: "Certifications — Inga Nguse" },
      { property: "og:description", content: "Browse certificates by category: AI Bootcamp, YES, Professional Development and Service Operations Practitioner." },
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
  { name: "YES", icon: Briefcase, desc: "Youth Employment Service programme credentials." },
  { name: "Professional Development", icon: GraduationCap, desc: "Communication, productivity and workplace skills." },
  { name: "Service Operations Practitioner", icon: Headset, desc: "IT support, networking and service operations." },
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

function Certifications() {
  const [certs, setCerts] = useState<Cert[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<string>("All");
  const [openCats, setOpenCats] = useState<Record<string, boolean>>({ "AI Bootcamp": true });

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

  async function openCert(c: Cert) {
    if (c.file_path) {
      const { data, error } = await supabase.storage.from("certificates").createSignedUrl(c.file_path, 3600);
      if (!error && data?.signedUrl) {
        window.open(data.signedUrl, "_blank", "noopener,noreferrer");
        return;
      }
    }
    if (c.file_url) window.open(c.file_url, "_blank", "noopener,noreferrer");
  }

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return certs.filter((c) => {
      const inCat = filter === "All" || categoryOf(c) === filter;
      const inQuery = !q || c.title.toLowerCase().includes(q) || c.provider.toLowerCase().includes(q);
      return inCat && inQuery;
    });
  }, [certs, query, filter]);

  const grouped = useMemo(() => {
    const map: Record<string, Cert[]> = {};
    for (const c of filtered) (map[categoryOf(c)] ||= []).push(c);
    return map;
  }, [filtered]);

  const searching = query.trim().length > 0;
  const visibleCats = CATEGORIES.filter((k) => filter === "All" || k.name === filter);

  function toggle(name: string) {
    setOpenCats((s) => ({ ...s, [name]: !s[name] }));
  }

  function expandAll() {
    setFilter("All");
    setQuery("");
    setOpenCats(Object.fromEntries(CATEGORIES.map((k) => [k.name, true])));
  }

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
      <div className="max-w-2xl">
        <p className="text-sm font-semibold text-primary uppercase tracking-wider">Certifications</p>
        <h1 className="mt-2 text-4xl sm:text-5xl font-bold tracking-tight text-foreground">Continuous learning</h1>
        <p className="mt-4 text-muted-foreground">
          A growing collection of certifications, organised into folders so you can find exactly what you need.
        </p>
      </div>

      {/* Controls */}
      <div className="mt-10 flex flex-col gap-4">
        <div className="relative max-w-md">
          <Search size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search certificates or issuers…"
            aria-label="Search certificates"
            className="w-full rounded-full border border-input bg-card pl-10 pr-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground shadow-soft focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {["All", ...CATEGORIES.map((c) => c.name)].map((name) => {
            const active = filter === name;
            const count = name === "All" ? certs.length : certs.filter((c) => categoryOf(c) === name).length;
            return (
              <button
                key={name}
                type="button"
                onClick={() => setFilter(name)}
                aria-pressed={active}
                className={
                  "rounded-full px-4 py-1.5 text-xs sm:text-sm font-medium border transition-all duration-200 " +
                  (active
                    ? "bg-primary text-primary-foreground border-primary shadow-soft"
                    : "bg-card text-muted-foreground border-border hover:text-primary hover:border-primary/40 hover:bg-primary-soft")
                }
              >
                {name} <span className="opacity-70">({count})</span>
              </button>
            );
          })}
          <button
            type="button"
            onClick={expandAll}
            className="ml-auto inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-1.5 text-xs sm:text-sm font-medium text-foreground hover:bg-muted transition-colors"
          >
            <FolderOpen size={14} /> View all certificates
          </button>
        </div>
      </div>

      {/* Folders */}
      <div className="mt-10">
        {loading ? (
          <div className="text-sm text-muted-foreground">Loading certifications…</div>
        ) : filtered.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border bg-card p-10 text-center">
            <Award size={28} className="mx-auto text-muted-foreground" />
            <p className="mt-3 text-sm text-muted-foreground">No certificates match your search.</p>
          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-1">
            {visibleCats.map((cat) => {
              const items = grouped[cat.name] ?? [];
              const isOpen = searching || filter === cat.name || openCats[cat.name];
              const Icon = cat.icon;
              return (
                <section
                  key={cat.name}
                  className="bg-card border border-border rounded-2xl shadow-soft hover:shadow-card transition-shadow overflow-hidden"
                >
                  <button
                    type="button"
                    onClick={() => toggle(cat.name)}
                    aria-expanded={isOpen}
                    className="w-full grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-4 p-5 text-left hover:bg-muted/40 transition-colors"
                  >
                    <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-primary-soft text-primary">
                      <Icon size={20} />
                    </span>
                    <span className="min-w-0">
                      <span className="block truncate font-semibold text-foreground">{cat.name}</span>
                      <span className="block truncate text-xs text-muted-foreground">{cat.desc}</span>
                    </span>
                    <span className="flex shrink-0 items-center gap-3">
                      <span className="rounded-full bg-muted px-2.5 py-1 text-xs font-semibold text-muted-foreground">
                        {items.length}
                      </span>
                      <ChevronDown
                        size={18}
                        className={"text-muted-foreground transition-transform duration-300 " + (isOpen ? "rotate-180" : "")}
                      />
                    </span>
                  </button>

                  <div
                    className={
                      "grid transition-all duration-300 ease-out " +
                      (isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0")
                    }
                  >
                    <div className="overflow-hidden">
                      <div className="border-t border-border p-5">
                        {items.length === 0 ? (
                          <p className="text-sm text-muted-foreground">Nothing in this folder yet.</p>
                        ) : (
                          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                            {items.map((c) => (
                              <article
                                key={c.id}
                                className="flex flex-col rounded-xl border border-border bg-background p-4 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-card"
                              >
                                <div className="grid size-9 shrink-0 place-items-center rounded-lg bg-primary-soft text-primary">
                                  <Award size={16} />
                                </div>
                                <h3 className="mt-3 font-semibold leading-snug text-foreground">{c.title}</h3>
                                <p className="mt-1 text-xs text-muted-foreground">
                                  {c.provider}
                                  {formatDate(c.issued_on) ? ` · ${formatDate(c.issued_on)}` : ""}
                                </p>
                                <button
                                  type="button"
                                  onClick={() => openCert(c)}
                                  className="mt-4 inline-flex items-center gap-2 self-start rounded-full bg-primary px-3.5 py-1.5 text-xs font-semibold text-primary-foreground transition-opacity hover:opacity-90"
                                >
                                  View / Download <ExternalLink size={12} />
                                </button>
                              </article>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </section>
              );
            })}
          </div>
        )}
      </div>

      <div className="mt-20">
        <h2 className="text-2xl font-bold text-foreground">Certification focus areas</h2>
        <div className="mt-6 grid grid-cols-2 lg:grid-cols-4 gap-5">
          {CATEGORIES.map((cat) => (
            <div key={cat.name} className="bg-card border border-border rounded-2xl p-6 text-center shadow-soft">
              <div className="text-4xl font-bold text-primary">
                {certs.filter((c) => categoryOf(c) === cat.name).length}
              </div>
              <div className="mt-1 text-sm text-muted-foreground">{cat.name}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
