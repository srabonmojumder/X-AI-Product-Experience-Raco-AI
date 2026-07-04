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
        {/* 1 — Hero: raw noise → living intelligence (Three.js bloom) */}
        <Hero />
        {/* 2 — How it flows: Listen → Connect → Bloom (GSAP ScrollTrigger) */}
        <InsightFlow />
        {/* 3 — The workspace: living product dashboard (Framer Motion) */}
        <Dashboard />
        {/* 4 — Signature: the reshaping data cluster (Three.js) */}
        <Signature />
      </main>
      <Footer />
    </>
  );
}
