import { useState } from "react";
import { X, Upload, Loader2 } from "lucide-react";
import { toast } from "react-toastify";
import { useTechnologies } from "../../hooks/useTechnologies";
import { useAboutMeMutations } from "../../hooks/useAboutMeMutations";
import type { AboutMeData } from "../../hooks/useAboutMe";
import { useDebouncedCallback } from "../../lib/useDebouncedCallback";

const inputClass =
  "w-full rounded-sm border border-ink/15 bg-bg-elevated px-3 py-2 text-[14px] text-ink outline-none transition-all duration-300 focus:shadow-[0_0_0_3px_rgba(127,173,173,0.12)] focus:border-accent";
const labelClass =
  "mb-1 block font-mono text-[10px] uppercase tracking-[0.15em] text-ink-soft";

function getInitialTechIds(initialData?: AboutMeData | null): string[] {
  const fromIds = initialData?.technologyIds ?? [];
  const fromTechnologies = initialData?.technologies.map((t) => t.id) ?? [];
  return Array.from(new Set([...fromIds, ...fromTechnologies]));
}

type AboutFormProps = {
  initialData?: AboutMeData | null;
  onClose: () => void;
};

export function AboutForm({ initialData, onClose }: AboutFormProps) {
  const { data: technologies } = useTechnologies();
  const { updateAboutMe, upsertAboutImage } = useAboutMeMutations();

  const [sentences, setSentences] = useState<string[]>(
    initialData?.sentences?.length ? initialData.sentences : [""],
  );
  const [selectedTechIds, setSelectedTechIds] = useState<string[]>(
    getInitialTechIds(initialData),
  );
  const [image, setImage] = useState<string>(initialData?.image ?? "");
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  const debouncedSave = useDebouncedCallback(
    (payload: { sentences: string[]; technologyIds: string[] }) => {
      setSaving(true);
      updateAboutMe.mutate(payload, {
        onSuccess: () => setSaving(false),
        onError: () => setSaving(false),
      });
    },
    500,
  );

  const saveSentences = (next: string[]) => {
    setSentences(next);
    debouncedSave({
      sentences: next.filter((s) => s.trim().length > 0),
      technologyIds: selectedTechIds,
    });
  };

  const toggleTechnology = (id: string) => {
    const next = selectedTechIds.includes(id)
      ? selectedTechIds.filter((tid) => tid !== id)
      : [...selectedTechIds, id];
    setSelectedTechIds(next);
    debouncedSave({
      sentences: sentences.filter((s) => s.trim().length > 0),
      technologyIds: next,
    });
  };

  const addSentence = () => saveSentences([...sentences, ""]);
  const removeSentence = (index: number) => {
    const next = sentences.filter((_, i) => i !== index);
    saveSentences(next.length ? next : [""]);
  };
  const updateSentence = (index: number, value: string) => {
    const next = [...sentences];
    next[index] = value;
    saveSentences(next);
  };

  const handleImageChange = async (file: File) => {
    const formData = new FormData();
    formData.append("image", file);
    setUploading(true);
    try {
      const res = await upsertAboutImage.mutateAsync(formData);
      setImage(res.image);
      toast.success("About image updated successfully.");
    } catch {
      toast.error("Failed to update about image.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="rounded-lg border border-accent/30 bg-bg-elevated/70 p-6">
      <div className="mb-5 flex items-center justify-between">
        <h2 className="font-sans text-[1.1rem] font-extrabold tracking-[-0.03em] text-ink">
          {initialData ? "Edit About" : "Create About"}
        </h2>
        <button
          type="button"
          onClick={onClose}
          className="grid size-8 place-items-center rounded-sm border border-ink/10 text-ink-muted transition hover:border-error hover:bg-error/10 hover:text-error"
          aria-label="Close"
        >
          <X className="size-4" />
        </button>
      </div>

      <div className="grid gap-5">
        <div>
          <label className={labelClass}>Sentences</label>
          <div className="grid gap-3">
            {sentences.map((sentence, index) => (
              <div key={index} className="flex gap-2">
                <textarea
                  value={sentence}
                  onChange={(e) => updateSentence(index, e.target.value)}
                  rows={2}
                  className={`${inputClass} resize-y`}
                  placeholder="Enter a sentence..."
                />
                {sentences.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeSentence(index)}
                    className="rounded-sm border border-error px-2 py-1 text-[11px] text-error transition hover:bg-error/10"
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={addSentence}
            className="mt-2 font-mono text-[11px] uppercase tracking-[0.12em] text-accent transition hover:text-accent/80"
          >
            + Add Sentence
          </button>
        </div>

        <div>
          <label className={labelClass}>Technologies</label>
          <div className="thin-scrollbar mb-3 grid max-h-[200px] gap-2 overflow-y-auto rounded-sm border border-ink/15 bg-bg-elevated p-3">
            {technologies?.map((tech) => (
              <button
                key={tech.id}
                type="button"
                onClick={() => toggleTechnology(tech.id)}
                className={`flex items-center justify-between rounded-sm px-3 py-2 text-[13px] font-mono transition hover:border-accent hover:bg-accent/10 ${
                  selectedTechIds.includes(tech.id)
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
          {selectedTechIds.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {selectedTechIds.map((id) => {
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
          <label className={labelClass}>Image</label>
          <div className="flex items-center gap-3">
            {image && !uploading && (
              <img
                src={image}
                alt="Portrait"
                className="size-16 rounded-sm border border-ink/15 object-cover"
              />
            )}
            <label
              className={`inline-flex cursor-pointer items-center gap-1.5 rounded-sm border border-ink/15 bg-bg-elevated px-3 py-2 font-mono text-[11px] uppercase tracking-[0.1em] text-ink-muted transition hover:border-accent hover:text-accent ${
                uploading ? "pointer-events-none opacity-60" : ""
              }`}
            >
              {uploading ? (
                <>
                  <Loader2 className="size-3.5 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="size-3.5" />
                  {image ? "Replace Image" : "Upload Image"}
                </>
              )}
              <input
                type="file"
                accept="image/*"
                className="hidden"
                disabled={uploading}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleImageChange(file);
                  e.target.value = "";
                }}
              />
            </label>
          </div>
        </div>
      </div>

      {saving && (
        <p className="mt-4 font-mono text-[11px] uppercase tracking-[0.1em] text-accent/70">
          saving…
        </p>
      )}

      <div className="mt-6 flex items-center justify-end">
        <button
          type="button"
          onClick={onClose}
          className="rounded-sm border border-accent bg-accent px-5 py-2 font-mono text-[12px] uppercase tracking-[0.1em] text-white transition hover:opacity-90"
        >
          Done
        </button>
      </div>
    </div>
  );
}
