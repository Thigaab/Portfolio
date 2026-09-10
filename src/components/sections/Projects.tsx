'use client'

import { useCallback, useRef, useState } from 'react'
import { useTranslations } from 'next-intl'
import { useReveal, SplitHeading } from '@/lib/anim'
import TiltCard from '@/components/ui/TiltCard'
import TypeChip from '@/components/ui/TypeChip'
import AwardBadge from '@/components/ui/AwardBadge'
import { Section, Container } from '@/components/layout/Section'
import { PROJECTS, type Project } from '@/lib/data'
import ProjectModal from '@/components/sections/ProjectModal'
import ProjectCarousel from '@/components/sections/ProjectCarousel'

// The two featured shelves. Order matters: this is the reading order on the page.
const GROUPS = ['product', 'systems'] as const

/** Featured card, carrying the cover art that until now only the modal showed. */
function FeaturedCard({ project, onSelect }: { project: Project; onSelect: (p: Project) => void }) {
  const t = useTranslations('projects')

  return (
    <TiltCard
      data-cursor-hover
      role="button"
      tabIndex={0}
      aria-label={project.title}
      onClick={() => onSelect(project)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onSelect(project)
        }
      }}
      max={5}
      className="h-full group cursor-pointer overflow-hidden rounded-2xl border border-line bg-surface shadow-[0_1px_2px_rgba(23,22,29,0.04)] hover:border-iris/35 transition-colors duration-400 flex flex-col"
    >
      <div className="relative z-20 flex h-full flex-col">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={project.cover ?? `/projects/${project.id}.svg`}
          alt=""
          className="aspect-[3/2] w-full border-b border-line object-cover"
        />

        <div className="flex flex-1 flex-col p-7">
          <div className="mb-4 flex items-start justify-between gap-2">
            <TypeChip type={project.type} />
            <span className="font-mono text-xs text-ink-3">{t(`items.${project.id}.period`)}</span>
          </div>

          <h3 className="mb-3 font-display text-3xl leading-tight text-ink transition-colors duration-300 group-hover:text-iris">
            {project.title}
          </h3>

          {project.award && (
            <div className="-mt-1 mb-3">
              <AwardBadge label={t(`items.${project.id}.award`)} />
            </div>
          )}

          <p className="mb-6 flex-1 text-base leading-relaxed text-ink-2">
            {t(`items.${project.id}.description`)}
          </p>

          <div className="mb-5 flex flex-wrap gap-1.5">
            {project.tech.map((tech) => (
              <span
                key={tech}
                className="rounded-md border border-line bg-paper-2 px-2 py-0.5 font-mono text-[11px] text-ink-2"
              >
                {tech}
              </span>
            ))}
          </div>

          <span className="mt-auto inline-flex items-center gap-2 text-xs font-medium text-iris">
            {t('details')}
            <span className="transition-transform duration-200 group-hover:translate-x-0.5">→</span>
          </span>
        </div>
      </div>
    </TiltCard>
  )
}

export default function Projects() {
  const t = useTranslations('projects')
  const sectionRef = useRef<HTMLDivElement>(null)
  useReveal(sectionRef)
  const [selected, setSelected] = useState<Project | null>(null)
  const closeModal = useCallback(() => setSelected(null), [])
  const select = useCallback((p: Project) => setSelected(p), [])

  const rest = PROJECTS.filter((p) => !p.group)

  return (
    <Section id="projects">
      <div className="absolute top-0 left-6 right-6 sm:left-8 sm:right-8 lg:left-12 lg:right-12 h-px bg-line-strong" />

      <Container ref={sectionRef}>
        <div className="mb-16">
          <p data-reveal className="text-xs font-mono tracking-[0.28em] text-ink-3 uppercase mb-4">
            {t('eyebrow')}
          </p>
          <SplitHeading
            text={t('heading')}
            className="font-display text-6xl md:text-7xl leading-[0.95] tracking-[-0.02em] text-ink"
          />
        </div>

        {GROUPS.map((group) => (
          <section key={group} className="mb-14 last:mb-0">
            <h3
              data-reveal
              className="mb-5 font-mono text-xs uppercase tracking-[0.28em] text-ink-3"
            >
              {t(`groups.${group}`)}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {PROJECTS.filter((p) => p.group === group).map((project, idx) => (
                <div data-reveal data-reveal-delay={(idx * 0.05).toString()} key={project.id}>
                  <FeaturedCard project={project} onSelect={select} />
                </div>
              ))}
            </div>
          </section>
        ))}

        <ProjectCarousel projects={rest} onSelect={select} />

        <ProjectModal project={selected} onClose={closeModal} />
      </Container>
    </Section>
  )
}
