@AGENTS.md

# Portfolio — Thibaut Bonefont

Personal showcase / portfolio site. Owner: Thibaut Bonefont — fullstack + DevOps
engineer, EPITA Paris (2026). The site is deliberately **broad**, not tied to
one industry: the art direction is a light, warm **editorial / atelier** look —
printed paper, ink type, iris + coral accents, soft clay 3D. Keep it that way.
(An earlier dark/gold *finance* direction was dropped on purpose — the owner
likes finance but does not want the portfolio to pigeonhole them. Do not
reintroduce gold-on-black, candlesticks or market imagery.)

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
- `src/components/layout/BackgroundTexture.tsx` — global CSS background (ink dot grid + drifting risograph washes), behind a `relative z-10` content wrapper in `layout.tsx`. A `.grain-overlay` (multiplied paper noise) sits on top in `layout.tsx`.
- `src/components/providers/SmoothScroll.tsx` — Lenis ↔ GSAP wiring.
- `src/components/sections/` — Hero, About, Skills, Projects, Contact. Project cards open **`ProjectModal`** (portal to `document.body` — a `fixed` modal must escape the `transform`ed `TiltCard`/Lenis ancestors; `SmoothScroll` exports `getLenis()` so the modal pauses smooth scroll while open). Per-project **cover art is a hand-drawn SVG** at `public/projects/<id>.svg`; long descriptions live in messages `projects.items.<id>.long`; a project's live-site URL is the `website` field in `data.ts`.
- `src/components/canvas/` — `HeroScene.tsx`, `LatticeCube.tsx` (lazy-loaded via `next/dynamic` `ssr:false`).
- `src/components/ui/` — Navbar, CustomCursor, ScrollProgress, Magnetic, TiltCard, LocaleSwitcher.

## i18n (next-intl)

