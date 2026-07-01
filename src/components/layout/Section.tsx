import type { ReactNode } from 'react'

/**
 * Section = full-bleed vertical band with consistent rhythm + horizontal
 * overflow containment (so decorative glows never push the page sideways).
 * Container = the centered content column shared by every section, including
 * the hero, so left edges align across the whole site.
 */

export function Section({
  id,
  children,
  className = '',
}: {
  id?: string
  children: ReactNode
  className?: string
}) {
  return (
    <section
      id={id}
      className={`relative overflow-hidden py-20 md:py-28 ${className}`}
    >
      {children}
    </section>
  )
}

export function Container({
  children,
  className = '',
  ref,
}: {
  children: ReactNode
  className?: string
  ref?: React.Ref<HTMLDivElement>
}) {
  return (
    <div
      ref={ref}
      className={`mx-auto w-full max-w-6xl px-6 sm:px-8 lg:px-12 ${className}`}
    >
      {children}
    </div>
  )
}
