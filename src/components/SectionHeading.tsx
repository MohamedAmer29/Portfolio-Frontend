type SectionHeadingProps = {
  number: string
  title: string
  className?: string
}

export function SectionHeading({ number, title, className = "" }: SectionHeadingProps) {
  return (
    <h2 className={`mb-7 flex items-center gap-4 font-sans text-section font-bold text-ink md:mb-10 ${className}`}>
      <span className="shrink-0 font-mono text-[0.85em] font-medium text-ink-muted">{number}</span>
      <span className="shrink-0">{title}</span>
      <span className="h-px min-w-8 max-w-[280px] flex-1 bg-accent/70" />
    </h2>
  )
}
