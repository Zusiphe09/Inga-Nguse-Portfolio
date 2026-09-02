import { Link, Outlet, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Menu, X, Github, Mail, Phone, Linkedin } from "lucide-react";

const NAV = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/education", label: "Education" },
  { to: "/experience", label: "Experience" },
  { to: "/projects", label: "Projects" },
  { to: "/certifications", label: "Certifications" },
  { to: "/contact", label: "Contact" },
] as const;

export function Layout({ children }: { children?: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="sticky top-0 z-40 backdrop-blur-md bg-background/80 border-b border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 grid grid-cols-[minmax(0,1fr)_auto] md:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-3">
          <Link
            to="/admin"
            aria-label="Admin login"
            title="Admin login"
            className="min-w-0 truncate font-bold text-lg tracking-tight text-foreground hover:text-primary transition-colors"
          >
            Inga Nguse
          </Link>
          <nav className="hidden md:flex items-center justify-center gap-0.5 lg:gap-1">
            {NAV.map((item) => {
              const active = item.to === "/" ? pathname === "/" : pathname.startsWith(item.to);
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  aria-current={active ? "page" : undefined}
                  className={
                    "relative px-3 lg:px-4 py-2 rounded-full text-[13px] lg:text-sm font-medium transition-all duration-200 " +
                    (active
                      ? "bg-primary text-primary-foreground shadow-soft"
                      : "text-muted-foreground hover:text-primary hover:bg-primary-soft")
                  }
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <div className="hidden md:block" />
          <button
            onClick={() => setOpen((o) => !o)}
            className="md:hidden shrink-0 p-2 rounded-md text-foreground hover:bg-muted"
            aria-label="Toggle menu"
            aria-expanded={open}
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
        <div
          className={
            "md:hidden overflow-hidden transition-[max-height,opacity] duration-300 ease-out border-t border-border " +
            (open ? "max-h-[480px] opacity-100" : "max-h-0 opacity-0")
          }
        >

          <nav className="px-4 py-3 flex flex-col gap-1 bg-background">
            {NAV.map((item) => {
              const active = item.to === "/" ? pathname === "/" : pathname.startsWith(item.to);
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={
                    "px-4 py-2.5 rounded-lg text-sm font-medium transition-colors " +
                    (active
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted")
                  }
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </header>

      <main className="flex-1">
        {children ?? <Outlet />}
      </main>

      <footer className="bg-[#0F172A] text-white border-t border-white/10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8 lg:gap-12 items-start">
            <div>
              <div className="font-bold text-xl tracking-tight">Inga Nguse</div>
              <p className="mt-3 text-sm leading-relaxed text-slate-300 max-w-xs">
                IT Support Specialist turning technical problems into simple solutions.
              </p>
            </div>

            <div>
              <div className="font-semibold text-sm uppercase tracking-wider mb-4">Quick Links</div>
              <ul className="space-y-2.5">
                {[
                  { to: "/about", label: "About" },
                  { to: "/education", label: "Education" },
                  { to: "/experience", label: "Experience" },
                  { to: "/projects", label: "Projects" },
                ].map((item) => (
                  <li key={item.to}>
                    <Link
                      to={item.to}
                      className="text-sm text-slate-300 hover:text-white transition-colors"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <div className="font-semibold text-sm uppercase tracking-wider mb-4">Get in Touch</div>
              <ul className="space-y-3 text-sm text-slate-300">
                <li>
                  <a
                    href="tel:+27810049960"
                    className="inline-flex items-center gap-3 hover:text-white transition-colors"
                  >
                    <span className="inline-flex size-8 items-center justify-center rounded-lg bg-slate-800 text-white">
                      <Phone size={16} />
                    </span>
                    081 0049 960
                  </a>
                </li>
                <li>
                  <a
                    href="mailto:inganguse09@gmail.com"
                    className="inline-flex items-center gap-3 hover:text-white transition-colors break-all"
                  >
                    <span className="inline-flex size-8 items-center justify-center rounded-lg bg-slate-800 text-white">
                      <Mail size={16} />
                    </span>
                    inganguse09@gmail.com
                  </a>
                </li>
              </ul>
              <div className="mt-5 flex items-center gap-3">
                <a
                  href="https://www.linkedin.com/in/inga-nguse-4902323a5"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn"
                  className="inline-flex size-10 items-center justify-center rounded-lg bg-slate-800 text-white hover:bg-[#2563EB] hover:scale-105 transition-all duration-200"
                >
                  <Linkedin size={18} />
                </a>
                <a
                  href="https://github.com/Zusiphe09"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="GitHub"
                  className="inline-flex size-10 items-center justify-center rounded-lg bg-slate-800 text-white hover:bg-[#2563EB] hover:scale-105 transition-all duration-200"
                >
                  <Github size={18} />
                </a>
                <a
                  href="mailto:inganguse09@gmail.com"
                  aria-label="Email"
                  className="inline-flex size-10 items-center justify-center rounded-lg bg-slate-800 text-white hover:bg-[#2563EB] hover:scale-105 transition-all duration-200"
                >
                  <Mail size={18} />
                </a>
              </div>
            </div>
          </div>
        </div>
        <div className="border-t border-white/10">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-5 text-xs text-slate-400 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 text-center sm:text-left">
            <span>© {new Date().getFullYear()} Inga Nguse. All rights reserved.</span>
            <span>Built with care.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
