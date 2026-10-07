"use client";

import { m, type HTMLMotionProps } from "framer-motion";

type Props = HTMLMotionProps<"div"> & { delay?: number; y?: number };

/** Fades + lifts its children in when scrolled into view. */
export function Reveal({ delay = 0, y = 24, children, ...rest }: Props) {
  return (
    <m.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
      {...rest}
    >
      {children}
    </m.div>
  );
}

type ItemProps = HTMLMotionProps<"li"> & { delay?: number; y?: number };

/** Same as Reveal, rendered as an <li> for use inside lists. */
export function RevealItem({ delay = 0, y = 16, children, ...rest }: ItemProps) {
  return (
    <m.li
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}
      {...rest}
    >
      {children}
    </m.li>
  );
}
