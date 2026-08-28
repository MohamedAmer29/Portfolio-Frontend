import { Pencil, Trash2 } from "lucide-react";
import { Reveal } from "../Reveal";
import { CATEGORIES, CATEGORY_COLORS } from "./skillsData";
import type { Skill, SkillCategory } from "./skillsData";

export function SkillsMobileList({
  activeCategory,
  skills,
  showActions,
  onEdit,
  onDelete,
}: {
  activeCategory: SkillCategory | null;
  skills: Skill[];
  showActions: boolean;
  onEdit: (skill: Skill) => void;
  onDelete: (skill: Skill) => void;
}) {
  return (
    <div className="space-y-8 md:hidden">
      {CATEGORIES.map((cat) => {
        const catSkills = skills.filter((s) => s.category === cat.id);
        if (
          catSkills.length === 0 ||
          (activeCategory && activeCategory !== cat.id)
        ) {
          return null;
        }
        return (
          <Reveal key={cat.id} delay={0.05}>
            <div>
              <div className="mb-3 flex items-center gap-2">
                <span
                  className="size-2 rounded-full"
                  style={{ backgroundColor: CATEGORY_COLORS[cat.id] }}
                />
                <span className="font-mono text-[11px] uppercase tracking-widest text-ink-soft">
                  {cat.label}
                </span>
              </div>
              <div className="space-y-2">
                {catSkills.map((skill) => (
                  <div
                    key={skill.id}
                    className="group flex items-center gap-3 rounded-lg border border-ink/6 bg-bg-elevated/50 px-4 py-3 transition-all duration-300 hover:border-accent/25 hover:bg-accent/5"
                  >
                    <div className="relative flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-ink">
                          {skill.name}
                        </span>
                        <span className="font-mono text-[10px] text-ink-soft">
                          {skill.level}%
                        </span>
                      </div>
                      <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-ink/6">
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{
                            width: `${skill.level}%`,
                            backgroundColor: CATEGORY_COLORS[skill.category],
                            opacity: 0.7,
                          }}
                        />
                      </div>
                    </div>
                    {showActions && (
                      <div className="flex shrink-0 flex-col gap-1.5">
                        <button
                          type="button"
                          onClick={() => onEdit(skill)}
                          className="grid size-8 place-items-center rounded-sm border border-ink/10 text-ink-muted transition hover:border-accent hover:bg-accent/10 hover:text-accent"
                          aria-label={`Edit ${skill.name}`}
                          title="Edit"
                        >
                          <Pencil className="size-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => onDelete(skill)}
                          className="grid size-8 place-items-center rounded-sm border border-ink/10 text-ink-muted transition hover:border-error hover:bg-error/10 hover:text-error"
                          aria-label={`Delete ${skill.name}`}
                          title="Delete"
                        >
                          <Trash2 className="size-3.5" />
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        );
      })}
    </div>
  );
}