'use client'

import { useCallback, useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { useTranslations } from 'next-intl'
import { getLenis } from '@/components/providers/SmoothScroll'
import type { Project } from '@/lib/data'

const ARROW = (
  <span className="transition-transform duration-200 group-hover:translate-x-0.5">→</span>
)

export default function ProjectModal({
  project,
  onClose,
}: {
  project: Project | null
  onClose: () => void
}) {
  const t = useTranslations('projects')
  const [mounted, setMounted] = useState(false)
  const [visible, setVisible] = useState(false)

  useEffect(() => setMounted(true), [])

  const close = useCallback(() => {
    setVisible(false)
    setTimeout(onClose, 220) // let the exit transition play before unmount
  }, [onClose])

  useEffect(() => {
    if (!project) return
    const raf = requestAnimationFrame(() => setVisible(true))
    getLenis()?.stop() // lock background scroll while open
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close()
    }
    window.addEventListener('keydown', onKey)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('keydown', onKey)
      getLenis()?.start()
    }
  }, [project, close])

  if (!mounted || !project) return null

  const { id, title, tech, type, github, website, cover } = project

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label={title}
      className={`fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 transition-opacity duration-300 ${
        visible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <div className="absolute inset-0 bg-dark/80 backdrop-blur-md" onClick={close} aria-hidden="true" />

      <div
        data-lenis-prevent
        className={`relative z-10 w-full max-w-2xl max-h-[88vh] overflow-y-auto rounded-2xl border border-border bg-dark-2 shadow-[0_24px_90px_rgba(0,0,0,0.65)] transition-all duration-300 ${
          visible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-4 scale-[0.97]'
        }`}
      >
        <button
          onClick={close}
          aria-label={t('close')}
          className="absolute top-4 right-4 z-20 flex h-9 w-9 items-center justify-center rounded-full border border-border bg-dark/60 text-muted backdrop-blur-sm hover:text-warm-white hover:border-gold/40 transition-colors duration-200"
        >
          ✕
        </button>

        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={cover ?? `/projects/${id}.svg`}
          alt=""
          className="aspect-[16/9] w-full rounded-t-2xl border-b border-border object-cover"
        />

        <div className="p-6 sm:p-8">
          <div className="mb-3 flex items-center gap-3">
            <span className="rounded-md border border-gold/25 bg-gold/10 px-2.5 py-1 text-[10px] font-mono font-semibold uppercase tracking-widest text-gold">
              {type}
            </span>
            <span className="font-mono text-xs text-muted">{t(`items.${id}.period`)}</span>
          </div>

          <h3 className="mb-4 font-display text-2xl font-bold text-warm-white md:text-3xl">{title}</h3>

          <p className="mb-6 leading-relaxed text-muted">{t(`items.${id}.long`)}</p>

          <div className="mb-8 flex flex-wrap gap-1.5">
            {tech.map((tItem) => (
              <span
                key={tItem}
                className="rounded-md border border-dark-4 bg-dark-4 px-2 py-0.5 font-mono text-[11px] text-muted"
              >
                {tItem}
              </span>
            ))}
          </div>

          <div className="flex flex-wrap gap-3">
            {website && (
              <a
                href={website}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-2 rounded-full bg-gold px-5 py-2.5 text-sm font-semibold text-dark transition-shadow duration-300 hover:shadow-[0_0_30px_rgba(212,168,83,0.4)]"
              >
                {t('visitSite')} {ARROW}
              </a>
            )}
            {github && (
              <a
                href={github}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-2 rounded-full border border-gold/30 px-5 py-2.5 text-sm font-medium text-gold transition-colors duration-300 hover:bg-gold/10"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
                </svg>
                {t('viewGithub')}
              </a>
            )}
            {!github && !website && (
              <span className="font-mono text-xs italic text-muted/60">{t('privateCode')}</span>
            )}
          </div>
        </div>
      </div>
    </div>,
    document.body
  )
}
