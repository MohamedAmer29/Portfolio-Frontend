import { Reveal } from "../Reveal";
import { CATEGORIES, CATEGORY_COLORS } from "./skillsData";
import type { Skill, SkillCategory } from "./skillsData";

export function SkillsMobileList({
  activeCategory,
  skills,
}: {
  activeCategory: SkillCategory | null;
  skills: Skill[];
}) {
  return (
    <div className="space-y-8 md:hidden">
      {CATEGORIES.map((cat) => {
        const catSkills = skills.filter((s) => s.category === cat.id);
        if (activeCategory && activeCategory !== cat.id) return null;
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
