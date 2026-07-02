"use client";

import { useEffect, useState } from "react";

/**
 * Returns true when the user has asked the OS to reduce motion.
 * Every heavy animation in the app checks this and falls back to a
 * static / minimal state.
 */
export function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const onChange = () => setReduced(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  return reduced;
}
