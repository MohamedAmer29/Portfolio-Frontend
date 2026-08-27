import { motion } from 'framer-motion'
import { Reveal } from '../Reveal'
import { SectionHeading } from '../SectionHeading'
import { useProjects } from '../../hooks/useProjects'

export type Project = {
  title: string
  slug?: string
  shortDescription?: string
  description: string
  image: string | null
  githubUrl?: string | null
  liveUrl?: string | null
  featured?: boolean
  status?: string | null
  displayOrder?: number
  startDate?: string | null
  endDate?: string | null
  technologies?: readonly { name: string; category?: string; icon?: string | null }[]
  tech: readonly string[]
  github: string
  external: string
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
  const { data: projectsData } = useProjects()
  const allProjects = projectsData ?? projects

  return (
    <section className="scroll-mt-20 px-5 py-[72px] md:px-0 md:py-[100px]" id="work">
      <div className="mx-auto w-full max-w-[1000px] md:w-[min(100%-10rem,1000px)]">
        <Reveal>
          <SectionHeading number="05." title="Some Projects I've Built" />
        </Reveal>

        <div className="flex flex-col gap-6 md:gap-24">
          {allProjects.map((project, index) => {
            const reversed = index % 2 === 1
            const imgSrc =
              project.image && project.image.startsWith('http')
                ? project.image
                : null
            const imageLabel = project.image ?? project.status ?? ''
            const techItems =
              project.technologies && project.technologies.length > 0
                ? project.technologies.map((t) => t.name)
                : project.tech
            const orderLabel = String(project.displayOrder ?? index + 1).padStart(
              2,
              '0',
            )
            const dateRange =
              project.startDate || project.endDate
                ? `${project.startDate ?? ''}${project.startDate && project.endDate ? ' — ' : ''}${project.endDate ?? ''}`
                : null

            return (
              <Reveal key={project.title} delay={0.05 * index}>
                {/* Mobile card */}
                <article className="relative grid min-h-[360px] overflow-hidden bg-project rounded-lg md:hidden">
                  <div className="absolute inset-0">
                    {imgSrc ? (
                      <motion.img
                        src={imgSrc}
                        alt={project.title}
                        className="size-full object-cover"
                        initial={{ opacity: 0, scale: 1.05 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                      />
                    ) : (
                      <div className="grid size-full place-items-center bg-[radial-gradient(circle_at_20%_20%,rgba(127,173,173,0.35),transparent_45%),radial-gradient(circle_at_80%_70%,rgba(90,120,140,0.4),transparent_40%),linear-gradient(145deg,#243038,#13181d)] font-mono text-[13px] uppercase tracking-[0.08em] text-white/35">
                        {imageLabel}
                      </div>
                    )}
                  </div>
                  <div className="relative z-[2] flex min-h-[360px] flex-col justify-end gap-3 bg-gradient-to-t from-[#0e1216] via-[#0e1216]/90 to-transparent p-5">
                    <p className="font-mono text-[11px] text-accent">
                      {orderLabel} ·{' '}
                      {project.featured ? 'Featured Project' : project.status || 'Project'}
                    </p>
                    <h3 className="font-sans text-[1.35rem] font-bold leading-tight text-white">
                      {project.title}
                    </h3>
                    {project.slug && (
                      <p className="font-mono text-[11px] text-accent/80">
                        {project.slug}
                      </p>
                    )}
                    <p className="rounded-md bg-[#161d24]/90 p-3.5 text-[0.88rem] leading-[1.6] text-white/90 backdrop-blur-md">
                      {project.description}
                    </p>
                    <ul className="flex flex-wrap gap-x-3 gap-y-1.5 font-mono text-[11px] text-white/70">
                      {techItems.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                    <div className="mt-1 flex gap-4">
                      <a
                        href={project.github}
                        target="_blank"
                        rel="noreferrer"
                        aria-label="GitHub"
                        className="grid size-7 place-items-center rounded bg-white/10 text-white transition-colors duration-200 hover:bg-accent/20 hover:text-accent"
                      >
                        <IconGitHub />
                      </a>
                      <a
                        href={project.external}
                        target="_blank"
                        rel="noreferrer"
                        aria-label="Live site"
                        className="grid size-7 place-items-center rounded bg-white/10 text-white transition-colors duration-200 hover:bg-accent/20 hover:text-accent"
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
                      {imgSrc ? (
                        <motion.img
                          src={imgSrc}
                          alt={project.title}
                          className="size-full object-cover"
                          whileHover={{ scale: 1.06 }}
                          transition={{ duration: 0.4 }}
                        />
                      ) : (
                        <div className="grid size-full place-items-center bg-[radial-gradient(circle_at_20%_20%,rgba(127,173,173,0.35),transparent_45%),radial-gradient(circle_at_80%_70%,rgba(90,120,140,0.4),transparent_40%),linear-gradient(145deg,#243038,#13181d)] font-mono text-[13px] uppercase tracking-[0.08em] text-white/40 transition-all duration-500 group-hover:text-white/55">
                          {imageLabel}
                        </div>
                      )}

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
                    <p className="font-mono text-[13px] tracking-wide text-accent">
                      {orderLabel} ·{' '}
                      {project.featured ? 'Featured Project' : project.status || 'Project'}
                    </p>

                    <h3 className="font-sans text-[clamp(1.35rem,2.4vw,1.75rem)] font-bold text-ink transition-colors duration-300 group-hover:text-accent">
                      <a href={project.external} target="_blank" rel="noreferrer">
                        {project.title}
                      </a>
                    </h3>

                    {project.slug && (
                      <p className="font-mono text-[11px] text-accent/70">
                        {project.slug}
                      </p>
                    )}
                    {project.shortDescription &&
                      project.shortDescription !== project.description && (
                        <p className="font-mono text-[11px] uppercase tracking-widest text-ink-soft">
                          {project.shortDescription}
                        </p>
                      )}

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
                      {techItems.map((item) => (
                        <li key={item} className="transition-colors duration-300 group-hover:text-ink">
                          {item}
                        </li>
                      ))}
                    </ul>

                    <div
                      className={`flex flex-wrap items-center gap-x-4 gap-y-1 font-mono text-[12px] text-ink-muted ${
                        reversed ? 'justify-start' : 'justify-end'
                      }`}
                    >
                      {project.status && !project.featured && (
                        <span className="text-accent/80">{project.status}</span>
                      )}
                      {dateRange && <span>{dateRange}</span>}
                    </div>

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
