import { LogOut, ShieldCheck } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";

export function AdminAuthBadge() {
  const { isAdmin, logout } = useAuth();

  if (!isAdmin) return null;

  return (
    <div className="fixed top-16 right-4   z-[190] flex items-center gap-2">
      <span className="inline-flex items-center gap-1.5 rounded-sm border border-accent/30 bg-accent/10 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.12em] text-accent">
        <ShieldCheck className="size-3" aria-hidden="true" />
        Authenticated
      </span>
      <button
        type="button"
        onClick={() => logout()}
        className="inline-flex items-center gap-1.5 rounded-sm border border-ink/15 bg-bg-elevated px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.12em] text-ink-muted transition hover:border-error/40 hover:bg-error/10 hover:text-error"
        aria-label="Log out"
      >
        <LogOut className="size-3" aria-hidden="true" />
        Logout
      </button>
    </div>
  );
}
