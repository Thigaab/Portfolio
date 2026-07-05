'use client'

import { useRef, useState } from 'react'
import dynamic from 'next/dynamic'
import { useTranslations } from 'next-intl'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import { STATS } from '@/lib/data'
import { SplitHeading, useReveal } from '@/lib/anim'
import { Section, Container } from '@/components/layout/Section'
import TiltCard from '@/components/ui/TiltCard'

gsap.registerPlugin(ScrollTrigger, useGSAP)

const AboutOrb = dynamic(() => import('@/components/canvas/AboutOrb'), { ssr: false })

function AnimatedCounter({ value, suffix }: { value: number; suffix: string }) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const triggered = useRef(false)

  useGSAP(() => {
    ScrollTrigger.create({
      trigger: ref.current,
      start: 'top 90%',
      once: true,
      onEnter: () => {
        if (triggered.current) return
        triggered.current = true
        gsap.to(
          { val: 0 },
          {
            val: value,
            duration: 2,
            ease: 'power2.out',
            onUpdate: function () {
              setCount(Math.round(this.targets()[0].val))
            },
          }
        )
      },
    })
  })

  return (
    <span ref={ref} className="tabular-nums">
      {count}
      {suffix}
    </span>
  )
}

const FEATURES = [
  { icon: '⚡', key: 'epita' },
  { icon: '🏗️', key: 'fullstack' },
  { icon: '📈', key: 'finance' },
  { icon: '🐳', key: 'selfhosted' },
] as const

export default function About() {
  const t = useTranslations('about')
  const tStats = useTranslations('stats')
  const sectionRef = useRef<HTMLDivElement>(null)
  useReveal(sectionRef)

  return (
    <Section id="about">
      <Container ref={sectionRef}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left — text + 3D orb */}
          <div>
            <p data-reveal className="text-xs font-mono tracking-[0.3em] text-gold uppercase mb-4">
              {t('eyebrow')}
            </p>

            <SplitHeading
              text={t('heading')}
              className="font-display font-bold text-5xl md:text-6xl leading-tight text-warm-white mb-8"
            />

            <p data-reveal className="text-muted text-base md:text-lg leading-relaxed mb-6">
              {t('bio')}
            </p>

            <p data-reveal className="text-muted text-base leading-relaxed mb-10">
              {t('paragraph2')}
            </p>

            {/* 3D orb */}
            <div data-reveal className="h-56 w-full -ml-4" data-cursor-hover>
              <AboutOrb />
            </div>
          </div>

          {/* Right — stats + features */}
          <div>
            <div className="grid grid-cols-3 gap-4 mb-10">
              {STATS.map((stat) => (
                <div key={stat.key} data-reveal>
                  <TiltCard
                    max={6}
                    className="text-center border border-border rounded-2xl p-5 bg-dark-2/50 backdrop-blur-sm"
                  >
                    <div className="relative z-20">
                      <div className="font-display font-bold text-3xl md:text-4xl gradient-text mb-1">
                        <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                      </div>
                      <p className="text-xs text-muted leading-tight">{tStats(stat.key)}</p>
                    </div>
                  </TiltCard>
                </div>
              ))}
            </div>

            <div className="space-y-3">
              {FEATURES.map((f) => (
                <div key={f.key} data-reveal>
                  <TiltCard
                    max={6}
                    className="border border-border rounded-xl px-4 py-3.5 bg-dark-2/30"
                  >
                    <div className="relative z-20 flex items-center gap-4">
                      <span className="text-xl">{f.icon}</span>
                      <div>
                        <p className="text-sm font-medium text-warm-white">{t(`features.${f.key}.label`)}</p>
                        <p className="text-xs text-muted">{t(`features.${f.key}.desc`)}</p>
                      </div>
                    </div>
                  </TiltCard>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </Section>
  )
}
