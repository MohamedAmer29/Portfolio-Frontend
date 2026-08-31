import { useRef, useState, useEffect } from 'react'
import { Trash2, X } from 'lucide-react'
import { toast } from 'react-toastify'
import { Reveal } from '../Reveal'
import { AdminSectionActions } from '../admin/AdminSectionActions'
import { DataSourceTag } from '../admin/DataSourceTag'
import { SectionHeading } from '../SectionHeading'
import { useExperience } from '../../hooks/useExperience'
import {
  useCreateExperience,
  useDeleteExperience,
  useUpdateExperience,
  DEFAULT_EXPERIENCE_BODY,
  type ExperienceInput,
} from '../../hooks/useExperienceMutations'
import { useAuth } from '../../hooks/useAuth'
import { useGSAP } from '../../lib/gsap'
import { useDebouncedCallback } from '../../lib/useDebouncedCallback'

declare const gsap: any

export type Job = {
  id?: string
  company: string
  title: string
  range: string
  url: string
  bullets: readonly string[]
  position?: string
  location?: string
  employmentType?: string
  startDate?: string
  endDate?: string
  isCurrent?: boolean
  displayOrder?: number
}

type ExperienceProps = {
  jobs: readonly Job[]
}

const inputClass =
  'w-full rounded-sm border border-ink/15 bg-bg-elevated px-3 py-2 text-[14px] text-ink outline-none transition-all duration-300 focus:border-accent focus:shadow-[0_0_0_3px_rgba(127,173,173,0.12)]'
const labelClass =
  'mb-1 block font-mono text-[10px] uppercase tracking-[0.15em] text-ink-soft'

const EMPLOYMENT_TYPES = [
  { value: 'FULL_TIME', label: 'Full-time' },
  { value: 'PART_TIME', label: 'Part-time' },
  { value: 'CONTRACT', label: 'Contract' },
  { value: 'INTERNSHIP', label: 'Internship' },
  { value: 'FREELANCE', label: 'Freelance' },
]

function jobToInput(job: Job): ExperienceInput {
  return {
    company: job.company,
    position: job.position ?? job.title,
    description: Array.from(job.bullets),
    location: job.location ?? '',
    employmentType: job.employmentType ?? 'FULL_TIME',
    startDate: job.startDate ?? '',
    endDate: job.isCurrent ? undefined : job.endDate || undefined,
    isCurrent: Boolean(job.isCurrent),
    displayOrder: job.displayOrder ?? 0,
  }
}

function EditableField({
  label,
  value,
  onChange,
  multiline,
  type = 'text',
}: {
  label: string
  value: string
  onChange: (value: string) => void
  multiline?: boolean
  type?: string
}) {
  return (
    <label className="block">
      <span className={labelClass}>{label}</span>
      {multiline ? (
        <textarea
          className={`${inputClass} min-h-[80px] resize-y`}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      ) : (
        <input
          type={type}
          className={inputClass}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      )}
    </label>
  )
}

