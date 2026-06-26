import { createFileRoute } from "@tanstack/react-router";
import { Layout } from "@/components/Layout";
import { GraduationCap } from "lucide-react";

export const Route = createFileRoute("/education")({
  head: () => ({
    meta: [
      { title: "Education — Inga Nguse" },
      { name: "description", content: "Academic background of Inga Nguse from Nelson Mandela University." },
    ],
  }),
  component: () => (<Layout><Education /></Layout>),
});

const ENTRIES = [
  {
    years: "2025",
    title: "Advanced Diploma in Information Technology",
    institution: "Nelson Mandela University",
    body: "Deeper specialization in systems thinking, software development, data, and modern IT practices.",
  },
  {
    years: "2022 – 2024",
    title: "Diploma in IT (Support Services)",
    institution: "Nelson Mandela University",
    body: "Comprehensive foundation in technical support, hardware, networking, operating systems, and end-user service delivery.",
  },
];


const SKILLS = [
  "Technical Support",
  "Systems Administration",
  "Networking Fundamentals",
  "Operating Systems",
  "Software Development",
  "Database Management",
  "IT Project Management",
  "Cloud Computing",
  "Information Security",
  "Data Analysis",
  "Service Management",
  "Documentation",
];

function Education() {
  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
      <div className="max-w-2xl">
        <p className="text-sm font-semibold text-primary uppercase tracking-wider">Education</p>
        <h1 className="mt-2 text-4xl sm:text-5xl font-bold tracking-tight text-foreground">Academic journey</h1>
        <p className="mt-4 text-muted-foreground">A solid foundation built at Nelson Mandela University.</p>
      </div>

      <div className="mt-14 relative">
        <div className="absolute left-[28px] sm:left-[60px] top-0 bottom-0 w-px bg-border" aria-hidden />
        <ol className="space-y-10">
          {ENTRIES.map((e) => (
            <li key={e.title} className="relative grid grid-cols-[64px_1fr] sm:grid-cols-[140px_1fr] gap-4 sm:gap-8">
              <div className="flex flex-col items-start">
                <div className="relative z-10 size-14 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center shadow-soft">
                  <GraduationCap size={22} />
                </div>
                <div className="mt-3 text-xs font-semibold text-primary">{e.years}</div>
              </div>
              <div className="bg-card border border-border rounded-2xl p-6 shadow-soft">
                <h3 className="text-lg font-semibold text-foreground">{e.title}</h3>
                <p className="mt-0.5 text-sm text-primary font-medium">{e.institution}</p>
                <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{e.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>

      <div className="mt-20">
        <h2 className="text-2xl font-bold text-foreground">Skills acquired through education</h2>
        <p className="mt-2 text-muted-foreground">Core competencies developed across both diplomas.</p>
        <div className="mt-6 flex flex-wrap gap-2">
          {SKILLS.map((s) => (
            <span key={s} className="inline-flex items-center px-3.5 py-1.5 rounded-full bg-primary-soft text-primary text-sm font-medium">
              {s}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
