import { useLayoutEffect, useRef, useState } from 'react'

export function useSmartImage(src: string | null | undefined) {
  const [loaded, setLoaded] = useState(false)
  const [failed, setFailed] = useState(false)
  const ref = useRef<HTMLImageElement | null>(null)

  useLayoutEffect(() => {
    setLoaded(false)
    setFailed(false)
  }, [src])

  useLayoutEffect(() => {
    const img = ref.current
    if (img && img.complete && img.naturalWidth > 0) {
      setLoaded(true)
    }
  }, [src])

  const onLoad = () => setLoaded(true)
  const onError = () => {
    setFailed(true)
    setLoaded(true)
  }

  return {
    ref,
    loaded,
    failed,
    onLoad,
    onError,
    showSkeleton: Boolean(src) && !loaded && !failed,
  }
}