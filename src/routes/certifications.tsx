import { createFileRoute } from "@tanstack/react-router";
import { Layout } from "@/components/Layout";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ExternalLink, Award } from "lucide-react";

export const Route = createFileRoute("/certifications")({
  head: () => ({
    meta: [
      { title: "Certifications — Inga Nguse" },
      { name: "description", content: "Certifications earned by Inga Nguse across IT support, software, data, and project management." },
    ],
  }),
  component: () => (<Layout><Certifications /></Layout>),
});

type Cert = { id: string; title: string; provider: string; file_url: string; file_path: string | null };

const FOCUS = [
  { count: 8, label: "IT Support" },
  { count: 12, label: "Software Development" },
  { count: 6, label: "Data & AI" },
  { count: 4, label: "Project Management" },
];

function Certifications() {
  const [certs, setCerts] = useState<Cert[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from("certificates")
      .select("id, title, provider, file_url, file_path")
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


  const grouped = certs.reduce<Record<string, Cert[]>>((acc, c) => {
    (acc[c.provider] ||= []).push(c);
    return acc;
  }, {});

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
      <div className="max-w-2xl">
        <p className="text-sm font-semibold text-primary uppercase tracking-wider">Certifications</p>
        <h1 className="mt-2 text-4xl sm:text-5xl font-bold tracking-tight text-foreground">Continuous learning</h1>
        <p className="mt-4 text-muted-foreground">A growing collection of certifications across IT and emerging technologies.</p>
      </div>

      <div className="mt-12">
        {loading ? (
          <div className="text-sm text-muted-foreground">Loading certifications…</div>
        ) : Object.keys(grouped).length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border bg-card p-10 text-center">
            <Award size={28} className="mx-auto text-muted-foreground" />
            <p className="mt-3 text-sm text-muted-foreground">No certificates uploaded yet. Check back soon.</p>
          </div>
        ) : (
          <div className="space-y-10">
            {Object.entries(grouped).map(([provider, items]) => (
              <section key={provider}>
                <h2 className="text-xl font-semibold text-foreground">{provider}</h2>
                <div className="mt-4 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {items.map((c) => (
                    <div key={c.id} className="bg-card border border-border rounded-2xl p-5 shadow-soft hover:shadow-card transition-shadow flex flex-col">
                      <div className="size-10 rounded-lg bg-primary-soft text-primary flex items-center justify-center">
                        <Award size={18} />
                      </div>
                      <h3 className="mt-3 font-semibold text-foreground leading-snug">{c.title}</h3>
                      <button
                        type="button"
                        onClick={() => openCert(c)}
                        className="mt-4 inline-flex items-center gap-2 self-start rounded-full bg-primary text-primary-foreground px-3.5 py-1.5 text-xs font-semibold hover:opacity-90 transition-opacity"
                      >
                        View Certificate <ExternalLink size={12} />
                      </button>

                    </div>
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}
      </div>

      <div className="mt-20">
        <h2 className="text-2xl font-bold text-foreground">Certification focus areas</h2>
        <div className="mt-6 grid grid-cols-2 lg:grid-cols-4 gap-5">
          {FOCUS.map((f) => (
            <div key={f.label} className="bg-card border border-border rounded-2xl p-6 text-center shadow-soft">
              <div className="text-4xl font-bold text-primary">{f.count}</div>
              <div className="mt-1 text-sm text-muted-foreground">{f.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
