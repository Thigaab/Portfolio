import { defineRouting } from 'next-intl/routing'

export const routing = defineRouting({
  locales: ['fr', 'en'],
  defaultLocale: 'fr',
  // French (primary) served at `/`, English at `/en`.
  localePrefix: 'as-needed',
})
