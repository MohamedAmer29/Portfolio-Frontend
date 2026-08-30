import { useState } from "react";
import { Pencil, Plus, Trash2, X } from "lucide-react";
import { toast } from "react-toastify";
import { useSkills } from "../../hooks/useSkills";
import { useDeleteSkill } from "../../hooks/useSkillsMutations";
import { CATEGORIES, CATEGORY_COLORS, type Skill } from "./skillsData";
import { SkillForm } from "./SkillForm";

type SkillsManagerProps = {
  onClose: () => void;
};

const iconButtonClass =
  "grid size-8 place-items-center rounded-sm border border-ink/10 text-ink-muted transition hover:border-accent hover:bg-accent/10 hover:text-accent";

export function SkillsManager({ onClose }: SkillsManagerProps) {
  const { data: skills, isFetching } = useSkills();
  const deleteSkill = useDeleteSkill();
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [skillToDelete, setSkillToDelete] = useState<Skill | null>(null);

  const handleDelete = async (skill: Skill) => {
    try {
      await deleteSkill.mutateAsync(skill.id);
      toast.success("Skill deleted successfully.");
      setSkillToDelete(null);
    } catch {
      toast.error("Failed to delete skill.");
    }
  };

  return (
    <div
      className="fixed inset-0 z-[110] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="thin-scrollbar relative max-h-[90vh] w-full max-w-[640px] overflow-y-auto rounded-lg border border-ink/10 bg-bg-elevated p-8 shadow-[0_20px_60px_rgba(26,31,36,0.2)]"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 grid size-8 place-items-center rounded-sm border border-ink/10 text-ink-muted transition hover:border-error hover:bg-error/10 hover:text-error"
          aria-label="Close"
        >
          <X className="size-4" />
        </button>

        <div className="mb-6 flex items-center justify-between gap-3 pr-10">
          <div>
            <h2 className="font-sans text-[1.25rem] font-extrabold tracking-[-0.03em] text-ink">
              Skills
            </h2>
            <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.15em] text-accent/70">
              {isFetching
                ? "syncing…"
                : skills
                  ? `${skills.length} synced from server`
                  : "local data"}
            </p>
          </div>
          <button
            type="button"
            onClick={() => setShowCreateForm(true)}
            className="inline-flex items-center gap-1.5 rounded-sm border border-accent bg-accent px-4 py-2 font-mono text-[11px] uppercase tracking-[0.1em] text-bg transition hover:opacity-90"
          >
            <Plus className="size-3.5" /> Add Skill
          </button>
        </div>

        {!skills || skills.length === 0 ? (
          <p className="font-mono text-[12px] text-ink-soft">
            No skills yet. Add one above.
          </p>
        ) : (
          <div className="thin-scrollbar grid max-h-[60vh] gap-2 overflow-y-auto pr-1">
            {skills.map((skill) => (
              <div
                key={skill.id}
                className="flex items-center justify-between gap-3 rounded-sm border border-ink/10 bg-bg-elevated px-3 py-2.5"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span
                      className="size-2 shrink-0 rounded-full"
                      style={{ backgroundColor: CATEGORY_COLORS[skill.category] }}
                    />
                    <span className="truncate text-[13px] font-medium text-ink">
                      {skill.name}
                    </span>
                    <span className="shrink-0 rounded-sm border border-accent/30 bg-accent/10 px-1.5 py-0.5 font-mono text-[10px] text-accent">
                      {skill.level}%
                    </span>
                    {skill.isFeatured && (
                      <span className="shrink-0 rounded-sm border border-ink/10 px-1.5 py-0.5 font-mono text-[10px] text-ink-soft">
                        featured
                      </span>
                    )}
                  </div>
                  <p className="mt-0.5 truncate font-mono text-[11px] text-ink-soft">
                    {CATEGORIES.find((c) => c.id === skill.category)?.label}
                    {skill.icon ? ` · ${skill.icon}` : ""}
                    {typeof skill.yearsOfExperience === "number"
                      ? ` · ${skill.yearsOfExperience} yrs`
                      : ""}
                    {typeof skill.displayOrder === "number"
                      ? ` · order ${skill.displayOrder}`
                      : ""}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => setEditingSkill(skill)}
                    className={iconButtonClass}
                    aria-label={`Edit ${skill.name}`}
                    title="Edit"
                  >
                    <Pencil className="size-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setSkillToDelete(skill)}
                    className={`${iconButtonClass} hover:border-error hover:bg-error/10 hover:text-error`}
                    aria-label={`Delete ${skill.name}`}
                    title="Delete"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showCreateForm && (
        <SkillForm initialData={null} onClose={() => setShowCreateForm(false)} />
      )}
      {editingSkill && (
        <SkillForm
          initialData={editingSkill}
          onClose={() => setEditingSkill(null)}
        />
      )}
      {skillToDelete && (
        <div
          className="fixed inset-0 z-[120] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
          onClick={() => setSkillToDelete(null)}
        >
          <div
            className="relative w-full max-w-[400px] rounded-lg border border-ink/10 bg-bg-elevated p-8 shadow-[0_20px_60px_rgba(26,31,36,0.2)]"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setSkillToDelete(null)}
              className="absolute right-4 top-4 grid size-8 place-items-center rounded-sm border border-ink/10 text-ink-muted transition hover:border-error hover:bg-error/10 hover:text-error"
              aria-label="Close"
            >
              <X className="size-4" />
            </button>
            <h2 className="mb-2 pr-10 font-sans text-[1.25rem] font-extrabold tracking-[-0.03em] text-ink">
              Delete Skill
            </h2>
            <p className="mb-6 font-mono text-[13px] text-ink-muted">
              Are you sure you want to delete "{skillToDelete.name}"? This
              action cannot be undone.
            </p>
            <div className="flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setSkillToDelete(null)}
                className="rounded-sm border border-ink px-5 py-2 font-mono text-[12px] uppercase tracking-[0.1em] text-ink transition hover:border-accent hover:bg-accent/10"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleDelete(skillToDelete)}
                disabled={deleteSkill.isPending}
                className="rounded-sm border border-error bg-error px-5 py-2 font-mono text-[12px] uppercase tracking-[0.1em] text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {deleteSkill.isPending ? "Deleting…" : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}