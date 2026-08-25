import { Reveal } from '../Reveal'
import { SectionHeading } from '../SectionHeading'

type AboutProps = {
  paragraphs: readonly string[]
  tech: readonly string[]
  letter: string
}

export function About({ paragraphs, tech, letter }: AboutProps) {
  const [intro, ...rest] = paragraphs
  const techIntro = rest[rest.length - 1]
  const body = rest.slice(0, -1)

  return (
    <section className="scroll-mt-20 px-5 py-[72px] md:px-0 md:py-[100px]" id="about">
      <div className="mx-auto w-full max-w-[1000px] md:w-[min(100%-10rem,1000px)]">
        <Reveal>
          <SectionHeading number="01." title="About Me" />
        </Reveal>

        <div className="grid items-start gap-10 md:grid-cols-[1.2fr_0.8fr] md:gap-12">
          <Reveal delay={0.08}>
            <div className="space-y-4 text-[17px] leading-[1.7] text-ink-muted md:text-body">
              <p className="max-w-[540px]">{intro}</p>
              {body.map((paragraph) => (
                <p key={paragraph.slice(0, 24)} className="max-w-[540px]">
                  {paragraph}
                </p>
              ))}
              <p className="max-w-[540px]">{techIntro}</p>
              <ul className="mt-4 grid max-w-[480px] grid-cols-2 gap-x-5 gap-y-2.5 md:grid-cols-3">
                {tech.map((item) => (
                  <li
                    key={item}
                    className="relative pl-4 font-mono text-[13px] text-ink-muted before:absolute before:left-0 before:top-[2px] before:text-[11px] before:text-accent before:content-['▸']"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>

          <Reveal delay={0.16} className="justify-self-center md:justify-self-end">
            <div className="relative aspect-[1/1.15] w-[min(100%,280px)] md:w-[min(100%,300px)]" aria-hidden="true">
              <div className="relative size-full overflow-hidden rounded-sm border border-ink/15 bg-linear-to-br from-[#c5ced2] via-[#8fa0a8] to-[#5f7078] shadow-[0_20px_60px_-15px_rgba(26,31,36,0.25)]">
                <div className="absolute inset-0 z-1 bg-linear-to-b from-transparent from-50% to-ink/30" />
                <span className="absolute inset-0 grid place-items-center text-[5.5rem] font-extrabold tracking-[-0.04em] text-white/30">
                  {letter}
                </span>
              </div>
              {/* Decorative accent border */}
              <div className="absolute -bottom-3 -right-3 -z-1 size-full border-2 border-accent/20 rounded-sm" />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

