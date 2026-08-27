import { useState } from "react";
import { ChevronDown } from "lucide-react";
import type { Service } from "./servicesData";

type ServiceCardProps = {
  service: Service;
};

export function ServiceCard({ service }: ServiceCardProps) {
  const [expanded, setExpanded] = useState(false);
  const Icon = service.icon;
  const detailsId = `service-details-${service.id}`;
  const isCompact = service.emphasis === "compact";
  const isDetail = service.emphasis === "detail";

  return (
    <article
      className="group relative flex h-full w-full flex-col overflow-hidden border border-ink/10 bg-bg-elevated/60 p-5 transition-all duration-300 rounded-sm hover:-translate-y-1 hover:border-accent/50 hover:bg-accent/[0.04] hover:shadow-[0_16px_32px_-20px_rgba(69,110,110,0.28)]"
      data-cursor="hover"
    >
      {isCompact ? (
        <>
          <span
            aria-hidden="true"
            className="pointer-events-none absolute -right-2 -top-4 select-none font-mono text-[4.5rem] font-medium leading-none text-ink/[0.05]"
          >
            {service.number}
          </span>

          <div className="relative flex w-full min-h-[82px] flex-1 flex-col">
            <div className="mb-3 flex items-center gap-3">
              <span
                className="grid size-9 shrink-0 place-items-center rounded-sm border border-ink/10 bg-bg text-ink transition-all duration-300 group-hover:border-accent/40 group-hover:-rotate-3 group-hover:scale-105 group-hover:text-accent"
                aria-hidden="true"
              >
                <Icon size={17} strokeWidth={1.7} />
              </span>
              <span
                className="size-1.5 rounded-full"
                style={{ backgroundColor: service.color }}
                aria-hidden="true"
              />
            </div>

            <h3 className="mb-3 font-sans text-[1rem] font-bold leading-snug text-ink">
              {service.title}
            </h3>

            <ul
              className="mt-auto flex flex-wrap gap-1.5"
              aria-label={`${service.title} technologies`}
            >
              {service.technologies.map((tech) => (
                <li
                  key={tech}
                  className="rounded-sm border border-ink/10 bg-bg px-2 py-0.5 font-mono text-[10px] text-ink-soft transition-colors duration-300 group-hover:border-accent/25 group-hover:text-ink-muted"
                >
                  {tech}
                </li>
              ))}
            </ul>
          </div>
        </>
      ) : (
        <>
          <div className="relative flex w-full flex-1 flex-col">
            <div className="mb-4 flex items-center justify-between">
              <span
                className="grid size-10 place-items-center rounded-sm border border-ink/10 bg-bg text-ink transition-all duration-300 group-hover:border-accent/40 group-hover:-rotate-3 group-hover:scale-105 group-hover:text-accent"
                aria-hidden="true"
              >
                <Icon size={19} strokeWidth={1.7} />
              </span>
              <span className="font-mono text-[10px] tracking-[0.15em] text-ink-soft">
                {service.number}
              </span>
            </div>

            <div className="mb-1.5 flex items-center gap-2">
              <span
                className="size-1.5 rounded-full"
                style={{ backgroundColor: service.color }}
                aria-hidden="true"
              />
              <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-soft">
                {service.category}
              </span>
            </div>

            <h3 className="mb-2 font-sans text-[1.05rem] font-bold leading-snug text-ink">
              {service.title}
            </h3>

            <p className="mb-4 text-[14px] leading-[1.7] text-ink-muted">
              {service.description}
            </p>

            {isDetail ? (
              <ul
                className="mb-4 space-y-2 border-t border-ink/10 pt-4"
                aria-label={`${service.title} highlights`}
              >
                {service.highlights?.map((highlight) => (
                  <li
                    key={highlight}
                    className="relative pl-4 text-[13px] leading-[1.6] text-ink-muted before:absolute before:left-0 before:top-[8px] before:text-[9px] before:text-accent before:content-['▸']"
                  >
                    {highlight}
                  </li>
                ))}
              </ul>
            ) : (
              <button
                type="button"
                id={`service-toggle-${service.id}`}
                aria-expanded={expanded}
                aria-controls={detailsId}
                onClick={() => setExpanded((value) => !value)}
                className="mt-auto mb-4 inline-flex items-center gap-1.5 self-start font-mono text-[11px] tracking-wide text-accent transition-colors duration-200 hover:text-ink rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent cursor-pointer"
              >
                {expanded ? "Less" : "More"}
                <ChevronDown
                  size={13}
                  strokeWidth={2}
                  aria-hidden="true"
                  className={`transition-transform duration-300 ${expanded ? "rotate-180" : ""}`}
                />
              </button>
            )}

            <ul
              className={`flex flex-wrap gap-1.5 ${isDetail ? "mt-auto" : ""}`}
              aria-label={`${service.title} technologies`}
            >
              {service.technologies.map((tech) => (
                <li
                  key={tech}
                  className="rounded-sm border border-ink/10 bg-bg px-2 py-0.5 font-mono text-[10px] text-ink-soft transition-colors duration-300 group-hover:border-accent/25 group-hover:text-ink-muted"
                >
                  {tech}
                </li>
              ))}
            </ul>

            {!isDetail && (
              <div
                id={detailsId}
                className={`grid transition-all duration-300 ease-out ${
                  expanded ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                }`}
              >
                <div className="overflow-hidden">
                  <ul className="mt-3 space-y-2 border-t border-ink/10 pt-3">
                    {service.details?.map((detail) => (
                      <li
                        key={detail}
                        className="relative pl-4 text-[13px] leading-[1.6] text-ink-muted before:absolute before:left-0 before:top-[8px] before:text-[9px] before:text-accent before:content-['▸']"
                      >
                        {detail}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </article>
  );
}