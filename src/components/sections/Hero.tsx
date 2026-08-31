import { useRef, useState } from "react";
import { motion, type Variants } from "framer-motion";
import { X } from "lucide-react";
import { toast } from "react-toastify";

const heroContainerVariants: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.15,
    },
  },
};

const heroItemVariants: Variants = {
  hidden: { y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
};
import { AdminSectionActions } from "../admin/AdminSectionActions";
import { DataSourceTag } from "../admin/DataSourceTag";
import { useAuth } from "../../hooks/useAuth";
import { useHero, type HeroData } from "../../hooks/useHero";
import {
  useCreateHero,
  useDeleteHero,
  useUpdateHero,
} from "../../hooks/useHeroMutations";
import { useDebouncedCallback } from "../../lib/useDebouncedCallback";

type HeroProps = {
  greeting: string;
  name: string;
  tagline: string;
  bio: string;
};

const inputClass =
  "w-full rounded-sm border border-ink/15 bg-bg-elevated px-3 py-2 text-ink outline-none transition-all duration-300 focus:border-accent focus:shadow-[0_0_0_3px_rgba(127,173,173,0.12)]";
const labelClass =
  "mb-1 block font-mono text-[10px] uppercase tracking-[0.15em] text-ink-soft";

function pickString(...values: unknown[]): string {
  for (const value of values) {
    if (typeof value === "string" && value.trim().length > 0) {
      return value;
    }
  }
  return "";
}

function toHeroDraft(
  hero: HeroData | null | undefined,
  fallbacks: { name: string; tagline: string; bio: string },
): HeroData {
  return {
    fullName: pickString(hero?.fullName, fallbacks.name),
    bio: pickString(hero?.bio, fallbacks.tagline),
    description: pickString(hero?.description, fallbacks.bio),
  };
}

export function Hero({ greeting, name, tagline, bio }: HeroProps) {
  const { data: hero } = useHero();
  const { isAdmin } = useAuth();
  const createHero = useCreateHero();
  const updateHero = useUpdateHero();
  const deleteHero = useDeleteHero();
  const rootRef = useRef<HTMLElement>(null);
  const [editMode, setEditMode] = useState(false);
  const [draft, setDraft] = useState<HeroData | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);

  const fallbacks = { name, tagline, bio };
  const hasServerData = Boolean(
    hero &&
      (hero.fullName.trim() || hero.bio.trim() || hero.description.trim()),
  );
  const resolved = toHeroDraft(hero, fallbacks);
  const currentDraft = draft ?? resolved;

  const debouncedSave = useDebouncedCallback((data: HeroData) => {
    if (hasServerData) {
      updateHero.mutate(data);
    } else {
      createHero.mutate(data);
    }
  }, 500);

  const handleFieldChange = (patch: Partial<HeroData>) => {
    const base = draft ?? resolved;
    const next = { ...base, ...patch };
    setDraft(next);
    debouncedSave(next);
  };

  const enterEditMode = () => {
    setDraft(toHeroDraft(hero, fallbacks));
    setEditMode(true);
  };

  const exitEditMode = () => {
    setEditMode(false);
    setDraft(null);
  };

  const handleCreate = async () => {
    try {
      await createHero.mutateAsync(toHeroDraft(undefined, fallbacks));
      toast.success("Hero created successfully.");
      enterEditMode();
    } catch {
      /* error toast in mutation */
    }
  };

  return (
    <section
      ref={rootRef}
      className="relative flex min-h-svh items-center px-4 pb-12 pt-24 md:px-0 md:pb-0 md:pt-20"
      id="top"
    >
      <AdminSectionActions
        section="hero"
        className="absolute right-4 top-24 md:right-[calc((100%-min(100%-10rem,1000px))/2)] md:top-20"
        onCreate={hasServerData ? undefined : handleCreate}
        onUpdate={isAdmin ? () => (editMode ? exitEditMode() : enterEditMode()) : undefined}
        onDelete={hasServerData ? () => setShowConfirm(true) : undefined}
        isCreatePending={createHero.isPending}
      />
      {isAdmin && (
        <DataSourceTag
          hasServerData={hasServerData}
          className="absolute right-4 top-[8.5rem] md:right-[calc((100%-min(100%-10rem,1000px))/2+3rem)] md:top-[7.5rem]"
        />
      )}
      {editMode && (
        <p className="absolute right-4 top-[9.75rem] font-mono text-[10px] uppercase tracking-[0.12em] text-accent/70 md:right-[calc((100%-min(100%-10rem,1000px))/2+3rem)] md:top-[8.75rem]">
          Editing live — changes save automatically
        </p>
      )}
      {updateHero.isPending && editMode && (
        <p className="absolute right-4 top-[11rem] font-mono text-[10px] uppercase tracking-[0.12em] text-accent/60 md:right-[calc((100%-min(100%-10rem,1000px))/2+3rem)] md:top-[10rem]">
          saving…
        </p>
      )}

      <motion.div
        variants={heroContainerVariants}
        initial="hidden"
        animate="show"
        className="mx-auto w-full max-w-[720px] md:w-[min(100%-10rem,1000px)]"
      >
            <motion.p
              variants={heroItemVariants}
              data-entrance-hero={!editMode ? true : undefined}
              className="mb-3 font-mono text-[13px] tracking-[0.15em] text-accent md:mb-5 md:text-[14px]"
            >
              {greeting}
            </motion.p>

        {editMode ? (
          <div className="space-y-4 opacity-100">
            <label className="block">
              <span className={labelClass}>Full Name</span>
              <input
                type="text"
                className={`${inputClass} font-sans text-[clamp(1.75rem,6vw,3.5rem)] font-extrabold`}
                value={currentDraft.fullName}
                onChange={(e) => handleFieldChange({ fullName: e.target.value })}
              />
            </label>
            <label className="block">
              <span className={labelClass}>Tagline / Bio</span>
              <input
                type="text"
                className={`${inputClass} font-sans text-[clamp(1.25rem,4vw,2.5rem)] font-bold`}
                value={currentDraft.bio}
                onChange={(e) => handleFieldChange({ bio: e.target.value })}
              />
            </label>
            <label className="block">
              <span className={labelClass}>Description</span>
              <textarea
                className={`${inputClass} min-h-[120px] resize-y text-[15px] leading-[1.7] md:text-body`}
                value={currentDraft.description}
                onChange={(e) => handleFieldChange({ description: e.target.value })}
              />
            </label>
          </div>
        ) : (
          <>
            <motion.h1
              variants={heroItemVariants}
              data-entrance-hero
              className="mb-2 font-sans text-[clamp(2.25rem,8vw,5rem)] font-extrabold leading-[1.05] tracking-[-0.03em] text-ink"
            >
              {resolved.fullName}
            </motion.h1>
            <motion.p
              variants={heroItemVariants}
              data-entrance-hero
              className="mb-5 font-sans text-[clamp(1.5rem,5vw,3.5rem)] font-bold leading-[1.1] tracking-[-0.025em] text-accent md:mb-6"
            >
              {resolved.bio}
            </motion.p>
            <motion.p
              variants={heroItemVariants}
              data-entrance-hero
              className="max-w-[34rem] text-[15px] leading-[1.8] tracking-wide text-ink-muted md:text-body lg:max-w-[40rem]"
            >
              {resolved.description}
            </motion.p>
            <motion.a
              variants={heroItemVariants}
              data-entrance-hero
              className="mt-8 inline-flex text-ink-muted transition-colors duration-300 hover:text-accent md:mt-12"
              href="#about"
              aria-label="Scroll to about"
            >
              <span
                className="relative h-[38px] w-[24px] rounded-[14px] border-[1.5px] border-current transition-colors duration-300 hover:border-accent"
                aria-hidden="true"
              >
                <span className="animate-scroll-dot absolute left-1/2 top-[8px] size-1 -translate-x-1/2 rounded-full bg-current" />
              </span>
            </motion.a>
          </>
        )}
      </motion.div>

      {showConfirm && (
        <div
          className="fixed inset-0 z-[110] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
          onClick={() => setShowConfirm(false)}
        >
          <div
            className="relative w-full max-w-[400px] rounded-lg border border-ink/10 bg-bg-elevated p-8 shadow-[0_20px_60px_rgba(26,31,36,0.2)]"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setShowConfirm(false)}
              className="absolute right-4 top-4 grid size-8 place-items-center rounded-sm border border-ink/10 text-ink-muted transition hover:border-error hover:bg-error/10 hover:text-error"
              aria-label="Close"
            >
              <X className="size-4" />
            </button>
            <h2 className="mb-2 pr-10 font-sans text-[1.25rem] font-extrabold tracking-[-0.03em] text-ink">
              Delete Hero
            </h2>
            <p className="mb-6 font-mono text-[13px] text-ink-muted">
              Are you sure you want to delete the hero section? This action
              cannot be undone.
            </p>
            <div className="flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowConfirm(false)}
                className="rounded-sm border border-ink px-5 py-2 font-mono text-[12px] uppercase tracking-[0.1em] text-ink transition hover:border-accent hover:bg-accent/10"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={async () => {
                  try {
                    await deleteHero.mutateAsync();
                    toast.success("Hero deleted successfully.");
                    setShowConfirm(false);
                    exitEditMode();
                  } catch {
                    toast.error("Failed to delete hero.");
                  }
                }}
                disabled={deleteHero.isPending}
                className="rounded-sm border border-error bg-error px-5 py-2 font-mono text-[12px] uppercase tracking-[0.1em] text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {deleteHero.isPending ? "Deleting…" : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
