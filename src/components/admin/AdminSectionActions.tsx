import { Plus, Pencil, Trash2, Loader2 } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";

export type AdminSection =
  | "hero"
  | "about"
  | "skills"
  | "education"
  | "experience"
  | "projects"
  | "services"
  | "contact";

type AdminSectionActionsProps = {
  section: AdminSection;
  className?: string;
  onCreate?: () => void;
  onUpdate?: () => void;
  onDelete?: () => void;
  isCreatePending?: boolean;
};

const actionButtonClass =
  "inline-flex size-9 items-center justify-center rounded-sm border border-ink/15 bg-bg-elevated text-ink-muted transition-all duration-300 hover:-translate-y-0.5 hover:border-accent hover:bg-accent/10 hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40";

export function AdminSectionActions({
  section,
  className = "",
  onCreate,
  onUpdate,
  onDelete,
  isCreatePending = false,
}: AdminSectionActionsProps) {
  const { isAdmin } = useAuth();

  if (!isAdmin) return null;

  return (
    <div
      className={`flex items-center gap-2 ${className}`}
      data-admin-section={section}
      aria-label={`Admin actions for ${section}`}
    >
      {onCreate && (
        <button
          type="button"
          className={actionButtonClass}
          aria-label={`Create ${section}`}
          title="Create"
          onClick={onCreate}
          disabled={isCreatePending}
        >
          {isCreatePending ? (
            <Loader2 className="size-4 animate-spin" aria-hidden="true" />
          ) : (
            <Plus className="size-4" aria-hidden="true" />
          )}
        </button>
      )}
      {onUpdate && (
        <button
          type="button"
          className={actionButtonClass}
          aria-label={`Update ${section}`}
          title="Update"
          onClick={onUpdate}
        >
          <Pencil className="size-4" aria-hidden="true" />
        </button>
      )}
      {onDelete && (
        <button
          type="button"
          className={`${actionButtonClass} hover:border-error hover:bg-error/10 hover:text-error`}
          aria-label={`Delete ${section}`}
          title="Delete"
          onClick={onDelete}
        >
          <Trash2 className="size-4" aria-hidden="true" />
        </button>
      )}
    </div>
  );
}
