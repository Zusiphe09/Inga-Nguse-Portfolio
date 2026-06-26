import { createFileRoute } from "@tanstack/react-router";
import { Layout } from "@/components/Layout";
import { Eye, Target, Compass } from "lucide-react";
import portrait from "@/assets/inga-portrait.jpeg.asset.json";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — Inga Nguse" },
      { name: "description", content: "Personal background, vision, mission, and career goals of Inga Nguse." },
    ],
  }),
  component: () => (<Layout><About /></Layout>),
});

function About() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
      <div className="max-w-2xl">
        <p className="text-sm font-semibold text-primary uppercase tracking-wider">About</p>
        <h1 className="mt-2 text-4xl sm:text-5xl font-bold tracking-tight text-foreground">A bit about me</h1>
      </div>

      <div className="mt-12 grid lg:grid-cols-2 gap-12 items-start">
        <div className="space-y-5 text-muted-foreground leading-relaxed">
          <h2 className="text-2xl font-semibold text-foreground">Personal background</h2>
          <p>
            I am Inga Nguse, an IT Support Specialist with a strong foundation in information
            technology and a passion for solving complex technical challenges. My journey in IT
            began with a curiosity about how technology works and has evolved into a dedicated
            career focused on providing exceptional technical support and innovative solutions.
          </p>
          <p>
            With a Diploma and Advanced Diploma in Information Technology from Nelson Mandela
            University, I have built a solid academic foundation that complements my practical
            experience. My approach to IT support is centered on understanding user needs,
            communicating technical concepts clearly, and delivering solutions that enhance
            productivity and user satisfaction.
          </p>
          <p>
            Beyond technical skills, I believe in the power of continuous learning and staying
            current with emerging technologies. This commitment is reflected in my extensive
            collection of certifications from leading technology providers including Google,
            IBM, AWS, and DeepLearning.AI.
          </p>
        </div>

        <div className="relative">
          <div className="absolute -inset-4 rounded-[2rem] bg-gradient-to-br from-primary-soft to-transparent -z-10" />
          <div className="relative rounded-3xl overflow-hidden shadow-elevated bg-card aspect-[4/5] max-w-md mx-auto">
            <img src={portrait.url} alt="Inga Nguse" className="h-full w-full object-cover" />
          </div>
        </div>
      </div>

      <div className="mt-20 grid sm:grid-cols-3 gap-5">
        {[
          { icon: Eye, title: "Vision", body: "To become a trusted IT leader who designs systems that empower people and organizations to do their best work." },
          { icon: Target, title: "Mission", body: "Deliver reliable, secure, and human-centered technical support that turns friction into flow." },
          { icon: Compass, title: "Career Goals", body: "Grow into senior IT and cloud roles, specializing in service management, security, and automation." },
        ].map((c) => (
          <div key={c.title} className="bg-card border border-border rounded-2xl p-7 shadow-soft hover:shadow-card transition-shadow">
            <div className="size-11 rounded-xl bg-primary-soft text-primary flex items-center justify-center mb-4">
              <c.icon size={20} />
            </div>
            <h3 className="font-semibold text-foreground text-lg">{c.title}</h3>
            <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{c.body}</p>
          </div>
        ))}
      </div>

      <div className="mt-16 rounded-3xl bg-muted/50 border border-border p-8 lg:p-12">
        <p className="text-sm font-semibold text-primary uppercase tracking-wider">Professional philosophy</p>
        <p className="mt-4 text-xl lg:text-2xl text-foreground leading-relaxed font-medium">
          "Technology should empower, not frustrate. Every technical challenge is an opportunity
          to learn, improve, and deliver better solutions — for the people using the system
          today, and the team maintaining it tomorrow."
        </p>
      </div>
    </div>
  );
}
