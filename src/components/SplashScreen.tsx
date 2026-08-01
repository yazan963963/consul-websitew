"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

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

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-(--color-ink)"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <motion.div initial={{opacity:0,scale:.86}} animate={{opacity:1,scale:1}} transition={{duration:.75,ease:"easeOut"}} className="relative h-56 w-80 max-w-[80vw] drop-shadow-[0_0_50px_rgba(201,162,39,.22)]">
            <Image src="/brand/consul-logo-transparent.png" alt="CONSUL" fill priority sizes="320px" className="object-contain"/>
          </motion.div>
          <motion.div initial={{scaleX:0,opacity:0}} animate={{scaleX:1,opacity:1}} transition={{delay:.45,duration:.7}} className="mt-5 h-px w-36 bg-gradient-to-r from-transparent via-(--color-gold) to-transparent"/>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
