type LogoProps = {
  letter: string
  className?: string
  asLink?: boolean
}

export function Logo({ letter, className = '', asLink = true }: LogoProps) {
  const mark = (
    <svg viewBox="0 0 100 100" fill="none" aria-hidden="true" className="size-full">
      <polygon
        points="50,4 93,27.5 93,72.5 50,96 7,72.5 7,27.5"
        stroke="currentColor"
        strokeWidth="5"
      />
      <text
        x="50"
        y="64"
        textAnchor="middle"
        fill="currentColor"
        fontFamily="Plus Jakarta Sans, sans-serif"
        fontSize="40"
        fontWeight="700"
      >
        {letter}
      </text>
    </svg>
  )

  const classes = `inline-grid size-10 place-items-center text-ink transition duration-200 hover:-translate-y-0.5 hover:text-accent md:size-11 ${className}`.trim()

  if (!asLink) {
    return <div className={classes}>{mark}</div>
  }

  return (
    <a href="#top" className={classes} aria-label="Home">
      {mark}
    </a>
  )
}
