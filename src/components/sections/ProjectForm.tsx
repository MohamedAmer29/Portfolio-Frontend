import { Trash2, Upload, Loader2 } from "lucide-react";
import { useTechnologies } from "../../hooks/useTechnologies";
import type { ProjectDraft } from "../../hooks/useProjectsMutations";

const inputClass =
  "w-full rounded-sm border border-ink/15 bg-bg-elevated px-3 py-2 text-[14px] text-ink outline-none transition-all duration-300 focus:shadow-[0_0_0_3px_rgba(127,173,173,0.12)] focus:border-accent";
const labelClass =
  "mb-1 block font-mono text-[10px] uppercase tracking-[0.15em] text-ink-soft";

const STATUSES = [
  "PLANNING",
  "IN_PROGRESS",
  "COMPLETED",
  "MAINTENANCE",
  "ARCHIVED",
];

type ProjectFormProps = {
  project: ProjectDraft;
  onChange: (patch: Partial<ProjectDraft>) => void;
  onImageChange: (file: File) => void;
  onDelete?: () => void;
  isUploading?: boolean;
};

export function ProjectForm({
  project,
  onChange,
  onImageChange,
  onDelete,
  isUploading = false,
}: ProjectFormProps) {
  const { data: technologies } = useTechnologies();

  const toggleTechnology = (id: string) => {
    const selected = project.technologies.includes(id)
      ? project.technologies.filter((t) => t !== id)
      : [...project.technologies, id];
    onChange({ technologies: selected });
  };

  return (
    <div className="relative flex flex-col gap-3 rounded-lg border border-accent/30 bg-bg-elevated/70 p-5">
      {onDelete && (
        <button
          type="button"
          onClick={onDelete}
          className="absolute right-3 top-3 inline-flex size-8 items-center justify-center rounded-sm border border-error/40 bg-error/10 text-error transition hover:bg-error/20"
          aria-label="Delete project"
        >
          <Trash2 className="size-4" />
        </button>
      )}

      <label className="block">
        <span className={labelClass}>Title</span>
        <input
          type="text"
          className={inputClass}
          value={project.title}
          onChange={(e) => onChange({ title: e.target.value })}
        />
      </label>

      <label className="block">
        <span className={labelClass}>Slug</span>
        <input
          type="text"
          className={inputClass}
          value={project.slug}
          onChange={(e) => onChange({ slug: e.target.value })}
        />
      </label>

      <label className="block">
        <span className={labelClass}>Short Description</span>
        <input
          type="text"
          className={inputClass}
          value={project.shortDescription}
          onChange={(e) => onChange({ shortDescription: e.target.value })}
        />
      </label>

      <label className="block">
        <span className={labelClass}>Description</span>
        <textarea
          className={`${inputClass} resize-y min-h-[70px]`}
          value={project.description}
          onChange={(e) => onChange({ description: e.target.value })}
        />
      </label>

      <div className="grid grid-cols-2 gap-3">
        <label className="block">
          <span className={labelClass}>GitHub URL</span>
          <input
            type="text"
            className={inputClass}
            value={project.githubUrl}
            onChange={(e) => onChange({ githubUrl: e.target.value })}
          />
        </label>
        <label className="block">
          <span className={labelClass}>Live URL</span>
          <input
            type="text"
            className={inputClass}
            value={project.liveUrl}
            onChange={(e) => onChange({ liveUrl: e.target.value })}
          />
        </label>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <label className="block">
          <span className={labelClass}>Status</span>
          <select
            className={inputClass}
            value={project.status}
            onChange={(e) => onChange({ status: e.target.value })}
          >
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className={labelClass}>Display Order</span>
          <input
            type="number"
            className={inputClass}
            value={project.displayOrder}
            onChange={(e) =>
              onChange({ displayOrder: Number(e.target.value) })
            }
          />
        </label>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <label className="block">
          <span className={labelClass}>Start Date</span>
          <input
            type="text"
            className={inputClass}
            value={project.startDate}
            placeholder="2024-01-01"
            onChange={(e) => onChange({ startDate: e.target.value })}
          />
        </label>
        <label className="block">
          <span className={labelClass}>End Date</span>
          <input
            type="text"
            className={inputClass}
            value={project.endDate}
            placeholder="2024-06-01"
            onChange={(e) => onChange({ endDate: e.target.value })}
          />
        </label>
      </div>

      <label className="flex items-center gap-2 text-[13px] text-ink-muted">
        <input
          type="checkbox"
          checked={project.featured}
          onChange={(e) => onChange({ featured: e.target.checked })}
        />
        Featured project
      </label>

      <div>
        <span className={labelClass}>Technologies</span>
        <div className="thin-scrollbar mb-3 grid max-h-[200px] gap-2 overflow-y-auto rounded-sm border border-ink/15 bg-bg-elevated p-3">
          {technologies?.map((tech) => (
            <button
              key={tech.id}
              type="button"
              onClick={() => toggleTechnology(tech.id)}
              className={`flex items-center justify-between rounded-sm px-3 py-2 text-[13px] font-mono transition hover:border-accent hover:bg-accent/10 ${
                project.technologies.includes(tech.id)
                  ? "border border-accent bg-accent/10 text-accent"
                  : "border border-transparent text-ink-muted"
              }`}
            >
              <span>{tech.name}</span>
              <span className="text-[11px] text-ink-soft">
                {tech.category ?? "Uncategorized"}
              </span>
            </button>
          ))}
        </div>
        {project.technologies.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {project.technologies.map((id) => {
              const tech = technologies?.find((t) => t.id === id);
              return (
                <span
                  key={id}
                  className="inline-flex items-center gap-1 rounded-sm border border-accent bg-accent/10 px-3 py-1 font-mono text-[11px] text-accent"
                >
                  {tech?.name ?? id}
                  <button
                    type="button"
                    onClick={() => toggleTechnology(id)}
                    className="ml-1 text-accent/60 transition hover:text-error"
                  >
                    ✕
                  </button>
                </span>
              );
            })}
          </div>
        )}
      </div>

      <div>
        <span className={labelClass}>Image</span>
        <div className="flex items-center gap-3">
          {project.image && (
            <img
              src={project.image}
              alt={project.title}
              className="size-16 rounded-sm border border-ink/15 object-cover"
            />
          )}
          <label
            className={`inline-flex cursor-pointer items-center gap-1.5 rounded-sm border border-ink/15 bg-bg-elevated px-3 py-2 font-mono text-[11px] uppercase tracking-[0.1em] text-ink-muted transition hover:border-accent hover:text-accent ${
              isUploading ? "pointer-events-none opacity-60" : ""
            }`}
          >
            {isUploading ? (
              <>
                <Loader2 className="size-3.5 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="size-3.5" />
                {project.image ? "Replace Image" : "Upload Image"}
              </>
            )}
            <input
              type="file"
              accept="image/*"
              className="hidden"
              disabled={isUploading}
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) onImageChange(file);
                e.target.value = "";
              }}
            />
          </label>
        </div>
      </div>
    </div>
  );
}
