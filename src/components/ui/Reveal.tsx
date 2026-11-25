"use client";

import { motion, useInView, useReducedMotion } from "motion/react";
import { useLayoutEffect, useRef, useState, type ReactNode } from "react";

type Phase = "visible" | "hidden" | "revealed";

/**
 * Subtle fade-up on first scroll into view.
 * Content is rendered visible in the server HTML, so whatever is on screen when the
 * page opens paints immediately (good for LCP and for visitors without JavaScript).
 * Only content that starts below the fold is hidden after hydration and faded in
 * when scrolled to. Respects reduced-motion.
 */
export function Reveal({
  children,
  className,
  delay = 0,
  y = 18,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const [phase, setPhase] = useState<Phase>("visible");
  const inView = useInView(ref, { once: true, margin: "0px 0px -60px 0px" });

  // Measure once on mount: hide only elements that start below the visible screen.
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el || reduce) return;
    if (el.getBoundingClientRect().top > window.innerHeight) {
      setPhase("hidden");
    }
  }, [reduce]);

  const show = phase === "visible" || inView;
  return (
    <motion.div
      ref={ref}
      className={className}
      initial={false}
      animate={show ? { opacity: 1, y: 0 } : { opacity: 0, y }}
      transition={phase === "hidden" && show ? { duration: 0.6, delay, ease: [0.21, 0.61, 0.35, 1] } : { duration: 0 }}
      onAnimationComplete={() => {
        if (phase === "hidden" && show) setPhase("revealed");
      }}
    >
      {children}
    </motion.div>
  );
}
