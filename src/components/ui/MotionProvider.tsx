"use client";

import { LazyMotion, MotionConfig, domAnimation } from "framer-motion";

/** Loads a slim framer-motion feature set once and honours prefers-reduced-motion. */
export function MotionProvider({ children }: { children: React.ReactNode }) {
  return (
    <LazyMotion features={domAnimation}>
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </LazyMotion>
  );
}
