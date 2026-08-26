import { Reveal } from '../Reveal'
import { SectionHeading } from '../SectionHeading'

type Project = {
  title: string
  description: string
  tech: readonly string[]
  github: string
  external: string
  image: string
}

type ProjectsProps = {
  projects: readonly Project[]
}

function IconGitHub() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true" className="size-full">
      <path d="M9 19c-4.3 1.4-4.3-2.1-6-2.5m12 5v-3.4c0-.9-.3-1.6-.8-2 2.8-.3 5.7-1.4 5.7-6.2 0-1.4-.5-2.5-1.3-3.4.1-.3.6-1.7-.1-3.4 0 0-1.1-.3-3.5 1.3a12 12 0 0 0-6.2 0C6.8 2.5 5.7 2.8 5.7 2.8c-.7 1.7-.2 3.1-.1 3.4-.8.9-1.3 2-1.3 3.4 0 4.8 2.9 5.9 5.7 6.2-.4.3-.7.9-.8 1.7V22" />
    </svg>
  )
}

function IconExternal() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true" className="size-full">
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
      <polyline points="15 3 21 3 21 9" />
      <line x1="10" y1="14" x2="21" y2="3" />
    </svg>
  )
}

export function Projects({ projects }: ProjectsProps) {
  return (
    <section className="scroll-mt-20 px-5 py-[72px] md:px-0 md:py-[100px]" id="work">
      <div className="mx-auto w-full max-w-[1000px] md:w-[min(100%-10rem,1000px)]">
        <Reveal>
          <SectionHeading number="05." title="Some Projects I've Built" />
        </Reveal>

        <div className="flex flex-col gap-6 md:gap-24">
          {projects.map((project, index) => {
            const reversed = index % 2 === 1

            return (
              <Reveal key={project.title} delay={0.05 * index}>
                {/* Mobile card */}
                <article className="relative grid min-h-[400px] overflow-hidden bg-project rounded-sm md:hidden">
                  <div className="absolute inset-0">
                    <div className="grid size-full place-items-center bg-[radial-gradient(circle_at_20%_20%,rgba(127,173,173,0.35),transparent_45%),radial-gradient(circle_at_80%_70%,rgba(90,120,140,0.4),transparent_40%),linear-gradient(145deg,#243038,#13181d)] font-mono text-[13px] uppercase tracking-[0.08em] text-white/35">
                      {project.image}
                    </div>
                  </div>
                  <div className="relative z-[2] flex min-h-[400px] flex-col justify-end gap-4 bg-linear-to-b from-black/40 via-black/80 to-[#101418]/95 p-6">
                    <p className="font-mono text-label text-accent">Featured Project</p>
                    <h3 className="font-sans text-[clamp(1.25rem,2.5vw,1.65rem)] font-bold text-bg-elevated">
                      {project.title}
                    </h3>
                    <p className="rounded-sm bg-ink/60 p-4 text-[0.92rem] leading-[1.65] text-bg-elevated/80 backdrop-blur-sm">
                      {project.description}
                    </p>
                    <ul className="flex flex-wrap gap-x-4 gap-y-2 font-mono text-[12px] text-ink-soft">
                      {project.tech.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                    <div className="flex gap-4">
                      <a
                        href={project.github}
                        target="_blank"
                        rel="noreferrer"
                        aria-label="GitHub"
                        className="grid size-[22px] place-items-center text-bg-elevated transition-colors duration-200 hover:text-accent"
                      >
                        <IconGitHub />
                      </a>
                      <a
                        href={project.external}
                        target="_blank"
                        rel="noreferrer"
                        aria-label="Live site"
                        className="grid size-[22px] place-items-center text-bg-elevated transition-colors duration-200 hover:text-accent"
                      >
                        <IconExternal />
                      </a>
                    </div>
                  </div>
                </article>

                {/* Desktop featured layout + hover */}
                <article className="group relative hidden md:grid md:grid-cols-12 md:items-center">
                  {/* Image */}
                  <div
                    className={`relative col-span-7 row-start-1 aspect-video overflow-hidden rounded-sm shadow-[0_15px_40px_-15px_rgba(26,31,36,0.35)] ${
                      reversed ? 'col-start-6' : 'col-start-1'
                    }`}
                  >
                    <div className="relative size-full transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-y-1 group-hover:shadow-[0_20px_50px_-20px_rgba(26,31,36,0.4)]">
                      <div className="grid size-full place-items-center bg-[radial-gradient(circle_at_20%_20%,rgba(127,173,173,0.35),transparent_45%),radial-gradient(circle_at_80%_70%,rgba(90,120,140,0.4),transparent_40%),linear-gradient(145deg,#243038,#13181d)] font-mono text-[13px] uppercase tracking-[0.08em] text-white/40 transition-all duration-500 group-hover:text-white/55">
                        {project.image}
                      </div>

                      {/* Teal tint — fades on hover to reveal image clearly */}
                      <div
                        className="pointer-events-none absolute inset-0 bg-accent/50 mix-blend-multiply transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:bg-transparent group-hover:opacity-0"
                        aria-hidden="true"
                      />
                      <div
                        className="pointer-events-none absolute inset-0 bg-bg/15 transition-all duration-500 group-hover:opacity-0"
                        aria-hidden="true"
                      />
                    </div>
                  </div>

                  {/* Content */}
                  <div
                    className={`relative z-[3] col-span-6 row-start-1 flex flex-col gap-4 ${
                      reversed
                        ? 'col-start-1 items-start text-left'
                        : 'col-start-7 items-end text-right'
                    }`}
                  >
                    <p className="font-mono text-[13px] tracking-wide text-accent">Featured Project</p>

                    <h3 className="font-sans text-[clamp(1.35rem,2.4vw,1.75rem)] font-bold text-ink transition-colors duration-300 group-hover:text-accent">
                      <a href={project.external} target="_blank" rel="noreferrer">
                        {project.title}
                      </a>
                    </h3>

                    {/* Overlapping teal description — lifts slightly on hover */}
                    <p
                      className={`relative z-[4] w-full max-w-[460px] rounded-sm bg-accent-soft px-6 py-5 text-[0.95rem] leading-[1.7] text-ink shadow-[0_12px_35px_-15px_rgba(26,31,36,0.3)] backdrop-blur-[2px] transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-y-1 group-hover:bg-[rgba(127,173,173,0.88)] group-hover:shadow-[0_18px_45px_-18px_rgba(26,31,36,0.38)] ${
                        reversed ? '-mr-8' : '-ml-8'
                      }`}
                    >
                      {project.description}
                    </p>

                    <ul
                      className={`flex flex-wrap gap-x-4 gap-y-2 font-mono text-[12px] text-ink-muted ${
                        reversed ? 'justify-start' : 'justify-end'
                      }`}
                    >
                      {project.tech.map((item) => (
                        <li key={item} className="transition-colors duration-300 group-hover:text-ink">
                          {item}
                        </li>
                      ))}
                    </ul>

                    <div className="flex gap-4">
                      <a
                        href={project.github}
                        target="_blank"
                        rel="noreferrer"
                        aria-label="GitHub"
                        className="grid size-[22px] place-items-center text-ink transition-all duration-200 hover:-translate-y-0.5 hover:text-accent"
                      >
                        <IconGitHub />
                      </a>
                      <a
                        href={project.external}
                        target="_blank"
                        rel="noreferrer"
                        aria-label="Live site"
                        className="grid size-[22px] place-items-center text-ink transition-all duration-200 hover:-translate-y-0.5 hover:text-accent"
                      >
                        <IconExternal />
                      </a>
                    </div>
                  </div>
                </article>
              </Reveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}
