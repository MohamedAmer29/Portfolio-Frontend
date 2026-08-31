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

  const hasHighlights = Boolean(service.highlights?.length);
  const hasDetails = Boolean(service.details?.length);
  const hasExpandable = hasHighlights || hasDetails;

  return (
    <article
      className="group relative flex h-full w-full flex-col overflow-hidden border border-ink/10 bg-bg-elevated/60 p-5 transition-all duration-300 rounded-sm hover:-translate-y-1 hover:border-accent/50 hover:bg-accent/[0.04] hover:shadow-[0_16px_32px_-20px_rgba(69,110,110,0.28)]"
      data-cursor="hover"
    >
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -right-2 -top-4 select-none font-mono text-[4.5rem] font-medium leading-none text-ink/[0.05]"
      >
        {service.number}
      </span>

      <div className="relative flex w-full flex-1 flex-col">
        {isCompact ? (
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
        ) : (
          <>
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
          </>
        )}

        <h3
          className={`font-sans font-bold leading-snug text-ink ${
            isCompact ? "mb-2 text-[1rem]" : "mb-2 text-[1.05rem]"
          }`}
        >
          {service.title}
        </h3>

        <p
          className={`text-ink-muted ${
            isCompact
              ? "mb-3 text-[12.5px] leading-[1.65]"
              : "mb-4 text-[14px] leading-[1.7]"
          }`}
        >
          {service.description}
        </p>

        {hasExpandable && (
          <>
            <button
              type="button"
              id={`service-toggle-${service.id}`}
              aria-expanded={expanded}
              aria-controls={detailsId}
              onClick={() => setExpanded((v) => !v)}
              className={`inline-flex items-center gap-1.5 self-start font-mono tracking-wide text-accent transition-colors duration-200 hover:text-ink rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent cursor-pointer ${
                isCompact ? "mb-3 text-[10px]" : "mb-4 text-[11px]"
              }`}
            >
              {expanded ? "Less" : "More"}
              <ChevronDown
                size={isCompact ? 11 : 13}
                strokeWidth={2}
                aria-hidden="true"
                className={`transition-transform duration-300 ${
                  expanded ? "rotate-180" : ""
                }`}
              />
            </button>

            <div
              id={detailsId}
              className={`grid transition-all duration-300 ease-out ${
                expanded ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
              }`}
            >
              <div className="overflow-hidden">
                {hasHighlights && (
                  <ul
                    className={`space-y-2 ${
                      hasDetails ? "border-b border-ink/10 pb-3 mb-3" : ""
                    }`}
                    aria-label={`${service.title} highlights`}
                  >
                    {service.highlights!.map((highlight) => (
                      <li
                        key={highlight}
                        className={`relative pl-4 text-ink-muted before:absolute before:left-0 before:top-[8px] before:text-[9px] before:text-accent before:content-['▸'] ${
                          isCompact
                            ? "text-[11.5px] leading-[1.55]"
                            : "text-[13px] leading-[1.6]"
                        }`}
                      >
                        {highlight}
                      </li>
                    ))}
                  </ul>
                )}

                {hasDetails && (
                  <ul
                    className="space-y-2"
                    aria-label={`${service.title} details`}
                  >
                    {service.details!.map((detail) => (
                      <li
                        key={detail}
                        className={`relative pl-4 text-ink-muted before:absolute before:left-0 before:top-[8px] before:text-[9px] before:text-accent before:content-['▸'] ${
                          isCompact
                            ? "text-[11.5px] leading-[1.55]"
                            : "text-[13px] leading-[1.6]"
                        }`}
                      >
                        {detail}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </>
        )}

        <ul
          className={`mt-auto flex flex-wrap gap-1.5 ${
            isCompact ? "pt-0" : "pt-0"
          }`}
          aria-label={`${service.title} technologies`}
        >
          {service.technologies.map((tech) => (
            <li
              key={tech}
              className={`rounded-sm border border-ink/10 bg-bg px-2 py-0.5 font-mono text-ink-soft transition-colors duration-300 group-hover:border-accent/25 group-hover:text-ink-muted ${
                isCompact ? "text-[9px]" : "text-[10px]"
              }`}
            >
              {tech}
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
}