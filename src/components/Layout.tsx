import { Link, Outlet, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Menu, X, Github, Mail, Phone, Linkedin } from "lucide-react";
import { AdminButton } from "./AdminButton";

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
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link
            to="/admin"
            aria-label="Admin login"
            title="Admin login"
            className="font-bold text-lg tracking-tight text-foreground hover:text-primary transition-colors"
          >
            Inga Nguse
          </Link>
          <nav className="hidden lg:flex items-center gap-1">
            {NAV.map((item) => {
              const active = item.to === "/" ? pathname === "/" : pathname.startsWith(item.to);
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={
                    "px-4 py-2 rounded-full text-sm font-medium transition-colors " +
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
          <button
            onClick={() => setOpen((o) => !o)}
            className="lg:hidden p-2 rounded-md text-foreground hover:bg-muted"
            aria-label="Toggle menu"
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
        <div
          className={
            "lg:hidden overflow-hidden transition-[max-height,opacity] duration-300 ease-out border-t border-border " +
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

      <footer className="border-t border-border bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 grid gap-10 md:grid-cols-3">
          <div>
            <div className="font-bold text-lg text-foreground">Inga Nguse</div>
            <p className="mt-2 text-sm text-muted-foreground max-w-xs">
              IT Support Specialist turning technical problems into simple solutions.
            </p>
          </div>
          <div>
            <div className="font-semibold text-sm text-foreground mb-3">Navigate</div>
            <ul className="space-y-2">
              {NAV.map((item) => (
                <li key={item.to}>
                  <Link to={item.to} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <div className="font-semibold text-sm text-foreground mb-3">Contact</div>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a href="tel:+27810049960" className="inline-flex items-center gap-2 hover:text-primary transition-colors">
                  <Phone size={14} /> 081 0049 960
                </a>
              </li>
              <li>
                <a href="mailto:inganguse09@gmail.com" className="inline-flex items-center gap-2 hover:text-primary transition-colors">
                  <Mail size={14} /> inganguse09@gmail.com
                </a>
              </li>
            </ul>
            <div className="mt-4 flex items-center gap-2 md:justify-end">
              <a
                href="https://www.linkedin.com/in/inga-nguse-4902323a5"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="inline-flex size-9 items-center justify-center rounded-full border border-border bg-background text-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary transition-colors"
              >
                <Linkedin size={16} />
              </a>
              <a
                href="https://github.com/Zusiphe09"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                className="inline-flex size-9 items-center justify-center rounded-full border border-border bg-background text-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary transition-colors"
              >
                <Github size={16} />
              </a>
              <a
                href="mailto:inganguse09@gmail.com"
                aria-label="Email"
                className="inline-flex size-9 items-center justify-center rounded-full border border-border bg-background text-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary transition-colors"
              >
                <Mail size={16} />
              </a>
            </div>
          </div>

        </div>
        <div className="border-t border-border">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-5 text-xs text-muted-foreground flex flex-wrap justify-between gap-2">
            <span>© {new Date().getFullYear()} Inga Nguse. All rights reserved.</span>
            <span>Built with care.</span>
          </div>
        </div>
      </footer>

      <AdminButton />
    </div>
  );
}
