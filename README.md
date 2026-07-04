# Xai — Living Intelligence

A high-fidelity, single-page interactive product experience that shows how **Xai** grows raw data into decisions:

> **raw signal → living structure → ranked insight → automations**

Built as a frontend challenge submission. The direction here — **Living Intelligence** — treats the product as an organism that *grows* understanding, rather than a machine that *processes* it. The goal was not a landing page; it's product-quality UI with intentional motion, custom 3D, and real interface craft.

---

## Live demo & video

- **Live site:** _add your Vercel URL here_
- **Walkthrough video (2 min):** _add your YouTube / Drive link here_

---

## What's inside

The page is one continuous scroll composed of four deliberate sections.

**1. Hero — Noise → Living Intelligence (Three.js)**
A GPU-driven field of ~4,500 particles begins as a chaotic cloud and blooms into an organic fibonacci-sphere formation as you scroll — the coral→violet "living gradient" sweeping in as it resolves. The bloom, per-particle stagger, arc-out transit, idle shimmer/breathing, and cursor repulsion all run in a custom GLSL shader; scroll progress is piped in from Framer Motion's `useScroll`. A soft "life bloom" cursor glow (not a crosshair) follows your pointer over the field.

**2. How it Flows (GSAP + ScrollTrigger)**
A pinned section that scrubs through the three real pipeline stages — **Listen → Connect → Bloom**. Each stage is pure SVG geometry (source funnel, a semantic graph, a bar/trend readout) that draws itself via `strokeDashoffset` and cross-fades on a scrubbed GSAP timeline. The left-hand narrative expands in sync with the animation.

**3. Your Workspace (Framer Motion)**
A mock product surface — sidebar, top bar, tabbed panels — not marketing cards. Charts (area, bar, donut, sparklines) are hand-built SVG with draw-in animations. Tabs (**Overview / Insights / Automations**) transition with `AnimatePresence`, and the tab underline glides between positions using a shared-layout (`layoutId`) animation. Automation rows are individually toggleable.

**4. The Living Cluster — signature interaction (Three.js)**
The WOW moment: 2,600 points that **reshape on command** between four living formations — **Seed** (raw cloud), **Bloom** (fibonacci shell), **Flow** (double helix), and **Ranked** (quantified bars). Switching snapshots the currently displayed positions on the CPU and morphs to the new target on the GPU (with an organic arc during transit), so transitions never pop even mid-flight. The cluster also gently orbits and reacts to cursor movement.

---

## Tech stack

| Concern | Choice |
| --- | --- |
| Framework | **Next.js 14** (App Router) |
| Language | **TypeScript** (strict) |
| UI motion | **Framer Motion** — choreography, layout & tab transitions |
| Timeline / scroll | **GSAP + ScrollTrigger** — pinned, scrubbed insight flow |
| 3D | **Three.js + React Three Fiber** — custom GLSL for hero & signature |
| Styling | **Tailwind CSS** with a warm, custom design-token layer |
| Type / fonts | **Bricolage Grotesque** (display) + **Plus Jakarta Sans** (UI) + **JetBrains Mono** (data), via Google Fonts |
| Icons | **lucide-react** |

All three required animation libraries are used, each where it is genuinely the best tool for the job. No UI kits, templates, or stock illustrations. All data is local mock data (`lib/data.ts`); there is no backend.

---

## Design decisions

- **Avoids both the "black + one acid accent" AI cliché and the "cream + serif + terracotta" AI cliché.** The base is a warm, greige-leaning ivory (`#F3EFE8` — never pure cream) with a warm near-black ink (`#241F1A`). Loud colour is rationed to a single **coral→rose→violet "living gradient"**, used only where something is *alive* — particles, chart lines, confidence bars, the primary CTA — so it always means "growth" rather than decoration.
- **Monospace as instrumentation.** JetBrains Mono is used for labels, metrics, and readouts, so the product still feels precise and data-driven even inside a warm, human palette.
- **One motion vocabulary.** Every entrance shares an `out-expo` ease and every morph an eased cubic (`lib/motion.ts`), so the whole page feels authored by one hand.
- **Warm "living field" viewports.** The Three.js stages sit inside a deep plum surface (not black), so the particle glow always reads warm — an intentional departure from the cold "data terminal" look.
- **Restraint over spectacle.** Generous spacing, a single 1240px content shell, soft elevation shadows instead of hairlines, and calm typography — motion supports comprehension of the product story rather than showing off.

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
- **Fonts load via a `<link>` tag** in `app/layout.tsx` rather than `next/font`, with `optimizeFonts: false` in `next.config.mjs`. This keeps `next build` fully network-free (useful on locked-down CI) while still resolving the exact family names the inline SVG charts reference. Swap to `next/font/google` any time if you'd rather self-host.

---

## Accessibility & quality floor

- **Reduced motion is respected everywhere.** `prefers-reduced-motion` is honoured both by a global CSS safety net and per-component: the hero settles to a mostly-bloomed static state, the insight flow renders its resolved scene without pinning/scrub, and the signature cluster snaps between formations instead of animating.
- **Keyboard focus is always visible** (coral focus ring), pointer focus is not.
- Semantic headings and accessible toggle controls (`role="switch"`) on the automation rows.
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
