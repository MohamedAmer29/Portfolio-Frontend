import { type ReactNode } from 'react'
import { motion } from 'framer-motion'

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
}: RevealProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y, scale }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

