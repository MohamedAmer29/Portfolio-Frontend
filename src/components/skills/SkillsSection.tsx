import { useRef, useState, useMemo, useCallback, useEffect } from "react";
import { gsap, useGSAP } from "../../lib/gsap";
import { Reveal } from "../Reveal";
import { SectionHeading } from "../SectionHeading";
import {
  skills,
  CATEGORIES,
  CATEGORY_COLORS,
  type Skill,
  type SkillCategory,
} from "./skillsData";

function getNodePositions(count: number, radius: number) {
  const positions: { x: number; y: number }[] = [];
  for (let i = 0; i < count; i++) {
    const angle = (i / count) * Math.PI * 2 - Math.PI / 2;
    positions.push({
      x: Math.cos(angle) * radius,
      y: Math.sin(angle) * radius,
    });
  }
  return positions;
}

function getConnections(skillList: Skill[]) {
  const conns: { from: number; to: number }[] = [];
  const nameIndex = new Map(skillList.map((s, i) => [s.name, i]));
  skillList.forEach((s, i) => {
    s.related.forEach((r) => {
      const j = nameIndex.get(r);
      if (j !== undefined && j > i) {
        conns.push({ from: i, to: j });
      }
    });
  });
  return conns;
}

export function SkillsSection() {
  const [activeCategory, setActiveCategory] = useState<SkillCategory | null>(
    null,
  );
  const [hoveredSkill, setHoveredSkill] = useState<string | null>(null);
  const [selectedSkill, setSelectedSkill] = useState<string | null>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const networkRef = useRef<SVGSVGElement>(null);
  const nodesRef = useRef<HTMLDivElement>(null);

  const filteredSkills = useMemo(
    () =>
      activeCategory
        ? skills.filter((s) => s.category === activeCategory)
        : skills,
    [activeCategory],
  );

  const positions = useMemo(
    () => getNodePositions(filteredSkills.length, 320),
    [filteredSkills.length],
  );

  const connections = useMemo(
    () => getConnections(filteredSkills),
    [filteredSkills],
  );

  const focusedSkill = useMemo(
    () => skills.find((s) => s.name === (hoveredSkill || selectedSkill)),
    [hoveredSkill, selectedSkill],
  );

  const isRelated = useCallback(
    (name: string) => {
      if (!focusedSkill) return false;
      return focusedSkill.name === name || focusedSkill.related.includes(name);
    },
    [focusedSkill],
  );

  const handleCategory = useCallback((cat: SkillCategory | null) => {
    setActiveCategory((prev) => (prev === cat ? null : cat));
    setHoveredSkill(null);
    setSelectedSkill(null);
  }, []);

  const handleSkillInteract = useCallback((name: string | null) => {
    setHoveredSkill(name);
    if (name) setSelectedSkill(name);
  }, []);

  useEffect(() => {
    if (!nodesRef.current) return;
    const nodes = nodesRef.current.querySelectorAll("[data-skill-node]");
    gsap.fromTo(
      nodes,
      { scale: 0, opacity: 0 },
      {
        scale: 1,
        opacity: 1,
        duration: 0.5,
        stagger: 0.03,
        ease: "back.out(1.4)",
        overwrite: true,
      },
    );
  }, [filteredSkills]);

  useGSAP(() => {
    if (!networkRef.current) return;
    const lines = networkRef.current.querySelectorAll("[data-connection]");
    gsap.fromTo(
      lines,
      { opacity: 0 },
      {
        opacity: 1,
        duration: 0.8,
        stagger: 0.015,
        ease: "power2.out",
        overwrite: true,
      },
    );
  }, [connections]);

  const categoryStats = useMemo(() => {
    return CATEGORIES.map((cat) => ({
      ...cat,
      count: skills.filter((s) => s.category === cat.id).length,
    }));
  }, []);

  return (
    <section
      ref={sectionRef}
      className="scroll-mt-20 px-5 py-[72px] md:px-0 md:py-[100px]"
      id="skills"
    >
      <div className="mx-auto w-full max-w-[1100px] md:w-[min(100%-10rem,1100px)]">
        <Reveal>
          <SectionHeading number="02." title="Skills" />
        </Reveal>

        {/* Stats bar */}
        <Reveal delay={0.04}>
          <div className="mb-8 flex flex-wrap gap-4">
            {categoryStats.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => handleCategory(cat.id)}
                className={`group flex items-center gap-2.5 rounded-lg border px-4 py-2.5 transition-all duration-300 cursor-pointer ${
                  activeCategory === cat.id
                    ? "border-accent bg-accent/10 shadow-[0_0_20px_rgba(127,173,173,0.12)]"
                    : "border-ink/8 bg-bg-elevated/60 hover:border-ink/15 hover:bg-bg-elevated"
                }`}
              >
                <span
                  className="size-2.5 rounded-full"
                  style={{ backgroundColor: CATEGORY_COLORS[cat.id] }}
                />
                <span
                  className={`font-mono text-[11px] font-medium tracking-wide ${
                    activeCategory === cat.id ? "text-accent" : "text-ink-muted"
                  }`}
                >
                  {cat.label}
                </span>
                <span className="font-mono text-[10px] text-ink-soft">
                  {cat.count}
                </span>
              </button>
            ))}
          </div>
        </Reveal>

        {/* Desktop: Network visualization + info panel */}
        <Reveal delay={0.12}>
          <div className="relative hidden md:block">
            <div className="flex gap-8">
              {/* Network */}
              <div className="relative flex-1">
                <div className="relative mx-auto aspect-square max-w-[720px]">
                  {/* Subtle grid background */}
                  <div
                    className="absolute inset-0 rounded-2xl opacity-[0.03]"
                    style={{
                      backgroundImage:
                        "linear-gradient(rgba(127,173,173,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(127,173,173,0.5) 1px, transparent 1px)",
                      backgroundSize: "40px 40px",
                    }}
                  />

                  {/* SVG connections */}
                  <svg
                    ref={networkRef}
                    className="absolute inset-0 h-full w-full"
                    viewBox="-380 -380 760 760"
                  >
                    <defs>
                      <filter id="glow">
                        <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                        <feMerge>
                          <feMergeNode in="coloredBlur" />
                          <feMergeNode in="SourceGraphic" />
                        </feMerge>
                      </filter>
                    </defs>
                    {connections.map(({ from, to }) => {
                      const a = positions[from];
                      const b = positions[to];
                      if (!a || !b) return null;
                      const fromSkill = filteredSkills[from];
                      const toSkill = filteredSkills[to];
                      const highlighted =
                        focusedSkill &&
                        (isRelated(fromSkill.name) || isRelated(toSkill.name));
                      return (
                        <g key={`${from}-${to}`} data-connection>
                          {highlighted && (
                            <line
                              x1={a.x}
                              y1={a.y}
                              x2={b.x}
                              y2={b.y}
                              stroke={CATEGORY_COLORS[fromSkill.category]}
                              strokeWidth="3"
                              opacity={0.2}
                              filter="url(#glow)"
                            />
                          )}
                          <line
                            x1={a.x}
                            y1={a.y}
                            x2={b.x}
                            y2={b.y}
                            stroke={
                              highlighted
                                ? CATEGORY_COLORS[fromSkill.category]
                                : "currentColor"
                            }
                            strokeWidth={highlighted ? 1.5 : 0.6}
                            opacity={highlighted ? 0.7 : 0.1}
                            className="transition-all duration-300"
                          />
                        </g>
                      );
                    })}
                  </svg>

                  {/* Skill nodes */}
                  <div ref={nodesRef} className="absolute inset-0">
                    {filteredSkills.map((skill, i) => {
                      const pos = positions[i];
                      if (!pos) return null;
                      const isFocused = isRelated(skill.name);
                      const dimmed = focusedSkill && !isFocused;
                      const catColor = CATEGORY_COLORS[skill.category];
                      const nodeSize = Math.max(64, skill.level * 0.72);
                      return (
                        <div
                          key={skill.name}
                          data-skill-node
                          className="absolute"
                          style={{
                            left: `calc(50% + ${pos.x}px)`,
                            top: `calc(50% + ${pos.y}px)`,
                            transform: "translate(-50%, -50%)",
                          }}
                        >
                          <button
                            type="button"
                            onMouseEnter={() =>
                              handleSkillInteract(skill.name)
                            }
                            onMouseLeave={() => handleSkillInteract(null)}
                            onClick={() =>
                              setSelectedSkill(
                                selectedSkill === skill.name
                                  ? null
                                  : skill.name,
                              )
                            }
                            className={`group relative flex items-center justify-center transition-all duration-300 cursor-pointer ${
                              isFocused
                                ? "scale-110"
                                : dimmed
                                  ? "scale-95 opacity-25"
                                  : "hover:scale-105"
                            }`}
                            style={{
                              width: `${nodeSize}px`,
                              height: `${nodeSize}px`,
                            }}
                          >
                            <span
                              className={`px-1 text-center font-mono text-[11px] font-semibold leading-tight transition-colors duration-300 ${
                                isFocused ? "" : "text-ink-muted"
                              }`}
                              style={{
                                color: isFocused ? catColor : undefined,
                              }}
                            >
                              {skill.name}
                            </span>

                            {/* Proficiency ring */}
                            <svg
                              className="absolute inset-0 -rotate-90"
                              viewBox="0 0 100 100"
                            >
                              <circle
                                cx="50"
                                cy="50"
                                r="47"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                opacity={0.06}
                              />
                              <circle
                                cx="50"
                                cy="50"
                                r="47"
                                fill="none"
                                stroke={catColor}
                                strokeWidth="2"
                                strokeDasharray={`${skill.level * 2.95} ${295 - skill.level * 2.95}`}
                                strokeLinecap="round"
                                opacity={isFocused ? 0.9 : 0.2}
                                className="transition-all duration-300"
                              />
                            </svg>
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Info panel - fixed sidebar */}
              <div className="hidden w-[260px] shrink-0 lg:block">
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
                            backgroundColor:
                              CATEGORY_COLORS[focusedSkill.category],
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
                          {focusedSkill.related.map((r) => (
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
              </div>
            </div>
          </div>
        </Reveal>

        {/* Mobile: Vertical categorized list */}
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
                        key={skill.name}
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
      </div>
    </section>
  );
}
