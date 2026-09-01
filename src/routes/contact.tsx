import { createFileRoute } from "@tanstack/react-router";
import { Layout } from "@/components/Layout";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Phone, Mail, Linkedin, Github, CheckCircle2 } from "lucide-react";
import { z } from "zod";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Inga Nguse" },
      { name: "description", content: "Get in touch with Inga Nguse for IT collaboration, opportunities, and inquiries." },
    ],
  }),
  component: () => (<Layout><Contact /></Layout>),
});

const schema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100),
  email: z.string().trim().email("Invalid email").max(255),
  message: z.string().trim().min(1, "Message is required").max(5000),
});

function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [error, setError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      setError(parsed.error.issues[0].message);
      return;
    }
    setSending(true);
    const { error: insErr } = await supabase.from("contact_messages").insert(parsed.data);
    setSending(false);
    if (insErr) {
      setError("Could not send your message. Please try again.");
      return;
    }
    setSent(true);
    setForm({ name: "", email: "", message: "" });
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
      <div className="max-w-2xl">
        <p className="text-sm font-semibold text-primary uppercase tracking-wider">Contact</p>
        <h1 className="mt-2 text-4xl sm:text-5xl font-bold tracking-tight text-foreground">Let's talk</h1>
        <p className="mt-4 text-muted-foreground">
          Whether it's a collaboration, an opportunity, or a quick question — I'd love to hear from you.
        </p>
      </div>

      <div className="mt-12 grid lg:grid-cols-2 gap-10 items-start">
        <div className="space-y-6">
          <div className="bg-card border border-border rounded-2xl p-6 sm:p-8 shadow-soft">
            <div className="space-y-5">
              <a
                href="tel:+27810049960"
                className="flex items-center gap-4 group"
              >
                <div className="size-11 shrink-0 rounded-xl bg-primary-soft text-primary flex items-center justify-center">
                  <Phone size={20} />
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Phone</div>
                  <div className="mt-0.5 font-semibold text-foreground group-hover:text-primary transition-colors break-all">
                    081 0049 960
                  </div>
                </div>
              </a>
              <a
                href="mailto:inganguse09@gmail.com"
                className="flex items-center gap-4 group"
              >
                <div className="size-11 shrink-0 rounded-xl bg-primary-soft text-primary flex items-center justify-center">
                  <Mail size={20} />
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Email</div>
                  <div className="mt-0.5 font-semibold text-foreground group-hover:text-primary transition-colors break-all">
                    inganguse09@gmail.com
                  </div>
                </div>
              </a>
            </div>

            <div className="my-6 border-t border-border" />

            <div className="flex justify-center items-center gap-5">
              <a
                href="https://www.linkedin.com/in/inga-nguse-4902323a5"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="inline-flex size-11 items-center justify-center rounded-full border border-border bg-background text-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary transition-colors"
              >
                <Linkedin size={20} />
              </a>
              <a
                href="https://github.com/Zusiphe09"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                className="inline-flex size-11 items-center justify-center rounded-full border border-border bg-background text-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary transition-colors"
              >
                <Github size={20} />
              </a>
              <a
                href="mailto:inganguse09@gmail.com"
                aria-label="Email"
                className="inline-flex size-11 items-center justify-center rounded-full border border-border bg-background text-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary transition-colors"
              >
                <Mail size={20} />
              </a>
            </div>
          </div>

          <div className="rounded-2xl bg-accent border border-primary/15 p-6">
            <div className="text-sm font-semibold text-accent-foreground">Availability</div>
            <p className="mt-1.5 text-sm text-accent-foreground/80">
              Currently open to IT support, systems administration, and collaborative project opportunities.
              I usually respond within 24 hours.
            </p>
          </div>
        </div>

        <form onSubmit={onSubmit} className="bg-card border border-border rounded-2xl p-7 shadow-soft space-y-4">
          <h2 className="text-xl font-semibold text-foreground">Send a message</h2>
          {sent && (
            <div className="rounded-lg bg-primary-soft text-primary p-3 flex items-start gap-2 text-sm">
              <CheckCircle2 size={16} className="mt-0.5 flex-none" />
              <span>Thank you! Your message has been received.</span>
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Name</label>
            <input
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full rounded-lg border border-input bg-background px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="Your name"
              maxLength={100}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Email</label>
            <input
              required
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full rounded-lg border border-input bg-background px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="you@example.com"
              maxLength={255}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Message</label>
            <textarea
              required
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              rows={5}
              maxLength={5000}
              className="w-full rounded-lg border border-input bg-background px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none"
              placeholder="How can I help?"
            />
          </div>
          {error && <div className="text-sm text-destructive">{error}</div>}
          <button
            type="submit"
            disabled={sending}
            className="w-full rounded-full bg-primary text-primary-foreground px-5 py-3 text-sm font-semibold shadow-soft hover:opacity-95 transition-opacity disabled:opacity-60"
          >
            {sending ? "Sending…" : "Send message"}
          </button>
          <p className="text-xs text-muted-foreground text-center">
            Messages are delivered to inganguse09@gmail.com via the admin inbox.
          </p>
        </form>
      </div>
    </div>
  );
}
