import { useForm, type SubmitHandler } from "react-hook-form";
import { X, Loader2 } from "lucide-react";
import { toast } from "react-toastify";
import {
  useCreateSkill,
  useUpdateSkill,
  type SkillInput,
} from "../../hooks/useSkillsMutations";
import { apiCategoryLabels } from "../../hooks/useSkills";
import {
  CATEGORIES,
  type Skill,
  type SkillCategory,
} from "./skillsData";

type SkillFormProps = {
  initialData?: Skill | null;
  onClose: () => void;
};

type SkillFormValues = {
  name: string;
  category: string;
  proficiency: number;
  yearsOfExperience: number;
  icon: string;
  description: string;
  relatedText: string;
  displayOrder: number;
  isFeatured: boolean;
};

function splitRelated(value: string): string[] {
  return value
    .split(",")
    .map((r) => r.trim())
    .filter(Boolean);
}

function toNumber(value: number | undefined): number {
  return Number.isFinite(value) ? value! : 0;
}

const baseField =
  "w-full rounded-sm border bg-bg-elevated px-4 py-3.5 text-[16px] text-ink outline-none transition-all duration-300 placeholder:text-ink-soft focus:shadow-[0_0_0_3px_rgba(127,173,173,0.1)]";
const fieldClass = (hasError: boolean) =>
  `${baseField} ${
    hasError
      ? "border-error focus:border-error/60"
      : "border-ink-muted/15 focus:border-accent/60 focus:bg-white"
  }`;
const errorClass = "mt-1.5 font-mono text-[11px] text-error";
const labelClass =
  "mb-1.5 block font-mono text-[11px] uppercase tracking-[0.12em] text-ink-muted";

