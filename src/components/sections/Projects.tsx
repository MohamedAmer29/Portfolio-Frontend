import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import { Reveal } from '../Reveal'
import { AdminSectionActions } from '../admin/AdminSectionActions'
import { DataSourceTag } from '../admin/DataSourceTag'
import { SectionHeading } from '../SectionHeading'
import { ProjectForm } from './ProjectForm'
import { useProjects } from '../../hooks/useProjects'
import {
  useProjectsMutations,
  DEFAULT_PROJECT_BODY,
  toPatch,
  type ProjectDraft,
} from '../../hooks/useProjectsMutations'
import { useAuth } from '../../hooks/useAuth'
import { useDebouncedCallback } from '../../lib/useDebouncedCallback'
import { useSmartImage } from '../../hooks/useSmartImage'

export type Project = {
  id?: string
  technologyIds?: string[]
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

const fallbackProjectBg =
  'grid size-full place-items-center bg-[radial-gradient(circle_at_20%_20%,rgba(127,173,173,0.35),transparent_45%),radial-gradient(circle_at_80%_70%,rgba(90,120,140,0.4),transparent_40%),linear-gradient(145deg,#243038,#13181d)] font-mono text-[13px] uppercase tracking-[0.08em]'

function ProjectArtwork({
  imgSrc,
  title,
  imageLabel,
  mobile = false,
}: {
  imgSrc: string | null
  title: string
  imageLabel: string
  mobile?: boolean
}) {
  const { loaded, failed, onLoad, onError } = useSmartImage(imgSrc)

  if (!imgSrc || failed) {
    return (
      <div
        className={`${fallbackProjectBg} ${
          mobile
            ? 'text-white/35'
            : 'text-white/40 transition-all duration-500 group-hover:text-white/55'
        }`}
      >
        {imageLabel}
      </div>
    )
  }

  return (
    <>
      {!loaded && (
        <span
          aria-hidden="true"
          className="absolute inset-0 z-[1] animate-pulse bg-ink/10"
        />
      )}
      {mobile ? (
        <motion.img
          src={imgSrc}
          alt={title}
          onLoad={onLoad}
          onError={onError}
          initial={{ opacity: 0, scale: 1.05 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        />
      ) : (
        <img
          src={imgSrc}
          alt={title}
          onLoad={onLoad}
          onError={onError}
          className={loaded ? 'img-fade-in' : undefined}
        />
      )}
    </>
  )
}

export function Projects({ projects }: ProjectsProps) {
  const { data: projectsData } = useProjects()
  const { isAdmin } = useAuth()
  const {
    updateProject,
    createProject,
    deleteProject,
    uploadProjectImage,
  } = useProjectsMutations()
  const allProjects = projectsData ?? projects
  const hasServerData = Boolean(projectsData && projectsData.length > 0)

  const [editMode, setEditMode] = useState(false)
  const [draftProjects, setDraftProjects] = useState<ProjectDraft[] | null>(null)
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null)
  const [uploadingId, setUploadingId] = useState<string | null>(null)

  const toDraft = (p: Project): ProjectDraft => ({
    id: p.id ?? '',
    title: p.title,
    slug: p.slug ?? '',
    shortDescription: p.shortDescription ?? '',
    description: p.description,
    githubUrl: p.githubUrl ?? '',
    liveUrl: p.liveUrl ?? '',
    featured: p.featured ?? false,
    status: p.status ?? 'PLANNING',
    displayOrder: p.displayOrder ?? 0,
    startDate: p.startDate ?? '',
    endDate: p.endDate ?? '',
    technologies: p.technologyIds ?? [],
    image: p.image ?? null,
  })

  const rawToDraft = (raw: any): ProjectDraft => ({
    id: raw?.id ?? '',
    title: raw?.title ?? '',
    slug: raw?.slug ?? '',
    shortDescription: raw?.shortDescription ?? '',
    description: raw?.description ?? '',
    githubUrl: raw?.githubUrl ?? '',
    liveUrl: raw?.liveUrl ?? '',
    featured: raw?.featured ?? false,
    status: raw?.status ?? 'PLANNING',
    displayOrder: raw?.displayOrder ?? 0,
    startDate: raw?.startDate ?? '',
    endDate: raw?.endDate ?? '',
    technologies:
      raw?.technologyIds ??
      raw?.technologies?.map((t: any) => t.id) ??
      raw?.tech ??
      [],
    image: raw?.image ?? null,
  })

  useEffect(() => {
    if (!editMode) {
      setDraftProjects(null)
    } else if (draftProjects === null && projectsData) {
      setDraftProjects(projectsData.map(toDraft))
    }
  }, [editMode, projectsData, draftProjects])

  const debouncedSave = useDebouncedCallback(
    (id: string, patch: ReturnType<typeof toPatch>) => {
      updateProject.mutate({ id, patch })
    },
    500,
  )

  const handleProjectChange = (index: number, patch: Partial<ProjectDraft>) => {
    const base = draftProjects ?? projectsData?.map(toDraft) ?? []
    const next = base.map((p, i) => (i === index ? { ...p, ...patch } : p))
    setDraftProjects(next)
    const id = next[index].id
    debouncedSave(id, toPatch(next[index]))
  }

  const handleAdd = async () => {
    try {
      const created = (await createProject.mutateAsync(DEFAULT_PROJECT_BODY)) as
        | any
        | { data: any }
      const entity = (created as any)?.data ?? created
      toast.success('Project created successfully.')
      setEditMode(true)
      setDraftProjects((prev) => [
        ...(prev ?? projectsData?.map(toDraft) ?? []),
        rawToDraft(entity),
      ])
    } catch {
      /* error toast handled in mutation */
    }
  }

  const handleDelete = (id: string) => {
    setPendingDeleteId(id)
  }

  const confirmDelete = async () => {
    const id = pendingDeleteId
    if (!id) return
    setPendingDeleteId(null)
    setDraftProjects((prev) =>
      prev ? prev.filter((p) => p.id !== id) : prev,
    )
    try {
      await deleteProject.mutateAsync(id)
      toast.success('Project deleted successfully.')
    } catch {
      /* error toast handled in mutation */
    }
  }

  const handleImageChange = async (index: number, file: File) => {
    const draft = (draftProjects ?? [])[index]
    if (!draft) return
    setUploadingId(draft.id)
    try {
      const res = await uploadProjectImage.mutateAsync({
        id: draft.id,
        file,
        hasImage: Boolean(draft.image),
      })
      toast.success('Project image uploaded successfully.')
      setDraftProjects((prev) =>
        prev
          ? prev.map((p, i) => (i === index ? { ...p, image: res.image } : p))
          : prev,
      )
    } finally {
      setUploadingId(null)
    }
  }

  const editList = draftProjects ?? projectsData?.map(toDraft) ?? []

  return (
    <section className="scroll-mt-20 px-5 py-[72px] md:px-0 md:py-[100px]" id="work">
      <div className="mx-auto w-full max-w-[1000px] md:w-[min(100%-10rem,1000px)]">
        <Reveal>
          <div className="mb-7 flex flex-wrap items-center justify-between gap-4 md:mb-10">
            <SectionHeading number="05." title="Some Projects I've Built" className="mb-0" />
            {isAdmin && (
              <AdminSectionActions
                section="projects"
                onCreate={handleAdd}
                onUpdate={() => setEditMode((v) => !v)}
                isCreatePending={createProject.isPending}
              />
            )}
          </div>
        </Reveal>

        {isAdmin && (
          <DataSourceTag hasServerData={hasServerData} className="mb-4 block" />
        )}

        {(updateProject.isPending || uploadProjectImage.isPending) && (
          <p className="mb-4 font-mono text-[11px] uppercase tracking-[0.1em] text-accent/70">
            saving…
          </p>
        )}

        {editMode ? (
          projectsData ? (
            <div className="grid items-start gap-6 lg:grid-cols-2">
              {editList.map((project, index) => (
                <ProjectForm
                  key={project.id || index}
                  project={project}
                  onChange={(patch) => handleProjectChange(index, patch)}
                  onImageChange={(file) => handleImageChange(index, file)}
                  onDelete={() => handleDelete(project.id)}
                  isUploading={uploadingId === project.id}
                />
              ))}
            </div>
          ) : (
            <p className="font-mono text-[12px] uppercase tracking-[0.1em] text-ink-soft">
              Loading projects…
            </p>
          )
        ) : (
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
              <Reveal key={project.id ?? index} delay={0.05 * index}>
                {/* Mobile card */}
                <article className="relative grid min-h-[360px] overflow-hidden bg-project rounded-lg md:hidden">
                  <div className="absolute inset-0">
                    <div className="photo-frame photo-frame--project size-full rounded-none">
                      <ProjectArtwork
                        imgSrc={imgSrc}
                        title={project.title}
                        imageLabel={imageLabel}
                        mobile
                      />
                    </div>
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
                    className={`relative col-span-7 row-start-1 ${
                      reversed ? 'col-start-6' : 'col-start-1'
                    }`}
                  >
                    <div className="photo-frame photo-frame--project transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-y-1 group-hover:shadow-[0_20px_50px_-20px_rgba(26,31,36,0.4)]">
                      <ProjectArtwork
                        imgSrc={imgSrc}
                        title={project.title}
                        imageLabel={imageLabel}
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
        )}
      {pendingDeleteId && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-[400px] rounded-lg border border-ink/10 bg-bg-elevated p-8 shadow-[0_20px_60px_rgba(26,31,36,0.2)]">
            <h2 className="mb-2 font-sans text-[1.25rem] font-extrabold tracking-[-0.03em] text-ink">
              Delete Project
            </h2>
            <p className="mb-6 font-mono text-[13px] text-ink-muted">
              Are you sure you want to delete this project? This action cannot be
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
                disabled={deleteProject.isPending}
                className="rounded-sm border border-error bg-error px-5 py-2 font-mono text-[12px] uppercase tracking-[0.1em] text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {deleteProject.isPending ? 'Deleting…' : 'Confirm'}
              </button>
            </div>
          </div>
        </div>
      )}
      </div>
    </section>
  )
}