- Locales: **`fr` (default) + `en`**, `localePrefix: 'as-needed'` → French at `/`, English at `/en`. Config in `src/i18n/routing.ts`.
- Routing files: `src/i18n/{routing,navigation,request}.ts`, and **`src/proxy.ts`** (Next 16 renamed `middleware` → `proxy`; it's `createMiddleware(routing)`). `next.config.ts` is wrapped with `createNextIntlPlugin()`.
- All routed pages live under **`src/app/[locale]/`** (`layout.tsx` renders `<html lang={locale}>` + `NextIntlClientProvider`, calls `setRequestLocale`, exports `generateStaticParams`/`generateMetadata`). `favicon.ico`, `icon.svg`, `globals.css` stay at `src/app/` root.
- **Translatable text lives in `messages/{fr,en}.json`**, keyed by section. `data.ts` keeps only structural data (ids, tech, links) — projects/stats reference messages via their `id`/`key`. To add a string: add the key to BOTH json files, then `const t = useTranslations('<namespace>')` in the (client) component.
- Language switch: `LocaleSwitcher` uses locale-aware `Link`/`usePathname` from `src/i18n/navigation.ts`.

## Design system

- Colors (tokens in `globals.css`): `paper #f4f1ea` (page), `paper-2 #eae4d7`, `surface #fbf9f5` (cards), ink scale `ink #17161d` / `ink-2 #46434f` / `ink-3 #7c7787`, accents `iris #4a3aed` + `iris-soft #7a6bff` + `coral #ff6a45`, category-only hues `moss` / `ochre` / `plum`, and `line` / `line-strong` hairlines.
- **Two accents carry the identity: iris + coral.** `moss`/`ochre`/`plum` exist only to tag skill and project categories — don't spread them into layout chrome.
- Display font: **Instrument Serif** (400 + italic only — no bold; size and italic do the emphasis). Body/UI: Geist. Labels/eyebrows: Geist Mono, uppercase, tracked. Custom cursor (disabled on touch).
- Buttons are solid `bg-ink text-paper`, hovering to `bg-iris`. No glow shadows — this palette is flat and printed.

## 3D theme = SOFT CLAY (important)

Matte, hand-made objects on paper — never metallic, never dark.
- **HeroScene**: `ClayStill`, a still-life of soft clay primitives (iris torus knot, coral sphere, cream capsule, ochre rounded box) floating right of the type, + `HalftoneFloor`, an ink point grid that craters away from the cursor.
- **LatticeCube** (About section): a slowly tumbling cube frame, 12 ink bars and 8 accent corners, over a drei `<ContactShadows>` ground. All 12 edges of a cube are axis aligned, so each is a thin `boxGeometry` with no rotation maths. Corners are coloured by parity, which puts two of each accent on every face. Hover is tracked on the wrapping div, not the meshes: thin bars are miserable to hover in a 224px canvas, and an invisible hit mesh would be picked up by ContactShadows.
- **On this canvas the user rejected, in order:** a coral `MeshDistortMaterial` blob (disliked outright) and a folded paper dart (too thin, and its ivory face at `#fbf9f5` was 7 points of grey off the `#f4f1ea` page, so it vanished). Whatever sits here must have real volume or heavy ink linework, and must never use a near-paper tone as its main visible surface.
- **No `<Environment>` / HDRI anywhere.** Both canvases are lit by hemisphere + directional lights only, so nothing can suspend and blank a canvas. Materials are `metalness={0}` + `clearcoat` — clay, not metal. Don't add an env map to "improve" the look.

Do NOT go back to icosahedron + orbital rings (reads as an atom), and do not
reintroduce candlesticks or any market/chart imagery.

## Gotchas (learned the hard way — don't regress)

- **Scroll reveals**: use `useReveal`/`SplitHeading` (once-triggers, `start: 'top 90%'`) + the multi-`ScrollTrigger.refresh()` in `SmoothScroll`. `gsap.from()` scattered with ScrollTrigger left content stuck at `opacity:0` when triggers fired before layout settled.
- **R3F `<Environment>` needs `<Suspense>`** around it, or a suspended HDRI load blanks the whole canvas ("appears then disappears"). The current scenes dodge this by using no `Environment` at all — keep it that way. Avoid toggling `frameloop` to `'never'` — it clears the WebGL buffer (blank canvas).
- **drei `<Text>` blanks the canvas the same way**: it fetches a font (Roboto by default) and suspends; unwrapped (or if the fetch hangs/fails) the whole scene "appears then disappears". Avoid it for canvas labels — bake markings into geometry/texture instead.
- **Never use R3F `state.pointer` in `HeroScene`** — the hero's `z-[1]` gradient overlays cover the canvas with pointer-events, so it stays frozen at its initial value. `usePointerNDC()` tracks the cursor from a `window` `mousemove` and derives NDC from the canvas rect; `Scene` calls it once and passes the refs down to `ClayStill` / `HalftoneFloor` / `CameraRig`. `HalftoneFloor`'s grid is a *tilted* plane, so its cursor is mapped via a **raycaster onto the plane + `worldToLocal`** (NOT `ndc.x/y` directly). Points are then shoved radially away (+ `z` dip) from that local point.
- **Overflow**: `html,body { overflow-x: clip }` + `Section` has `overflow-hidden`; cap decorative glows at `max-w-[90vw]`.
- Motion should stay **slow/calm** — the user pushed back on fast, high-amplitude animation.
- **Keep `src/app/favicon.ico` even though `src/app/icon.svg` exists.** Browsers request `/favicon.ico` unconditionally, whatever `<link rel="icon">` says, so deleting it 404s on every page load. Next emits a link for both. Regenerate it from `icon.svg` rather than hand-editing:
  `rsvg-convert -w N -h N src/app/icon.svg -o N.png` for N in 16/32/48, then `magick 16.png 32.png 48.png -colors 256 src/app/favicon.ico`.
- **Next 16 renamed `middleware.ts` → `proxy.ts`** (root/`src`, default-exports a `proxy` fn). next-intl's `createMiddleware` goes there. Don't create a `middleware.ts`.

## Conventions

- Conventional Commits, short English messages. **Never add a `Co-Authored-By` / "Generated with Claude" trailer or any Anthropic attribution to commits.**
- Per-project cover SVGs in `public/projects/` follow the site palette (paper ground, iris/coral linework) — recolour any new one to match.
- `.char-wrap` carries `padding: 0 .05em; margin: 0 -.05em` so italic display glyphs aren't shaved off by the reveal mask. Don't remove it.
