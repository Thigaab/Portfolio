'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { useTranslations } from 'next-intl'
import TypeChip from '@/components/ui/TypeChip'
import AwardBadge from '@/components/ui/AwardBadge'
import type { Project } from '@/lib/data'

const DRAG_SLOP = 6 // px of travel before a pointer gesture counts as a drag, not a click

function Arrow({ dir }: { dir: 'left' | 'right' }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={dir === 'left' ? 'M15 18l-6-6 6-6' : 'M9 18l6-6-6-6'} />
    </svg>
  )
}

export default function ProjectCarousel({
  projects,
  onSelect,
}: {
  projects: Project[]
  onSelect: (p: Project) => void
}) {
  const t = useTranslations('projects')
  const scroller = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(0)
  // Both arrows start enabled: the scroll offset is only knowable in the
  // browser — a reload restores the strip's scrollLeft before React hydrates,
  // so a server-rendered `disabled` is a guess React refuses to patch up.
  // `sync()` sets the truth on mount.
  const [atStart, setAtStart] = useState(false)
  const [atEnd, setAtEnd] = useState(false)

  // Drag state lives in a ref: it changes on every pointermove and must never
  // re-render the list.
  const drag = useRef({ down: false, capturing: false, startX: 0, startLeft: 0, moved: 0 })

  const sync = useCallback(() => {
    const el = scroller.current
    if (!el) return
    const max = el.scrollWidth - el.clientWidth
    setAtStart(el.scrollLeft <= 1)
    setAtEnd(el.scrollLeft >= max - 1)

    // Active card = the one whose left edge is closest to the scroll offset.
    let best = 0
    let bestDist = Infinity
    Array.from(el.children).forEach((c, i) => {
      const d = Math.abs((c as HTMLElement).offsetLeft - el.offsetLeft - el.scrollLeft)
      if (d < bestDist) {
        bestDist = d
        best = i
      }
    })
    setActive(best)
  }, [])

  useEffect(() => {
    sync()
    window.addEventListener('resize', sync)
    return () => window.removeEventListener('resize', sync)
  }, [sync])

  const scrollToCard = useCallback((i: number) => {
    const el = scroller.current
    const card = el?.children[i] as HTMLElement | undefined
    if (!el || !card) return
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    el.scrollTo({ left: card.offsetLeft - el.offsetLeft, behavior: reduced ? 'auto' : 'smooth' })
  }, [])

  const step = (dir: 1 | -1) =>
    scrollToCard(Math.min(projects.length - 1, Math.max(0, active + dir)))

  // Mouse drag. Touch is left to the browser's own momentum scrolling, which is
  // better than anything reimplemented here.
  const onPointerDown = (e: React.PointerEvent) => {
    const el = scroller.current
    if (!el || e.pointerType === 'touch') return
    drag.current = { down: true, capturing: false, startX: e.clientX, startLeft: el.scrollLeft, moved: 0 }
  }

  const onPointerMove = (e: React.PointerEvent) => {
    const el = scroller.current
    if (!el || !drag.current.down) return
    const dx = e.clientX - drag.current.startX
    if (Math.abs(dx) <= DRAG_SLOP) return

    // Capture only once this is unmistakably a drag. Capturing on pointerdown
    // also retargets the compatibility mouse events, so `click` would land on
    // this scroller instead of the card underneath and no card would ever open.
    if (!drag.current.capturing) {
      drag.current.capturing = true
      el.setPointerCapture(e.pointerId)
    }
    drag.current.moved = Math.max(drag.current.moved, Math.abs(dx))
    el.scrollLeft = drag.current.startLeft - dx
  }

  const onPointerUp = (e: React.PointerEvent) => {
    const el = scroller.current
    if (!el || !drag.current.down) return
    drag.current.down = false
    if (drag.current.capturing && el.hasPointerCapture(e.pointerId)) {
      el.releasePointerCapture(e.pointerId)
    }
    drag.current.capturing = false
  }

  // A drag ends with a pointerup over a card, which would otherwise open its
  // modal. Only treat it as a click if the pointer barely moved.
  const open = (p: Project) => {
    if (drag.current.moved > DRAG_SLOP) return
    onSelect(p)
  }

  return (
    <div data-reveal className="mt-14">
      <div className="mb-5 flex items-center justify-between gap-4">
        <h3 className="font-mono text-xs uppercase tracking-[0.28em] text-ink-3">{t('more')}</h3>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => step(-1)}
            disabled={atStart}
            aria-label={t('prev')}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-line text-ink-2 transition-colors duration-200 hover:border-iris/40 hover:text-ink disabled:pointer-events-none disabled:opacity-30"
          >
            <Arrow dir="left" />
          </button>
          <button
            type="button"
            onClick={() => step(1)}
            disabled={atEnd}
            aria-label={t('next')}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-line text-ink-2 transition-colors duration-200 hover:border-iris/40 hover:text-ink disabled:pointer-events-none disabled:opacity-30"
          >
            <Arrow dir="right" />
          </button>
        </div>
      </div>

      {/*
        data-lenis-prevent is required: Lenis calls preventDefault on every wheel
        event it handles, which would swallow horizontal trackpad swipes over
        this strip. The trade-off is that a vertical wheel here scrolls the page
        natively rather than through Lenis, which is the lesser evil.
      */}
      <div
        ref={scroller}
        data-lenis-prevent
        role="region"
        aria-label={t('carouselLabel')}
        tabIndex={0}
        onScroll={sync}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onKeyDown={(e) => {
          if (e.key === 'ArrowRight') {
            e.preventDefault()
            step(1)
          } else if (e.key === 'ArrowLeft') {
            e.preventDefault()
            step(-1)
          }
        }}
        className="flex snap-x snap-mandatory gap-5 overflow-x-auto pb-3 [scrollbar-width:none] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-iris/50 [&::-webkit-scrollbar]:hidden"
      >
        {projects.map((project) => (
          <div
            key={project.id}
            role="button"
            tabIndex={0}
            aria-label={project.title}
            data-cursor-hover
            onClick={() => open(project)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                onSelect(project)
              }
            }}
            className="group flex w-[16rem] shrink-0 select-none snap-start cursor-pointer flex-col overflow-hidden rounded-2xl border border-line bg-surface shadow-[0_1px_2px_rgba(23,22,29,0.04)] transition-colors duration-300 hover:border-iris/35 sm:w-[18rem]"
          >
            {/* draggable=false: without it, dragging the strip by an image
                starts the browser's native image drag instead of scrolling. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={project.cover ?? `/projects/${project.id}.svg`}
              alt=""
              draggable={false}
              className="aspect-[16/9] w-full border-b border-line object-cover"
            />

            <div className="flex flex-1 flex-col p-5">
            <div className="mb-4 flex items-start justify-between gap-2">
              <TypeChip type={project.type} />
              <span className="font-mono text-xs text-ink-3">{t(`items.${project.id}.period`)}</span>
            </div>

            <h4 className="mb-2 font-display text-xl leading-tight text-ink transition-colors duration-300 group-hover:text-iris">
              {project.title}
            </h4>

            {project.award && (
              <div className="mb-3">
                <AwardBadge label={t(`items.${project.id}.award`)} />
              </div>
            )}

            <p className="mb-4 line-clamp-2 text-sm leading-relaxed text-ink-2">
              {t(`items.${project.id}.description`)}
            </p>

            <div className="mt-auto flex flex-wrap gap-1.5">
              {project.tech.slice(0, 3).map((tech) => (
                <span
                  key={tech}
                  className="rounded-md border border-line bg-paper-2 px-2 py-0.5 font-mono text-[11px] text-ink-2"
                >
                  {tech}
                </span>
              ))}
            </div>

            <span className="mt-4 inline-flex items-center gap-2 text-xs font-medium text-iris">
              {t('details')}
              <span className="transition-transform duration-200 group-hover:translate-x-0.5">→</span>
            </span>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 flex items-center justify-center gap-2">
        {projects.map((project, i) => (
          <button
            key={project.id}
            type="button"
            onClick={() => scrollToCard(i)}
            aria-label={t('goTo', { name: project.title })}
            aria-current={i === active ? 'true' : undefined}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              i === active ? 'w-5 bg-iris' : 'w-1.5 bg-ink/20 hover:bg-ink/40'
            }`}
          />
        ))}
      </div>
    </div>
  )
}
