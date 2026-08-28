import { useMemo, useState, useEffect } from "react";
import { toast } from "react-toastify";
import { SectionHeading } from "../SectionHeading";
import { AdminSectionActions } from "../admin/AdminSectionActions";
import { DataSourceTag } from "../admin/DataSourceTag";
import { Reveal } from "../Reveal";
import { FeaturedService } from "./FeaturedService";
import { ServiceCard } from "./ServiceCard";
import { ServiceForm } from "./ServiceForm";
import { SERVICES, FEATURED_SERVICE, type Service } from "./servicesData";
import { useServices, toService } from "../../hooks/useServices";
import {
  useServicesMutations,
  DEFAULT_SERVICE_BODY,
  type ServicePatch,
} from "../../hooks/useServicesMutations";
import { useAuth } from "../../hooks/useAuth";
import { useDebouncedCallback } from "../../lib/useDebouncedCallback";

function buildServicePayload(s: Service): ServicePatch {
  return {
    title: s.title,
    description: s.description,
    icon: s.iconName,
    number: s.number,
    category: s.category,
    color: s.color,
    emphasis: s.emphasis,
    technologies: s.technologies,
    groups: s.groups,
    highlights: s.highlights,
    displayOrder: s.displayOrder,
    isFeatured: s.isFeatured,
  };
}

export function ServicesSection() {
  const { data } = useServices();
  const { isAdmin } = useAuth();
  const { updateService, createService, deleteService } =
    useServicesMutations();

  const [editMode, setEditMode] = useState(false);
  const [draftServices, setDraftServices] = useState<Service[] | null>(null);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);

  const serverServices = (data && data.length > 0 ? data : SERVICES) as Service[];
  const hasServerData = Boolean(data && data.length > 0);
  const services = editMode
    ? (draftServices ?? serverServices)
    : serverServices;

  useEffect(() => {
    if (editMode && draftServices === null) {
      setDraftServices(serverServices);
    } else if (!editMode) {
      setDraftServices(null);
    }
  }, [editMode, serverServices]);

  const debouncedSave = useDebouncedCallback(
    (id: string, patch: ServicePatch) => {
      updateService.mutate({ id, patch });
    },
    500,
  );

  const handleServiceChange = (index: number, patch: Partial<Service>) => {
    const base = draftServices ?? serverServices;
    const next = base.map((s, i) => (i === index ? { ...s, ...patch } : s));
    setDraftServices(next);
    const id = next[index].id;
    debouncedSave(id, buildServicePayload(next[index]));
  };

  const handleAdd = async () => {
    try {
      const created = (await createService.mutateAsync(
        DEFAULT_SERVICE_BODY,
      )) as Parameters<typeof toService>[0];
      toast.success("Service created successfully.");
      setEditMode(true);
      if (created) {
        setDraftServices((prev) => [
          ...(prev ?? serverServices),
          toService(created),
        ]);
      }
    } catch {
      /* error toast handled in mutation */
    }
  };

  const handleDelete = (id: string) => {
    setPendingDeleteId(id);
  };

  const confirmDelete = async () => {
    const id = pendingDeleteId;
    if (!id) return;
    setPendingDeleteId(null);
    setDraftServices((prev) =>
      prev ? prev.filter((s) => s.id !== id) : prev,
    );
    try {
      await deleteService.mutateAsync(id);
      toast.success("Service deleted successfully.");
    } catch {
      /* error toast handled in mutation */
    }
  };

  const featured: Service = useMemo(() => {
    if (!services || services.length === 0) return FEATURED_SERVICE;
    return (
      services.find((s) => s.isFeatured && s.title && s.description) ??
      services.find((s) => s.isFeatured) ??
      services[0]
    );
  }, [services]);

  const gridServices = useMemo(
    () => services.filter((s) => s.id !== featured?.id),
    [services, featured],
  );

  return (
    <section
      className="scroll-mt-20 px-5 py-[72px] md:px-0 md:py-[100px]"
      id="services"
    >
      <div className="mx-auto w-full max-w-[1000px] md:w-[min(100%-10rem,1000px)]">
        <Reveal>
          <div className="mb-7 flex flex-wrap items-center justify-between gap-4 md:mb-10">
            <SectionHeading number="06." title="Services" className="mb-0" />
            {isAdmin && (
              <AdminSectionActions
                section="services"
                onCreate={handleAdd}
                onUpdate={() => setEditMode((v) => !v)}
                isCreatePending={createService.isPending}
              />
            )}
          </div>
        </Reveal>

        {isAdmin && (
          <DataSourceTag hasServerData={hasServerData} className="mb-4 block" />
        )}

        <Reveal delay={0.05}>
          <p className="mx-auto mb-10 max-w-[520px] text-[17px] leading-[1.8] text-ink-muted md:text-body">
            What I can build for you.
          </p>
        </Reveal>

        {updateService.isPending && editMode && (
          <p className="mb-4 font-mono text-[11px] uppercase tracking-[0.1em] text-accent/70">
            saving…
          </p>
        )}

        {editMode ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service, index) => (
              <ServiceForm
                key={service.id}
                service={service}
                onChange={(patch) => handleServiceChange(index, patch)}
                onDelete={() => handleDelete(service.id)}
              />
            ))}
          </div>
        ) : (
          <>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <Reveal delay={0.1} className="sm:[grid-column:1_/-1]">
                <FeaturedService service={featured} />
              </Reveal>

              {gridServices.map((service, index) => (
                <Reveal key={service.id} delay={0.15 + index * 0.05}>
                  <ServiceCard service={service} />
                </Reveal>
              ))}
            </div>

            <Reveal delay={0.5}>
              <div className="mt-12 border-t border-ink/10 pt-10 text-center">
                <p className="mb-5 font-sans text-[1.5rem] font-bold tracking-[-0.01em] text-ink">
                  Have a project in mind?
                </p>
                <a
                  href="#contact"
                  data-cursor="hover"
                  className="inline-flex items-center justify-center rounded-sm border border-ink bg-white px-8 py-3.5 font-mono text-[12px] uppercase tracking-[0.1em] text-ink transition-all duration-300 hover:-translate-y-0.5 hover:border-accent hover:bg-accent/10 hover:shadow-[0_8px_25px_-10px_rgba(127,173,173,0.35)]"
                >
                  Let's Work Together
                </a>
              </div>
            </Reveal>
          </>
        )}
      </div>

      {pendingDeleteId && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-[400px] rounded-lg border border-ink/10 bg-bg-elevated p-8 shadow-[0_20px_60px_rgba(26,31,36,0.2)]">
            <h2 className="mb-2 font-sans text-[1.25rem] font-extrabold tracking-[-0.03em] text-ink">
              Delete Service
            </h2>
            <p className="mb-6 font-mono text-[13px] text-ink-muted">
              Are you sure you want to delete this service? This action cannot be
              undone.
            </p>
            <div className="flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setPendingDeleteId(null)}
                className="rounded-sm border border-ink px-5 py-2 font-mono text-[12px] uppercase tracking-[0.1em] text-ink transition hover:border-accent hover:bg-accent/10"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                disabled={deleteService.isPending}
                className="rounded-sm border border-error bg-error px-5 py-2 font-mono text-[12px] uppercase tracking-[0.1em] text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {deleteService.isPending ? "Deleting…" : "Confirm"}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
