import { useRef, useState, useMemo, useCallback } from "react";
import { Search, Wrench, X } from "lucide-react";
import { toast } from "react-toastify";

import { AdminSectionActions } from "../admin/AdminSectionActions";
import { DataSourceTag } from "../admin/DataSourceTag";
import { Reveal } from "../Reveal";
import { SectionHeading } from "../SectionHeading";
import { useSkills } from "../../hooks/useSkills";
import { useDeleteSkill } from "../../hooks/useSkillsMutations";
import { useAuth } from "../../hooks/useAuth";
import {
  skills as fallbackSkills,
  CATEGORIES,
  CATEGORY_COLORS,
  type Skill,
  type SkillCategory,
} from "./skillsData";
import { SkillsNetwork } from "./SkillsNetwork";
import { SkillsInfoPanel } from "./SkillsInfoPanel";
import { SkillsMobileList } from "./SkillsMobileList";
import { SkillForm } from "./SkillForm";
import { SkillsManager } from "./SkillsManager";

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
    (s.related ?? []).forEach((r) => {
      const j = nameIndex.get(r);
      if (j !== undefined && j > i) {
        conns.push({ from: i, to: j });
      }
    });
  });
  return conns;
}

export function SkillsSection() {
  const { data: skillsData } = useSkills();
  const { isAdmin } = useAuth();
  const deleteSkill = useDeleteSkill();
  const skills = skillsData ?? fallbackSkills;
  const hasServerData = Boolean(skillsData && skillsData.length > 0);
  const [activeCategory, setActiveCategory] = useState<SkillCategory | null>(
    null,
  );
  const [hoveredSkill, setHoveredSkill] = useState<string | null>(null);
  const [selectedSkill, setSelectedSkill] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSkillForm, setShowSkillForm] = useState(false);
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null);
  const [skillToDelete, setSkillToDelete] = useState<Skill | null>(null);
  const [showManager, setShowManager] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  const networkRef = useRef<SVGSVGElement>(null);
  const nodesRef = useRef<HTMLDivElement>(null);

  const querySkills = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return skills;
    return skills.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        (s.description ?? "").toLowerCase().includes(q) ||
        (s.related ?? []).some((r) => r.toLowerCase().includes(q)),
    );
  }, [searchQuery, skills]);

  const filteredSkills = useMemo(
    () =>
      activeCategory
        ? querySkills.filter((s) => s.category === activeCategory)
        : querySkills,
    [activeCategory, querySkills],
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
    () =>
      skills.find((s) => s.name === (hoveredSkill || selectedSkill)),
    [hoveredSkill, selectedSkill, skills],
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
      count: querySkills.filter((s) => s.category === cat.id).length,
    }));
  }, [querySkills]);

  const handleConfirmDelete = async () => {
    if (!skillToDelete) return;
    try {
      await deleteSkill.mutateAsync(skillToDelete.id);
      toast.success("Skill deleted successfully.");
      setSkillToDelete(null);
    } catch {
      toast.error("Failed to delete skill.");
    }
  };

  const startCreate = () => {
    setEditingSkill(null);
    setShowSkillForm(true);
  };

  const startEdit = (skill: Skill) => {
    setEditingSkill(skill);
    setShowSkillForm(true);
  };

  return (
    <section
      ref={sectionRef}
      className="scroll-mt-20 px-5 py-[72px] md:px-0 md:py-[100px]"
      id="skills"
    >
      <div className="mx-auto w-full max-w-[1100px] md:w-[min(100%-10rem,1100px)]">
        <Reveal>
          <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
            <SectionHeading number="02." title="Skills" className="mb-0" />
            <div className="flex items-center gap-2">
              {isAdmin && hasServerData && (
                <button
                  type="button"
                  onClick={() => setShowManager(true)}
                  className="inline-flex size-9 items-center justify-center rounded-sm border border-ink/15 bg-bg-elevated text-ink-muted transition-all duration-300 hover:-translate-y-0.5 hover:border-accent hover:bg-accent/10 hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
                  aria-label="Manage skills"
                  title="Manage skills"
                >
                  <Wrench className="size-4" />
                </button>
              )}
              <AdminSectionActions section="skills" onCreate={startCreate} />
            </div>
          </div>
          {isAdmin && (
            <DataSourceTag hasServerData={hasServerData} className="mb-7 block md:mb-10" />
          )}
        </Reveal>

        <Reveal delay={0.04}>
          <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap gap-4">
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
                {querySkills.length}
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

            <div className="relative w-full sm:w-64">
              <Search
                className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-ink-soft"
                aria-hidden="true"
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search skills…"
                className="w-full rounded-lg border border-ink/10 bg-bg-elevated/60 py-2.5 pl-9 pr-3 font-mono text-[12px] text-ink outline-none transition-all duration-300 placeholder:text-ink-soft/60 focus:border-accent/60 focus:bg-white focus:shadow-[0_0_0_3px_rgba(127,173,173,0.1)]"
              />
            </div>
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

        {filteredSkills.length === 0 && (
          <p className="py-8 text-center font-mono text-[12px] text-ink-soft">
            No skills match your search.
          </p>
        )}

        <SkillsMobileList
          activeCategory={activeCategory}
          skills={skills}
          showActions={isAdmin && hasServerData}
          onEdit={startEdit}
          onDelete={setSkillToDelete}
        />

        {showSkillForm && (
          <SkillForm
            initialData={editingSkill}
            onClose={() => {
              setShowSkillForm(false);
              setEditingSkill(null);
            }}
          />
        )}

        {showManager && (
          <SkillsManager onClose={() => setShowManager(false)} />
        )}

        {skillToDelete && (
          <div
            className="fixed inset-0 z-[110] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
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
                  onClick={handleConfirmDelete}
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
    </section>
  );
}
