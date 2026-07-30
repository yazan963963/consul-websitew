"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, type PanInfo } from "framer-motion";
import { ChevronLeft, ChevronRight, Maximize2, Minimize2, ZoomIn, ZoomOut } from "lucide-react";
import type { CatalogImage } from "@/lib/types";
import type { Dictionary } from "@/i18n/getDictionary";

const SWIPE_THRESHOLD = 60;

export default function CatalogViewer({
  images,
  dict,
  dir,
}: {
  images: CatalogImage[];
  dict: Dictionary;
  dir: "rtl" | "ltr";
}) {
  const [index, setIndex] = useState(0);
  const [zoomed, setZoomed] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const sorted = [...images].sort((a, b) => a.sortOrder - b.sortOrder);
  const rtl = dir === "rtl";

  const goTo = useCallback(
    (next: number) => {
      setZoomed(false);
      setIndex((current) => {
        const clamped = Math.max(0, Math.min(sorted.length - 1, next));
        return clamped;
      });
    },
    [sorted.length]
  );

  const next = useCallback(() => goTo(index + (rtl ? -1 : 1)), [goTo, index, rtl]);
  const prev = useCallback(() => goTo(index - (rtl ? -1 : 1)), [goTo, index, rtl]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") rtl ? prev() : next();
      if (e.key === "ArrowLeft") rtl ? next() : prev();
      if (e.key === "Escape" && fullscreen) toggleFullscreen();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [next, prev, fullscreen]);

  const toggleFullscreen = async () => {
    if (!document.fullscreenElement) {
      await containerRef.current?.requestFullscreen();
      setFullscreen(true);
    } else {
      await document.exitFullscreen();
      setFullscreen(false);
    }
  };

  const onDragEnd = (_: unknown, info: PanInfo) => {
    if (zoomed) return;
    if (info.offset.x > SWIPE_THRESHOLD) rtl ? next() : prev();
    else if (info.offset.x < -SWIPE_THRESHOLD) rtl ? prev() : next();
  };

  if (sorted.length === 0) {
    return <p className="py-20 text-center text-(--color-smoke)">{dict.catalog.empty}</p>;
  }

  const current = sorted[index];

  return (
    <div
      ref={containerRef}
      className={`relative flex flex-col items-center bg-(--color-ink) ${
        fullscreen ? "fixed inset-0 z-[90] justify-center" : ""
      }`}
    >
      <div className="relative flex w-full max-w-3xl items-center justify-center overflow-hidden px-2 py-6">
        <button
          onClick={prev}
          aria-label="previous"
          className="absolute start-0 z-10 rounded-full border border-(--color-line) bg-(--color-surface)/80 p-2 text-(--color-ivory) transition hover:border-(--color-gold) hover:text-(--color-gold) md:start-2"
        >
          <ChevronLeft size={18} className="rtl:rotate-180" />
        </button>

        <div className="relative aspect-[4/5] w-full max-w-md overflow-hidden rounded-xl bg-(--color-surface)">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={current.id}
              drag={zoomed ? false : "x"}
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.15}
              onDragEnd={onDragEnd}
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -24 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              className="relative h-full w-full cursor-grab active:cursor-grabbing"
              onDoubleClick={() => setZoomed((z) => !z)}
            >
              <motion.div
                animate={{ scale: zoomed ? 1.9 : 1 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="relative h-full w-full"
              >
                <Image
                  src={current.url}
                  alt={current.alt ?? ""}
                  fill
                  sizes="(max-width: 768px) 90vw, 500px"
                  className="object-contain"
                  priority={index === 0}
                />
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </div>

        <button
          onClick={next}
          aria-label="next"
          className="absolute end-0 z-10 rounded-full border border-(--color-line) bg-(--color-surface)/80 p-2 text-(--color-ivory) transition hover:border-(--color-gold) hover:text-(--color-gold) md:end-2"
        >
          <ChevronRight size={18} className="rtl:rotate-180" />
        </button>
      </div>

      <div className="flex items-center gap-4 pb-4 text-xs text-(--color-bone)">
        <span>
          {index + 1} {dict.catalog.of} {sorted.length}
        </span>
        <button
          onClick={() => setZoomed((z) => !z)}
          className="flex items-center gap-1 text-(--color-gold)"
        >
          {zoomed ? <ZoomOut size={14} /> : <ZoomIn size={14} />}
        </button>
        <button onClick={toggleFullscreen} className="flex items-center gap-1 text-(--color-gold)">
          {fullscreen ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
        </button>
      </div>

      {/* thumbnail strip */}
      <div className="scrollbar-none flex max-w-full gap-2 overflow-x-auto px-4 pb-6">
        {sorted.map((img, i) => (
          <button
            key={img.id}
            onClick={() => goTo(i)}
            className={`relative h-16 w-12 shrink-0 overflow-hidden rounded-md border transition ${
              i === index ? "border-(--color-gold)" : "border-(--color-line) opacity-60"
            }`}
          >
            <Image src={img.url} alt="" fill sizes="48px" className="object-cover" loading="lazy" />
          </button>
        ))}
      </div>
    </div>
  );
}
