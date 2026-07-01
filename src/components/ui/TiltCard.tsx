'use client'

import { useRef, type ReactNode } from 'react'
import gsap from 'gsap'

/**
 * 3D-tilt card that rotates toward the cursor and renders a radial gold glow
 * that tracks the pointer. Used for project/skill cards.
 */
export default function TiltCard({
  children,
  className = '',
  max = 8,
  glow = true,
  ...rest
}: {
  children: ReactNode
  className?: string
  max?: number
  glow?: boolean
} & React.HTMLAttributes<HTMLDivElement>) {
  const ref = useRef<HTMLDivElement>(null)
  const glowRef = useRef<HTMLDivElement>(null)

  const onMove = (e: React.MouseEvent) => {
    const el = ref.current
    if (!el) return
    const { left, top, width, height } = el.getBoundingClientRect()
    const px = (e.clientX - left) / width
    const py = (e.clientY - top) / height
    gsap.to(el, {
      rotateY: (px - 0.5) * max * 2,
      rotateX: -(py - 0.5) * max * 2,
      duration: 0.5,
      ease: 'power2.out',
      transformPerspective: 900,
    })
    if (glowRef.current) {
      gsap.to(glowRef.current, {
        opacity: 1,
        duration: 0.3,
      })
      glowRef.current.style.background = `radial-gradient(420px circle at ${px * 100}% ${py * 100}%, rgba(212,168,83,0.14), transparent 60%)`
    }
  }

  const onLeave = () => {
    if (ref.current)
      gsap.to(ref.current, {
        rotateX: 0,
        rotateY: 0,
        duration: 0.8,
        ease: 'elastic.out(1, 0.5)',
      })
    if (glowRef.current) gsap.to(glowRef.current, { opacity: 0, duration: 0.4 })
  }

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className={`relative [transform-style:preserve-3d] ${className}`}
      {...rest}
    >
      {glow && (
        <div
          ref={glowRef}
          className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 z-10"
          aria-hidden="true"
        />
      )}
      {children}
    </div>
  )
}
