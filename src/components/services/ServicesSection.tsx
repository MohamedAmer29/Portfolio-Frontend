import { useMemo } from "react";
import { SectionHeading } from "../SectionHeading";
import { Reveal } from "../Reveal";
import { FeaturedService } from "./FeaturedService";
import { ServiceCard } from "./ServiceCard";
import { SERVICES, FEATURED_SERVICE, type Service } from "./servicesData";
import { useServices } from "../../hooks/useServices";

export function ServicesSection() {
  const { data } = useServices();

  const services = data ?? SERVICES;

  const featured: Service = useMemo(() => {
    if (!data) return FEATURED_SERVICE;
    return (
      services.find((s) => s.isFeatured && s.title && s.description) ??
      services.find((s) => s.isFeatured) ??
      services[0]
    );
  }, [data, services]);

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
          <SectionHeading number="06." title="Services" />
        </Reveal>

        <Reveal delay={0.05}>
          <p className="mx-auto mb-10 max-w-[520px] text-[17px] leading-[1.8] text-ink-muted md:text-body">
            What I can build for you.
          </p>
        </Reveal>

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
      </div>
    </section>
  );
}
