import { Navbar } from "@/components/sections/Navbar";
import { Hero } from "@/components/sections/Hero";
import { InsightFlow } from "@/components/sections/InsightFlow";
import { Dashboard } from "@/components/sections/Dashboard";
import { Signature } from "@/components/sections/Signature";
import { Footer } from "@/components/sections/Footer";

export default function Page() {
  return (
    <>
      <Navbar />
      <main id="top">
        {/* 1 — Hero: raw data → structured intelligence (Three.js) */}
        <Hero />
        {/* 2 — Insight Flow: Ingest → Analyze → Generate (GSAP ScrollTrigger) */}
        <InsightFlow />
        {/* 3 — Intelligence Dashboard preview (Framer Motion) */}
        <Dashboard />
        {/* 4 — Signature interaction: the reorganizing data cluster (Three.js) */}
        <Signature />
      </main>
      <Footer />
    </>
  );
}
