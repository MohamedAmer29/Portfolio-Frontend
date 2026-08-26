import { useEffect, useLayoutEffect, useRef, useState } from 'react'

let _gsap: typeof import('gsap').default | null = null
let _gsapPromise: Promise<typeof import('gsap').default> | null = null

async function ensureGsap() {
  if (_gsap) return _gsap
  if (!_gsapPromise) {
    _gsapPromise = (async () => {
      const [gsapMod, stMod] = await Promise.all([
        import('gsap'),
        import('gsap/ScrollTrigger'),
      ])
      gsapMod.default.registerPlugin(stMod.ScrollTrigger)
      _gsap = gsapMod.default
      ;(window as any).gsap = gsapMod.default
      return _gsap
    })()
  }
  return _gsapPromise
}

export { ensureGsap as loadGsap }
export function getGsap() { return _gsap }

const isBrowser = typeof document !== 'undefined'
const useIsomorphicLayoutEffect = isBrowser ? useLayoutEffect : useEffect

type GSAPCallback = () => void | (() => void)
type GSAPConfig = {
  dependencies?: unknown[]
  scope?: React.RefObject<HTMLElement | null>
}

export function useGSAP(
  callback: GSAPCallback,
  config: GSAPConfig | unknown[] = [],
) {
  const deps = Array.isArray(config) ? config : (config.dependencies ?? [])

  const callbackRef = useRef(callback)
  callbackRef.current = callback

  const [ready, setReady] = useState(() => _gsap !== null)

  useEffect(() => {
    if (_gsap) { setReady(true); return }
    ensureGsap().then(() => setReady(true))
  }, [])

  useIsomorphicLayoutEffect(() => {
    if (!ready) return
    const cleanup = callbackRef.current()
    return () => {
      if (typeof cleanup === 'function') cleanup()
    }
  }, [ready, ...deps])
}
