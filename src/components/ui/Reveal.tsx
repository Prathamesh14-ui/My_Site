"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

/** Subtle fade-up on first scroll into view. Respects reduced-motion. */
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
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -60px 0px" }}
      transition={{ duration: 0.6, delay, ease: [0.21, 0.61, 0.35, 1] }}
    >
      {children}
    </motion.div>
  );
}
