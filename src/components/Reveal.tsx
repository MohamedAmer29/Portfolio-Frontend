import { useRef, type ReactNode } from 'react'
import { motion } from 'framer-motion'
import { useGSAP } from '../lib/gsap'

declare const gsap: any

type RevealProps = {
  children: ReactNode
  className?: string
  delay?: number
  y?: number
  scale?: number
  duration?: number
  stagger?: number
  selector?: string
}

export function Reveal({
  children,
  className = '',
  delay = 0,
  y = 30,
  scale = 1,
  duration = 0.8,
  stagger = 0,
  selector,
}: RevealProps) {
  const ref = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const el = ref.current
      if (!el) return

      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        gsap.set(el, { autoAlpha: 1, y: 0, scale: 1 })
        return
      }

      const targets = selector ? el.querySelectorAll(selector) : el

      gsap.fromTo(
        targets,
        { autoAlpha: 0, y, scale },
        {
          autoAlpha: 1,
          y: 0,
          scale: 1,
          duration,
          delay,
          stagger: stagger > 0 ? stagger : undefined,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 85%',
            toggleActions: 'play none none reverse',
          },
        },
      )
    },
    { dependencies: [delay, y, scale, duration, stagger, selector] },
  )

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration, delay, ease: [0.22, 1, 0.36, 1] }}
      className={`opacity-0 ${className}`.trim()}
    >
      {children}
    </motion.div>
  )
}

