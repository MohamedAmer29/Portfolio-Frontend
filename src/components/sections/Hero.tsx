import { useRef } from 'react'
import { gsap, useGSAP } from '../../lib/gsap'

type HeroProps = {
  greeting: string
  name: string
  tagline: string
  bio: string
  ready: boolean
}

export function Hero({ greeting, name, tagline, bio, ready }: HeroProps) {
  const rootRef = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      if (!ready || !rootRef.current) return

      const items = rootRef.current.querySelectorAll('[data-hero-item]')
      gsap.fromTo(
        items,
        { autoAlpha: 0, y: 28 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.85,
          stagger: 0.12,
          ease: 'power3.out',
          delay: 0.1,
        },
      )
    },
    { dependencies: [ready] },
  )

  return (
    <section
      ref={rootRef}
      className="flex min-h-svh items-start px-5 pb-12 pt-[calc(70px+2.5rem)] md:items-center md:px-0 md:pb-0 md:pt-20"
      id="top"
    >
      <div className="mx-auto w-full max-w-[720px] md:w-[min(100%-10rem,1000px)]">
        <p
          data-hero-item
          className="mb-5 font-mono text-[13px] tracking-wide text-accent opacity-0 md:text-[14px]"
        >
          {greeting}
        </p>
        <h1
          data-hero-item
          className="mb-2 font-sans text-hero-name font-extrabold leading-[1.05] tracking-[-0.03em] text-ink opacity-0"
        >
          {name}
        </h1>
        <h2
          data-hero-item
          className="mb-6 font-sans text-hero-tag font-bold leading-[1.1] tracking-[-0.025em] text-ink-muted opacity-0"
        >
          {tagline}
        </h2>
        <p
          data-hero-item
          className="max-w-[34rem] text-[17px] leading-[1.8] text-ink-muted opacity-0 md:text-body"
        >
          {bio}
        </p>

        <a
          data-hero-item
          className="mt-12 inline-flex text-ink-muted opacity-0 transition-colors duration-300 hover:text-accent"
          href="#about"
          aria-label="Scroll to about"
        >
          <span
            className="relative h-[38px] w-[24px] rounded-[14px] border-[1.5px] border-current transition-colors duration-300 hover:border-accent"
            aria-hidden="true"
          >
            <span className="animate-scroll-dot absolute left-1/2 top-[8px] size-1 -translate-x-1/2 rounded-full bg-current" />
          </span>
        </a>
      </div>
    </section>
  )
}
