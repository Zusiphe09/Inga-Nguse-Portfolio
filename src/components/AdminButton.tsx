import { Link } from "@tanstack/react-router";
import { Lock } from "lucide-react";

export function AdminButton() {
  return (
    <Link
      to="/auth"
      aria-label="Admin login"
      className="fixed bottom-4 left-4 z-50 inline-flex items-center gap-1.5 rounded-full bg-foreground/90 text-background px-3 py-1.5 text-xs font-medium shadow-card hover:bg-foreground transition-colors"
    >
      <Lock size={12} /> Admin
    </Link>
  );
}
