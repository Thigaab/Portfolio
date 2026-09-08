'use client'

import { useRef } from 'react'
import { useTranslations } from 'next-intl'
import { useReveal, SplitHeading } from '@/lib/anim'
import TiltCard from '@/components/ui/TiltCard'
import { Section, Container } from '@/components/layout/Section'
import { SKILLS } from '@/lib/data'

const CATEGORY_STYLE: Record<string, { text: string; chip: string; dot: string }> = {
  Frontend: { text: 'text-iris', chip: 'border-iris/25 text-iris bg-iris/5', dot: 'bg-iris' },
  Backend: { text: 'text-moss', chip: 'border-moss/25 text-moss bg-moss/5', dot: 'bg-moss' },
  DevOps: { text: 'text-plum', chip: 'border-plum/25 text-plum bg-plum/5', dot: 'bg-plum' },
  Databases: { text: 'text-ochre', chip: 'border-ochre/30 text-ochre bg-ochre/5', dot: 'bg-ochre' },
  Languages: { text: 'text-coral', chip: 'border-coral/30 text-coral bg-coral/5', dot: 'bg-coral' },
}

export default function Skills() {
  const t = useTranslations('skills')
  const sectionRef = useRef<HTMLDivElement>(null)
  useReveal(sectionRef)

  return (
    <Section id="skills">
      <Container ref={sectionRef} className="relative z-10">
        <div className="mb-16">
          <p data-reveal className="text-xs font-mono tracking-[0.28em] text-ink-3 uppercase mb-4">
            {t('eyebrow')}
          </p>
          <SplitHeading
            text={t('heading')}
            className="font-display text-6xl md:text-7xl leading-[0.95] tracking-[-0.02em] text-ink"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">
          {SKILLS.map((group, idx) => {
            const style = CATEGORY_STYLE[group.category] ?? CATEGORY_STYLE.Languages
            return (
              <div data-reveal data-reveal-delay={(idx * 0.05).toString()} key={group.category}>
                <TiltCard
                  data-cursor-hover
                  className="h-full border border-line rounded-2xl p-5 bg-surface/70 backdrop-blur-sm shadow-[0_1px_2px_rgba(23,22,29,0.04)] hover:border-line-strong transition-colors duration-300 group"
                >
                  <div className="relative z-20">
                    <div className="flex items-center gap-2 mb-4">
                      <div className={`w-1.5 h-1.5 rounded-full ${style.dot}`} />
                      <span className={`text-xs font-mono font-semibold uppercase tracking-widest ${style.text}`}>
                        {group.category}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {group.items.map((skill) => (
                        <span
                          key={skill}
                          className={`text-xs px-2.5 py-1 rounded-lg border font-medium transition-transform duration-200 hover:scale-105 ${style.chip}`}
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </TiltCard>
              </div>
            )
          })}
        </div>
      </Container>
    </Section>
  )
}
