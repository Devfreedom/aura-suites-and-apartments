"use client";

/**
 * Suite Details Modal — the single modal surface for suite image galleries.
 *
 * Conventions (applied by every trigger that renders this component):
 *  - Hero image wrapper:  `relative w-full h-64 sm:h-72 overflow-hidden rounded-t-2xl`
 *  - Thumbnail overlay:   absolutely anchored bottom-right with dark glass backdrop
 *  - Scroll locking:      body scroll locked while the modal is active and
 *                         restored when it closes
 *  - Backdrop / card:     shared overlay styling (`bg-black/70 backdrop-blur-sm`,
 *                         white card capped at 90vh)
 *  - Image fallbacks:     missing/broken suite photos default to the luxury
 *                         suite interior placeholder at /images/suite-placeholder.jpg
 */

import { useEffect, useState } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import SafeImage from "@/components/ui/SafeImage";

/** Default fallback (missing/empty gallery) — luxury room interior. */
export const SUITE_PLACEHOLDER_IMAGE = "/images/suite-placeholder.jpg";

interface SuiteDetailsModalProps {
  /** Whether the modal is open. */
  isOpen: boolean;
  /** Called when the user closes the modal. */
  onClose: () => void;
  /** Gallery image URLs. */
  images: string[];
  /** Suite name shown in the header for context. */
  suiteName?: string;
}

export default function SuiteDetailsModal({
  isOpen,
  onClose,
  images = [],
  suiteName,
}: SuiteDetailsModalProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Lock background scroll while this modal is active; restore when it closes
  // or unmounts (same contract as the shared `useEffect` scroll-lock hook).
  useEffect(() => {
    if (!isOpen) return;

    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // Reset to the first image whenever a new suite gallery opens.
  useEffect(() => {
    if (isOpen) setCurrentIndex(0);
  }, [isOpen]);

  // Escape closes; arrow keys navigate.
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      if (!hasMultiple) return;
      if (event.key === "ArrowLeft") goPrev();
      if (event.key === "ArrowRight") goNext();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  if (!isOpen) return null;

  const gallery = images.length > 0 ? images : [SUITE_PLACEHOLDER_IMAGE];
  const activeImage = gallery[currentIndex] ?? SUITE_PLACEHOLDER_IMAGE;
  const hasMultiple = gallery.length > 1;

  function goPrev() {
    setCurrentIndex((i) => (i === 0 ? gallery.length - 1 : i - 1));
  }

  function goNext() {
    setCurrentIndex((i) => (i === gallery.length - 1 ? 0 : i + 1));
  }

  return (
    <>
      {/* Click-away catcher (kept outside the flex wrapper so centering is preserved) */}
      <button
        type="button"
        onClick={onClose}
        aria-label="Close gallery"
        className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm cursor-default"
      />

      {/* Backdrop wrapper — fixed, centered, dimmed overlay */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label={`Suite gallery${suiteName ? ` for ${suiteName}` : ""}`}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 overflow-y-auto"
      >
        {/* Modal content card */}
        <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white shadow-2xl text-slate-900 border border-slate-100">

          {/* Close button — floats above everything in the card */}
          <button
            type="button"
            onClick={onClose}
            aria-label="Close gallery"
            className="absolute top-4 right-4 z-30 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-slate-700 shadow-lg transition-colors hover:bg-white hover:text-slate-900"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Hero image wrapper */}
          <div className="relative w-full h-64 sm:h-72 overflow-hidden rounded-t-2xl bg-gray-900">
            <SafeImage
              src={activeImage}
              alt={suiteName ?? "Suite gallery"}
              className="absolute inset-0 object-cover transition-opacity duration-300 ease-in-out"
              sizes="(max-width: 640px) 100vw, 768px"
              priority
            />

            {hasMultiple && (
              <>
                <button
                  type="button"
                  onClick={goPrev}
                  aria-label="Previous image"
                  className="absolute left-3 top-1/2 -translate-y-1/2 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-slate-700 shadow-lg transition-colors hover:bg-white hover:text-slate-900"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  type="button"
                  onClick={goNext}
                  aria-label="Next image"
                  className="absolute right-3 top-1/2 -translate-y-1/2 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-slate-700 shadow-lg transition-colors hover:bg-white hover:text-slate-900"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </>
            )}

            {/* Thumbnail selector — bottom-right glass overlay */}
            {hasMultiple && (
              <div className="absolute bottom-3 right-3 flex gap-2 z-20 bg-black/50 backdrop-blur-md p-1.5 rounded-lg border border-white/20">
                {gallery.map((img, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setCurrentIndex(i)}
                    aria-label={`Show image ${i + 1}`}
                    aria-pressed={currentIndex === i}
                    className={`relative w-12 h-12 rounded overflow-hidden cursor-pointer opacity-70 hover:opacity-100 border-2 border-transparent transition-all ${
                      currentIndex === i ? "border-amber-400 opacity-100" : ""
                    }`}
                  >
                    <SafeImage
                      src={img}
                      alt=""
                      className="absolute inset-0 object-cover"
                      sizes="48px"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Footer: counter + hint */}
          <div className="p-5 sm:p-6">
            {suiteName && (
              <h2 className="font-serif text-xl font-bold text-slate-900 leading-tight">
                {suiteName}
              </h2>
            )}
            <div className="mt-1 flex items-center justify-between text-xs text-slate-500">
              <span>
                {hasMultiple
                  ? `Image ${currentIndex + 1} of ${gallery.length}`
                  : "1 image"}
              </span>
              {hasMultiple && (
                <span className="hidden sm:inline">
                  Use ← → keys to navigate · Esc to close
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
