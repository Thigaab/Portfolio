'use client'

import { useRef } from 'react'
import dynamic from 'next/dynamic'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { PERSONAL } from '@/lib/data'
import Magnetic from '@/components/ui/Magnetic'
import { Container } from '@/components/layout/Section'

gsap.registerPlugin(useGSAP)

const HeroScene = dynamic(() => import('@/components/canvas/HeroScene'), {
  ssr: false,
  loading: () => <div className="absolute inset-0 bg-dark" />,
})

function splitChars(text: string) {
  return text.split('').map((char, i) => (
    <span key={i} className="char-wrap">
      <span className="char-inner">{char === ' ' ? ' ' : char}</span>
    </span>
  ))
}

export default function Hero() {
  const containerRef = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const tl = gsap.timeline({ delay: 0.3 })
      tl.from('.hero-eyebrow', { y: 24, opacity: 0, duration: 0.7, ease: 'power3.out' })
        .from('.hero-name .char-inner', { yPercent: 115, duration: 0.95, stagger: 0.025, ease: 'power4.out' }, '-=0.3')
        .from('.hero-title-line .char-inner', { yPercent: 115, duration: 0.95, stagger: 0.025, ease: 'power4.out' }, '-=0.75')
        .from('.hero-subtitle', { y: 20, opacity: 0, duration: 0.8, ease: 'power3.out' }, '-=0.4')
        .from('.hero-cta', { y: 20, opacity: 0, duration: 0.7, ease: 'power3.out' }, '-=0.5')
        .from('.hero-scroll', { opacity: 0, duration: 0.6 }, '-=0.3')
        .from('.hero-canvas', { opacity: 0, duration: 1.4, ease: 'power2.out' }, 0.1)

      // Parallax: content drifts opposite to pointer for depth.
      const onMove = (e: MouseEvent) => {
        const x = (e.clientX / window.innerWidth - 0.5) * -12
        const y = (e.clientY / window.innerHeight - 0.5) * -10
        gsap.to('.hero-parallax', { x, y, duration: 1, ease: 'power3.out' })
      }
      window.addEventListener('mousemove', onMove)
      return () => window.removeEventListener('mousemove', onMove)
    },
    { scope: containerRef }
  )

  return (
    <section
      ref={containerRef}
      id="hero"
      className="relative min-h-screen flex flex-col justify-center overflow-hidden"
    >
      <div className="hero-canvas absolute inset-0 z-0">
        <HeroScene />
      </div>

      <div className="absolute inset-0 z-[1] bg-gradient-to-r from-dark via-dark/60 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 z-[1] h-40 bg-gradient-to-t from-dark to-transparent" />

      <Container className="hero-parallax relative z-10 pt-28 pb-24">
        <p className="hero-eyebrow text-xs md:text-sm font-mono tracking-[0.3em] text-gold uppercase mb-6 flex items-center gap-3">
          <span className="inline-block w-8 h-px bg-gold" />
          Fullstack · DevOps · Finance
        </p>

        <h1 className="font-display font-bold leading-[0.9] mb-2">
          <span className="hero-name block text-[clamp(3rem,10vw,8.5rem)] text-warm-white tracking-tight overflow-hidden pb-1">
            {splitChars('THIBAUT')}
          </span>
          <span className="hero-title-line block text-[clamp(3rem,10vw,8.5rem)] gradient-text tracking-tight overflow-hidden pb-1">
            {splitChars('BONEFONT')}
          </span>
        </h1>

        <p className="hero-subtitle mt-8 text-muted text-base md:text-lg max-w-md leading-relaxed">
          {PERSONAL.bio}
        </p>

        <div className="hero-cta mt-10 flex flex-wrap items-center gap-4">
          <Magnetic strength={0.5}>
            <a
              href="#projects"
              onClick={(e) => {
                e.preventDefault()
                document.querySelector('#projects')?.scrollIntoView({ behavior: 'smooth' })
              }}
              className="group relative inline-flex items-center gap-3 bg-gold text-dark font-semibold px-7 py-3.5 rounded-full text-sm overflow-hidden transition-shadow duration-300 hover:shadow-[0_0_40px_rgba(212,168,83,0.45)]"
            >
              <span className="relative z-10">Découvrir mes projets</span>
              <span className="relative z-10 text-lg transition-transform duration-300 group-hover:translate-x-1">→</span>
              <div className="absolute inset-0 bg-gold-light scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300" />
            </a>
          </Magnetic>

          <Magnetic strength={0.3}>
            <a
              href={PERSONAL.github}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-muted hover:text-warm-white text-sm transition-colors duration-300 border border-dark-4 hover:border-gold/40 rounded-full px-5 py-3.5"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
              </svg>
              GitHub
            </a>
          </Magnetic>
        </div>
      </Container>

      <div className="hero-scroll absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2">
        <span className="text-xs font-mono tracking-[0.2em] text-muted uppercase">Scroll</span>
        <div className="w-px h-10 bg-gradient-to-b from-gold to-transparent animate-pulse" />
      </div>
    </section>
  )
}
