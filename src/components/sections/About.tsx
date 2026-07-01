'use client'

import { useRef, useState } from 'react'
import dynamic from 'next/dynamic'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import { PERSONAL, STATS } from '@/lib/data'
import { SplitHeading, useReveal } from '@/lib/anim'
import { Section, Container } from '@/components/layout/Section'

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
  { icon: '⚡', label: 'EPITA Paris', desc: 'Cycle ingénieur, diplôme 2026' },
  { icon: '🏗️', label: 'Fullstack & DevOps', desc: 'Du code au déploiement' },
  { icon: '📈', label: 'Finance', desc: 'Systèmes quantitatifs & trading' },
  { icon: '🐳', label: 'Self-hosted', desc: 'Infra Docker personnelle' },
]

export default function About() {
  const sectionRef = useRef<HTMLDivElement>(null)
  useReveal(sectionRef)

  return (
    <Section id="about">
      <Container ref={sectionRef}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left — text + 3D orb */}
          <div>
            <p data-reveal className="text-xs font-mono tracking-[0.3em] text-gold uppercase mb-4">
              01 / À propos
            </p>

            <SplitHeading
              text="À PROPOS"
              className="font-display font-bold text-5xl md:text-6xl leading-tight text-warm-white mb-8"
            />

            <p data-reveal className="text-muted text-base md:text-lg leading-relaxed mb-6">
              {PERSONAL.bio}
            </p>

            <p data-reveal className="text-muted text-base leading-relaxed mb-10">
              Fasciné par la complexité des systèmes — qu&apos;il s&apos;agisse de pipelines de
              données, d&apos;architectures microservices ou de marchés financiers. Je recherche des
              projets où la rigueur technique rencontre un impact réel.
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
                <div
                  key={stat.label}
                  data-reveal
                  className="text-center border border-border rounded-2xl p-5 bg-dark-2/50 backdrop-blur-sm"
                >
                  <div className="font-display font-bold text-3xl md:text-4xl gradient-text mb-1">
                    <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                  </div>
                  <p className="text-xs text-muted leading-tight">{stat.label}</p>
                </div>
              ))}
            </div>

            <div className="space-y-3">
              {FEATURES.map((f) => (
                <div
                  key={f.label}
                  data-reveal
                  data-cursor-hover
                  className="group flex items-center gap-4 border border-border rounded-xl px-4 py-3.5 bg-dark-2/30 hover:bg-dark-3/50 hover:border-gold/30 transition-all duration-300"
                >
                  <span className="text-xl transition-transform duration-300 group-hover:scale-125">
                    {f.icon}
                  </span>
                  <div>
                    <p className="text-sm font-medium text-warm-white">{f.label}</p>
                    <p className="text-xs text-muted">{f.desc}</p>
                  </div>
                  <span className="ml-auto text-gold opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all duration-300">
                    →
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </Section>
  )
}
