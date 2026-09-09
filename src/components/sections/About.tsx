'use client'

import { useRef, type ReactNode } from 'react'
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

const LatticeCube = dynamic(() => import('@/components/canvas/LatticeCube'), { ssr: false })

function AnimatedCounter({ value, suffix }: { value: number; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null)

  useGSAP(() => {
    const el = ref.current
    if (!el) return
    ScrollTrigger.create({
      trigger: el,
      start: 'top 90%',
      once: true,
      onEnter: () => {
        gsap.to(
          { val: 0 },
          {
            val: value,
            duration: 2,
            ease: 'power2.out',
            // Written straight to the DOM. Going through setState here
            // re-rendered the whole card on every frame of the count, which
            // also churned the DOM enough to keep the cursor's old
            // MutationObserver busy.
            onUpdate: function () {
              el.textContent = `${Math.round(this.targets()[0].val)}${suffix}`
            },
          }
        )
      },
    })
  })

  return (
    <span ref={ref} className="tabular-nums">
      0{suffix}
    </span>
  )
}

function Icon({ children }: { children: ReactNode }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {children}
    </svg>
  )
}

const FEATURES = [
  {
    key: 'epita',
    accent: 'text-iris',
    icon: <Icon><path d="M12 4 2 9l10 5 10-5-10-5Z" /><path d="M6 11.5V16c0 1.4 2.7 2.5 6 2.5s6-1.1 6-2.5v-4.5" /></Icon>,
  },
  {
    key: 'fullstack',
    accent: 'text-coral',
    icon: <Icon><path d="M12 3 3 7.5l9 4.5 9-4.5L12 3Z" /><path d="m3 12 9 4.5L21 12" /><path d="m3 16.5 9 4.5 9-4.5" /></Icon>,
  },
  {
    key: 'systems',
    accent: 'text-moss',
    icon: <Icon><rect x="3" y="4" width="18" height="16" rx="2" /><path d="m8 10 2.5 2L8 14" /><path d="M13 15h4" /></Icon>,
  },
  {
    key: 'selfhosted',
    accent: 'text-plum',
    icon: <Icon><rect x="3" y="4" width="18" height="6" rx="2" /><rect x="3" y="14" width="18" height="6" rx="2" /><path d="M7 7h.01M7 17h.01" /></Icon>,
  },
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
          {/* Left — text + 3D lattice */}
          <div>
            <p data-reveal className="text-xs font-mono tracking-[0.28em] text-ink-3 uppercase mb-4">
              {t('eyebrow')}
            </p>

            <SplitHeading
              text={t('heading')}
              className="font-display text-6xl md:text-7xl leading-[0.95] tracking-[-0.02em] text-ink mb-8"
            />

            <p data-reveal className="text-ink-2 text-base md:text-lg leading-relaxed mb-6">
              {t('bio')}
            </p>

            <p data-reveal className="text-ink-2 text-base leading-relaxed mb-10">
              {t('paragraph2')}
            </p>

            {/* 3D lattice cube */}
            <div data-reveal className="h-56 w-full -ml-4" data-cursor-hover>
              <LatticeCube />
            </div>
          </div>

          {/* Right — stats + features */}
          <div>
            <div className="grid grid-cols-3 gap-4 mb-10">
              {STATS.map((stat) => (
                <div key={stat.key} data-reveal>
                  <TiltCard
                    max={6}
                    className="h-full text-center border border-line rounded-2xl p-5 bg-surface shadow-[0_1px_2px_rgba(23,22,29,0.04)]"
                  >
                    <div className="relative z-20">
                      <div className="font-display text-4xl md:text-5xl text-iris mb-1">
                        <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                      </div>
                      <p className="text-xs text-ink-3 leading-tight">{tStats(stat.key)}</p>
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
                    className="border border-line rounded-xl px-4 py-3.5 bg-surface shadow-[0_1px_2px_rgba(23,22,29,0.04)]"
                  >
                    <div className="relative z-20 flex items-center gap-4">
                      <span className={f.accent}>{f.icon}</span>
                      <div>
                        <p className="text-sm font-medium text-ink">{t(`features.${f.key}.label`)}</p>
                        <p className="text-xs text-ink-3">{t(`features.${f.key}.desc`)}</p>
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