export function SkillForm({ initialData, onClose }: SkillFormProps) {
  const createSkill = useCreateSkill();
  const updateSkill = useUpdateSkill();
  const isEdit = initialData !== null && initialData !== undefined;

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<SkillFormValues>({
    mode: "onBlur",
    defaultValues: initialData
      ? {
          name: initialData.name,
          category: initialData.category,
          proficiency: initialData.proficiency ?? 0,
          yearsOfExperience: initialData.yearsOfExperience ?? 0,
          icon: initialData.icon ?? "",
          description: initialData.description ?? "",
          relatedText: (initialData.related ?? []).join(", "),
          displayOrder: initialData.displayOrder ?? 0,
          isFeatured: initialData.isFeatured ?? false,
        }
      : {
          name: "",
          category: "",
          proficiency: 0,
          yearsOfExperience: 0,
          icon: "",
          description: "",
          relatedText: "",
          displayOrder: 0,
          isFeatured: false,
        },
  });

  const values = watch();

  const allFieldsFilled =
    (values.name ?? "").trim().length > 0 &&
    Boolean(values.category) &&
    Number.isFinite(values.proficiency) &&
    Number.isFinite(values.yearsOfExperience) &&
    (values.icon ?? "").trim().length > 0 &&
    (values.description ?? "").trim().length > 0 &&
    splitRelated(values.relatedText ?? "").length > 0 &&
    Number.isFinite(values.displayOrder);

  const isChanged = isEdit && initialData && (
    (values.name ?? "").trim() !== initialData.name ||
    values.category !== initialData.category ||
    toNumber(values.proficiency) !== (initialData.proficiency ?? 0) ||
    toNumber(values.yearsOfExperience) !== (initialData.yearsOfExperience ?? 0) ||
    (values.icon ?? "").trim() !== (initialData.icon ?? "") ||
    (values.description ?? "").trim() !== (initialData.description ?? "") ||
    JSON.stringify(splitRelated(values.relatedText ?? "")) !==
      JSON.stringify(initialData.related ?? []) ||
    toNumber(values.displayOrder) !== (initialData.displayOrder ?? 0) ||
    Boolean(values.isFeatured) !== Boolean(initialData.isFeatured)
  );

  const isSubmitDisabled =
    isSubmitting || (isEdit ? !isChanged : !allFieldsFilled);

  const onSubmit: SubmitHandler<SkillFormValues> = async (data) => {
    const payload: SkillInput = {
      name: (data.name ?? "").trim(),
      category:
        apiCategoryLabels[data.category as SkillCategory] ?? data.category,
      proficiency: Math.round(toNumber(data.proficiency)),
      yearsOfExperience: Math.round(toNumber(data.yearsOfExperience) * 10) / 10,
      icon: (data.icon ?? "").trim(),
      description: (data.description ?? "").trim(),
      related: splitRelated(data.relatedText ?? ""),
      displayOrder: Math.round(toNumber(data.displayOrder)),
      isFeatured: Boolean(data.isFeatured),
    };
    try {
      if (isEdit && initialData) {
        await updateSkill.mutateAsync({ id: initialData.id, data: payload });
        toast.success("Skill updated successfully.");
      } else {
        await createSkill.mutateAsync(payload);
        toast.success("Skill created successfully.");
      }
      onClose();
    } catch {
      toast.error(isEdit ? "Failed to update skill." : "Failed to create skill.");
    }
  };

  return (
    <form
      className="fixed inset-0 z-[110] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      onSubmit={handleSubmit(onSubmit)}
      onClick={onClose}
    >
      <div
        className="thin-scrollbar relative max-h-[90vh] w-full max-w-[600px] overflow-y-auto rounded-lg border border-ink/10 bg-bg-elevated p-8 shadow-[0_20px_60px_rgba(26,31,36,0.2)]"
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
        <h2 className="mb-6 pr-10 font-sans text-[1.25rem] font-extrabold tracking-[-0.03em] text-ink">
          {isEdit ? "Edit Skill" : "Add Skill"}
        </h2>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className={labelClass} htmlFor="skill-name">Name</label>
            <input
              id="skill-name"
              type="text"
              placeholder="NestJS"
              {...register("name", {
                required: "Name is required",
                maxLength: {
                  value: 120,
                  message: "Name must not exceed 120 characters",
                },
              })}
              aria-invalid={!!errors.name}
              className={fieldClass(!!errors.name)}
            />
            {errors.name && <p className={errorClass}>{errors.name.message}</p>}
          </div>

          <div className="sm:col-span-2">
            <label className={labelClass} htmlFor="skill-category">Category</label>
            <select
              id="skill-category"
              {...register("category", { required: "Category is required" })}
              aria-invalid={!!errors.category}
              className={fieldClass(!!errors.category)}
            >
              <option value="" disabled>
                Select a category
              </option>
              {CATEGORIES.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.label}
                </option>
              ))}
            </select>
            {errors.category && (
              <p className={errorClass}>{errors.category.message}</p>
            )}
          </div>

          <div>
            <label className={labelClass} htmlFor="skill-proficiency">
              Proficiency (0–100)
            </label>
            <input
              id="skill-proficiency"
              type="number"
              min={0}
              max={100}
              step={1}
              placeholder="80"
              {...register("proficiency", {
                required: "Proficiency is required",
                setValueAs: (v) => (v === "" ? undefined : Number(v)),
                min: { value: 0, message: "Must be at least 0" },
                max: { value: 100, message: "Must be at most 100" },
                validate: (v) =>
                  v === undefined ||
                  (Number.isFinite(v) && Number.isInteger(v)) ||
                  "Proficiency must be a whole number",
              })}
              aria-invalid={!!errors.proficiency}
              className={fieldClass(!!errors.proficiency)}
            />
            {errors.proficiency && (
              <p className={errorClass}>{errors.proficiency.message}</p>
            )}
          </div>

          <div>
            <label className={labelClass} htmlFor="skill-years">
              Years of Experience
            </label>
            <input
              id="skill-years"
              type="number"
              min={0}
              step={0.1}
              placeholder="3.5"
              {...register("yearsOfExperience", {
                required: "Years of experience is required",
                setValueAs: (v) => (v === "" ? undefined : Number(v)),
                min: { value: 0, message: "Must be at least 0" },
                validate: (v) =>
                  v === undefined ||
                  (Number.isFinite(v) && Math.round(v * 10) / 10 === v) ||
                  "Max one decimal place",
              })}
              aria-invalid={!!errors.yearsOfExperience}
              className={fieldClass(!!errors.yearsOfExperience)}
            />
            {errors.yearsOfExperience && (
              <p className={errorClass}>{errors.yearsOfExperience.message}</p>
            )}
          </div>

          <div className="sm:col-span-2">
            <label className={labelClass} htmlFor="skill-icon">Icon</label>
            <input
              id="skill-icon"
              type="text"
              placeholder="nestjs-icon"
              {...register("icon", { required: "Icon is required" })}
              aria-invalid={!!errors.icon}
              className={fieldClass(!!errors.icon)}
            />
            {errors.icon && <p className={errorClass}>{errors.icon.message}</p>}
          </div>

          <div className="sm:col-span-2">
            <label className={labelClass} htmlFor="skill-description">
              Description
            </label>
            <textarea
              id="skill-description"
              rows={3}
              placeholder="Backend framework for Node.js"
              {...register("description", {
                required: "Description is required",
              })}
              aria-invalid={!!errors.description}
              className={`${fieldClass(!!errors.description)} resize-y`}
            />
            {errors.description && (
              <p className={errorClass}>{errors.description.message}</p>
            )}
          </div>

          <div className="sm:col-span-2">
            <label className={labelClass} htmlFor="skill-related">
              Related (comma-separated)
            </label>
            <input
              id="skill-related"
              type="text"
              placeholder="TypeScript, Redux"
              {...register("relatedText", {
                required: "At least one related skill is required",
                validate: (v) =>
                  splitRelated(v ?? "").length > 0 ||
                  "At least one related skill is required",
              })}
              aria-invalid={!!errors.relatedText}
              className={fieldClass(!!errors.relatedText)}
            />
            {errors.relatedText && (
              <p className={errorClass}>{errors.relatedText.message}</p>
            )}
          </div>

          <div>
            <label className={labelClass} htmlFor="skill-order">
              Display Order
            </label>
            <input
              id="skill-order"
              type="number"
              min={0}
              step={1}
              placeholder="0"
              {...register("displayOrder", {
                required: "Display order is required",
                setValueAs: (v) => (v === "" ? undefined : Number(v)),
                min: { value: 0, message: "Must be at least 0" },
                validate: (v) =>
                  v === undefined ||
                  (Number.isFinite(v) && Number.isInteger(v)) ||
                  "Must be a whole number",
              })}
              aria-invalid={!!errors.displayOrder}
              className={fieldClass(!!errors.displayOrder)}
            />
            {errors.displayOrder && (
              <p className={errorClass}>{errors.displayOrder.message}</p>
            )}
          </div>

          <div className="flex items-end">
            <label className="flex cursor-pointer items-center gap-2.5 pb-3.5">
              <input
                type="checkbox"
                {...register("isFeatured")}
                className="size-4 accent-accent"
              />
              <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-ink-muted">
                Featured
              </span>
            </label>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-sm border border-ink px-5 py-2 font-mono text-[12px] uppercase tracking-[0.1em] text-ink transition hover:border-accent hover:bg-accent/10"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitDisabled}
            className="inline-flex items-center gap-2 rounded-sm border border-accent bg-accent px-5 py-2 font-mono text-[12px] uppercase tracking-[0.1em] text-bg transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSubmitting && <Loader2 className="size-3.5 animate-spin" />}
            {isEdit ? "Save Changes" : "Create"}
          </button>
        </div>
      </div>
    </form>
  );
}