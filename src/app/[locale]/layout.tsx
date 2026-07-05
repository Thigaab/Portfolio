import type { Metadata } from 'next'
import { Geist, Geist_Mono, Space_Grotesk } from 'next/font/google'
import { notFound } from 'next/navigation'
import { NextIntlClientProvider, hasLocale } from 'next-intl'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { routing } from '@/i18n/routing'
import '../globals.css'
import SmoothScroll from '@/components/providers/SmoothScroll'
import CustomCursor from '@/components/ui/CustomCursor'
import Navbar from '@/components/ui/Navbar'
import ScrollProgress from '@/components/ui/ScrollProgress'
import BackgroundTexture from '@/components/layout/BackgroundTexture'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

const spaceGrotesk = Space_Grotesk({
  variable: '--font-space-grotesk',
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
})

type Props = {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'metadata' })
  return {
    title: t('title'),
    description: t('description'),
    keywords: ['fullstack', 'devops', 'finance', 'epita', 'react', 'java', 'docker'],
    alternates: {
      canonical: locale === routing.defaultLocale ? '/' : `/${locale}`,
      languages: { fr: '/', en: '/en' },
    },
  }
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params
  if (!hasLocale(routing.locales, locale)) notFound()
  setRequestLocale(locale)

  return (
    <html
      lang={locale}
      className={`${geistSans.variable} ${geistMono.variable} ${spaceGrotesk.variable}`}
    >
      <body className="bg-dark text-warm-white antialiased overflow-x-hidden">
        <BackgroundTexture />
        <div className="noise-overlay" aria-hidden="true" />
        <NextIntlClientProvider>
          <SmoothScroll>
            <CustomCursor />
            <ScrollProgress />
            <div className="relative z-10">
              <Navbar />
              {children}
            </div>
          </SmoothScroll>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
