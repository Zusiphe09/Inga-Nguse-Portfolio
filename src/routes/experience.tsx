import { createFileRoute } from "@tanstack/react-router";
import { Layout } from "@/components/Layout";
import { Briefcase, FileCheck } from "lucide-react";

export const Route = createFileRoute("/experience")({
  head: () => ({
    meta: [
      { title: "Experience — Inga Nguse" },
      { name: "description", content: "Professional experience and roles held by Inga Nguse." },
    ],
  }),
  component: () => (<Layout><Experience /></Layout>),
});

const ENTRIES = [
  {
    period: "Present",
    title: "CAPACITI",
    role: "CAPACITI Candidate",
    icon: Briefcase,
    points: [
      "Participating in intensive IT training and professional development program",
      "Gaining hands-on experience in enterprise IT support and systems administration",
      "Collaborating with industry professionals on real-world IT projects",
      "Developing skills in modern IT infrastructure and cloud technologies",
      "Building expertise in IT service management and best practices",
    ],
  },
  {
    period: "Dec 2024 – Dec 2025",
    title: "Gill College Marking Centre",
    role: "Examination Assistant",
    icon: FileCheck,
    points: [
      "Provided technical and administrative support during examination periods",
      "Managed examination materials and ensured secure handling of documents",
      "Assisted in coordinating examination logistics and scheduling",
      "Maintained accurate records and documentation",
      "Supported quality assurance processes for examination administration",
      "Demonstrated attention to detail and ability to work under pressure",
    ],
  },
];


const SKILLS = {
  Technical: ["Systems administration", "Cloud technologies", "IT service management", "Troubleshooting"],
  Organizational: ["Documentation", "Quality control", "Coordination", "Time management"],
  Professional: ["Communication", "Teamwork", "Reliability", "Attention to detail"],
};

function Experience() {
  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
      <div className="max-w-2xl">
        <p className="text-sm font-semibold text-primary uppercase tracking-wider">Experience</p>
        <h1 className="mt-2 text-4xl sm:text-5xl font-bold tracking-tight text-foreground">Where I've worked</h1>
        <p className="mt-4 text-muted-foreground">A timeline of hands-on roles and responsibilities.</p>
      </div>

      <div className="mt-14 relative">
        <div className="absolute left-[28px] sm:left-[60px] top-0 bottom-0 w-px bg-border" aria-hidden />
        <ol className="space-y-10">
          {ENTRIES.map((e) => (
            <li key={e.title} className="relative grid grid-cols-[64px_1fr] sm:grid-cols-[140px_1fr] gap-4 sm:gap-8">
              <div className="flex flex-col items-start">
                <div className="relative z-10 size-14 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center shadow-soft">
                  <e.icon size={22} />
                </div>
                <div className="mt-3 text-xs font-semibold text-primary text-left">{e.period}</div>
              </div>
              <div className="bg-card border border-border rounded-2xl p-6 shadow-soft">
                <h3 className="text-lg font-semibold text-foreground">{e.title}</h3>
                <p className="mt-0.5 text-sm text-primary font-medium">{e.role}</p>
                <ul className="mt-4 space-y-2">
                  {e.points.map((p) => (
                    <li key={p} className="flex gap-2.5 text-sm text-muted-foreground">
                      <span className="mt-2 size-1.5 rounded-full bg-primary flex-none" />
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </li>
          ))}
        </ol>
      </div>

      <div className="mt-20">
        <h2 className="text-2xl font-bold text-foreground">Skills developed on the job</h2>
        <div className="mt-6 grid sm:grid-cols-3 gap-5">
          {Object.entries(SKILLS).map(([group, items]) => (
            <div key={group} className="bg-card border border-border rounded-2xl p-6 shadow-soft">
              <h3 className="font-semibold text-foreground">{group}</h3>
              <ul className="mt-3 space-y-1.5">
                {items.map((i) => (
                  <li key={i} className="text-sm text-muted-foreground">{i}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
