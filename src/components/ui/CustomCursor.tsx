'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'

const INTERACTIVE = 'a, button, [data-cursor-hover]'

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const dot = dotRef.current
    const ring = ringRef.current
    if (!dot || !ring) return

    let mouseX = 0
    let mouseY = 0
    let ringX = 0
    let ringY = 0

    // quickTo reuses a single tween instead of allocating a new one on every
    // mousemove (which can fire well over 100x/s on a high-polling mouse).
    const dotX = gsap.quickTo(dot, 'x', { duration: 0.1, ease: 'power3.out' })
    const dotY = gsap.quickTo(dot, 'y', { duration: 0.1, ease: 'power3.out' })

    const onMove = (e: MouseEvent) => {
      mouseX = e.clientX
      mouseY = e.clientY
      dotX(mouseX)
      dotY(mouseY)
    }

    /**
     * Hover state by delegation: two listeners on `document`, forever.
     * The previous version kept a `MutationObserver` on the whole body and,
     * on every mutation, re-ran `querySelectorAll` and re-bound enter/leave
     * handlers without ever removing the old ones. Any React re-render (the
     * stat counters tick every frame for two seconds) triggered a full
     * re-scan and leaked a duplicate listener onto every interactive element.
     */
    const interactive = (n: EventTarget | null) =>
      n instanceof Element ? n.closest(INTERACTIVE) : null

    const onOver = (e: MouseEvent) => {
      // relatedTarget = where the pointer came from; ignore moves that stay
      // inside the same interactive element.
      if (interactive(e.target) && !interactive(e.relatedTarget)) {
        gsap.to(ring, { scale: 2.5, opacity: 0.5, duration: 0.3 })
        gsap.to(dot, { scale: 0, duration: 0.3 })
      }
    }

    const onOut = (e: MouseEvent) => {
      if (interactive(e.target) && !interactive(e.relatedTarget)) {
        gsap.to(ring, { scale: 1, opacity: 1, duration: 0.3 })
        gsap.to(dot, { scale: 1, duration: 0.3 })
      }
    }

    let raf = 0
    const followRing = () => {
      ringX += (mouseX - ringX) * 0.1
      ringY += (mouseY - ringY) * 0.1
      gsap.set(ring, { x: ringX, y: ringY })
      raf = requestAnimationFrame(followRing)
    }
    raf = requestAnimationFrame(followRing)

    window.addEventListener('mousemove', onMove, { passive: true })
    document.addEventListener('mouseover', onOver)
    document.addEventListener('mouseout', onOut)

    return () => {
      window.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseover', onOver)
      document.removeEventListener('mouseout', onOut)
      cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <>
      <div
        ref={dotRef}
        className="fixed top-0 left-0 w-2 h-2 rounded-full bg-iris pointer-events-none z-[9998] -translate-x-1/2 -translate-y-1/2"
        aria-hidden="true"
      />
      <div
        ref={ringRef}
        className="fixed top-0 left-0 w-8 h-8 rounded-full border border-iris/60 pointer-events-none z-[9997] -translate-x-1/2 -translate-y-1/2"
        aria-hidden="true"
      />
    </>
  )
}
