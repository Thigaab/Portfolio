'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import { PERSONAL } from '@/lib/data'

const NAV_ITEMS = [
  { label: 'À propos', href: '#about' },
  { label: 'Compétences', href: '#skills' },
  { label: 'Projets', href: '#projects' },
  { label: 'Contact', href: '#contact' },
]

export default function Navbar() {
  const navRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const nav = navRef.current
    if (!nav) return

    gsap.fromTo(
      nav,
      { y: -80, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, ease: 'power3.out', delay: 1.5 }
    )

    ScrollTrigger.create({
      start: 'top -80',
      onEnter: () => nav.classList.add('nav-scrolled'),
      onLeaveBack: () => nav.classList.remove('nav-scrolled'),
    })
  }, [])

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault()
    const target = document.querySelector(href)
    if (target) target.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <header
      ref={navRef}
      className="fixed top-0 left-0 right-0 z-50 py-4 transition-all duration-500 [&.nav-scrolled]:bg-dark/80 [&.nav-scrolled]:backdrop-blur-md [&.nav-scrolled]:border-b [&.nav-scrolled]:border-border"
    >
      <div className="mx-auto w-full max-w-6xl px-6 sm:px-8 lg:px-12 flex items-center justify-between">
        <a
          href="#"
          className="font-display font-bold text-xl tracking-tight gradient-text"
          onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
        >
          TB.
        </a>

        <nav className="hidden md:flex items-center gap-8">
          {NAV_ITEMS.map((item) => (
            <a
              key={item.href}
              href={item.href}
              onClick={(e) => handleClick(e, item.href)}
              className="text-sm text-muted hover:text-warm-white transition-colors duration-300 tracking-wide uppercase font-medium"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <a
          href={`mailto:${PERSONAL.email}`}
          className="hidden md:flex items-center gap-2 text-sm font-medium text-gold border border-gold/30 rounded-full px-4 py-2 hover:bg-gold/10 transition-all duration-300"
        >
          Me contacter
        </a>
      </div>
    </header>
  )
}
