'use client'

import { useCallback, useRef, useState } from 'react'
import { useTranslations } from 'next-intl'
import { useReveal, SplitHeading } from '@/lib/anim'
import TiltCard from '@/components/ui/TiltCard'
import { Section, Container } from '@/components/layout/Section'
import { PROJECTS, type Project } from '@/lib/data'
import ProjectModal from '@/components/sections/ProjectModal'

const TYPE_COLORS: Record<string, string> = {
  Systems: 'bg-violet-500/10 text-violet-300 border-violet-500/20',
  Backend: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20',
  Frontend: 'bg-sky-500/10 text-sky-300 border-sky-500/20',
  'AI/ML': 'bg-pink-500/10 text-pink-300 border-pink-500/20',
  Tools: 'bg-amber-500/10 text-amber-300 border-amber-500/20',
}

export default function Projects() {
  const t = useTranslations('projects')
  const sectionRef = useRef<HTMLDivElement>(null)
  useReveal(sectionRef)
  const [selected, setSelected] = useState<Project | null>(null)
  const closeModal = useCallback(() => setSelected(null), [])

  return (
    <Section id="projects">
      <div className="absolute top-0 left-6 right-6 sm:left-8 sm:right-8 lg:left-12 lg:right-12 h-px bg-gradient-to-r from-transparent via-border to-transparent" />

      <Container ref={sectionRef}>
        <div className="mb-16">
          <p data-reveal className="text-xs font-mono tracking-[0.3em] text-gold uppercase mb-4">
            {t('eyebrow')}
          </p>
          <SplitHeading
            text={t('heading')}
            className="font-display font-bold text-5xl md:text-6xl leading-tight text-warm-white"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {PROJECTS.map((project, idx) => (
            <div data-reveal data-reveal-delay={(idx * 0.05).toString()} key={project.id}>
              <TiltCard
                data-cursor-hover
                role="button"
                tabIndex={0}
                aria-label={project.title}
                onClick={() => setSelected(project)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    setSelected(project)
                  }
                }}
                max={6}
                className="h-full group cursor-pointer border border-border rounded-2xl p-6 bg-dark-2/40 backdrop-blur-sm hover:border-gold/30 transition-colors duration-400 flex flex-col"
              >
                <div className="relative z-20 flex flex-col h-full">
                  <div className="flex items-start justify-between mb-4">
                    <span className={`text-[10px] font-mono font-semibold uppercase tracking-widest px-2.5 py-1 rounded-md border ${TYPE_COLORS[project.type] ?? 'bg-gold/10 text-gold border-gold/20'}`}>
                      {project.type}
                    </span>
                    <span className="text-xs text-muted font-mono">{t(`items.${project.id}.period`)}</span>
                  </div>

                  <h3 className="font-display font-bold text-lg text-warm-white mb-3 group-hover:text-gold transition-colors duration-300">
                    {project.title}
                  </h3>

                  <p className="text-sm text-muted leading-relaxed mb-5 flex-1">
                    {t(`items.${project.id}.description`)}
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

                  <span className="mt-auto inline-flex items-center gap-2 text-xs font-medium text-gold">
                    {t('details')}
                    <span className="transition-transform duration-200 group-hover:translate-x-0.5">→</span>
                  </span>
                </div>
              </TiltCard>
            </div>
          ))}
        </div>

        <ProjectModal project={selected} onClose={closeModal} />
      </Container>
    </Section>
  )
}
