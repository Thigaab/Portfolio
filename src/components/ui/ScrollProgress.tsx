'use client'

import { useEffect, useRef } from 'react'

export default function ScrollProgress() {
  const barRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = barRef.current
    if (!el) return

    // `scrollHeight` forces a layout, and the old loop read it on every single
    // frame. Measure only when the document can actually have resized.
    let max = 0
    let last = -1
    const measure = () => {
      max = document.documentElement.scrollHeight - window.innerHeight
    }
    measure()

    let raf = 0
    const update = () => {
      const p = max > 0 ? Math.min(window.scrollY / max, 1) : 0
      if (p !== last) {
        last = p
        el.style.transform = `scaleX(${p})`
      }
      raf = requestAnimationFrame(update)
    }
    raf = requestAnimationFrame(update)

    const ro = new ResizeObserver(measure)
    ro.observe(document.body)
    window.addEventListener('resize', measure)

    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
      window.removeEventListener('resize', measure)
    }
  }, [])

  return (
    <div className="fixed top-0 left-0 right-0 z-[60] h-[2px] bg-transparent">
      <div
        ref={barRef}
        className="h-full origin-left scale-x-0 bg-gradient-to-r from-iris via-iris-soft to-coral"
        style={{ willChange: 'transform' }}
      />
    </div>
  )
}
