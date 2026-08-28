import { useForm, type SubmitHandler } from "react-hook-form";
import { X, Loader2 } from "lucide-react";
import { toast } from "react-toastify";
import {
  useCreateExperience,
  useUpdateExperience,
  type ExperienceInput,
} from "../../hooks/useExperienceMutations";
import type { Job } from "../sections/Experience";

type ExperienceFormProps = {
  initialData?: Job | null;
  onClose: () => void;
};

type ExperienceFormValues = {
  company: string;
  position: string;
  description: string[];
  location: string;
  employmentType: string;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
  displayOrder: number;
};

const EMPLOYMENT_TYPES: { value: string; label: string }[] = [
  { value: "FULL_TIME", label: "Full-time" },
  { value: "PART_TIME", label: "Part-time" },
  { value: "CONTRACT", label: "Contract" },
  { value: "INTERNSHIP", label: "Internship" },
  { value: "FREELANCE", label: "Freelance" },
];

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

export function ExperienceForm({ initialData, onClose }: ExperienceFormProps) {
  const createExperience = useCreateExperience();
  const updateExperience = useUpdateExperience();
  const isEdit = initialData !== null && initialData !== undefined;

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ExperienceFormValues>({
    mode: "onBlur",
    defaultValues: initialData
      ? {
          company: initialData.company,
          position: initialData.position ?? initialData.title,
          description: Array.from(initialData.bullets ?? []),
          location: initialData.location ?? "",
          employmentType: initialData.employmentType ?? "FULL_TIME",
          startDate: initialData.startDate ?? "",
          endDate: initialData.endDate ?? "",
          isCurrent: initialData.isCurrent ?? false,
          displayOrder: initialData.displayOrder ?? 0,
        }
      : {
          company: "",
          position: "",
          description: [""],
          location: "",
          employmentType: "FULL_TIME",
          startDate: "",
          endDate: "",
          isCurrent: false,
          displayOrder: 0,
        },
  });

  const values = watch();
  const description = values.description ?? [""];

  const addRow = () => {
    setValue("description", [...description, ""], { shouldValidate: true });
  };

  const removeRow = (index: number) => {
    if (description.length <= 1) return;
    setValue(
      "description",
      description.filter((_, i) => i !== index),
      { shouldValidate: true },
    );
  };

  const updateRow = (index: number, value: string) => {
    const updated = [...description];
    updated[index] = value;
    setValue("description", updated, { shouldValidate: true });
  };

  const allFieldsFilled =
    (values.company ?? "").trim().length > 0 &&
    (values.position ?? "").trim().length > 0 &&
    description.some((d) => d.trim().length > 0) &&
    (values.location ?? "").trim().length > 0 &&
    Boolean(values.employmentType) &&
    Boolean(values.startDate) &&
    (Boolean(values.endDate) || Boolean(values.isCurrent)) &&
    Number.isFinite(values.displayOrder);

  const isChanged = isEdit && initialData && (
    (values.company ?? "").trim() !== initialData.company ||
    (values.position ?? "").trim() !== (initialData.position ?? initialData.title) ||
    JSON.stringify(description.map((d) => d.trim()).filter(Boolean)) !==
      JSON.stringify(Array.from(initialData.bullets ?? [])) ||
    (values.location ?? "").trim() !== (initialData.location ?? "") ||
    values.employmentType !== (initialData.employmentType ?? "FULL_TIME") ||
    (values.startDate ?? "") !== (initialData.startDate ?? "") ||
    (values.endDate ?? "") !== (initialData.endDate ?? "") ||
    Boolean(values.isCurrent) !== Boolean(initialData.isCurrent) ||
    toNumber(values.displayOrder) !== (initialData.displayOrder ?? 0)
  );

  const isSubmitDisabled =
    isSubmitting || (isEdit ? !isChanged : !allFieldsFilled);

  const onSubmit: SubmitHandler<ExperienceFormValues> = async (data) => {
    const endDate = (data.endDate ?? "").trim();
    const payload: ExperienceInput = {
      company: (data.company ?? "").trim(),
      position: (data.position ?? "").trim(),
      description: description.map((d) => d.trim()).filter(Boolean),
      location: (data.location ?? "").trim(),
      employmentType: data.employmentType,
      startDate: data.startDate,
      endDate: data.isCurrent && !endDate ? undefined : endDate || undefined,
      isCurrent: Boolean(data.isCurrent),
      displayOrder: Math.round(toNumber(data.displayOrder)),
    };
    try {
      if (isEdit && initialData?.id) {
        await updateExperience.mutateAsync({
          id: initialData.id,
          data: payload,
        });
        toast.success("Experience updated successfully.");
      } else {
        await createExperience.mutateAsync(payload);
        toast.success("Experience created successfully.");
      }
      onClose();
    } catch {
      toast.error(
        isEdit ? "Failed to update experience." : "Failed to create experience.",
      );
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
          {isEdit ? "Edit Experience" : "Add Experience"}
        </h2>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className={labelClass} htmlFor="exp-company">Company</label>
            <input
              id="exp-company"
              type="text"
              placeholder="Acme Corp"
              {...register("company", {
                required: "Company is required",
                maxLength: {
                  value: 180,
                  message: "Company must not exceed 180 characters",
                },
              })}
              aria-invalid={!!errors.company}
              className={fieldClass(!!errors.company)}
            />
            {errors.company && (
              <p className={errorClass}>{errors.company.message}</p>
            )}
          </div>

          <div>
            <label className={labelClass} htmlFor="exp-position">Position</label>
            <input
              id="exp-position"
              type="text"
              placeholder="Senior Backend Engineer"
              {...register("position", {
                required: "Position is required",
                maxLength: {
                  value: 180,
                  message: "Position must not exceed 180 characters",
                },
              })}
              aria-invalid={!!errors.position}
              className={fieldClass(!!errors.position)}
            />
            {errors.position && (
              <p className={errorClass}>{errors.position.message}</p>
            )}
          </div>

          <div className="sm:col-span-2">
            <div className="mb-2 flex items-center justify-between">
              <label className={labelClass}>Description</label>
              <button
                type="button"
                onClick={addRow}
                className="font-mono text-[11px] uppercase tracking-[0.12em] text-accent transition hover:text-accent/80"
              >
                + Add Point
              </button>
            </div>
            <input
              type="hidden"
              {...register("description", {
                validate: () =>
                  description.some((d) => d.trim().length > 0) ||
                  "At least one description point is required",
              })}
            />
            <div className="grid gap-3">
              {description.map((point, index) => (
                <div key={index} className="flex gap-2">
                  <textarea
                    value={point}
                    onChange={(e) => updateRow(index, e.target.value)}
                    rows={2}
                    className={`${fieldClass(!!errors.description)} resize-y`}
                    placeholder="Enter a responsibility or achievement..."
                  />
                  {description.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeRow(index)}
                      className="rounded-sm border border-error px-2 py-1 text-[11px] text-error transition hover:bg-error/10"
                    >
                      ✕
                    </button>
                  )}
                </div>
              ))}
            </div>
            {errors.description && (
              <p className={errorClass}>{errors.description.message}</p>
            )}
          </div>

          <div>
            <label className={labelClass} htmlFor="exp-location">Location</label>
            <input
              id="exp-location"
              type="text"
              placeholder="Remote"
              {...register("location", { required: "Location is required" })}
              aria-invalid={!!errors.location}
              className={fieldClass(!!errors.location)}
            />
            {errors.location && (
              <p className={errorClass}>{errors.location.message}</p>
            )}
          </div>

          <div>
            <label className={labelClass} htmlFor="exp-type">
              Employment Type
            </label>
            <select
              id="exp-type"
              {...register("employmentType", {
                required: "Employment type is required",
              })}
              aria-invalid={!!errors.employmentType}
              className={fieldClass(!!errors.employmentType)}
            >
              {EMPLOYMENT_TYPES.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
            {errors.employmentType && (
              <p className={errorClass}>{errors.employmentType.message}</p>
            )}
          </div>

          <div>
            <label className={labelClass} htmlFor="exp-start">Start Date</label>
            <input
              id="exp-start"
              type="date"
              {...register("startDate", { required: "Start date is required" })}
              aria-invalid={!!errors.startDate}
              className={fieldClass(!!errors.startDate)}
            />
            {errors.startDate && (
              <p className={errorClass}>{errors.startDate.message}</p>
            )}
          </div>

          <div>
            <label className={labelClass} htmlFor="exp-end">End Date</label>
            <input
              id="exp-end"
              type="date"
              disabled={values.isCurrent}
              {...register("endDate", {
                validate: (v) =>
                  values.isCurrent ||
                  (v ?? "").length > 0 ||
                  "End date is required unless currently employed",
              })}
              aria-invalid={!!errors.endDate}
              className={`${fieldClass(!!errors.endDate)} ${
                values.isCurrent ? "cursor-not-allowed opacity-50" : ""
              }`}
            />
            {errors.endDate && (
              <p className={errorClass}>{errors.endDate.message}</p>
            )}
          </div>

          <div className="flex items-end">
            <label className="flex cursor-pointer items-center gap-2.5 pb-3.5">
              <input
                type="checkbox"
                {...register("isCurrent")}
                className="size-4 accent-accent"
              />
              <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-ink-muted">
                Still working here
              </span>
            </label>
          </div>

          <div>
            <label className={labelClass} htmlFor="exp-order">
              Display Order
            </label>
            <input
              id="exp-order"
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
            className="inline-flex items-center gap-2 rounded-sm border border-accent bg-accent px-5 py-2 font-mono text-[12px] uppercase tracking-[0.1em] text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSubmitting && <Loader2 className="size-3.5 animate-spin" />}
            {isEdit ? "Save Changes" : "Create"}
          </button>
        </div>
      </div>
    </form>
  );
}