import { useForm, type SubmitHandler } from "react-hook-form";
import { X, Loader2 } from "lucide-react";
import { toast } from "react-toastify";
import { useCreateHero, useUpdateHero } from "../../hooks/useHeroMutations";
import type { HeroData } from "../../hooks/useHero";

type HeroFormProps = {
  initialData?: HeroData | null;
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

export function HeroForm({ initialData, onClose }: HeroFormProps) {
  const createHeroMutation = useCreateHero();
  const updateHeroMutation = useUpdateHero();
  const isEdit = initialData !== null && initialData !== undefined;

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<HeroData>({
    mode: "onBlur",
    defaultValues: initialData ?? { fullName: "", bio: "", description: "" },
  });

  const values = watch();

  const allFieldsFilled =
    (values.fullName ?? "").trim().length > 0 &&
    (values.bio ?? "").trim().length > 0 &&
    (values.description ?? "").trim().length > 0;

  const isDirty = isEdit && (
    (values.fullName ?? "") !== initialData!.fullName ||
    (values.bio ?? "") !== initialData!.bio ||
    (values.description ?? "") !== initialData!.description
  );

  const isSubmitDisabled = isSubmitting || (!isEdit && !allFieldsFilled) || (isEdit && !isDirty);

  const onSubmit: SubmitHandler<HeroData> = async (data) => {
    try {
      if (isEdit && initialData) {
        await updateHeroMutation.mutateAsync({ ...initialData, ...data });
        toast.success("Hero updated successfully.");
      } else {
        await createHeroMutation.mutateAsync(data);
        toast.success("Hero created successfully.");
      }
      onClose();
    } catch {
      toast.error(isEdit ? "Failed to update hero." : "Failed to create hero.");
    }
  };

  return (
    <form
      className="fixed inset-0 z-[110] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      onSubmit={handleSubmit(onSubmit)}
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-[480px] rounded-lg border border-ink/10 bg-bg-elevated p-8 shadow-[0_20px_60px_rgba(26,31,36,0.2)]"
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
          {isEdit ? "Edit Hero" : "Create Hero"}
        </h2>

        <div className="grid gap-5">
          <div>
            <label className={labelClass} htmlFor="hero-fullName">Full Name</label>
            <input
              id="hero-fullName"
              type="text"
              placeholder="Jane Doe"
              {...register("fullName", { required: "Full name is required" })}
              aria-invalid={!!errors.fullName}
              className={fieldClass(!!errors.fullName)}
            />
            {errors.fullName && <p className={errorClass}>{errors.fullName.message}</p>}
          </div>

          <div>
            <label className={labelClass} htmlFor="hero-bio">Bio</label>
            <input
              id="hero-bio"
              type="text"
              placeholder="I build things."
              {...register("bio", { required: "Bio is required" })}
              aria-invalid={!!errors.bio}
              className={fieldClass(!!errors.bio)}
            />
            {errors.bio && <p className={errorClass}>{errors.bio.message}</p>}
          </div>

          <div>
            <label className={labelClass} htmlFor="hero-description">Description</label>
            <textarea
              id="hero-description"
              placeholder="A longer description."
              rows={4}
              {...register("description", {
                required: "Description is required",
                maxLength: {
                  value: 250,
                  message: "Description must not exceed 250 characters",
                },
              })}
              aria-invalid={!!errors.description}
              className={`${fieldClass(!!errors.description)} resize-y`}
            />
            {errors.description && <p className={errorClass}>{errors.description.message}</p>}
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