"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { QRCodeSVG } from "qrcode.react";
import { Share2, Copy, Check, Download, X } from "lucide-react";
import type { Dictionary } from "@/i18n/getDictionary";

// Simple inline WhatsApp glyph (kept local to avoid pulling brand icon packs)
function WhatsAppIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.7.44 3.36 1.29 4.83L2 22l5.4-1.42a9.9 9.9 0 0 0 4.64 1.18h.01c5.46 0 9.9-4.45 9.9-9.91S17.5 2 12.04 2Zm5.8 14.13c-.24.68-1.4 1.3-1.93 1.36-.5.06-1.03.29-3.45-.72-2.92-1.22-4.77-4.19-4.91-4.38-.14-.19-1.16-1.55-1.16-2.96 0-1.4.73-2.09.99-2.37.26-.29.57-.36.76-.36.19 0 .38 0 .55.01.18.01.42-.07.65.5.24.58.82 2 .89 2.14.07.14.12.31.02.5-.1.19-.15.31-.29.48-.15.17-.31.38-.44.5-.15.15-.3.31-.13.6.17.29.76 1.25 1.63 2.03 1.12 1 2.06 1.31 2.36 1.46.29.14.46.12.63-.07.17-.19.72-.84.92-1.13.19-.29.38-.24.63-.14.26.1 1.65.78 1.93.92.29.14.48.22.55.34.07.13.07.72-.17 1.4Z" />
    </svg>
  );
}

export default function ShareMenu({
  url,
  title,
  pdfUrl,
  dict,
}: {
  url: string;
  title: string;
  pdfUrl?: string;
  dict: Dictionary;
}) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const copyLink = async () => {
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  const whatsappHref = `https://wa.me/?text=${encodeURIComponent(`${title} — ${url}`)}`;

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 rounded-full border border-(--color-line) px-4 py-2 text-sm text-(--color-ivory) transition hover:border-(--color-gold) hover:text-(--color-gold)"
      >
        <Share2 size={15} />
        {dict.catalog.share}
      </button>

      <AnimatePresence>
        {open && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
            <motion.div
              initial={{ opacity: 0, y: 8, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.98 }}
              transition={{ duration: 0.18 }}
              className="glass absolute end-0 top-full z-50 mt-2 w-72 rounded-2xl p-5"
            >
              <div className="mb-4 flex items-center justify-between">
                <span className="text-sm text-(--color-ivory)">{dict.catalog.share}</span>
                <button onClick={() => setOpen(false)} aria-label="close">
                  <X size={14} className="text-(--color-smoke)" />
                </button>
              </div>

              <div className="mb-4 flex justify-center rounded-xl bg-(--color-ivory) p-3">
                <QRCodeSVG value={url} size={140} fgColor="#0a0a09" bgColor="#f3f1ea" />
              </div>

              <div className="flex flex-col gap-2">
                <button
                  onClick={copyLink}
                  className="flex items-center justify-between rounded-lg border border-(--color-line) px-3 py-2 text-xs text-(--color-ivory) transition hover:border-(--color-gold)"
                >
                  <span>{copied ? dict.catalog.copied : dict.catalog.copyLink}</span>
                  {copied ? <Check size={14} className="text-(--color-gold)" /> : <Copy size={14} />}
                </button>

                <a
                  href={whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 rounded-lg border border-(--color-line) px-3 py-2 text-xs text-(--color-ivory) transition hover:border-(--color-gold)"
                >
                  <WhatsAppIcon size={14} />
                  {dict.catalog.whatsapp}
                </a>

                {pdfUrl && (
                  <a
                    href={pdfUrl}
                    download
                    className="flex items-center gap-2 rounded-lg border border-(--color-line) px-3 py-2 text-xs text-(--color-ivory) transition hover:border-(--color-gold)"
                  >
                    <Download size={14} />
                    {dict.catalog.download}
                  </a>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
