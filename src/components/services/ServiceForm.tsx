import { Trash2, Plus } from "lucide-react";
import type { Service, ServiceCategory, ServiceEmphasis } from "./servicesData";

const inputClass =
  "w-full rounded-sm border border-ink/15 bg-bg-elevated px-3 py-2 text-[14px] text-ink outline-none transition-all duration-300 focus:shadow-[0_0_0_3px_rgba(127,173,173,0.12)] focus:border-accent";
const labelClass =
  "mb-1 block font-mono text-[10px] uppercase tracking-[0.15em] text-ink-soft";

const CATEGORIES: ServiceCategory[] = [
  "Full Stack",
  "Frontend",
  "Backend",
  "Data & Security",
  "Infrastructure",
  "AI",
];
const EMPHASES: ServiceEmphasis[] = ["compact", "standard", "detail"];

type ServiceFormProps = {
  service: Service;
  onChange: (patch: Partial<Service>) => void;
  onDelete?: () => void;
};

export function ServiceForm({ service, onChange, onDelete }: ServiceFormProps) {
  const groups = service.groups ?? [];

  const updateGroup = (index: number, patch: Partial<{ label: string; items: string[] }>) => {
    const next = groups.map((g, i) => (i === index ? { ...g, ...patch } : g));
    onChange({ groups: next });
  };

  const addGroup = () => {
    onChange({ groups: [...groups, { label: "", items: [] }] });
  };

  const removeGroup = (index: number) => {
    onChange({ groups: groups.filter((_, i) => i !== index) });
  };

  return (
    <div className="relative flex h-full w-full flex-col gap-3 rounded-sm border border-accent/30 bg-bg-elevated/70 p-5">
      {onDelete && (
        <button
          type="button"
          onClick={onDelete}
          className="absolute right-3 top-3 inline-flex size-8 items-center justify-center rounded-sm border border-error/40 bg-error/10 text-error transition hover:bg-error/20"
          aria-label="Delete service"
        >
          <Trash2 className="size-4" />
        </button>
      )}

      <label className="block">
        <span className={labelClass}>Title</span>
        <input
          type="text"
          className={inputClass}
          value={service.title}
          onChange={(e) => onChange({ title: e.target.value })}
        />
      </label>

      <label className="block">
        <span className={labelClass}>Description</span>
        <textarea
          className={`${inputClass} resize-y min-h-[70px]`}
          value={service.description}
          onChange={(e) => onChange({ description: e.target.value })}
        />
      </label>

      <div className="grid grid-cols-2 gap-3">
        <label className="block">
          <span className={labelClass}>Icon (name)</span>
          <input
            type="text"
            className={inputClass}
            value={service.iconName ?? ""}
            onChange={(e) => onChange({ iconName: e.target.value })}
          />
        </label>
        <label className="block">
          <span className={labelClass}>Number</span>
          <input
            type="text"
            className={inputClass}
            value={service.number}
            onChange={(e) => onChange({ number: e.target.value })}
          />
        </label>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <label className="block">
          <span className={labelClass}>Category</span>
          <select
            className={inputClass}
            value={service.category}
            onChange={(e) =>
              onChange({ category: e.target.value as ServiceCategory })
            }
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className={labelClass}>Emphasis</span>
          <select
            className={inputClass}
            value={service.emphasis}
            onChange={(e) =>
              onChange({ emphasis: e.target.value as ServiceEmphasis })
            }
          >
            {EMPHASES.map((em) => (
              <option key={em} value={em}>
                {em}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <label className="block">
          <span className={labelClass}>Color</span>
          <div className="flex items-center gap-2">
            <input
              type="color"
              className="h-9 w-10 rounded-sm border border-ink/15 bg-bg-elevated"
              value={service.color}
              onChange={(e) => onChange({ color: e.target.value })}
            />
            <input
              type="text"
              className={inputClass}
              value={service.color}
              onChange={(e) => onChange({ color: e.target.value })}
            />
          </div>
        </label>
        <label className="block">
          <span className={labelClass}>Display Order</span>
          <input
            type="number"
            className={inputClass}
            value={service.displayOrder ?? 0}
            onChange={(e) =>
              onChange({ displayOrder: Number(e.target.value) })
            }
          />
        </label>
      </div>

      <label className="flex items-center gap-2 text-[13px] text-ink-muted">
        <input
          type="checkbox"
          checked={Boolean(service.isFeatured)}
          onChange={(e) => onChange({ isFeatured: e.target.checked })}
        />
        Featured service
      </label>

      <label className="block">
        <span className={labelClass}>Technologies (comma separated)</span>
        <input
          type="text"
          className={inputClass}
          value={service.technologies.join(", ")}
          onChange={(e) =>
            onChange({
              technologies: e.target.value
                .split(",")
                .map((t) => t.trim())
                .filter(Boolean),
            })
          }
        />
      </label>

      <label className="block">
        <span className={labelClass}>Highlights (one per line)</span>
        <textarea
          className={`${inputClass} resize-y min-h-[70px]`}
          value={(service.highlights ?? []).join("\n")}
          onChange={(e) =>
            onChange({
              highlights: e.target.value
                .split("\n")
                .map((h) => h.trim())
                .filter(Boolean),
            })
          }
        />
      </label>

      <div>
        <span className={labelClass}>Groups</span>
        <div className="space-y-2">
          {groups.map((group, index) => (
            <div
              key={index}
              className="rounded-sm border border-ink/10 bg-bg px-3 py-2"
            >
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Label"
                  className={inputClass}
                  value={group.label}
                  onChange={(e) => updateGroup(index, { label: e.target.value })}
                />
                <button
                  type="button"
                  onClick={() => removeGroup(index)}
                  className="grid size-8 shrink-0 place-items-center rounded-sm border border-error/40 bg-error/10 text-error transition hover:bg-error/20"
                  aria-label="Remove group"
                >
                  <Trash2 className="size-4" />
                </button>
              </div>
              <input
                type="text"
                placeholder="Items (comma separated)"
                className={`${inputClass} mt-2`}
                value={group.items.join(", ")}
                onChange={(e) =>
                  updateGroup(index, {
                    items: e.target.value
                      .split(",")
                      .map((i) => i.trim())
                      .filter(Boolean),
                  })
                }
              />
            </div>
          ))}
          <button
            type="button"
            onClick={addGroup}
            className="inline-flex items-center gap-1.5 rounded-sm border border-ink/15 bg-bg-elevated px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.1em] text-ink-muted transition hover:border-accent hover:text-accent"
          >
            <Plus className="size-3.5" /> Add Group
          </button>
        </div>
      </div>
    </div>
  );
}