export function Experience({ jobs }: ExperienceProps) {
  const { data: experienceData } = useExperience()
  const { isAdmin } = useAuth()
  const createExperience = useCreateExperience()
  const updateExperience = useUpdateExperience()
  const deleteExperience = useDeleteExperience()
  const allJobs = experienceData ?? jobs
  const hasServerData = Boolean(experienceData && experienceData.length > 0)
  const [active, setActive] = useState(0)
  const [editMode, setEditMode] = useState(false)
  const [draftJobs, setDraftJobs] = useState<Job[] | null>(null)
  const [jobToDelete, setJobToDelete] = useState<Job | null>(null)
  const displayJobs = editMode ? (draftJobs ?? allJobs) : allJobs
  const safeActive = displayJobs.length > 0 ? Math.min(active, displayJobs.length - 1) : -1
  const job = safeActive >= 0 ? displayJobs[safeActive] : undefined
  const panelRef = useRef<HTMLDivElement>(null)
  const tabsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (editMode && experienceData) {
      setDraftJobs(experienceData.map((j) => ({ ...j })))
    } else if (!editMode) {
      setDraftJobs(null)
    }
  }, [editMode, experienceData])

  const debouncedSave = useDebouncedCallback((id: string, data: ExperienceInput) => {
    updateExperience.mutate({ id, data })
  }, 500)

  const handleJobChange = (index: number, patch: Partial<Job>) => {
    const base = draftJobs ?? [...allJobs]
    const next = base.map((j, i) => (i === index ? { ...j, ...patch } : j))
    setDraftJobs(next)
    const updated = next[index]
    if (updated.id) {
      debouncedSave(updated.id, jobToInput(updated))
    }
  }

  const handleBulletChange = (index: number, bulletIndex: number, value: string) => {
    const base = draftJobs ?? [...allJobs]
    const bullets = [...base[index].bullets]
    bullets[bulletIndex] = value
    handleJobChange(index, { bullets })
  }

  const addBullet = (index: number) => {
    const base = draftJobs ?? [...allJobs]
    const bullets = [...base[index].bullets, '']
    handleJobChange(index, { bullets })
  }

  const removeBullet = (index: number, bulletIndex: number) => {
    const base = draftJobs ?? [...allJobs]
    const bullets = base[index].bullets.filter((_, i) => i !== bulletIndex)
    handleJobChange(index, { bullets: bullets.length > 0 ? bullets : [''] })
  }

  const handleAdd = async () => {
    try {
      await createExperience.mutateAsync(DEFAULT_EXPERIENCE_BODY)
      toast.success('Experience created successfully.')
      setEditMode(true)
    } catch {
      /* error toast in mutation */
    }
  }

  const handleConfirmDelete = async () => {
    if (!jobToDelete?.id) return
    try {
      await deleteExperience.mutateAsync(jobToDelete.id)
      toast.success('Experience deleted successfully.')
      setDraftJobs((prev) =>
        prev ? prev.filter((j) => j.id !== jobToDelete.id) : prev,
      )
      setJobToDelete(null)
    } catch {
      toast.error('Failed to delete experience.')
    }
  }

  useGSAP(() => {
    const el = tabsRef.current
    if (!el || editMode) return
    const ctx = gsap.context(() => {
      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      const tabs = el.querySelectorAll('[role="tab"]')
      if (reduced) {
        gsap.set(tabs, { autoAlpha: 1, y: 0 })
        return
      }
      gsap.fromTo(
        tabs,
        { autoAlpha: 0, y: 12 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.45,
          stagger: 0.06,
          ease: 'power2.out',
          clearProps: 'all',
        },
      )
    }, el)
    return () => ctx.revert()
  }, [editMode])

  useGSAP(() => {
    const panel = panelRef.current
    if (!panel || editMode) return
    const ctx = gsap.context(() => {
      gsap.fromTo(
        panel.children,
        { autoAlpha: 0, y: 15 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.4,
          stagger: 0.06,
          ease: 'power2.out',
          clearProps: 'all',
        },
      )
    }, panel)
    return () => ctx.revert()
  }, [safeActive, editMode])

  return (
    <section className="scroll-mt-20 px-5 py-[72px] md:px-0 md:py-[100px]" id="experience">
      <div className="mx-auto w-full max-w-[1000px] md:w-[min(100%-10rem,1000px)]">
        <Reveal>
          <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
            <SectionHeading number="04." title="Experience History" className="mb-0" />
            <AdminSectionActions
              section="experience"
              onCreate={handleAdd}
              onUpdate={hasServerData ? () => setEditMode((v) => !v) : undefined}
              isCreatePending={createExperience.isPending}
            />
          </div>
          {isAdmin && (
            <DataSourceTag hasServerData={hasServerData} className="mb-7 block md:mb-10" />
          )}
          {editMode && (
            <p className="mb-4 font-mono text-[11px] uppercase tracking-[0.1em] text-accent/70">
              Editing live — changes save automatically as you type.
            </p>
          )}
          {updateExperience.isPending && editMode && (
            <p className="mb-4 font-mono text-[11px] uppercase tracking-[0.1em] text-accent/60">
              saving…
            </p>
          )}
        </Reveal>

        {displayJobs.length === 0 ? (
          <p className="font-mono text-[12px] text-ink-soft">
            No experience yet. Add your first entry.
          </p>
        ) : (
          <Reveal delay={0.1}>
            <div className="grid gap-6 md:grid-cols-[200px_1fr] md:gap-8">
              <div
                ref={tabsRef}
                className="flex overflow-x-auto border-b border-ink-muted/30 [-ms-overflow-style:none] [scrollbar-width:none] md:flex-col md:overflow-visible md:border-b-0 md:border-l-2 md:border-ink-muted/15"
                role="tablist"
                aria-label="Companies"
              >
                {displayJobs.map((item, index) => (
                  <button
                    key={item.id ?? `${item.company}-${index}`}
                    type="button"
                    role="tab"
                    aria-selected={index === safeActive}
                    className={`shrink-0 whitespace-nowrap border-b-2 px-4 py-3 font-mono text-[12px] tracking-wide transition-all duration-300 md:border-b-0 md:border-l-2 md:text-left ${
                      index === safeActive
                        ? 'border-accent bg-accent/8 text-ink md:ml-[-2px]'
                        : 'border-transparent text-ink-muted hover:bg-accent/5 hover:text-ink md:ml-[-2px]'
                    }`}
                    onClick={() => setActive(index)}
                  >
                    {editMode ? (
                      <input
                        type="text"
                        className="w-full bg-transparent outline-none"
                        value={item.company}
                        onClick={(e) => e.stopPropagation()}
                        onChange={(e) =>
                          handleJobChange(index, { company: e.target.value })
                        }
                      />
                    ) : (
                      item.company.split(' ').length > 2
                        ? item.company.split(' ').slice(0, 2).join(' ') + '…'
                        : item.company
                    )}
                  </button>
                ))}
              </div>

              {job && (
                <div
                  ref={panelRef}
                  role="tabpanel"
                  className={`min-h-[280px] ${editMode ? 'rounded-xl border border-accent/25 bg-bg-elevated/60 p-5' : ''}`}
                >
                  {editMode ? (
                    <div className="space-y-3">
                      <div className="flex items-start justify-between gap-3">
                        <h3 className="font-sans text-[1.1rem] font-bold text-ink">
                          Edit role
                        </h3>
                        {job.id && (
                          <button
                            type="button"
                            onClick={() => setJobToDelete(job)}
                            className="grid size-8 place-items-center rounded-sm border border-ink/10 text-ink-muted transition hover:border-error hover:bg-error/10 hover:text-error"
                            aria-label={`Delete ${job.company}`}
                          >
                            <Trash2 className="size-3.5" />
                          </button>
                        )}
                      </div>
                      <div className="grid gap-3 sm:grid-cols-2">
                        <EditableField
                          label="Position"
                          value={job.position ?? job.title}
                          onChange={(v) =>
                            handleJobChange(safeActive, { position: v, title: v })
                          }
                        />
                        <EditableField
                          label="Location"
                          value={job.location ?? ''}
                          onChange={(v) => handleJobChange(safeActive, { location: v })}
                        />
                        <div>
                          <span className={labelClass}>Employment Type</span>
                          <select
                            className={inputClass}
                            value={job.employmentType ?? 'FULL_TIME'}
                            onChange={(e) =>
                              handleJobChange(safeActive, {
                                employmentType: e.target.value,
                              })
                            }
                          >
                            {EMPLOYMENT_TYPES.map((type) => (
                              <option key={type.value} value={type.value}>
                                {type.label}
                              </option>
                            ))}
                          </select>
                        </div>
                        <EditableField
                          label="Display Order"
                          type="number"
                          value={String(job.displayOrder ?? 0)}
                          onChange={(v) =>
                            handleJobChange(safeActive, {
                              displayOrder: Number(v) || 0,
                            })
                          }
                        />
                        <EditableField
                          label="Start Date"
                          type="date"
                          value={job.startDate ?? ''}
                          onChange={(v) => handleJobChange(safeActive, { startDate: v })}
                        />
                        <EditableField
                          label="End Date"
                          type="date"
                          value={job.endDate ?? ''}
                          onChange={(v) =>
                            handleJobChange(safeActive, {
                              endDate: v,
                              isCurrent: !v,
                            })
                          }
                        />
                      </div>
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={Boolean(job.isCurrent)}
                          onChange={(e) =>
                            handleJobChange(safeActive, {
                              isCurrent: e.target.checked,
                              endDate: e.target.checked ? '' : job.endDate,
                            })
                          }
                          className="size-4 accent-accent"
                        />
                        <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-ink-muted">
                          Still working here
                        </span>
                      </label>
                      <div>
                        <div className="mb-2 flex items-center justify-between">
                          <span className={labelClass}>Description</span>
                          <button
                            type="button"
                            onClick={() => addBullet(safeActive)}
                            className="font-mono text-[11px] uppercase tracking-[0.12em] text-accent"
                          >
                            + Add Point
                          </button>
                        </div>
                        <div className="space-y-2">
                          {job.bullets.map((bullet, bulletIndex) => (
                            <div key={bulletIndex} className="flex gap-2">
                              <textarea
                                className={`${inputClass} min-h-[60px] resize-y`}
                                value={bullet}
                                onChange={(e) =>
                                  handleBulletChange(
                                    safeActive,
                                    bulletIndex,
                                    e.target.value,
                                  )
                                }
                              />
                              {job.bullets.length > 1 && (
                                <button
                                  type="button"
                                  onClick={() => removeBullet(safeActive, bulletIndex)}
                                  className="rounded-sm border border-error px-2 text-error"
                                >
                                  ✕
                                </button>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="mb-2 flex items-start justify-between gap-3">
                        <h3 className="font-sans text-[1.25rem] font-bold text-ink tracking-wide">
                          {job.title}{' '}
                          {job.url ? (
                            <a
                              href={job.url}
                              target="_blank"
                              rel="noreferrer"
                              className="text-accent tracking-wide transition-colors duration-200 hover:underline decoration-accent/40 underline-offset-4"
                            >
                              @ {job.company}
                            </a>
                          ) : (
                            <span className="text-accent">@ {job.company}</span>
                          )}
                        </h3>
                      </div>
                      <p className="mb-6 font-mono text-[13px] tracking-wide text-ink-soft">{job.range}</p>
                      <ul className="space-y-4">
                        {job.bullets.map((bullet, bulletIndex) => (
                          <li
                            key={`${bullet}-${bulletIndex}`}
                            className="relative max-w-[580px] pl-5 text-[17px] leading-[1.8] tracking-wide text-ink-muted before:absolute before:left-0 before:top-[9px] before:text-[11px] before:text-accent before:content-['▸'] md:text-body"
                          >
                            {bullet}
                          </li>
                        ))}
                      </ul>
                    </>
                  )}
                </div>
              )}
            </div>
          </Reveal>
        )}

        {jobToDelete && (
          <div
            className="fixed inset-0 z-[110] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
            onClick={() => setJobToDelete(null)}
          >
            <div
              className="relative w-full max-w-[400px] rounded-lg border border-ink/10 bg-bg-elevated p-8 shadow-[0_20px_60px_rgba(26,31,36,0.2)]"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                onClick={() => setJobToDelete(null)}
                className="absolute right-4 top-4 grid size-8 place-items-center rounded-sm border border-ink/10 text-ink-muted transition hover:border-error hover:bg-error/10 hover:text-error"
                aria-label="Close"
              >
                <X className="size-4" />
              </button>
              <h2 className="mb-2 pr-10 font-sans text-[1.25rem] font-extrabold tracking-[-0.03em] text-ink">
                Delete Experience
              </h2>
              <p className="mb-6 font-mono text-[13px] text-ink-muted">
                Are you sure you want to delete the {jobToDelete.position ?? jobToDelete.title}{' '}
                role at {jobToDelete.company}? This action cannot be undone.
              </p>
              <div className="flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setJobToDelete(null)}
                  className="rounded-sm border border-ink px-5 py-2 font-mono text-[12px] uppercase tracking-[0.1em] text-ink transition hover:border-accent hover:bg-accent/10"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmDelete}
                  disabled={deleteExperience.isPending}
                  className="rounded-sm border border-error bg-error px-5 py-2 font-mono text-[12px] uppercase tracking-[0.1em] text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {deleteExperience.isPending ? 'Deleting…' : 'Delete'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
