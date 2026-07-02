# Xai — Intelligence Workspace

A high-fidelity, single-page interactive product experience that shows how **Xai** turns raw data into decisions:

> **raw data → structured intelligence → actionable insight → automations**

Built as a frontend challenge submission. The goal was not a landing page — it's a product-quality interactive UI with intentional motion, custom 3D, and real interface craft.

---

## Live demo & video

- **Live site:** _add your Vercel URL here_
- **Walkthrough video (2 min):** _add your YouTube / Drive link here_

---

## What's inside

The page is one continuous scroll composed of four deliberate sections, each demonstrating a different discipline.

**1. Hero — Data → Intelligence (Three.js)**
A GPU-driven field of ~4,500 particles begins as a chaotic sphere and resolves into an ordered lattice as you scroll. The morph, per-particle stagger, cursor repulsion, and cyan→indigo colouring all run in a custom GLSL shader; scroll progress is piped in from Framer Motion's `useScroll`. Copy choreography is staggered with Framer Motion.

**2. Interactive Insight Flow (GSAP + ScrollTrigger)**
A pinned section that scrubs through the three real pipeline stages — **Ingest → Analyze → Generate**. Each stage is pure SVG geometry (source funnels, a reasoning graph, a bar/trend readout) that draws itself via `strokeDashoffset` and cross-fades on a scrubbed GSAP timeline. The left-hand narrative highlights and expands in sync with the animation.

**3. Intelligence Dashboard (Framer Motion)**
A mock product surface — sidebar, top bar, tabbed panels — not marketing cards. Charts (area, bar, donut, sparklines) are hand-built SVG with draw-in animations. Tabs (**Overview / Insights / Automations**) transition with `AnimatePresence`, and both the sidebar selection and the tab underline glide between positions using shared-layout (`layoutId`) animations. Cards and rows have hover feedback.

**4. Signature Interaction — the reorganizing cluster (Three.js)**
The WOW moment: 2,600 points that **reorganize on command** between four formations — a raw cloud, a structured grid, a double-helix "flow", and 3D insight bars. Switching snapshots the currently displayed positions on the CPU and morphs to the new target on the GPU (with an organic arc during transit), so transitions never pop even mid-flight. The cluster responds to cursor movement with damped parallax.

---

## Tech stack

| Concern | Choice |
| --- | --- |
| Framework | **Next.js 14** (App Router) |
| Language | **TypeScript** (strict) |
| UI motion | **Framer Motion** — choreography, layout & tab transitions |
| Timeline / scroll | **GSAP + ScrollTrigger** — pinned, scrubbed insight flow |
| 3D | **Three.js + React Three Fiber** — custom GLSL for hero & signature |
| Styling | **Tailwind CSS** with a small custom design-token layer |
| Type / fonts | **Geist Sans + Geist Mono** |
| Icons | **lucide-react** |

All three required animation libraries are used, each where it is genuinely the best tool for the job. No UI kits, templates, or stock illustrations. All data is local mock data (`lib/data.ts`); there is no backend.

---

## Design decisions

- **Palette avoids the "black + one acid accent" AI cliché.** The base is a cool graphite (`#0B0D12`, deliberately blue-black, never pure `#000`) paired with a *warm* off-white (`#F3F3F1`). That subtle temperature contrast reads as premium. Loud colour is rationed to a single **cyan→indigo signal gradient** used only for data — particles, chart lines, confidence bars — so it always *means* "intelligence" rather than decoration.
- **Monospace as meaning.** Geist Mono is used for labels, metrics, and readouts to encode the "machine / data" feel; Geist Sans carries all prose.
- **One motion vocabulary.** Every entrance shares an `out-expo` ease and every morph an `in-out-quart` ease (`lib/motion.ts`), so the whole page feels authored by one hand.
- **Restraint over spectacle.** Generous spacing, a single 1200px content shell, hairline borders, and calm typography — motion supports comprehension of the product story rather than showing off.

---

## Engineering notes

```
app/                 App Router entry, global styles, font wiring
components/
  sections/          Hero, InsightFlow, Dashboard, Signature, Navbar, Footer
  three/             DataField + MorphCluster shaders and their SSR-safe canvases
  dashboard/         Sidebar, TopBar, and hand-built SVG charts
  ui/                Reveal, Eyebrow, SectionHeading, WindowFrame primitives
hooks/               usePrefersReducedMotion, useIsomorphicLayoutEffect
lib/                 motion tokens, mock data, small math/utility helpers
```

- **Animation architecture.** Shared motion tokens live in one place; reusable primitives (`Reveal`, `SectionHeading`) keep scroll-reveals consistent; each heavy technique is isolated in its own component.
- **Both R3F canvases are dynamically imported (`ssr: false`)** and code-split, so Three.js never blocks first paint. Each canvas **pauses its render loop when off-screen** via an `IntersectionObserver`, keeping the page light when the 3D isn't visible.
- **GSAP** is registered inside effects and scoped with `gsap.context()` + `ctx.revert()` for clean teardown — no leaked ScrollTriggers on unmount.

---

## Accessibility & quality floor

- **Reduced motion is respected everywhere.** `prefers-reduced-motion` is honoured both by a global CSS safety net and per-component: the hero settles to a static structured state, the insight flow renders without pinning/scrub, and the signature cluster snaps between formations instead of animating.
- **Keyboard focus is always visible** (accent focus ring), pointer focus is not.
- Semantic headings, `aria-label`s on icon-only controls, and `role="tablist"` on the interactive switchers.
- Responsive from mobile up; the dashboard sidebar collapses on small screens.

---

## Run locally

Requires **Node 18.17+** (Node 20 recommended).

```bash
npm install
npm run dev        # http://localhost:3000
```

Other scripts:

```bash
npm run build      # production build
npm run start      # serve the production build
npm run typecheck  # tsc --noEmit
npm run lint       # next lint
```

---

## Deploying to Vercel

1. Push this repo to GitHub.
2. Import it at [vercel.com/new](https://vercel.com/new) — the framework preset is detected automatically.
3. No environment variables are required. Deploy.
