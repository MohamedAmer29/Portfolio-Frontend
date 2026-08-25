import { useEffect, useRef, useState } from 'react'

const INTERACTIVE = 'a, button, input, textarea, label, [role="button"], [data-cursor="hover"]'
const LERP_DOT = 0.35
const LERP_RING = 0.14

function lerp(start: number, end: number, amount: number) {
  return start + (end - start) * amount
}

/**
 * Dual-element cursor matching the Francis Lagares / Brittany Chiang style:
 * solid center dot + lagging outline ring, expand on hover, press on click.
 * Position updates via refs + rAF (no React re-renders per mousemove).
 */
export function CustomCursor() {
  const [enabled] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(pointer: fine)').matches,
  )

  const dotRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)
  const rafRef = useRef<number>(0)

  const mouse = useRef({ x: -100, y: -100 })
  const dot = useRef({ x: -100, y: -100 })
  const ring = useRef({ x: -100, y: -100 })
  const hovering = useRef(false)
  const pressing = useRef(false)
  const visible = useRef(false)

  useEffect(() => {
    if (!enabled) return

    document.body.classList.add('has-custom-cursor')

    const render = () => {
      dot.current.x = lerp(dot.current.x, mouse.current.x, LERP_DOT)
      dot.current.y = lerp(dot.current.y, mouse.current.y, LERP_DOT)
      ring.current.x = lerp(ring.current.x, mouse.current.x, LERP_RING)
      ring.current.y = lerp(ring.current.y, mouse.current.y, LERP_RING)

      const opacity = visible.current ? '1' : '0'
      const hoverScale = hovering.current ? 1.55 : 1
      const pressScale = pressing.current ? 0.72 : 1
      const ringScale = hoverScale * pressScale
      const dotScale = pressing.current ? 0.55 : hovering.current ? 0.5 : 1

      if (dotRef.current) {
        dotRef.current.style.opacity = opacity
        dotRef.current.style.transform = `translate3d(${dot.current.x}px, ${dot.current.y}px, 0) translate(-50%, -50%) scale(${dotScale})`
      }

      if (ringRef.current) {
        ringRef.current.style.opacity = opacity
        ringRef.current.style.transform = `translate3d(${ring.current.x}px, ${ring.current.y}px, 0) translate(-50%, -50%) scale(${ringScale})`
        ringRef.current.classList.toggle('is-hover', hovering.current)
        ringRef.current.classList.toggle('is-press', pressing.current)
      }

      rafRef.current = window.requestAnimationFrame(render)
    }

    const onMove = (event: MouseEvent) => {
      mouse.current.x = event.clientX
      mouse.current.y = event.clientY
      if (!visible.current) {
        visible.current = true
        dot.current.x = event.clientX
        dot.current.y = event.clientY
        ring.current.x = event.clientX
        ring.current.y = event.clientY
      }
    }

    const onOver = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null
      hovering.current = Boolean(target?.closest(INTERACTIVE))
    }

    const onDown = () => {
      pressing.current = true
    }

    const onUp = () => {
      pressing.current = false
    }

    const onLeave = () => {
      visible.current = false
      hovering.current = false
      pressing.current = false
    }

    const onVisibility = () => {
      if (document.hidden) {
        visible.current = false
        pressing.current = false
      }
    }

    window.addEventListener('mousemove', onMove, { passive: true })
    window.addEventListener('mouseover', onOver, { passive: true })
    window.addEventListener('mousedown', onDown)
    window.addEventListener('mouseup', onUp)
    document.addEventListener('mouseleave', onLeave)
    document.addEventListener('visibilitychange', onVisibility)
    rafRef.current = window.requestAnimationFrame(render)

    return () => {
      document.body.classList.remove('has-custom-cursor')
      window.cancelAnimationFrame(rafRef.current)
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseover', onOver)
      window.removeEventListener('mousedown', onDown)
      window.removeEventListener('mouseup', onUp)
      document.removeEventListener('mouseleave', onLeave)
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [enabled])

  if (!enabled) return null

  return (
    <div className="pointer-events-none fixed inset-0 z-[9999]" aria-hidden="true">
      <div ref={dotRef} className="cursor-dot" />
      <div ref={ringRef} className="cursor-ring" />
    </div>
  )
}
