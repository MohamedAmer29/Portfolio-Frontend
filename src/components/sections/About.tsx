import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { Upload, Wrench, X } from "lucide-react";
import { toast } from "react-toastify";
import { Reveal } from "../Reveal";
import { SectionHeading } from "../SectionHeading";
import { AdminSectionActions } from "../admin/AdminSectionActions";
import { DataSourceTag } from "../admin/DataSourceTag";
import { AboutForm } from "../about/AboutForm";
import { TechnologyManager } from "../technologies/TechnologyManager";
import { useAuth } from "../../hooks/useAuth";
import { useAboutMe } from "../../hooks/useAboutMe";
import { useAboutMeMutations, DEFAULT_ABOUT_BODY } from "../../hooks/useAboutMeMutations";
import { useGSAP } from "../../lib/gsap";

declare const gsap: any;

type AboutProps = {
  paragraphs: readonly string[];
  tech: readonly string[];
  letter: string;
  image?: string;
};

export function About({ paragraphs, tech, letter, image }: AboutProps) {
  const { data: about } = useAboutMe();
  const { isAdmin } = useAuth();
  const { upsertAboutImage, deleteAboutMe, createAboutMe } = useAboutMeMutations();
  const [intro, ...rest] = about?.sentences ?? paragraphs;
  const body = rest;
  const techList = about?.technologies ?? tech.map((name) => ({ id: name, name, category: null } as const));
  const rawImageUrl = about?.image || image;
  const imageUrl = rawImageUrl && rawImageUrl.includes('cloudinary.com')
    ? rawImageUrl.replace('/upload/', '/upload/w_600,c_limit,f_auto,q_auto/')
    : rawImageUrl;
  const [failedUrls, setFailedUrls] = useState<Record<string, boolean>>({});
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showTechManage, setShowTechManage] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const photoRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const handleImageError = () => {
    if (imageUrl) {
      setFailedUrls((prev) => ({ ...prev, [imageUrl]: true }));
    }
  };

  const shouldShowFallback = !imageUrl || Boolean(failedUrls[imageUrl]);

  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error("Please select an image.");
      return;
    }

    if (selectedFile.size > 10 * 1024 * 1024) {
      toast.error("Image must be 10MB or smaller.");
      return;
    }

    const formData = new FormData();
    formData.append("image", selectedFile);

    setIsSubmitting(true);
    try {
      await upsertAboutImage.mutateAsync(formData);
      toast.success("About image updated successfully.");
      setShowModal(false);
      setSelectedFile(null);
    } catch {
      toast.error("Failed to update about image.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteAboutMe.mutateAsync();
      toast.success("About deleted successfully.");
      setShowConfirm(false);
    } catch {
      toast.error("Failed to delete about.");
    }
  };

  const handleCreate = async () => {
    try {
      await createAboutMe.mutateAsync(DEFAULT_ABOUT_BODY);
      setEditMode(true);
    } catch {
      /* error toast handled in mutation */
    }
  };

  // GSAP animation on dynamic backend data changes
  useGSAP(() => {
    if (!about || !contentRef.current) return;

    gsap.fromTo(
      contentRef.current.children,
      { opacity: 0, y: 15 },
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        stagger: 0.08,
        ease: "power2.out",
      }
    );
  }, [about]);

  useGSAP(() => {
    if (!photoRef.current) return;

    // ScrollTrigger entrance animation for photo frame
    gsap.fromTo(
      photoRef.current,
      { opacity: 0, y: 30, scale: 0.95 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.8,
        ease: "power2.out",
        scrollTrigger: {
          trigger: photoRef.current,
          start: "top 85%",
          toggleActions: "play none none reverse",
        },
      }
    );

    // Smooth hover animation for image scale and filter using GSAP
    if (imgRef.current) {
      const frameEl = photoRef.current;
      const imgEl = imgRef.current;

      const onMouseEnter = () => {
        gsap.to(imgEl, {
          scale: 1.06,
          filter: "grayscale(0%) contrast(105%)",
          duration: 0.6,
          ease: "power2.out",
        });
      };

      const onMouseLeave = () => {
        gsap.to(imgEl, {
          scale: 1,
          filter: "grayscale(100%) contrast(105%)",
          duration: 0.6,
          ease: "power2.out",
        });
      };

      frameEl.addEventListener("mouseenter", onMouseEnter);
      frameEl.addEventListener("mouseleave", onMouseLeave);

      return () => {
        frameEl.removeEventListener("mouseenter", onMouseEnter);
        frameEl.removeEventListener("mouseleave", onMouseLeave);
      };
    }
  }, [shouldShowFallback]);

  return (
    <section
      className="scroll-mt-20 px-5 py-[72px] md:px-0 md:py-[100px]"
      id="about"
    >
      <div className="mx-auto w-full max-w-[1000px] md:w-[min(100%-10rem,1000px)]">
        <Reveal>
          <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
            <SectionHeading number="01." title="About Me" className="mb-0" />
            <div className="flex items-center gap-2">
              {isAdmin && (
                <button
                  type="button"
                  onClick={() => setShowTechManage(true)}
                  className="inline-flex size-9 items-center justify-center rounded-sm border border-ink/15 bg-bg-elevated text-ink-muted transition-all duration-300 hover:-translate-y-0.5 hover:border-accent hover:bg-accent/10 hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
                  aria-label="Manage technologies"
                  title="Manage technologies"
                >
                  <Wrench className="size-4" />
                </button>
              )}
              <AdminSectionActions
                section="about"
                onCreate={about ? undefined : handleCreate}
                onUpdate={about ? () => setEditMode((v) => !v) : undefined}
                onDelete={about ? () => setShowConfirm(true) : undefined}
                isCreatePending={createAboutMe.isPending}
              />
            </div>
          </div>
          {isAdmin && (
            <DataSourceTag hasServerData={Boolean(about)} className="mb-7 block md:mb-10" />
          )}
        </Reveal>

        {editMode ? (
          <AboutForm initialData={about} onClose={() => setEditMode(false)} />
        ) : (
          <div className="grid items-start gap-10 md:grid-cols-[1.2fr_0.8fr] md:gap-12">
          <Reveal delay={0.08}>
            <div ref={contentRef} className="space-y-4 text-[17px] leading-[1.7] text-ink-muted md:text-body">
              <p className="max-w-[540px]">{intro}</p>
              {body.map((paragraph) => (
                <p key={paragraph.slice(0, 24)} className="max-w-[540px]">
                  {paragraph}
                </p>
              ))}
              <p className="max-w-[540px]">
                Here are a few technologies I've been working with recently:
              </p>
              <ul className="mt-4 grid max-w-[480px] grid-cols-2 gap-x-5 gap-y-2.5 md:grid-cols-3">
                {techList.map((item) => (
                  <li
                    key={item.id}
                    className="relative pl-4 font-mono text-[13px] text-ink-muted before:absolute before:left-0 before:top-[2px] before:text-[11px] before:text-accent before:content-['▸']"
                  >
                    {item.name}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>

          <div className="justify-self-center md:justify-self-end">
            <motion.div
              ref={photoRef}
              className="photo-frame"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ scale: 1.02 }}
            >
              {!shouldShowFallback ? (
                <motion.img
                  ref={imgRef}
                  src={imageUrl}
                  alt="Portrait"
                  onError={handleImageError}
                  whileHover={{ scale: 1.06 }}
                  transition={{ duration: 0.4 }}
                />
              ) : (
                <span className="absolute inset-0 grid place-items-center text-[5.5rem] font-extrabold tracking-[-0.04em] text-white/30">
                  {letter}
                </span>
              )}
              {isAdmin && (
                <button
                  type="button"
                  onClick={() => setShowModal(true)}
                  className="absolute bottom-2 right-2 grid size-9 place-items-center rounded-full bg-black/50 backdrop-blur-sm text-white transition hover:bg-accent/80"
                  aria-label="Update image"
                >
                  <Upload className="size-4" />
                </button>
              )}
            </motion.div>
          </div>
        </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4" onClick={() => {
          setShowModal(false);
          setSelectedFile(null);
        }}>
          <div
            className="relative w-full max-w-[400px] rounded-lg border border-ink/10 bg-bg-elevated p-8 shadow-[0_20px_60px_rgba(26,31,36,0.2)]"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => {
                setShowModal(false);
                setSelectedFile(null);
              }}
              className="absolute right-4 top-4 grid size-8 place-items-center rounded-sm border border-ink/10 text-ink-muted transition hover:border-error hover:bg-error/10 hover:text-error"
              aria-label="Close"
            >
              <X className="size-4" />
            </button>
            <h2 className="mb-4 pr-10 font-sans text-[1.25rem] font-extrabold tracking-[-0.03em] text-ink">
              Update Image
            </h2>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setSelectedFile(e.target.files?.[0] ?? null)}
              className="mb-4 w-full rounded-sm border border-ink-muted/15 bg-bg-elevated px-4 py-3.5 text-[14px] text-ink outline-none transition-all duration-300 focus:shadow-[0_0_0_3px_rgba(127,173,173,0.1)]"
            />
            <div className="flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => {
                  setShowModal(false);
                  setSelectedFile(null);
                }}
                className="rounded-sm border border-ink px-5 py-2 font-mono text-[12px] uppercase tracking-[0.1em] text-ink transition hover:border-accent hover:bg-accent/10"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleUpload}
                disabled={isSubmitting || !selectedFile}
                className="rounded-sm border border-accent bg-accent px-5 py-2 font-mono text-[12px] uppercase tracking-[0.1em] text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isSubmitting ? "Uploading…" : "Update"}
              </button>
            </div>
          </div>
        </div>
      )}

      {showTechManage && (
        <TechnologyManager onClose={() => setShowTechManage(false)} />
      )}

      {showConfirm && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4" onClick={() => setShowConfirm(false)}>
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
              Delete About
            </h2>
            <p className="mb-6 font-mono text-[13px] text-ink-muted">
              Are you sure you want to delete the about section? This action cannot be undone.
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
                onClick={handleDelete}
                disabled={deleteAboutMe.isPending}
                className="rounded-sm border border-error bg-error px-5 py-2 font-mono text-[12px] uppercase tracking-[0.1em] text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {deleteAboutMe.isPending ? "Deleting…" : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}