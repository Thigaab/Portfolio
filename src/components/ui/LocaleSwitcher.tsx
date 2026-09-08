'use client'

import { useLocale } from 'next-intl'
import { Link, usePathname } from '@/i18n/navigation'
import { routing } from '@/i18n/routing'

/** Compact FR/EN switch — keeps the current path, swaps the locale. */
export default function LocaleSwitcher() {
  const locale = useLocale()
  const pathname = usePathname()

  return (
    <div className="flex items-center gap-1 text-xs font-mono">
      {routing.locales.map((l, i) => (
        <span key={l} className="flex items-center gap-1">
          {i > 0 && <span className="text-ink-3/50">/</span>}
          <Link
            href={pathname}
            locale={l}
            aria-current={l === locale ? 'true' : undefined}
            className={
              l === locale
                ? 'text-iris'
                : 'text-ink-3 hover:text-ink transition-colors duration-200'
            }
          >
            {l.toUpperCase()}
          </Link>
        </span>
      ))}
    </div>
  )
}
