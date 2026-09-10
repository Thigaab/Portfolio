'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { useTranslations } from 'next-intl'

function Arrow({ dir, size = 15 }: { dir: 'left' | 'right'; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={dir === 'left' ? 'M15 18l-6-6 6-6' : 'M9 18l6-6-6-6'} />
    </svg>
  )
}

/** Full-size viewer stacked above the project modal. */
function Lightbox({
  shots,
  name,
  index,
  onClose,
  onMove,
}: {
  shots: readonly string[]
  name: string
  index: number
  onClose: () => void
  onMove: (delta: 1 | -1) => void
}) {
  const t = useTranslations('projects')
  const closeRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    closeRef.current?.focus()
  }, [])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape' && e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return
      // Capture phase + stopPropagation so the project modal, which also
      // listens on window for Escape, never sees the key. Without this a
      // single Escape would close the viewer and the modal underneath it.
      e.stopPropagation()
      if (e.key === 'Escape') onClose()
      else onMove(e.key === 'ArrowRight' ? 1 : -1)
    }
    window.addEventListener('keydown', onKey, true)
    return () => window.removeEventListener('keydown', onKey, true)
  }, [onClose, onMove])

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label={t('shotAlt', { n: index + 1, name })}
      className="fixed inset-0 z-[110] flex items-center justify-center p-4 sm:p-8"
    >
      <div className="absolute inset-0 bg-ink/80 backdrop-blur-sm" onClick={onClose} aria-hidden="true" />

      <button
        ref={closeRef}
        type="button"
        onClick={onClose}
        aria-label={t('close')}
        className="absolute top-4 right-4 z-10 flex h-10 w-10 items-center justify-center rounded-full border border-paper/25 bg-ink/50 text-paper transition-colors duration-200 hover:bg-ink/80"
      >
        ✕
      </button>

      {shots.length > 1 && (
        <>
          <button
            type="button"
            onClick={() => onMove(-1)}
            aria-label={t('prev')}
            className="absolute left-3 z-10 flex h-11 w-11 items-center justify-center rounded-full border border-paper/25 bg-ink/50 text-paper transition-colors duration-200 hover:bg-ink/80 sm:left-6"
          >
            <Arrow dir="left" size={20} />
          </button>
          <button
            type="button"
            onClick={() => onMove(1)}
            aria-label={t('next')}
            className="absolute right-3 z-10 flex h-11 w-11 items-center justify-center rounded-full border border-paper/25 bg-ink/50 text-paper transition-colors duration-200 hover:bg-ink/80 sm:right-6"
          >
            <Arrow dir="right" size={20} />
          </button>
        </>
      )}

      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={shots[index]}
        alt={t('shotAlt', { n: index + 1, name })}
        draggable={false}
        className="relative z-[1] max-h-full max-w-full rounded-lg object-contain shadow-[0_24px_90px_rgba(0,0,0,0.5)]"
      />

      <p className="absolute bottom-5 z-10 font-mono text-xs text-paper/70">
        {index + 1} / {shots.length}
      </p>
    </div>,
    document.body
  )
}

/**
 * Horizontal strip of project screenshots, shown inside the modal. No drag
 * handling on purpose: the modal panel already stops Lenis, so native
 * scrolling and trackpad swipes work, and pointer capture would break clicks
 * the way it did in the project carousel.
 */
export default function ShotGallery({ shots, name }: { shots: readonly string[]; name: string }) {
  const t = useTranslations('projects')
  const ref = useRef<HTMLDivElement>(null)
  const [open, setOpen] = useState<number | null>(null)
  const lastFocused = useRef<HTMLElement | null>(null)

  const step = useCallback((dir: 1 | -1) => {
    const el = ref.current
    if (!el) return
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    el.scrollBy({ left: dir * (el.clientWidth * 0.8), behavior: reduced ? 'auto' : 'smooth' })
  }, [])

  const move = useCallback(
    (delta: 1 | -1) => setOpen((i) => (i === null ? i : (i + delta + shots.length) % shots.length)),
    [shots.length]
  )

  const close = useCallback(() => {
    setOpen(null)
    lastFocused.current?.focus() // send focus back to the thumbnail that opened it
  }, [])

  if (shots.length === 0) return null

  return (
    <div className="mb-8">
      <div className="mb-3 flex items-center justify-between gap-4">
        <h4 className="font-mono text-[11px] uppercase tracking-[0.22em] text-ink-3">{t('shots')}</h4>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => step(-1)}
            aria-label={t('prev')}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-line text-ink-2 transition-colors duration-200 hover:border-iris/40 hover:text-ink"
          >
            <Arrow dir="left" />
          </button>
          <button
            type="button"
            onClick={() => step(1)}
            aria-label={t('next')}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-line text-ink-2 transition-colors duration-200 hover:border-iris/40 hover:text-ink"
          >
            <Arrow dir="right" />
          </button>
        </div>
      </div>

      <div
        ref={ref}
        role="region"
        aria-label={t('shots')}
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'ArrowRight') {
            e.preventDefault()
            step(1)
          } else if (e.key === 'ArrowLeft') {
            e.preventDefault()
            step(-1)
          }
        }}
        className="flex snap-x snap-mandatory gap-3 overflow-x-auto pb-2 [scrollbar-width:none] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-iris/50 [&::-webkit-scrollbar]:hidden"
      >
        {shots.map((src, i) => (
          <button
            key={src}
            type="button"
            data-cursor-hover
            aria-label={t('enlarge', { n: i + 1 })}
            onClick={(e) => {
              lastFocused.current = e.currentTarget
              setOpen(i)
            }}
            className="shrink-0 snap-start overflow-hidden rounded-lg border border-line bg-paper-2 transition-colors duration-200 hover:border-iris/40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-iris/50"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={src}
              alt={t('shotAlt', { n: i + 1, name })}
              draggable={false}
              loading="lazy"
              className="h-80 w-auto object-contain"
            />
          </button>
        ))}
      </div>

      {/* open only ever becomes non-null from a click, so the portal never
          runs during SSR and needs no mounted guard. */}
      {open !== null && (
        <Lightbox shots={shots} name={name} index={open} onClose={close} onMove={move} />
      )}
    </div>
  )
}
