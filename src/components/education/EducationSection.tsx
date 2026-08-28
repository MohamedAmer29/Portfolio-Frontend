import { useRef, useMemo, useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useGSAP } from "../../lib/gsap";
import { useDebouncedCallback } from "../../lib/useDebouncedCallback";

declare const gsap: any

import { AdminSectionActions } from "../admin/AdminSectionActions";
import { DataSourceTag } from "../admin/DataSourceTag";
import { Reveal } from "../Reveal";
import { SectionHeading } from "../SectionHeading";
import { useEducation, mapEducation } from "../../hooks/useEducation";
import {
  useEducationMutations,
  DEFAULT_EDUCATION_BODY,
} from "../../hooks/useEducationMutations";
import { useAuth } from "../../hooks/useAuth";
import {
  education as fallbackEducation,
  academicFocus as fallbackAcademicFocus,
  type Education,
} from "./educationData";

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

function CalendarIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <rect x="2" y="3" width="12" height="11" rx="1.5" />
      <line x1="2" y1="6.5" x2="14" y2="6.5" />
      <line x1="5.5" y1="1.5" x2="5.5" y2="4.5" />
      <line x1="10.5" y1="1.5" x2="10.5" y2="4.5" />
    </svg>
  );
}

const inputClass =
  "w-full rounded-sm border border-ink/15 bg-bg-elevated px-3 py-2 text-[14px] text-ink outline-none transition-all duration-300 focus:shadow-[0_0_0_3px_rgba(127,173,173,0.12)] focus:border-accent";
const labelClass =
  "mb-1 block font-mono text-[10px] uppercase tracking-[0.15em] text-ink-soft";

function EditableField({
  label,
  value,
  onChange,
  multiline,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  multiline?: boolean;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <span className={labelClass}>{label}</span>
      {multiline ? (
        <textarea
          className={`${inputClass} resize-y min-h-[80px]`}
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
        />
      ) : (
        <input
          type="text"
          className={inputClass}
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
        />
      )}
    </label>
  );
}

