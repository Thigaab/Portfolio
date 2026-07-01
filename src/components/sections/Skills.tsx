'use client'

import { useRef } from 'react'
import { useReveal, SplitHeading } from '@/lib/anim'
import TiltCard from '@/components/ui/TiltCard'
import { Section, Container } from '@/components/layout/Section'
import { SKILLS } from '@/lib/data'

const CATEGORY_STYLE: Record<string, { text: string; chip: string; dot: string }> = {
  Frontend: { text: 'text-sky-400', chip: 'border-sky-500/30 text-sky-300 bg-sky-500/5', dot: 'bg-sky-400' },
  Backend: { text: 'text-emerald-400', chip: 'border-emerald-500/30 text-emerald-300 bg-emerald-500/5', dot: 'bg-emerald-400' },
  DevOps: { text: 'text-violet-400', chip: 'border-violet-500/30 text-violet-300 bg-violet-500/5', dot: 'bg-violet-400' },
  Databases: { text: 'text-amber-400', chip: 'border-amber-500/30 text-amber-300 bg-amber-500/5', dot: 'bg-amber-400' },
  Languages: { text: 'text-gold', chip: 'border-gold/30 text-gold bg-gold/5', dot: 'bg-gold' },
}

export default function Skills() {
  const sectionRef = useRef<HTMLDivElement>(null)
  useReveal(sectionRef)

  return (
    <Section id="skills">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] max-w-[90vw] aspect-square rounded-full bg-gold/4 blur-[140px] pointer-events-none" />

      <Container ref={sectionRef} className="relative z-10">
        <div className="mb-16">
          <p data-reveal className="text-xs font-mono tracking-[0.3em] text-gold uppercase mb-4">
            02 / Stack technique
          </p>
          <SplitHeading
            text="COMPÉTENCES"
            className="font-display font-bold text-5xl md:text-6xl leading-tight text-warm-white"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">
          {SKILLS.map((group, idx) => {
            const style = CATEGORY_STYLE[group.category] ?? CATEGORY_STYLE.Languages
            return (
              <div data-reveal data-reveal-delay={(idx * 0.05).toString()} key={group.category}>
                <TiltCard
                  data-cursor-hover
                  className="h-full border border-border rounded-2xl p-5 bg-dark-2/40 backdrop-blur-sm hover:border-gold/25 transition-colors duration-300 group"
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
