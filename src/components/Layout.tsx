import { Link, Outlet, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowUpRight, Github, Linkedin, Mail, Menu, Phone, X } from "lucide-react";
import { Button } from "@/components/ui/button";

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
                      ? "bg-primary-soft text-highlight shadow-soft"
                      : "text-muted-foreground hover:text-highlight hover:bg-primary-soft")
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
                      ? "bg-primary-soft text-highlight"
                      : "text-muted-foreground hover:text-highlight hover:bg-muted")
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

      <footer className="border-y border-footer-divider bg-footer-background text-footer-foreground">
        <div className="footer-diagonal h-20 sm:h-28 lg:h-36 bg-background" aria-hidden="true" />

        <div className="mx-auto max-w-7xl px-4 pb-14 pt-8 sm:px-6 sm:pb-16 lg:px-8 lg:pb-20 lg:pt-10">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-semibold uppercase text-footer-muted">Interested?</p>
            <h2 className="mt-3 text-3xl font-bold sm:text-4xl">Let&apos;s Work Together</h2>
            <p className="mx-auto mt-4 max-w-xl leading-relaxed text-footer-muted">
              Have an opportunity, project, or technical challenge in mind? I&apos;d love to hear about it.
            </p>
            <Button asChild size="lg" className="mt-7 rounded-full bg-footer-foreground px-7 text-footer-background shadow-none hover:bg-footer-accent hover:-translate-y-0.5 focus-visible:ring-footer-foreground">
              <Link to="/contact">
                Start a conversation <ArrowUpRight />
              </Link>
            </Button>
          </div>

          <div className="mt-16 grid grid-cols-1 gap-10 border-t border-footer-divider pt-12 sm:grid-cols-2 lg:mt-20 lg:grid-cols-4 lg:gap-12">
            <div>
              <h3 className="font-semibold">Navigation</h3>
              <ul className="mt-5 space-y-3">
                {[
                  { to: "/", label: "Home" },
                  { to: "/about", label: "About" },
                  { to: "/education", label: "Education" },
                  { to: "/experience", label: "Experience" },
                ].map((item) => (
                  <li key={item.to}>
                    <Link to={item.to} className="inline-block text-sm text-footer-foreground transition-transform duration-200 hover:translate-x-1">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="font-semibold">Portfolio</h3>
              <ul className="mt-5 space-y-3">
                {["IT Monitoring System", "AfriNexus Helpdesk", "AI Article Analyzer", "Heart Disease Predictor"].map((label) => (
                  <li key={label}>
                    <Link to="/projects" className="inline-block text-sm text-footer-foreground transition-transform duration-200 hover:translate-x-1">
                      {label}
                    </Link>
                  </li>
                ))}
                <li>
                  <Link to="/certifications" className="inline-block text-sm text-footer-foreground transition-transform duration-200 hover:translate-x-1">
                    Certifications
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold">Contact Information</h3>
              <ul className="mt-5 space-y-4 text-sm">
                <li>
                  <a href="tel:+27810049960" className="group inline-flex items-center gap-3 text-footer-foreground">
                    <Phone size={18} className="transition-transform duration-200 group-hover:-translate-y-0.5" />
                    081 0049 960
                  </a>
                </li>
                <li>
                  <a href="mailto:inganguse09@gmail.com" className="group inline-flex items-start gap-3 break-all text-footer-foreground">
                    <Mail size={18} className="mt-0.5 shrink-0 transition-transform duration-200 group-hover:-translate-y-0.5" />
                    inganguse09@gmail.com
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold">Social Media</h3>
              <p className="mt-5 text-sm leading-relaxed text-footer-muted">Connect with me and follow my latest work.</p>
              <div className="mt-5 flex items-center gap-3">
                {[
                  { href: "https://www.linkedin.com/in/inga-nguse-4902323a5", label: "LinkedIn", Icon: Linkedin },
                  { href: "https://github.com/Zusiphe09", label: "GitHub", Icon: Github },
                  { href: "mailto:inganguse09@gmail.com", label: "Email", Icon: Mail },
                ].map(({ href, label, Icon }) => (
                  <a
                    key={label}
                    href={href}
                    target={href.startsWith("http") ? "_blank" : undefined}
                    rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
                    aria-label={label}
                    title={label}
                    className="inline-flex size-11 items-center justify-center rounded-full border border-footer-foreground text-footer-foreground transition-all duration-200 hover:-translate-y-1 hover:bg-footer-foreground hover:text-footer-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-footer-foreground focus-visible:ring-offset-2 focus-visible:ring-offset-footer-background"
                  >
                    <Icon size={18} strokeWidth={1.75} />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-footer-divider">
          <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-5 text-center text-xs text-footer-muted sm:flex-row sm:px-6 sm:text-left lg:px-8">
            <span>© {new Date().getFullYear()} Inga Nguse. All rights reserved.</span>
            <span>Built with care.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
