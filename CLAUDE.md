@AGENTS.md

# Portfolio — Thibaut Bonefont

Personal showcase / portfolio site. Owner: Thibaut Bonefont — fullstack + DevOps
engineer, EPITA Paris (2026), strong interest in **finance**. The whole site
leans into a premium dark/gold **finance** aesthetic — keep it that way.

## Stack

- **Next.js 16** (App Router, Turbopack) — ⚠️ breaking changes vs training data, see `@AGENTS.md`
- **React 19** + TypeScript
- **React Three Fiber** + **drei** (`three` ~0.185) for WebGL 3D
- **GSAP** + **ScrollTrigger** + `@gsap/react` for animation
- **Lenis** for smooth scroll
- **Tailwind CSS v4** (config-less, `@theme` in `globals.css`)

## Commands

```bash
npm run dev      # dev server (localhost:3000)
npm run build    # production build — run this to type-check
npm run lint
```

## Architecture

- `src/lib/data.ts` — all site content (bio, skills, projects, stats). Edit content here.
- `src/lib/anim.tsx` — `useReveal(scope)` + `<SplitHeading>` scroll-reveal primitives.
- `src/components/layout/Section.tsx` — `<Section>` (band) + `<Container>` (centered column). **Every section AND the navbar use these** so left edges align. Don't reintroduce ad-hoc `px-*` paddings.
- `src/components/layout/BackgroundTexture.tsx` — global CSS background (dotted grid + drifting gold aurora), behind a `relative z-10` content wrapper in `layout.tsx`.
- `src/components/providers/SmoothScroll.tsx` — Lenis ↔ GSAP wiring.
- `src/components/sections/` — Hero, About, Skills, Projects, Contact.
- `src/components/canvas/` — `HeroScene.tsx`, `AboutOrb.tsx` (lazy-loaded via `next/dynamic` `ssr:false`).
- `src/components/ui/` — Navbar, CustomCursor, ScrollProgress, Magnetic, TiltCard.

## Design system

- Colors (tokens in `globals.css`): `dark #050505`, `gold #d4a853`, `gold-light #f0c060`, `amber #e8923a`, `warm-white #f5f5f0`, `muted #888`.
- Display font: Space Grotesk. Custom cursor (disabled on touch).

## 3D theme = FINANCE (important)

The user explicitly rejected atom/molecule-looking 3D. Current centerpieces:
- **HeroScene**: animated 3D **candlestick chart** (`CandleChart` — gold bullish / bronze bearish candles, upward trend, glowing trend line) + a point-grid floor (`WaveField`) + orbiting particles.
- **AboutOrb**: rotating **gold coin stack** (spins on hover).

Do NOT go back to icosahedron + orbital rings (reads as an atom).

## Gotchas (learned the hard way — don't regress)

- **Scroll reveals**: use `useReveal`/`SplitHeading` (once-triggers, `start: 'top 90%'`) + the multi-`ScrollTrigger.refresh()` in `SmoothScroll`. `gsap.from()` scattered with ScrollTrigger left content stuck at `opacity:0` when triggers fired before layout settled.
- **R3F `<Environment>` needs `<Suspense>`** around it, or a suspended HDRI load blanks the whole canvas ("appears then disappears"). Avoid toggling `frameloop` to `'never'` — it clears the WebGL buffer (blank canvas).
- **WaveField cursor repulsion**: the grid is a tilted plane, so map the cursor via a **raycaster onto the plane + `worldToLocal`**, NOT `pointer.x/y` directly (that projects to the wrong spot). Points are pushed radially away from that local point.
- **Overflow**: `html,body { overflow-x: clip }` + `Section` has `overflow-hidden`; cap decorative glows at `max-w-[90vw]`.
- Motion should stay **slow/calm** — the user pushed back on fast, high-amplitude animation.

## Conventions

- Conventional Commits, short English messages. Commit trailer: `Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>`.
- A finance project is planned but not built yet — no placeholder card for it.
