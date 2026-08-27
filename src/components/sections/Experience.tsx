import { useRef, useState } from 'react'
import { Reveal } from '../Reveal'
import { SectionHeading } from '../SectionHeading'
import { useExperience } from '../../hooks/useExperience'
import { useGSAP } from '../../lib/gsap'

declare const gsap: any

export type Job = {
  id?: string
  company: string
  title: string
  range: string
  url: string
  bullets: readonly string[]
}

type ExperienceProps = {
  jobs: readonly Job[]
}

export function Experience({ jobs }: ExperienceProps) {
  const { data: experienceData } = useExperience()
  const allJobs = experienceData ?? jobs
  const [active, setActive] = useState(0)
  const job = allJobs[active]
  const panelRef = useRef<HTMLDivElement>(null)
  const tabsRef = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    const el = tabsRef.current
    if (!el) return
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const tabs = el.querySelectorAll('[role="tab"]')
    if (reduced) {
      gsap.set(tabs, { autoAlpha: 1, y: 0 })
      return
    }
    gsap.from(tabs, {
      autoAlpha: 0,
      y: 12,
      duration: 0.45,
      stagger: 0.06,
      ease: 'power2.out',
    })
  }, [])

  useGSAP(() => {
    if (!panelRef.current) return
    gsap.fromTo(
      panelRef.current.children,
      { autoAlpha: 0, y: 15 },
      {
        autoAlpha: 1,
        y: 0,
        duration: 0.4,
        stagger: 0.06,
        ease: 'power2.out',
      },
    )
  }, [active])

  return (
    <section className="scroll-mt-20 px-5 py-[72px] md:px-0 md:py-[100px]" id="experience">
      <div className="mx-auto w-full max-w-[1000px] md:w-[min(100%-10rem,1000px)]">
        <Reveal>
          <SectionHeading number="04." title="Experience History" />
        </Reveal>

        <Reveal delay={0.1}>
          <div className="grid gap-6 md:grid-cols-[200px_1fr] md:gap-8">
            <div
              ref={tabsRef}
              className="flex overflow-x-auto border-b border-ink-muted/30 [-ms-overflow-style:none] [scrollbar-width:none] md:flex-col md:overflow-visible md:border-b-0 md:border-l-2 md:border-ink-muted/15"
              role="tablist"
              aria-label="Companies"
            >
              {allJobs.map((item, index) => (
                <button
                  key={item.id ?? `${item.company}-${index}`}
                  type="button"
                  role="tab"
                  aria-selected={index === active}
                  className={`shrink-0 whitespace-nowrap border-b-2 px-4 py-3 font-mono text-[12px] tracking-wide transition-all duration-300 md:border-b-0 md:border-l-2 md:text-left ${
                    index === active
                      ? 'border-accent bg-accent/8 text-ink md:ml-[-2px]'
                      : 'border-transparent text-ink-muted hover:bg-accent/5 hover:text-ink md:ml-[-2px]'
                  }`}
                  onClick={() => setActive(index)}
                >
                  {item.company}
                </button>
              ))}
            </div>

            <div ref={panelRef} role="tabpanel" className="min-h-[280px]">
              <h3 className="mb-2 font-sans text-[1.25rem] font-bold text-ink">
                {job.title}{' '}
                {job.url ? (
                  <a
                    href={job.url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-accent transition-colors duration-200 hover:underline decoration-accent/40 underline-offset-4"
                  >
                    @ {job.company}
                  </a>
                ) : (
                  <span className="text-accent">@ {job.company}</span>
                )}
              </h3>
              <p className="mb-6 font-mono text-[13px] text-ink-soft">{job.range}</p>
              <ul className="space-y-4">
                {job.bullets.map((bullet) => (
                  <li
                    key={bullet}
                    className="relative max-w-[580px] pl-5 text-[17px] leading-[1.75] text-ink-muted before:absolute before:left-0 before:top-[9px] before:text-[11px] before:text-accent before:content-['▸'] md:text-body"
                  >
                    {bullet}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

