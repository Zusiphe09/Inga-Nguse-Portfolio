import { createFileRoute, Link } from "@tanstack/react-router";
import { Layout } from "@/components/Layout";
import { Wrench, BarChart3, ShieldCheck, Lightbulb, ArrowRight, MapPin, Download } from "lucide-react";
import portrait from "@/assets/inga-portrait.jpeg.asset.json";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Inga Nguse — IT Support Specialist" },
      { name: "description", content: "Turning technical problems into simple solutions. IT Support Specialist based in Port Elizabeth, South Africa." },
    ],
  }),
  component: () => (
    <Layout>
      <Home />
    </Layout>
  ),
});

function Home() {
  const [location, setLocation] = useState("Port Elizabeth, South Africa");
  const [cvUrl, setCvUrl] = useState<string | null>(null);
  useEffect(() => {
    supabase.from("site_settings").select("key,value").in("key", ["location", "cv_url"]).then(({ data }) => {
      const loc = data?.find((r) => r.key === "location")?.value;
      const cv = data?.find((r) => r.key === "cv_url")?.value;
      if (loc) setLocation(loc);
      if (cv) setCvUrl(cv);
    });
  }, []);

  return (
    <>
      {/* Hero */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-12 pb-20 lg:pt-20 lg:pb-28 grid lg:grid-cols-2 gap-12 items-center">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-soft text-primary text-xs font-medium mb-6">
            <MapPin size={12} /> Based in {location}
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-foreground leading-[1.05]">
            Inga Nguse
          </h1>
          <p className="mt-3 text-xl sm:text-2xl font-semibold text-primary">IT Support Specialist</p>
          <p className="mt-5 text-base sm:text-lg text-muted-foreground max-w-xl leading-relaxed">
            IT Support Specialist with a strong foundation in information technology and a
            passion for solving complex technical challenges. Based in Port Elizabeth, South
            Africa, I combine a solid academic background with hands-on experience to deliver
            reliable, user-focused technical support and innovative solutions.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/projects"
              className="inline-flex items-center gap-2 rounded-full bg-primary text-primary-foreground px-6 py-3 text-sm font-semibold shadow-soft hover:opacity-95 transition-all hover:-translate-y-0.5"
            >
              View Portfolio <ArrowRight size={16} />
            </Link>
            {cvUrl && (
              <a
                href={cvUrl}
                target="_blank"
                rel="noopener noreferrer"
                download
                className="inline-flex items-center gap-2 rounded-full border border-border bg-background text-foreground px-6 py-3 text-sm font-semibold hover:bg-muted transition-colors"
              >
                <Download size={16} /> Download CV
              </a>
            )}
          </div>
        </div>

        <div className="relative">
          <div className="absolute -inset-4 rounded-[2rem] bg-gradient-to-br from-primary-soft to-transparent -z-10" />
          <div className="relative rounded-3xl overflow-hidden shadow-elevated bg-card aspect-[4/5] max-w-md mx-auto">
            <img src={portrait.url} alt="Inga Nguse — IT Support Specialist" className="h-full w-full object-cover" />
          </div>
        </div>
      </section>

      {/* What I bring */}
      <section className="bg-muted/40 border-y border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground">What I bring to the table</h2>
            <p className="mt-3 text-muted-foreground">
              A blend of technical depth, structured thinking, and a security-first mindset.
            </p>
          </div>
          <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { icon: Wrench, title: "Technical expertise", desc: "Hands-on support across hardware, software, and networks." },
              { icon: BarChart3, title: "Data-driven solutions", desc: "Decisions grounded in metrics, logs, and clear evidence." },
              { icon: ShieldCheck, title: "Security focused", desc: "Best practices baked into every system I touch." },
              { icon: Lightbulb, title: "Innovation mindset", desc: "Always exploring better ways to solve real problems." },
            ].map((c) => (
              <div key={c.title} className="group bg-card rounded-2xl p-6 border border-border shadow-soft hover:shadow-card transition-all hover:-translate-y-0.5">
                <div className="size-11 rounded-xl bg-primary-soft text-primary flex items-center justify-center mb-4 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  <c.icon size={20} />
                </div>
                <h3 className="font-semibold text-foreground">{c.title}</h3>
                <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">{c.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
          {[
            { n: "30+", l: "Certifications" },
            { n: "2", l: "Major projects" },
            { n: "2", l: "Diplomas" },
            { n: "5+", l: "Years learning" },
          ].map((s) => (
            <div key={s.l} className="bg-card border border-border rounded-2xl p-6 text-center shadow-soft">
              <div className="text-4xl font-bold text-primary">{s.n}</div>
              <div className="mt-1 text-sm text-muted-foreground">{s.l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-24">
        <div className="rounded-3xl bg-primary text-primary-foreground px-8 py-14 lg:px-16 text-center shadow-elevated">
          <h2 className="text-2xl sm:text-3xl font-bold">Ready to collaborate?</h2>
          <p className="mt-3 text-base sm:text-lg opacity-90 max-w-2xl mx-auto">
            Let's discuss how I can help solve your IT challenges.
          </p>
          <Link
            to="/contact"
            className="mt-7 inline-flex items-center gap-2 rounded-full bg-background text-foreground px-6 py-3 text-sm font-semibold hover:opacity-90 transition-opacity"
          >
            Start a conversation <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </>
  );
}
