"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import type { Dictionary } from "@/i18n/getDictionary";

export default function Hero({ dict }: { dict: Dictionary }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "35%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <section ref={ref} className="relative flex min-h-[100svh] items-center justify-center overflow-hidden bg-(--color-ink)">
      {/* ambient gold glow */}
      <div className="pointer-events-none absolute -top-40 left-1/2 h-[560px] w-[560px] -translate-x-1/2 rounded-full bg-(--color-gold)/10 blur-[140px]" />

      <motion.div style={{ y, opacity }} className="relative z-10 mx-auto max-w-3xl px-6 text-center">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.6 }}
          className="mb-4 text-xs tracking-[0.4em] text-(--color-gold)"
        >
          {dict.hero.eyebrow}
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.85, duration: 0.7 }}
          className="font-(family-name:--font-display) text-4xl leading-[1.15] text-(--color-ivory) md:text-6xl"
        >
          {dict.hero.title}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.05, duration: 0.6 }}
          className="mx-auto mt-6 max-w-xl text-(--color-bone)"
        >
          {dict.hero.subtitle}
        </motion.p>

        <motion.a
          href="#catalogs"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.25, duration: 0.6 }}
          className="gold-underline mt-10 inline-block text-sm tracking-[0.2em] text-(--color-gold)"
        >
          {dict.hero.cta}
        </motion.a>

        {/* signature chevron motif, echoing the CONSUL wings */}
        <motion.div
          className="chevron-divider mt-16"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, y: [0, 8, 0] }}
          transition={{ delay: 1.5, duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
        >
          <span />
        </motion.div>
      </motion.div>
    </section>
  );
}
