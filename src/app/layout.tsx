import type { Metadata } from 'next'
import { Geist, Geist_Mono, Space_Grotesk } from 'next/font/google'
import './globals.css'
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

export const metadata: Metadata = {
  title: 'Thibaut Bonefont — Fullstack Engineer',
  description:
    'Portfolio de Thibaut Bonefont, ingénieur Fullstack & DevOps, étudiant à l\'EPITA Paris. Spécialisé en systèmes distribués et finance.',
  keywords: ['fullstack', 'devops', 'finance', 'epita', 'react', 'java', 'docker'],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="fr"
      className={`${geistSans.variable} ${geistMono.variable} ${spaceGrotesk.variable}`}
    >
      <body className="bg-dark text-warm-white antialiased overflow-x-hidden">
        <BackgroundTexture />
        <div className="noise-overlay" aria-hidden="true" />
        <SmoothScroll>
          <CustomCursor />
          <ScrollProgress />
          <div className="relative z-10">
            <Navbar />
            {children}
          </div>
        </SmoothScroll>
      </body>
    </html>
  )
}
