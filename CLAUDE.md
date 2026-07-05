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
- **next-intl** for i18n (FR default + EN)

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
- `src/components/ui/` — Navbar, CustomCursor, ScrollProgress, Magnetic, TiltCard, LocaleSwitcher.

## i18n (next-intl)

- Locales: **`fr` (default) + `en`**, `localePrefix: 'as-needed'` → French at `/`, English at `/en`. Config in `src/i18n/routing.ts`.
- Routing files: `src/i18n/{routing,navigation,request}.ts`, and **`src/proxy.ts`** (Next 16 renamed `middleware` → `proxy`; it's `createMiddleware(routing)`). `next.config.ts` is wrapped with `createNextIntlPlugin()`.
- All routed pages live under **`src/app/[locale]/`** (`layout.tsx` renders `<html lang={locale}>` + `NextIntlClientProvider`, calls `setRequestLocale`, exports `generateStaticParams`/`generateMetadata`). `favicon.ico`, `icon.svg`, `globals.css` stay at `src/app/` root.
- **Translatable text lives in `messages/{fr,en}.json`**, keyed by section. `data.ts` keeps only structural data (ids, tech, links) — projects/stats reference messages via their `id`/`key`. To add a string: add the key to BOTH json files, then `const t = useTranslations('<namespace>')` in the (client) component.
- Language switch: `LocaleSwitcher` uses locale-aware `Link`/`usePathname` from `src/i18n/navigation.ts`.

## Design system

- Colors (tokens in `globals.css`): `dark #050505`, `gold #d4a853`, `gold-light #f0c060`, `amber #e8923a`, `warm-white #f5f5f0`, `muted #888`.
- Display font: Space Grotesk. Custom cursor (disabled on touch).

## 3D theme = FINANCE (important)

The user explicitly rejected atom/molecule-looking 3D. Current centerpieces:
- **HeroScene**: animated 3D **candlestick chart** (`CandleChart` — gold bullish / bronze bearish candles, upward trend, glowing trend line) + a point-grid floor (`WaveField`) + orbiting particles.
- **AboutOrb**: a **molten-gold blob** — metallic icosahedron with drei `MeshDistortMaterial` (churns harder/faster on hover), slow spin. Reflections come from a local Shanghai-night HDRI (`public/hdri/shanghai_bund_2k.hdr`, CC0 Poly Haven) so city lights play across the gold. (User rejected earlier coin-stack, dotted-globe and bullion-bar versions, and every built-in `Environment` preset.)

Do NOT go back to icosahedron + orbital rings (reads as an atom).

## Gotchas (learned the hard way — don't regress)

- **Scroll reveals**: use `useReveal`/`SplitHeading` (once-triggers, `start: 'top 90%'`) + the multi-`ScrollTrigger.refresh()` in `SmoothScroll`. `gsap.from()` scattered with ScrollTrigger left content stuck at `opacity:0` when triggers fired before layout settled.
- **R3F `<Environment>` needs `<Suspense>`** around it, or a suspended HDRI load blanks the whole canvas ("appears then disappears"). Avoid toggling `frameloop` to `'never'` — it clears the WebGL buffer (blank canvas).
- **drei `<Text>` blanks the canvas the same way**: it fetches a font (Roboto by default) and suspends; unwrapped (or if the fetch hangs/fails) the whole scene "appears then disappears". Avoid it for canvas labels — bake markings into geometry/texture instead.
- **WaveField cursor repulsion**: don't use R3F `state.pointer` — the hero's `z-[1]` gradient overlays cover the canvas with pointer-events, so it stays frozen. Track the cursor from a `window` `mousemove` and derive NDC from the canvas rect. The grid is a tilted plane, so map that cursor via a **raycaster onto the plane + `worldToLocal`** (NOT `pointer.x/y` directly). Points are then shoved radially away (+ `z` dip) from that local point.
- **Overflow**: `html,body { overflow-x: clip }` + `Section` has `overflow-hidden`; cap decorative glows at `max-w-[90vw]`.
- Motion should stay **slow/calm** — the user pushed back on fast, high-amplitude animation.
- **Next 16 renamed `middleware.ts` → `proxy.ts`** (root/`src`, default-exports a `proxy` fn). next-intl's `createMiddleware` goes there. Don't create a `middleware.ts`.

## Conventions

- Conventional Commits, short English messages. **Never add a `Co-Authored-By` / "Generated with Claude" trailer or any Anthropic attribution to commits.**
- A finance project is planned but not built yet — no placeholder card for it.
