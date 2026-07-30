"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * Full-viewport splash shown once per session. Draws the three
 * "wing" chevrons from the CONSUL mark, then reveals the wordmark.
 * Skips itself if the tab was already visited this session.
 */
export default function SplashScreen() {
  const [visible, setVisible] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const seen = sessionStorage.getItem("consul-splash-seen");
    if (!seen) {
      setVisible(true);
      sessionStorage.setItem("consul-splash-seen", "1");
      const t = setTimeout(() => setVisible(false), 2200);
      return () => clearTimeout(t);
    }
  }, []);

  if (!mounted) return null;

  const chevron = (delay: number, y: number) => (
    <motion.path
      d={`M20 ${y} L60 ${y + 34} L100 ${y}`}
      stroke="url(#goldGrad)"
      strokeWidth="6"
      strokeLinecap="round"
      fill="none"
      initial={{ pathLength: 0, opacity: 0 }}
      animate={{ pathLength: 1, opacity: 1 }}
      transition={{ delay, duration: 0.6, ease: "easeOut" }}
    />
  );

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-(--color-ink)"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <svg width="120" height="120" viewBox="0 0 120 100" fill="none">
            <defs>
              <linearGradient id="goldGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--color-gold-bright)" />
                <stop offset="100%" stopColor="var(--color-gold-deep)" />
              </linearGradient>
            </defs>
            {chevron(0, 8)}
            {chevron(0.15, 32)}
            {chevron(0.3, 56)}
          </svg>
          <motion.p
            className="mt-4 font-(family-name:--font-display) text-2xl tracking-[0.3em] text-(--color-ivory)"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55, duration: 0.5 }}
          >
            CONSUL
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
