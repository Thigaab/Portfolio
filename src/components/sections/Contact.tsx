'use client'

import { useRef } from 'react'
import { useReveal, SplitHeading } from '@/lib/anim'
import Magnetic from '@/components/ui/Magnetic'
import { Section, Container } from '@/components/layout/Section'
import { PERSONAL } from '@/lib/data'

const LINKS = [
  {
    label: 'Email',
    value: PERSONAL.email,
    href: `mailto:${PERSONAL.email}`,
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    label: 'LinkedIn',
    value: 'thibaut-bonefont',
    href: PERSONAL.linkedin,
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z" />
        <circle cx="4" cy="4" r="2" />
      </svg>
    ),
  },
  {
    label: 'GitHub',
    value: 'Thigaab',
    href: PERSONAL.github,
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
      </svg>
    ),
  },
]

export default function Contact() {
  const sectionRef = useRef<HTMLDivElement>(null)
  useReveal(sectionRef)

  return (
    <Section id="contact">
      <div className="absolute top-0 left-6 right-6 sm:left-8 sm:right-8 lg:left-12 lg:right-12 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] max-w-[95vw] h-[400px] bg-gold/5 blur-[150px] pointer-events-none" />

      <Container ref={sectionRef} className="relative z-10">
        <div className="mx-auto max-w-3xl text-center">
        <p data-reveal className="text-xs font-mono tracking-[0.3em] text-gold uppercase mb-6">
          04 / Contact
        </p>

        <SplitHeading
          text="PARLONS"
          className="font-display font-bold text-5xl md:text-7xl leading-tight text-warm-white"
        />
        <SplitHeading
          text="ENSEMBLE"
          className="font-display font-bold text-5xl md:text-7xl leading-tight gradient-text mb-6"
        />

        <p data-reveal className="text-muted text-base md:text-lg leading-relaxed max-w-lg mx-auto mb-12">
          Ouvert aux opportunités de stage, d&apos;alternance et aux projets ambitieux.
          N&apos;hésitez pas à me contacter.
        </p>

        <div data-reveal className="mb-14 inline-block">
          <Magnetic strength={0.5}>
            <a
              href={`mailto:${PERSONAL.email}`}
              className="group inline-flex items-center gap-3 bg-gradient-to-r from-gold to-amber text-dark font-bold text-base md:text-lg px-8 py-4 rounded-full hover:shadow-[0_0_50px_rgba(212,168,83,0.4)] transition-shadow duration-400"
            >
              <span>Envoyer un message</span>
              <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
            </a>
          </Magnetic>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4">
          {LINKS.map((link) => (
            <a
              key={link.label}
              data-reveal
              data-cursor-hover
              href={link.href}
              target={link.href.startsWith('mailto') ? undefined : '_blank'}
              rel="noopener noreferrer"
              className="flex items-center gap-3 border border-border rounded-xl px-5 py-3 text-muted hover:text-warm-white hover:border-gold/30 hover:bg-dark-3/50 transition-all duration-300"
            >
              <span className="text-gold">{link.icon}</span>
              <div className="text-left">
                <p className="text-xs text-muted/70 font-mono">{link.label}</p>
                <p className="text-sm font-medium">{link.value}</p>
              </div>
            </a>
          ))}
        </div>
        </div>

        <div className="mt-24 pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-muted font-mono">
          <p>© {new Date().getFullYear()} Thibaut Bonefont</p>
          <p>Next.js · React Three Fiber · GSAP</p>
        </div>
      </Container>
    </Section>
  )
}
