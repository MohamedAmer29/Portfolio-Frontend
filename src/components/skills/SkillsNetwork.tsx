import { useEffect } from "react";
import { loadGsap, useGSAP } from "../../lib/gsap";
import { CATEGORY_COLORS, type Skill } from "./skillsData";

declare const gsap: any;

export function SkillsNetwork({
  filteredSkills,
  positions,
  connections,
  focusedSkill,
  isRelated,
  onSkillInteract,
  onSkillClick,
  networkRef,
  nodesRef,
}: {
  filteredSkills: Skill[];
  positions: { x: number; y: number }[];
  connections: { from: number; to: number }[];
  focusedSkill: Skill | undefined;
  isRelated: (name: string) => boolean;
  onSkillInteract: (name: string | null) => void;
  onSkillClick: (name: string) => void;
  networkRef: React.RefObject<SVGSVGElement | null>;
  nodesRef: React.RefObject<HTMLDivElement | null>;
}) {
  useEffect(() => {
    if (!nodesRef.current) return;
    loadGsap().then((g) => {
      const nodes = nodesRef.current!.querySelectorAll("[data-skill-node]");
      g.fromTo(
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
    });
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

  return (
    <div className="relative mx-auto aspect-square max-w-[720px]">
      <div
        className="absolute inset-0 rounded-2xl opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(127,173,173,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(127,173,173,0.5) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

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
                className="transition-opacity duration-300"
              />
            </g>
          );
        })}
      </svg>

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
              key={skill.id}
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
                onMouseEnter={() => onSkillInteract(skill.name)}
                onMouseLeave={() => onSkillInteract(null)}
                onClick={() => onSkillClick(skill.name)}
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
                className="transition-opacity duration-300"
                  />
                </svg>
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
