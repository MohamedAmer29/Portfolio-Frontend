import { useRef, useState, useMemo, useCallback } from "react";

import { Reveal } from "../Reveal";
import { SectionHeading } from "../SectionHeading";
import {
  skills,
  CATEGORIES,
  CATEGORY_COLORS,
  type SkillCategory,
} from "./skillsData";
import { SkillsNetwork } from "./SkillsNetwork";
import { SkillsInfoPanel } from "./SkillsInfoPanel";
import { SkillsMobileList } from "./SkillsMobileList";

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

function getConnections(skillList: { name: string; related: string[] }[]) {
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
  }, []);

  const handleSkillClick = useCallback((name: string) => {
    setSelectedSkill((prev) => (prev === name ? null : name));
  }, []);

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

        <Reveal delay={0.04}>
          <div className="mb-8 flex flex-wrap gap-4">
            <button
              type="button"
              onClick={() => handleCategory(null)}
              className={`group flex items-center gap-2.5 rounded-lg border px-4 py-2.5 transition-all duration-300 cursor-pointer ${
                activeCategory === null
                  ? "border-accent bg-accent/10 shadow-[0_0_20px_rgba(127,173,173,0.12)]"
                  : "border-ink/8 bg-bg-elevated/60 hover:border-ink/15 hover:bg-bg-elevated"
              }`}
            >
              <span className="size-2.5 rounded-full bg-ink/40" />
              <span
                className={`font-mono text-[11px] font-medium tracking-wide ${
                  activeCategory === null ? "text-accent" : "text-ink-muted"
                }`}
              >
                All
              </span>
              <span className="font-mono text-[10px] text-ink-soft">
                {skills.length}
              </span>
            </button>
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

        <Reveal delay={0.12}>
          <div className="relative hidden md:block">
            <div className="flex gap-8">
              <div className="relative flex-1">
                <SkillsNetwork
                  filteredSkills={filteredSkills}
                  positions={positions}
                  connections={connections}
                  focusedSkill={focusedSkill}
                  isRelated={isRelated}
                  onSkillInteract={handleSkillInteract}
                  onSkillClick={handleSkillClick}
                  networkRef={networkRef}
                  nodesRef={nodesRef}
                />
              </div>

              <div className="hidden w-[260px] shrink-0 lg:block">
                <SkillsInfoPanel focusedSkill={focusedSkill} />
              </div>
            </div>
          </div>
        </Reveal>

        <SkillsMobileList activeCategory={activeCategory} />
      </div>
    </section>
  );
}
