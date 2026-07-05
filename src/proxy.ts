import createMiddleware from 'next-intl/middleware'
import { routing } from './i18n/routing'

// Next 16 renamed the `middleware` convention to `proxy`.
export default createMiddleware(routing)

export const config = {
  // Run on everything except API routes, Next internals and files with a dot
  // (favicon.ico, icon.svg, /hdri/*.hdr, …).
  matcher: '/((?!api|_next|_vercel|.*\\..*).*)',
}
