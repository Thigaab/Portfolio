'use client'

import { useRef, type ReactNode } from 'react'
import gsap from 'gsap'

/**
 * Wraps a single interactive child and pulls it toward the cursor on hover.
 */
export default function Magnetic({
  children,
  strength = 0.4,
}: {
  children: ReactNode
  strength?: number
}) {
  const ref = useRef<HTMLElement>(null)

  const onMove = (e: React.MouseEvent) => {
    const el = ref.current
    if (!el) return
    const { left, top, width, height } = el.getBoundingClientRect()
    const x = (e.clientX - (left + width / 2)) * strength
    const y = (e.clientY - (top + height / 2)) * strength
    gsap.to(el, { x, y, duration: 0.6, ease: 'power3.out' })
  }

  const onLeave = () => {
    if (ref.current)
      gsap.to(ref.current, { x: 0, y: 0, duration: 0.7, ease: 'elastic.out(1, 0.4)' })
  }

  // The ref lives on a wrapper rather than being cloned onto the child: a ref
  // handed to someone else's element may be read during render, and GSAP moves
  // the wrapper just as well.
  return (
    <span ref={ref} className="inline-flex" onMouseMove={onMove} onMouseLeave={onLeave}>
      {children}
    </span>
  )
}
