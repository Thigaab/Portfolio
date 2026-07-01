'use client'

import { useRef } from 'react'
import { useReveal, SplitHeading } from '@/lib/anim'
import TiltCard from '@/components/ui/TiltCard'
import { Section, Container } from '@/components/layout/Section'
import { PROJECTS } from '@/lib/data'

const TYPE_COLORS: Record<string, string> = {
  Systems: 'bg-violet-500/10 text-violet-300 border-violet-500/20',
  Backend: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20',
  Frontend: 'bg-sky-500/10 text-sky-300 border-sky-500/20',
  'AI/ML': 'bg-pink-500/10 text-pink-300 border-pink-500/20',
  Tools: 'bg-amber-500/10 text-amber-300 border-amber-500/20',
}

export default function Projects() {
  const sectionRef = useRef<HTMLDivElement>(null)
  useReveal(sectionRef)

  return (
    <Section id="projects">
      <div className="absolute top-0 left-6 right-6 sm:left-8 sm:right-8 lg:left-12 lg:right-12 h-px bg-gradient-to-r from-transparent via-border to-transparent" />

      <Container ref={sectionRef}>
        <div className="mb-16">
          <p data-reveal className="text-xs font-mono tracking-[0.3em] text-gold uppercase mb-4">
            03 / Réalisations
          </p>
          <SplitHeading
            text="PROJETS"
            className="font-display font-bold text-5xl md:text-6xl leading-tight text-warm-white"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {PROJECTS.map((project, idx) => (
            <div data-reveal data-reveal-delay={(idx * 0.05).toString()} key={project.id}>
              <TiltCard
                data-cursor-hover
                max={6}
                className="h-full group border border-border rounded-2xl p-6 bg-dark-2/40 backdrop-blur-sm hover:border-gold/30 transition-colors duration-400 flex flex-col"
              >
                <div className="relative z-20 flex flex-col h-full">
                  <div className="flex items-start justify-between mb-4">
                    <span className={`text-[10px] font-mono font-semibold uppercase tracking-widest px-2.5 py-1 rounded-md border ${TYPE_COLORS[project.type] ?? 'bg-gold/10 text-gold border-gold/20'}`}>
                      {project.type}
                    </span>
                    <span className="text-xs text-muted font-mono">{project.period}</span>
                  </div>

                  <h3 className="font-display font-bold text-lg text-warm-white mb-3 group-hover:text-gold transition-colors duration-300">
                    {project.title}
                  </h3>

                  <p className="text-sm text-muted leading-relaxed mb-5 flex-1">
                    {project.description}
                  </p>

                  <div className="flex flex-wrap gap-1.5 mb-5">
                    {project.tech.map((t) => (
                      <span
                        key={t}
                        className="text-[11px] px-2 py-0.5 rounded-md bg-dark-4 text-muted border border-dark-4 font-mono"
                      >
                        {t}
                      </span>
                    ))}
                  </div>

                  {project.github ? (
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-xs text-gold hover:text-gold-light font-medium transition-colors duration-200 mt-auto"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
                      </svg>
                      Voir sur GitHub
                      <span className="transition-transform duration-200 group-hover:translate-x-0.5">→</span>
                    </a>
                  ) : (
                    <span className="text-xs text-muted/50 font-mono italic mt-auto">
                      Projet académique · code privé
                    </span>
                  )}
                </div>
              </TiltCard>
            </div>
          ))}
        </div>
      </Container>
    </Section>
  )
}
