'use client'

import { useEffect } from 'react'
import Lenis from 'lenis'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const lenis = new Lenis({
      lerp: 0.08,
      smoothWheel: true,
      wheelMultiplier: 1,
    })

    lenis.on('scroll', ScrollTrigger.update)

    const tick = (time: number) => lenis.raf(time * 1000)
    gsap.ticker.add(tick)
    gsap.ticker.lagSmoothing(0)

    // Robust refresh: recompute trigger positions after layout, fonts and full
    // load settle, so reveals below the fold never get stuck hidden.
    const refresh = () => ScrollTrigger.refresh()
    requestAnimationFrame(() => requestAnimationFrame(refresh))
    const t1 = setTimeout(refresh, 300)
    const t2 = setTimeout(refresh, 1200)
    window.addEventListener('load', refresh)
    if (document.fonts?.ready) document.fonts.ready.then(refresh)

    return () => {
      lenis.destroy()
      gsap.ticker.remove(tick)
      clearTimeout(t1)
      clearTimeout(t2)
      window.removeEventListener('load', refresh)
    }
  }, [])

  return <>{children}</>
}