function TimelineCard({
  item,
  isLast,
  editable,
  onChange,
  onDelete,
}: {
  item: Education;
  isLast: boolean;
  editable: boolean;
  onChange: (patch: Partial<Education>) => void;
  onDelete?: () => void;
}) {
  if (!editable) {
    return (
      <div
        data-education-entry
        className="relative grid gap-6 md:grid-cols-[100px_1fr] md:gap-8"
      >
        <div className="hidden md:flex md:flex-col md:items-end md:gap-1 md:pt-1">
          <span className="font-mono text-[13px] font-medium text-ink-muted">
            {item.startDate}
          </span>
          {!isLast && (
            <span className="font-mono text-[10px] text-ink-soft">—</span>
          )}
          {!isLast && (
            <span className="font-mono text-[13px] text-ink-muted">
              {item.endDate}
            </span>
          )}
        </div>

        <div className="group/node relative mb-2 rounded-xl border border-ink/8 bg-bg-elevated/50 p-5 transition-all duration-300 hover:border-accent/20 hover:bg-bg-elevated hover:shadow-[0_4px_24px_rgba(127,173,173,0.08)] md:mb-8 md:p-6">
          <div
            className="absolute -left-[calc(100px+2rem)] top-6 z-10 hidden md:block"
            data-timeline-node
          >
            <div className="relative flex size-[14px] items-center justify-center">
              <span className="absolute size-[14px] rounded-full bg-accent/20 transition-all duration-500 group-hover/node:scale-[2.5] group-hover/node:opacity-40" />
              <span className="relative size-[8px] rounded-full border-2 border-accent bg-bg transition-all duration-300 group-hover/node:bg-accent group-hover/node:shadow-[0_0_12px_rgba(127,173,173,0.6)]" />
            </div>
          </div>

          {!isLast && (
            <div
              data-timeline-line
              className="absolute -left-[calc(100px+1.75rem)] top-[42px] hidden h-[calc(100%+24px)] w-px bg-gradient-to-b from-accent/30 via-accent/15 to-transparent md:block"
            />
          )}

          <div className="mb-3 flex items-center gap-3 md:hidden">
            <span className="font-mono text-[12px] font-medium text-accent">
              {item.startDate}
            </span>
            <span className="font-mono text-[10px] text-ink-soft">—</span>
            <span className="font-mono text-[12px] text-ink-muted">
              {item.endDate}
            </span>
          </div>

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

          <div className="mb-3 flex flex-wrap items-center gap-x-4 gap-y-2">
            <div className="flex items-center gap-2 rounded-md border border-accent/20 bg-accent/8 px-3 py-1.5">
              <CalendarIcon className="size-3.5 text-accent" />
              <span className="font-mono text-[12px] font-medium text-ink">
                {item.startDate}
              </span>
              <span className="font-mono text-[11px] text-ink-soft">→</span>
              <span className="font-mono text-[12px] font-medium text-ink">
                {item.endDate}
              </span>
            </div>
            {item.location && (
              <span className="flex items-center gap-1.5 font-mono text-[11px] text-ink-soft">
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
          </div>

          {item.description && (
            <p className="mb-4 text-[14px] leading-relaxed text-ink-muted">
              {item.description}
            </p>
          )}

          {item.coursework && item.coursework.length > 0 && (
            <div>
              <h4 className="mb-2 font-mono text-[10px] uppercase tracking-widest text-ink-soft">
                Relevant Coursework
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {item.coursework.map((course) => (
                  <span
                    key={course}
                    className="rounded-md border border-ink/20 bg-ink/5 px-2.5 py-1 font-mono text-[11px] text-ink font-medium transition-all duration-300 hover:border-accent/40 hover:bg-accent/15 hover:text-accent"
                  >
                    {course}
                  </span>
                ))}
              </div>
            </div>
          )}

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

  return (
    <div
      className="relative grid gap-6 rounded-xl border border-accent/25 bg-bg-elevated/60 p-5 md:grid-cols-[100px_1fr] md:gap-8 md:p-6"
    >
      <div className="hidden md:block" />
      <div className="space-y-3">
        {onDelete && (
          <button
            type="button"
            onClick={onDelete}
            className="ml-auto flex items-center gap-1.5 rounded-sm border border-error/40 bg-error/10 px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.1em] text-error transition hover:bg-error/20"
          >
            Delete
          </button>
        )}
        <EditableField
          label="Degree"
          value={item.degree}
          onChange={(v) => onChange({ degree: v })}
        />
        <EditableField
          label="Field of Study"
          value={item.field}
          onChange={(v) => onChange({ field: v })}
        />
        <EditableField
          label="Institution"
          value={item.institution}
          onChange={(v) => onChange({ institution: v })}
        />
        <div className="grid grid-cols-2 gap-3">
          <EditableField
            label="Start Date"
            value={item.startDate}
            onChange={(v) => onChange({ startDate: v })}
          />
          <EditableField
            label="End Date"
            value={item.endDate}
            onChange={(v) => onChange({ endDate: v })}
          />
        </div>
        <EditableField
          label="Location"
          value={item.location ?? ""}
          onChange={(v) => onChange({ location: v })}
        />
        <EditableField
          label="Description"
          value={item.description ?? ""}
          onChange={(v) => onChange({ description: v })}
          multiline
        />
        <EditableField
          label="Coursework (comma separated)"
          value={(item.coursework ?? []).join(", ")}
          onChange={(v) =>
            onChange({
              coursework: v
                .split(",")
                .map((c) => c.trim())
                .filter(Boolean),
            })
          }
        />
        <EditableField
          label="Achievements (one per line)"
          value={(item.achievements ?? []).join("\n")}
          onChange={(v) =>
            onChange({
              achievements: v
                .split("\n")
                .map((a) => a.trim())
                .filter(Boolean),
            })
          }
          multiline
        />
      </div>
    </div>
  );
}

export function EducationSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);

  const { data: educationData } = useEducation();
  const { isAdmin } = useAuth();
  const {
    updateEducation,
    createEducation,
    deleteEducation,
  } = useEducationMutations();

  const [editMode, setEditMode] = useState(false);
  const [draftEntries, setDraftEntries] = useState<Education[] | null>(null);
  const [draftFocus, setDraftFocus] = useState<string[] | null>(null);
  const [focusInput, setFocusInput] = useState("");
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);

  const serverEntries = useMemo(
    () => educationData?.entries ?? fallbackEducation,
    [educationData],
  );
  const serverFocus =
    educationData?.academicFocus ?? fallbackAcademicFocus;
  const hasServerData = Boolean(educationData);

  const entries = editMode ? (draftEntries ?? serverEntries) : serverEntries;
  const academicFocus = editMode ? (draftFocus ?? serverFocus) : serverFocus;

  useEffect(() => {
    if (editMode && draftEntries === null) {
      setDraftEntries(serverEntries);
      setDraftFocus(serverFocus);
    } else if (!editMode) {
      setDraftEntries(null);
      setDraftFocus(null);
    }
  }, [editMode, serverEntries, serverFocus]);

  const debouncedSave = useDebouncedCallback(
    (id: string, patch: Record<string, unknown>) => {
      updateEducation.mutate({ id, patch });
    },
    500,
  );

  const handleEntryChange = (index: number, entryPatch: Partial<Education>) => {
    const base = draftEntries ?? serverEntries;
    const next = base.map((e, i) => (i === index ? { ...e, ...entryPatch } : e));
    setDraftEntries(next);
    const id = next[index].id;
    const entry = next[index];
    const patch: Record<string, unknown> = {
      institution: entry.institution,
      degree: entry.degree,
      fieldOfStudy: entry.field,
      description: entry.description,
      academicFocus: draftFocus ?? serverFocus,
      location: entry.location,
      startDate: entry.startDate,
      endDate: entry.endDate,
      isCurrent: entry.endDate === "Present",
      displayOrder: entry.displayOrder ?? 0,
    };
    if (entry.coursework && entry.coursework.length > 0) {
      patch.coursework = entry.coursework;
    }
    if (entry.achievements && entry.achievements.length > 0) {
      patch.achievements = entry.achievements;
    }
    debouncedSave(id, patch);
  };

  const handleFocusChange = (next: string[]) => {
    setDraftFocus(next);
    const firstId = serverEntries[0]?.id;
    if (firstId && next.length > 0) {
      debouncedSave(firstId, { academicFocus: next });
    }
  };

  const handleAdd = async () => {
    try {
      const created = (await createEducation.mutateAsync(
        DEFAULT_EDUCATION_BODY,
      )) as Parameters<typeof mapEducation>[0];
      toast.success("Education entry created successfully.");
      setEditMode(true);
      if (created) {
        setDraftEntries((prev) => [
          ...(prev ?? serverEntries),
          mapEducation(created),
        ]);
      }
    } catch {
      /* error toast handled in mutation */
    }
  };

  const handleDelete = (id: string) => {
    setPendingDeleteId(id);
  };

  const confirmDelete = async () => {
    const id = pendingDeleteId;
    if (!id) return;
    setPendingDeleteId(null);
    setDraftEntries((prev) => (prev ? prev.filter((e) => e.id !== id) : prev));
    try {
      await deleteEducation.mutateAsync(id);
      toast.success("Education entry deleted successfully.");
    } catch {
      /* error toast handled in mutation */
    }
  };

  useGSAP(
    () => {
      if (!timelineRef.current) return;

      const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      const line = lineRef.current;
      const nodes = Array.from(
        timelineRef.current.querySelectorAll("[data-timeline-node]"),
      );
      const cards = Array.from(
        timelineRef.current.querySelectorAll("[data-education-entry]"),
      );

      if (editMode) {
        gsap.set([...nodes, ...cards], { autoAlpha: 1, x: 0, opacity: 1 });
        if (line) gsap.set(line, { scaleY: 1 });
        return;
      }

      if (reducedMotion) {
        if (line) gsap.set(line, { scaleY: 1 });
        gsap.set([...nodes, ...cards], { opacity: 1, x: 0 });
        return;
      }

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: timelineRef.current,
          start: "top 80%",
          toggleActions: "play none none none",
        },
      });

      if (line) {
        tl.fromTo(
          line,
          { scaleY: 0 },
          {
            scaleY: 1,
            duration: 1.0,
            ease: "power3.out",
            transformOrigin: "top",
          },
          0,
        );
      }

      tl.fromTo(
        nodes,
        { scale: 0, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          duration: 0.4,
          stagger: 0.15,
          ease: "back.out(1.6)",
        },
        0.15,
      );

      tl.fromTo(
        cards,
        { autoAlpha: 0, x: -24 },
        {
          autoAlpha: 1,
          x: 0,
          duration: 0.6,
          stagger: 0.15,
          ease: "power3.out",
        },
        0.1,
      );
    },
    { scope: sectionRef, dependencies: [editMode] },
  );

  return (
    <section
      ref={sectionRef}
      className="scroll-mt-20 px-5 py-[72px] md:px-0 md:py-[100px]"
      id="education"
    >
      <div className="mx-auto w-full max-w-[1200px] md:w-[min(100%-10rem,1200px)]">
        <Reveal>
          <div className="mb-7 flex flex-wrap items-center justify-between gap-4 md:mb-10">
            <SectionHeading number="03." title="Education" className="mb-0" />
            {isAdmin && (
              <AdminSectionActions
                section="education"
                onCreate={handleAdd}
                onUpdate={() => setEditMode((v) => !v)}
                isCreatePending={createEducation.isPending}
              />
            )}
          </div>
        </Reveal>

        {isAdmin && (
          <DataSourceTag hasServerData={hasServerData} className="mb-4 block" />
        )}

        <Reveal delay={0.04}>
          <p className="mb-8 max-w-[480px] text-[15px] leading-relaxed text-ink-muted md:mb-10">
            Building the foundation behind my engineering journey.
          </p>
        </Reveal>

        <Reveal delay={0.08}>
          <div className="mb-10 md:mb-12">
            <h3 className="mb-3 font-mono text-[10px] uppercase tracking-widest text-ink-soft">
              Academic Focus
            </h3>
            <div className="flex flex-wrap gap-2">
              {academicFocus.map((topic) => (
                <span
                  key={topic}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-ink/8 bg-bg-elevated/60 px-3 py-1.5 font-mono text-[11px] text-ink-muted transition-all duration-300 hover:border-accent/25 hover:bg-accent/5 hover:text-accent"
                >
                  {topic}
                  {editMode && (
                    <button
                      type="button"
                      aria-label={`Remove ${topic}`}
                      className="text-ink-soft transition-colors hover:text-error"
                      onClick={() =>
                        handleFocusChange(
                          academicFocus.filter((t) => t !== topic),
                        )
                      }
                    >
                      ×
                    </button>
                  )}
                </span>
              ))}
              {editMode && (
                <input
                  type="text"
                  value={focusInput}
                  placeholder="Add focus…"
                  className="w-28 rounded-lg border border-ink/15 bg-bg-elevated px-3 py-1.5 font-mono text-[11px] text-ink outline-none transition-all duration-300 focus:border-accent"
                  onChange={(e) => setFocusInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && focusInput.trim()) {
                      handleFocusChange([
                        ...academicFocus,
                        focusInput.trim(),
                      ]);
                      setFocusInput("");
                    }
                  }}
                />
              )}
            </div>
          </div>
        </Reveal>

        {editMode ? (
          <div className="space-y-4 md:space-y-0">
            {entries.map((item, index) => (
              <TimelineCard
                key={item.id}
                item={item}
                isLast={index === entries.length - 1}
                editable={editMode}
                onChange={(patch) => handleEntryChange(index, patch)}
                onDelete={() => handleDelete(item.id)}
              />
            ))}
          </div>
        ) : (
          <div ref={timelineRef} className="relative">
            <div
              ref={lineRef}
              className="absolute -left-[14px] top-0 hidden h-full w-px origin-top bg-gradient-to-b from-accent/30 via-accent/20 to-accent/5 md:block"
            />
            <div className="absolute left-[5px] top-0 h-full w-px bg-gradient-to-b from-accent/30 via-accent/15 to-transparent md:hidden" />

            <div className="space-y-4 md:space-y-0">
              {entries.map((item, index) => (
                <TimelineCard
                  key={item.id}
                  item={item}
                  isLast={index === entries.length - 1}
                  editable={editMode}
                  onChange={(patch) => handleEntryChange(index, patch)}
                  onDelete={isAdmin ? () => handleDelete(item.id) : undefined}
                />
              ))}
            </div>
          </div>
        )}

        {editMode && (
          <p className="mt-6 font-mono text-[11px] text-ink-soft">
            {updateEducation.isPending
              ? "Saving changes…"
              : "Editing live — changes save automatically as you type."}
          </p>
        )}
      </div>

      {pendingDeleteId && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-[400px] rounded-lg border border-ink/10 bg-bg-elevated p-8 shadow-[0_20px_60px_rgba(26,31,36,0.2)]">
            <h2 className="mb-2 font-sans text-[1.25rem] font-extrabold tracking-[-0.03em] text-ink">
              Delete Education
            </h2>
            <p className="mb-6 font-mono text-[13px] text-ink-muted">
              Are you sure you want to delete this education entry? This action
              cannot be undone.
            </p>
            <div className="flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setPendingDeleteId(null)}
                className="rounded-sm border border-ink px-5 py-2 font-mono text-[12px] uppercase tracking-[0.1em] text-ink transition hover:border-accent hover:bg-accent/10"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                disabled={deleteEducation.isPending}
                className="rounded-sm border border-error bg-error px-5 py-2 font-mono text-[12px] uppercase tracking-[0.1em] text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {deleteEducation.isPending ? "Deleting…" : "Confirm"}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
