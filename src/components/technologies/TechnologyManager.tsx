import { useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { Pencil, Plus, Trash2, X, Loader2 } from "lucide-react";
import { toast } from "react-toastify";
import { useTechnologies } from "../../hooks/useTechnologies";
import {
  useCreateTechnology,
  useUpdateTechnology,
  useDeleteTechnology,
  type TechnologyInput,
} from "../../hooks/useTechnologiesMutations";

type TechnologyManagerProps = {
  onClose: () => void;
};

const baseField =
  "w-full rounded-sm border bg-bg-elevated px-4 py-3.5 text-[16px] text-ink outline-none transition-all duration-300 placeholder:text-ink-soft focus:shadow-[0_0_0_3px_rgba(127,173,173,0.1)]";
const fieldClass = (hasError: boolean) =>
  `${baseField} ${
    hasError ? "border-error focus:border-error/60" : "border-ink-muted/15 focus:border-accent/60 focus:bg-white"
  }`;
const errorClass = "mt-1.5 font-mono text-[11px] text-error";
const labelClass = "mb-1.5 block font-mono text-[11px] uppercase tracking-[0.12em] text-ink-muted";

export function TechnologyManager({ onClose }: TechnologyManagerProps) {
  const { data: technologies, isFetching } = useTechnologies();
  const createTechnology = useCreateTechnology();
  const updateTechnology = useUpdateTechnology();
  const deleteTechnology = useDeleteTechnology();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<TechnologyInput>({
    mode: "onBlur",
    defaultValues: { name: "", category: "", icon: "" },
  });

  const values = watch();
  const allFieldsFilled =
    (values.name ?? "").trim().length > 0 &&
    (values.category ?? "").trim().length > 0 &&
    (values.icon ?? "").trim().length > 0;

  const isSubmitDisabled =
    isSubmitting || isFetching || !allFieldsFilled;

  const onSubmit: SubmitHandler<TechnologyInput> = async (data) => {
    try {
      if (editingId) {
        await updateTechnology.mutateAsync({ id: editingId, data });
        toast.success("Technology updated successfully.");
      } else {
        await createTechnology.mutateAsync(data);
        toast.success("Technology created successfully.");
      }
      reset({ name: "", category: "", icon: "" });
      setEditingId(null);
    } catch {
      toast.error(
        editingId
          ? "Failed to update technology."
          : "Failed to create technology.",
      );
    }
  };

  const handleEdit = (id: string) => {
    const tech = technologies?.find((t) => t.id === id);
    if (!tech) return;
    setEditingId(id);
    reset({
      name: tech.name,
      category: tech.category ?? "",
      icon: tech.icon ?? "",
    });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    reset({ name: "", category: "", icon: "" });
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteTechnology.mutateAsync(id);
      toast.success("Technology deleted successfully.");
      setConfirmDeleteId(null);
    } catch {
      toast.error("Failed to delete technology.");
    }
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4" onClick={onClose}>
      <div
        className="thin-scrollbar relative w-full max-w-[640px] max-h-[90vh] overflow-y-auto rounded-lg border border-ink/10 bg-bg-elevated p-8 shadow-[0_20px_60px_rgba(26,31,36,0.2)]"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 grid size-8 place-items-center rounded-sm border border-ink/10 text-ink-muted transition hover:border-error hover:bg-error/10 hover:text-error"
          aria-label="Close"
        >
          <X className="size-4" />
        </button>

        <div className="mb-6 flex items-center justify-between pr-10">
          <div>
            <h2 className="font-sans text-[1.25rem] font-extrabold tracking-[-0.03em] text-ink">
              Technologies
            </h2>
            <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.15em] text-accent/70">
              {isFetching
                ? "syncing…"
                : technologies
                  ? `${technologies.length} synced from server`
                  : "local data"}
            </p>
          </div>
        </div>

        <form className="grid gap-5" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <label className={labelClass} htmlFor="tech-name">Name</label>
            <input
              id="tech-name"
              type="text"
              placeholder="TypeScript"
              {...register("name", { required: "Name is required" })}
              aria-invalid={!!errors.name}
              className={fieldClass(!!errors.name)}
            />
            {errors.name && <p className={errorClass}>{errors.name.message}</p>}
          </div>

          <div>
            <label className={labelClass} htmlFor="tech-category">Category</label>
            <input
              id="tech-category"
              type="text"
              placeholder="Language"
              {...register("category", { required: "Category is required" })}
              aria-invalid={!!errors.category}
              className={fieldClass(!!errors.category)}
            />
            {errors.category && <p className={errorClass}>{errors.category.message}</p>}
          </div>

          <div>
            <label className={labelClass} htmlFor="tech-icon">Icon</label>
            <input
              id="tech-icon"
              type="text"
              placeholder="typescript-icon"
              {...register("icon", { required: "Icon is required" })}
              aria-invalid={!!errors.icon}
              className={fieldClass(!!errors.icon)}
            />
            {errors.icon && <p className={errorClass}>{errors.icon.message}</p>}
          </div>

          <div className="flex items-center justify-end gap-3">
            {editingId && (
              <button
                type="button"
                onClick={handleCancelEdit}
                className="rounded-sm border border-ink px-5 py-2 font-mono text-[12px] uppercase tracking-[0.1em] text-ink transition hover:border-accent hover:bg-accent/10"
              >
                Cancel
              </button>
            )}
            <button
              type="submit"
              disabled={isSubmitDisabled}
              className="inline-flex items-center gap-2 rounded-sm border border-accent bg-accent px-5 py-2 font-mono text-[12px] uppercase tracking-[0.1em] text-bg transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSubmitting ? (
                <Loader2 className="size-3.5 animate-spin" />
              ) : editingId ? (
                <Pencil className="size-3.5" />
              ) : (
                <Plus className="size-3.5" />
              )}
              {editingId ? "Save Changes" : "Add Technology"}
            </button>
          </div>
        </form>

        <div className="mt-8 border-t border-ink/10 pt-6">
          <h3 className="mb-3 font-mono text-[10px] uppercase tracking-[0.12em] text-ink-muted">
            All Technologies
          </h3>
          {!technologies || technologies.length === 0 ? (
            <p className="font-mono text-[12px] text-ink-soft">
              No technologies yet. Add one above.
            </p>
          ) : (
            <div className="thin-scrollbar grid max-h-[240px] gap-2 overflow-y-auto pr-1">
              {technologies.map((tech) => (
                <div
                  key={tech.id}
                  className={`flex items-center justify-between gap-3 rounded-sm border px-3 py-2.5 transition ${
                    editingId === tech.id
                      ? "border-accent bg-accent/10"
                      : "border-ink-muted/15 bg-bg-elevated hover:border-accent/40"
                  }`}
                >
                  <div className="min-w-0">
                    <p className="truncate font-mono text-[13px] text-ink">
                      {tech.name}
                    </p>
                    <p className="truncate font-mono text-[11px] text-ink-soft">
                      {tech.category ?? "Uncategorized"}
                      {tech.icon ? ` · ${tech.icon}` : ""}
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleEdit(tech.id)}
                      className="grid size-8 place-items-center rounded-sm border border-ink/15 text-ink-muted transition hover:border-accent hover:bg-accent/10 hover:text-accent"
                      aria-label={`Update ${tech.name}`}
                      title="Update"
                    >
                      <Pencil className="size-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setConfirmDeleteId(tech.id)}
                      className="grid size-8 place-items-center rounded-sm border border-ink/15 text-ink-muted transition hover:border-error hover:bg-error/10 hover:text-error"
                      aria-label={`Delete ${tech.name}`}
                      title="Delete"
                    >
                      <Trash2 className="size-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {confirmDeleteId && (
        <div className="fixed inset-0 z-[210] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="relative w-full max-w-[400px] rounded-lg border border-ink/10 bg-bg-elevated p-8 shadow-[0_20px_60px_rgba(26,31,36,0.2)]">
            <button
              type="button"
              onClick={() => setConfirmDeleteId(null)}
              className="absolute right-4 top-4 grid size-8 place-items-center rounded-sm border border-ink/10 text-ink-muted transition hover:border-error hover:bg-error/10 hover:text-error"
              aria-label="Close"
            >
              <X className="size-4" />
            </button>
            <h2 className="mb-2 font-sans text-[1.25rem] font-extrabold tracking-[-0.03em] text-ink">
              Delete Technology
            </h2>
            <p className="mb-6 font-mono text-[13px] text-ink-muted">
              Are you sure you want to delete this technology? This action
              cannot be undone.
            </p>
            <div className="flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setConfirmDeleteId(null)}
                className="rounded-sm border border-ink px-5 py-2 font-mono text-[12px] uppercase tracking-[0.1em] text-ink transition hover:border-accent hover:bg-accent/10"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleDelete(confirmDeleteId)}
                disabled={deleteTechnology.isPending}
                className="rounded-sm border border-error bg-error px-5 py-2 font-mono text-[12px] uppercase tracking-[0.1em] text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {deleteTechnology.isPending ? "Deleting…" : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}