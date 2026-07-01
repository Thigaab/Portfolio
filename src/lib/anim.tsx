'use client'

import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

gsap.registerPlugin(useGSAP, ScrollTrigger)

/**
 * Bulletproof scroll-reveal: any element tagged with `data-reveal` inside the
 * scope fades/slides in once. Uses `once` triggers with a forgiving start so
 * elements never get stuck invisible even if a refresh races layout.
 */
export function useReveal(scope: React.RefObject<HTMLDivElement | null>) {
  useGSAP(
    () => {
      const els = gsap.utils.toArray<HTMLElement>('[data-reveal]', scope.current)
      els.forEach((el) => {
        const delay = parseFloat(el.dataset.revealDelay ?? '0')
        gsap.set(el, { opacity: 0, y: 42 })
        ScrollTrigger.create({
          trigger: el,
          start: 'top 90%',
          once: true,
          onEnter: () =>
            gsap.to(el, {
              opacity: 1,
              y: 0,
              duration: 0.9,
              delay,
              ease: 'power3.out',
            }),
        })
      })
    },
    { scope }
  )
}

/**
 * Heading that splits into characters and reveals them on scroll with a
 * mask-and-slide effect. Self-contained trigger, robust against layout shifts.
 */
export function SplitHeading({
  text,
  className = '',
  as: Tag = 'h2',
  start = 'top 85%',
}: {
  text: string
  className?: string
  as?: 'h1' | 'h2' | 'h3'
  start?: string
}) {
  const ref = useRef<HTMLHeadingElement>(null)

  useGSAP(
    () => {
      const chars = gsap.utils.toArray<HTMLElement>('.char-inner', ref.current)
      gsap.set(chars, { yPercent: 115 })
      ScrollTrigger.create({
        trigger: ref.current,
        start,
        once: true,
        onEnter: () =>
          gsap.to(chars, {
            yPercent: 0,
            duration: 0.95,
            stagger: 0.025,
            ease: 'power4.out',
          }),
      })
    },
    { scope: ref }
  )

  return (
    <Tag ref={ref} className={`overflow-hidden ${className}`}>
      {text.split(/(\s)/).map((seg, i) =>
        seg === ' ' ? (
          <span key={i}>&nbsp;</span>
        ) : seg === '' ? null : (
          <span key={i} className="inline-block whitespace-nowrap">
            {seg.split('').map((char, j) => (
              <span key={j} className="char-wrap">
                <span className="char-inner">{char}</span>
              </span>
            ))}
          </span>
        )
      )}
    </Tag>
  )
}
