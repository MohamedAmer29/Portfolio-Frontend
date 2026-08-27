import type { Service } from "./servicesData";

export function FeaturedService({ service }: { service: Service }) {
  const Icon = service.icon;

  return (
    <div
      className="group relative flex h-full w-full flex-col overflow-hidden rounded-sm border border-accent/30 bg-gradient-to-br from-accent/[0.06] via-bg-elevated/80 to-bg-elevated/40 p-6 transition-all duration-300 hover:border-accent/50 hover:shadow-[0_20px_45px_-24px_rgba(69,110,110,0.4)] md:p-7"
      data-cursor="hover"
    >
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -right-4 -top-8 select-none font-mono text-[7rem] font-medium leading-none text-ink/[0.045] md:text-[8.5rem]"
      >
        {service.number}
      </span>

      <div className="relative flex flex-1 flex-col">
        <div className="mb-3 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.18em] text-ink-soft">
          <span aria-hidden="true" className="h-px w-6 bg-accent/60" />
          Featured service
        </div>

        <div className="mb-4 flex items-start gap-3">
          <span
            className="grid size-10 shrink-0 place-items-center rounded-sm border border-accent/30 bg-bg text-accent transition-transform duration-300 group-hover:scale-105 group-hover:-rotate-3"
            aria-hidden="true"
          >
            <Icon size={20} strokeWidth={1.6} />
          </span>
          <h3 className="font-sans text-[1.3rem] font-extrabold leading-tight tracking-[-0.02em] text-ink">
            {service.title}
          </h3>
        </div>

        <p className="text-[13.5px] leading-[1.7] text-ink-muted">
          {service.description}
        </p>

        {service.highlights && (
          <ul className="mt-5 space-y-2 border-t border-accent/15 pt-4">
            {service.highlights.map((highlight) => (
              <li
                key={highlight}
                className="relative pl-4 text-[12.5px] leading-[1.6] text-ink-muted before:absolute before:left-0 before:top-[8px] before:text-[9px] before:text-accent before:content-['▸']"
              >
                {highlight}
              </li>
            ))}
          </ul>
        )}

        {service.groups && (
          <dl className="mt-auto grid grid-cols-2 gap-4 pt-7">
            {service.groups.map((group) => (
              <div key={group.label}>
                <dt className="mb-2 font-mono text-[9px] uppercase tracking-[0.16em] text-ink-soft">
                  {group.label}
                </dt>
                <dd className="flex flex-wrap gap-1.5">
                  {group.items.map((item) => (
                    <span
                      key={item}
                      className="rounded-sm border border-ink/10 bg-bg px-1.5 py-0.5 font-mono text-[9.5px] text-ink-soft transition-colors duration-300 group-hover:border-accent/25 group-hover:text-ink-muted"
                    >
                      {item}
                    </span>
                  ))}
                </dd>
              </div>
            ))}
          </dl>
        )}
      </div>
    </div>
  );
}