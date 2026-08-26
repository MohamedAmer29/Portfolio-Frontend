import { useRef, useMemo } from "react";
import { gsap, useGSAP } from "../../lib/gsap";
import { Reveal } from "../Reveal";
import { SectionHeading } from "../SectionHeading";
import { education, academicFocus, type Education } from "./educationData";

function GraduationIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M12 2L2 7l10 5 10-5-10-5z" />
      <path d="M2 17l10 5 10-5" />
      <path d="M2 12l10 5 10-5" />
    </svg>
  );
}

function TimelineCard({ item, isLast }: { item: Education; isLast: boolean }) {
  return (
    <div
      data-education-entry
      className="relative grid gap-6 md:grid-cols-[100px_1fr] md:gap-8"
    >
      {/* Year label */}
      <div className="flex items-start gap-4 md:flex-col md:items-end md:gap-1 md:pt-1">
        <span className="font-mono text-[13px] font-medium text-ink-muted">
          {item.startDate}
        </span>
        {!isLast && (
          <span className="hidden font-mono text-[10px] text-ink-soft md:block">
            —
          </span>
        )}
        {!isLast && (
          <span className="hidden font-mono text-[13px] text-ink-muted md:block">
            {item.endDate}
          </span>
        )}
      </div>

      {/* Education card with timeline node */}
      <div className="group/node relative mb-2 rounded-xl border border-ink/8 bg-bg-elevated/50 p-5 transition-all duration-300 hover:border-accent/20 hover:bg-bg-elevated hover:shadow-[0_4px_24px_rgba(127,173,173,0.08)] md:mb-8 md:p-6">
        {/* Timeline node - desktop only */}
        <div
          className="absolute -left-[calc(100px+2rem)] top-6 z-10 hidden md:block"
          data-timeline-node
        >
          <div className="relative flex size-[14px] items-center justify-center">
            <span className="absolute size-[14px] rounded-full bg-accent/20 transition-all duration-500 group-hover/node:scale-[2.5] group-hover/node:opacity-40" />
            <span className="relative size-[8px] rounded-full border-2 border-accent bg-bg transition-all duration-300 group-hover/node:bg-accent group-hover/node:shadow-[0_0_12px_rgba(127,173,173,0.6)]" />
          </div>
        </div>

        {/* Vertical connector line - desktop only */}
        {!isLast && (
          <div
            data-timeline-line
            className="absolute -left-[calc(100px+1.75rem)] top-[42px] h-[calc(100%+24px)] w-px bg-gradient-to-b from-accent/30 via-accent/15 to-transparent hidden md:block"
          />
        )}
        {/* Mobile year badge */}
        <div className="mb-3 flex items-center gap-3 md:hidden">
          <span className="font-mono text-[12px] font-medium text-accent">
            {item.startDate}
          </span>
          <span className="font-mono text-[10px] text-ink-soft">—</span>
          <span className="font-mono text-[12px] text-ink-muted">
            {item.endDate}
          </span>
        </div>

        {/* Header */}
        <div className="mb-3 flex items-start gap-3">
          <div className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-lg border border-ink/8 bg-ink/3 transition-all duration-300 group-hover/node:border-accent/25 group-hover/node:bg-accent/10">
            <GraduationIcon className="size-[18px] text-ink-soft transition-colors duration-300 group-hover/node:text-accent" />
          </div>
          <div>
            <h3 className="text-[17px] font-bold leading-snug text-ink">
              {item.degree} <span className="text-accent/70">·</span>{" "}
              <span className="text-ink-muted">{item.field}</span>
            </h3>
            <p className="mt-0.5 text-[14px] font-medium text-ink-muted">
              {item.institution}
            </p>
          </div>
        </div>

        {/* Location + dates row */}
        <div className="mb-3 flex flex-wrap items-center gap-x-4 gap-y-1 font-mono text-[11px] text-ink-soft">
          {item.location && (
            <span className="flex items-center gap-1.5">
              <svg
                viewBox="0 0 16 16"
                fill="currentColor"
                className="size-3 text-ink-soft/60"
              >
                <path d="M8 0a5.2 5.2 0 0 0-5.2 5.2C2.8 9.6 8 16 8 16s5.2-6.4 5.2-10.8A5.2 5.2 0 0 0 8 0zm0 7.4a2.2 2.2 0 1 1 0-4.4 2.2 2.2 0 0 1 0 4.4z" />
              </svg>
              {item.location}
            </span>
          )}
          <span className="hidden md:inline">
            {item.startDate} — {item.endDate}
          </span>
        </div>

        {/* Description */}
        {item.description && (
          <p className="mb-4 text-[14px] leading-relaxed text-ink-muted">
            {item.description}
          </p>
        )}

        {/* Coursework */}
        {item.coursework && item.coursework.length > 0 && (
          <div>
            <h4 className="mb-2 font-mono text-[10px] uppercase tracking-widest text-ink-soft">
              Relevant Coursework
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {item.coursework.map((course) => (
                <span
                  key={course}
                  className="rounded-md border border-ink/8 bg-ink/3 px-2.5 py-1 font-mono text-[11px] text-ink-soft transition-all duration-300 hover:border-accent/20 hover:bg-accent/5 hover:text-accent"
                >
                  {course}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Achievements */}
        {item.achievements && item.achievements.length > 0 && (
          <div className="mt-4">
            <h4 className="mb-2 font-mono text-[10px] uppercase tracking-widest text-ink-soft">
              Achievements
            </h4>
            <ul className="space-y-1.5">
              {item.achievements.map((a) => (
                <li
                  key={a}
                  className="relative pl-4 text-[13px] leading-relaxed text-ink-muted before:absolute before:left-0 before:top-[7px] before:text-[10px] before:text-accent before:content-['▸']"
                >
                  {a}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

export function EducationSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);

  const entries = useMemo(() => education, []);

  useGSAP(
    () => {
      if (!lineRef.current) return;

      const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
      if (reducedMotion) return;

      gsap.fromTo(
        lineRef.current,
        { scaleY: 0 },
        {
          scaleY: 1,
          duration: 1.2,
          ease: "power3.out",
          transformOrigin: "top",
          scrollTrigger: {
            trigger: lineRef.current,
            start: "top 80%",
            toggleActions: "play none none none",
          },
        },
      );
    },
    { scope: sectionRef },
  );

  useGSAP(
    () => {
      if (!timelineRef.current) return;

      const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      const nodes = Array.from(
        timelineRef.current.querySelectorAll("[data-timeline-node]"),
      );
      const cards = Array.from(
        timelineRef.current.querySelectorAll("[data-education-entry]"),
      );

      if (reducedMotion) {
        gsap.set([...nodes, ...cards], { opacity: 1 });
        return;
      }

      gsap.fromTo(
        nodes,
        { scale: 0, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          duration: 0.5,
          stagger: 0.15,
          ease: "back.out(1.6)",
          scrollTrigger: {
            trigger: timelineRef.current,
            start: "top 75%",
            toggleActions: "play none none none",
          },
        },
      );

      gsap.fromTo(
        cards,
        { autoAlpha: 0, x: -20 },
        {
          autoAlpha: 1,
          x: 0,
          duration: 0.7,
          stagger: 0.18,
          ease: "power3.out",
          scrollTrigger: {
            trigger: timelineRef.current,
            start: "top 70%",
            toggleActions: "play none none none",
          },
        },
      );
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      className="scroll-mt-20 px-5 py-[72px] md:px-0 md:py-[100px]"
      id="education"
    >
      <div className="mx-auto w-full max-w-[1200px] md:w-[min(100%-10rem,1200px)]">
        <Reveal>
          <SectionHeading number="03." title="Education" />
        </Reveal>

        {/* Subtitle */}
        <Reveal delay={0.04}>
          <p className="mb-8 max-w-[480px] text-[15px] leading-relaxed text-ink-muted md:mb-10">
            Building the foundation behind my engineering journey.
          </p>
        </Reveal>

        {/* Academic focus tags */}
        <Reveal delay={0.08}>
          <div className="mb-10 md:mb-12">
            <h3 className="mb-3 font-mono text-[10px] uppercase tracking-widest text-ink-soft">
              Academic Focus
            </h3>
            <div className="flex flex-wrap gap-2">
              {academicFocus.map((topic) => (
                <span
                  key={topic}
                  className="rounded-lg border border-ink/8 bg-bg-elevated/60 px-3 py-1.5 font-mono text-[11px] text-ink-muted transition-all duration-300 hover:border-accent/25 hover:bg-accent/5 hover:text-accent"
                >
                  {topic}
                </span>
              ))}
            </div>
          </div>
        </Reveal>

        {/* Timeline */}
        <Reveal delay={0.12}>
          <div ref={timelineRef} className="relative">
            {/* Animated vertical line - desktop only */}
            <div
              ref={lineRef}
              className="absolute -left-[14px] top-0 hidden h-full w-px origin-top bg-gradient-to-b from-accent/30 via-accent/20 to-accent/5 md:block"
            />

            {/* Mobile vertical line */}
            <div className="absolute left-[5px] top-0 h-full w-px bg-gradient-to-b from-accent/30 via-accent/15 to-transparent md:hidden" />

            <div className="space-y-4 md:space-y-0">
              {entries.map((item, index) => (
                <TimelineCard
                  key={item.id}
                  item={item}
                  isLast={index === entries.length - 1}
                />
              ))}
            </div>
          </div>
        </Reveal>

        {/* Connection hint */}
        <Reveal delay={0.2}>
          <div className="mt-10 flex items-center gap-3 md:mt-12">
            <div className="h-px flex-1 bg-gradient-to-r from-accent/20 to-transparent" />
            <span className="font-mono text-[10px] uppercase tracking-widest text-ink-soft">
              Education → Experience
            </span>
            <div className="h-px flex-1 bg-gradient-to-l from-accent/20 to-transparent" />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
