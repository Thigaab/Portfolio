# Portfolio — Thibaut Bonefont

Personal portfolio site — a premium, interactive showcase with a dark/gold
**finance** aesthetic, 3D WebGL scenes and scroll-driven animation.

🔗 [github.com/Thigaab](https://github.com/Thigaab) · [LinkedIn](https://www.linkedin.com/in/thibaut-bonefont-aa7822268/)

## Tech stack

| Domain | Tools |
| --- | --- |
| Framework | [Next.js 16](https://nextjs.org) (App Router, Turbopack), React 19, TypeScript |
| 3D / WebGL | [React Three Fiber](https://r3f.docs.pmnd.rs) + [drei](https://github.com/pmndrs/drei), [three.js](https://threejs.org) |
| Animation | [GSAP](https://gsap.com) + ScrollTrigger, [Lenis](https://lenis.darkroom.engineering) smooth scroll |
| Styling | [Tailwind CSS v4](https://tailwindcss.com) |

## Highlights

- Animated 3D **candlestick chart** hero with a cursor-reactive point grid
- Gold coin-stack 3D element, magnetic buttons and 3D tilt cards
- Global animated background (dotted grid + drifting gold aurora)
- Smooth scrolling with scroll-triggered section reveals

## Getting started

```bash
npm install
npm run dev      # http://localhost:3000
```

## Scripts

```bash
npm run dev      # development server
npm run build    # production build
npm run start    # serve the production build
npm run lint     # lint
```

## Project structure

```
src/
├── app/                 # Next.js App Router (layout, page, global styles)
├── components/
│   ├── canvas/          # React Three Fiber scenes
│   ├── sections/        # Hero, About, Skills, Projects, Contact
│   ├── layout/          # Section/Container, background texture
│   ├── providers/       # smooth scroll
│   └── ui/              # navbar, cursor, magnetic, tilt, scroll progress
└── lib/                 # site content (data.ts) + animation helpers
```
