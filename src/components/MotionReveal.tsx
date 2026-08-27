import { motion, type HTMLMotionProps } from 'framer-motion'
import type { ReactNode } from 'react'

type MotionRevealProps = {
  children: ReactNode
  className?: string
  delay?: number
  duration?: number
  y?: number
  scale?: number
} & HTMLMotionProps<'div'>

export function MotionReveal({
  children,
  className = '',
  delay = 0,
  duration = 0.6,
  y = 30,
  scale = 1,
  ...props
}: MotionRevealProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y, scale }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  )
}
