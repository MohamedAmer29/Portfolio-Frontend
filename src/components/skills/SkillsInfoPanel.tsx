import { CATEGORIES, CATEGORY_COLORS, type Skill } from "./skillsData";

export function SkillsInfoPanel({
  focusedSkill,
}: {
  focusedSkill: Skill | undefined;
}) {
  return (
    <div
      className={`sticky top-28 transition-all duration-500 ${
        focusedSkill
          ? "translate-y-0 opacity-100"
          : "translate-y-4 opacity-40"
      }`}
    >
      {focusedSkill ? (
        <div className="rounded-xl border border-ink/10 bg-bg-elevated/90 p-5 shadow-[0_8px_32px_rgba(0,0,0,0.08)] backdrop-blur-sm">
          <div className="mb-1 flex items-center gap-2">
            <span
              className="size-2 rounded-full"
              style={{
                backgroundColor: CATEGORY_COLORS[focusedSkill.category],
              }}
            />
            <span className="font-mono text-[10px] uppercase tracking-widest text-ink-soft">
              {
                CATEGORIES.find(
                  (c) => c.id === focusedSkill.category,
                )?.label
              }
            </span>
          </div>
          <div className="mb-2 text-base font-bold text-ink">
            {focusedSkill.name}
          </div>
          <div className="mb-3 text-[13px] leading-relaxed text-ink-muted">
            {focusedSkill.description}
          </div>
          <div className="mb-3">
            <div className="mb-1 font-mono text-[10px] uppercase tracking-wider text-ink-soft">
              Proficiency
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-ink/6">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${focusedSkill.level}%`,
                  backgroundColor:
                    CATEGORY_COLORS[focusedSkill.category],
                }}
              />
            </div>
          </div>
          <div>
            <div className="mb-1.5 font-mono text-[10px] uppercase tracking-wider text-ink-soft">
              Related
            </div>
            <div className="flex flex-wrap gap-1.5">
              {[...new Set(focusedSkill.related)].map((r) => (
                <span
                  key={r}
                  className="rounded-md border border-ink/8 bg-ink/3 px-2 py-0.5 font-mono text-[10px] text-ink-soft"
                >
                  {r}
                </span>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-ink/10 p-5 text-center">
          <div className="mb-2 text-[13px] text-ink-soft">
            Hover over a skill
          </div>
          <div className="font-mono text-[10px] text-ink-soft/60">
            to see details
          </div>
        </div>
      )}
    </div>
  );
}
