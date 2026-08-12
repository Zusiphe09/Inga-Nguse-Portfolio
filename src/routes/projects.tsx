import { createFileRoute } from "@tanstack/react-router";
import { Layout } from "@/components/Layout";
import { ExternalLink, Activity, Headset, Sparkles } from "lucide-react";

export const Route = createFileRoute("/projects")({
  head: () => ({
    meta: [
      { title: "Projects — Inga Nguse" },
      { name: "description", content: "Selected IT projects by Inga Nguse including monitoring and helpdesk systems." },
    ],
  }),
  component: () => (<Layout><Projects /></Layout>),
});

const PROJECTS = [
  {
    title: "IT Monitoring System",
    status: "Completed",
    statusTone: "completed" as const,
    icon: Activity,
    desc: "Comprehensive SQL Server and Power BI solution for real-time IT infrastructure monitoring and reporting.",
    role: "Database Developer & BI Analyst",
    stack: ["SQL Server", "Power BI", "T-SQL", "DAX", "Data Modeling"],
    outcomes: [
      "Real-time system performance monitoring with automated alerts",
      "Incident tracking and resolution time analysis",
      "SLA compliance reporting with visual dashboards",
      "Security monitoring and threat detection metrics",
      "Interactive dashboards for stakeholder reporting",
      "Reduced incident response time by 37% through proactive monitoring",
    ],
    link: null as string | null,
  },
  {
    title: "AfriNexus Helpdesk System",
    status: "Completed",
    statusTone: "completed" as const,
    icon: Headset,
    desc: "AI-powered workplace ticketing platform designed to streamline IT support operations with intelligent automation and predictive analytics.",
    role: "Lead Developer & System Architect",
    stack: ["React", "Node.js", "AI/ML", "Database Design", "API Development"],
    outcomes: [
      "Automated ticket prioritization using machine learning algorithms",
      "Intelligent routing based on technician expertise and workload",
      "Predictive insights for proactive issue resolution",
      "Self-service knowledge base with AI-powered search",
      "Real-time analytics and performance metrics",
      "Integration with existing IT infrastructure",
    ],
    link: "https://persona-powered-biz.lovable.app/auth",
  },
  {
    title: "AI Article Analyzer",
    status: "Completed",
    statusTone: "completed" as const,
    icon: Sparkles,
    desc: "AI-powered web application that analyzes articles and generates concise, meaningful summaries with sentiment insights.",
    role: "AI/ML Developer",
    stack: ["Python", "Hugging Face Transformers", "PyTorch", "OpenRouter API", "Gradio", "Requests"],
    outcomes: [
      "Article sentiment analysis with positive/negative classification",
      "AI-powered article summarization",
      "Full Analysis mode combining sentiment insights and summaries",
      "Interactive web interface",
      "Secure API key management using environment variables",
      "Web-based deployment",
    ],
    link: "https://article-analyzer-with-hugging-face-rqcr3kdkzkmfaakb4xbsza.streamlit.app/",
  },
];


function Projects() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
      <div className="max-w-2xl">
        <p className="text-sm font-semibold text-primary uppercase tracking-wider">Projects</p>
        <h1 className="mt-2 text-4xl sm:text-5xl font-bold tracking-tight text-foreground">Selected work</h1>
        <p className="mt-4 text-muted-foreground">Hands-on systems built to solve real operational problems.</p>
      </div>

      <div className="mt-12 grid md:grid-cols-2 gap-6">
        {PROJECTS.map((p) => (
          <article key={p.title} className="relative bg-card border border-border rounded-2xl p-7 shadow-soft hover:shadow-elevated transition-all hover:-translate-y-0.5 flex flex-col">
            <div className="flex items-start justify-between gap-4">
              <div className="size-12 rounded-xl bg-primary-soft text-primary flex items-center justify-center">
                <p.icon size={22} />
              </div>
              <span
                className={
                  "px-3 py-1 rounded-full text-xs font-semibold " +
                  (p.statusTone === "completed"
                    ? "bg-primary text-primary-foreground"
                    : "bg-accent text-accent-foreground border border-primary/20")
                }
              >
                {p.status}
              </span>
            </div>
            <h2 className="mt-5 text-xl font-semibold text-foreground">{p.title}</h2>
            <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{p.desc}</p>
            <div className="mt-4">
              <div className="text-xs font-semibold uppercase tracking-wider text-primary">Role</div>
              <div className="mt-1 text-sm text-foreground">{p.role}</div>
            </div>
            <div className="mt-4">
              <div className="text-xs font-semibold uppercase tracking-wider text-primary">Technologies</div>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {p.stack.map((s) => (
                  <span key={s} className="inline-flex px-2.5 py-1 rounded-md bg-muted text-foreground/80 text-xs font-medium">
                    {s}
                  </span>
                ))}
              </div>
            </div>
            <div className="mt-4">
              <div className="text-xs font-semibold uppercase tracking-wider text-primary">Key outcomes</div>
              <ul className="mt-2 space-y-1.5">
                {p.outcomes.map((o) => (
                  <li key={o} className="flex gap-2.5 text-sm text-muted-foreground">
                    <span className="mt-2 size-1.5 rounded-full bg-primary flex-none" />
                    <span>{o}</span>
                  </li>
                ))}
              </ul>
            </div>

            {p.link && (
              <a
                href={p.link}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 inline-flex items-center gap-2 self-start rounded-full bg-foreground text-background px-4 py-2 text-sm font-semibold hover:opacity-90 transition-opacity"
              >
                Visit project <ExternalLink size={14} />
              </a>
            )}
          </article>
        ))}
      </div>

      <div className="mt-20 rounded-3xl bg-muted/50 border border-border p-8 lg:p-12">
        <h2 className="text-2xl font-bold text-foreground">My project approach</h2>
        <div className="mt-6 grid sm:grid-cols-3 gap-6">
          {[
            { n: "01", t: "Understand", d: "Listen to the people who'll use the system. Map the real problem before writing a line of code." },
            { n: "02", t: "Build", d: "Iterate in small, working slices. Keep the architecture simple, secure, and observable." },
            { n: "03", t: "Refine", d: "Measure how it actually performs in the field, then polish friction points and document for the next person." },
          ].map((s) => (
            <div key={s.n}>
              <div className="text-primary font-bold">{s.n}</div>
              <div className="mt-1 font-semibold text-foreground">{s.t}</div>
              <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">{s.d}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
