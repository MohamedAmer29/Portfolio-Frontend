import { useRef, type ReactNode } from 'react'
import { gsap, useGSAP } from '../lib/gsap'

type RevealProps = {
  children: ReactNode
  className?: string
  delay?: number
  y?: number
}

export function Reveal({ children, className = '', delay = 0, y = 32 }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const el = ref.current
      if (!el) return

      gsap.fromTo(
        el,
        { autoAlpha: 0, y },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.9,
          delay,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
        },
      )
    },
    { dependencies: [delay, y] },
  )

  return (
    <div ref={ref} className={`opacity-0 ${className}`.trim()}>
      {children}
    </div>
  )
}

