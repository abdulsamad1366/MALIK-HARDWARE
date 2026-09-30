/**
 * components/HeroCarousel.tsx — Full-width hero image slider (08-homepage-layout.md §1).
 *
 * Visual: Pure imagery without text overlays.
 * Motion: Framer Motion direction-aware sliding carousel with drag/swipe support.
 * Auto-advances every 5 seconds; pauses on hover.
 * prefers-reduced-motion: crossfades opacity without horizontal displacement.
 */

"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

interface HeroSlide {
  id: string;
  imageUrl: string;
  headline?: string | null;
  linkUrl?: string | null;
  displayOrder: number;
}

interface HeroCarouselProps {
  slides: HeroSlide[];
}

/** Variants for direction-aware sliding animation */
const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? "100%" : "-100%",
    opacity: 0,
  }),
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    zIndex: 0,
    x: direction < 0 ? "100%" : "-100%",
    opacity: 0,
  }),
};

/** Accessible reduced-motion variants: crossfade only */
const reducedMotionVariants = {
  enter: { opacity: 0 },
  center: { opacity: 1, zIndex: 1 },
  exit: { opacity: 0, zIndex: 0 },
};

const swipeConfidenceThreshold = 10000;
const swipePower = (offset: number, velocity: number) => {
  return Math.abs(offset) * velocity;
};

export default function HeroCarousel({ slides }: HeroCarouselProps) {
  const [[current, direction], setSlideState] = useState([0, 0]);
  const [paused, setPaused] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Check prefers-reduced-motion once on mount
  const [reducedMotion, setReducedMotion] = useState(false);
  useEffect(() => {
    if (typeof window !== "undefined") {
      setReducedMotion(
        window.matchMedia("(prefers-reduced-motion: reduce)").matches
      );
    }
  }, []);

  const total = slides.length;

  /** Move slide by delta (+1 for next, -1 for prev) */
  const paginate = useCallback(
    (newDirection: number) => {
      setSlideState(([prevIndex]) => {
        const nextIndex = (prevIndex + newDirection + total) % total;
        return [nextIndex, newDirection];
      });
    },
    [total]
  );

  /** Jump directly to a specific slide */
  const goToSlide = (index: number) => {
    if (index === current) return;
    const newDir = index > current ? 1 : -1;
    setSlideState([index, newDir]);
  };

  // Auto-advance every 5 seconds, paused on hover or with reduced motion
  useEffect(() => {
    if (reducedMotion || paused || total <= 1) return;
    timerRef.current = setInterval(() => {
      paginate(1);
    }, 5000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [paused, total, reducedMotion, paginate]);

  if (!total) return null;

  const activeSlide = slides[current];

  return (
    <section
      className="relative w-full overflow-hidden bg-bg-tertiary select-none"
      aria-label="Hero visual gallery"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Slide track */}
      <div className="relative h-72 sm:h-96 md:h-112 lg:h-136 xl:h-144 w-full overflow-hidden">
        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            key={activeSlide.id}
            custom={direction}
            variants={reducedMotion ? reducedMotionVariants : slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 280, damping: 30 },
              opacity: { duration: 0.35 },
            }}
            drag={total > 1 ? "x" : false}
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={1}
            onDragEnd={(_, { offset, velocity }) => {
              const swipe = swipePower(offset.x, velocity.x);
              if (swipe < -swipeConfidenceThreshold) {
                paginate(1);
              } else if (swipe > swipeConfidenceThreshold) {
                paginate(-1);
              }
            }}
            className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing"
          >
            {activeSlide.linkUrl ? (
              <Link
                href={activeSlide.linkUrl}
                className="relative block w-full h-full"
                aria-label={`Slide ${current + 1}`}
                tabIndex={0}
              >
                <Image
                  src={activeSlide.imageUrl}
                  alt={`Hero display ${current + 1}`}
                  fill
                  className="object-cover"
                  priority={current === 0}
                  sizes="100vw"
                />
              </Link>
            ) : (
              <div className="relative w-full h-full">
                <Image
                  src={activeSlide.imageUrl}
                  alt={`Hero display ${current + 1}`}
                  fill
                  className="object-cover"
                  priority={current === 0}
                  sizes="100vw"
                />
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Prev / Next navigation arrows */}
      {total > 1 && (
        <>
          <button
            onClick={() => paginate(-1)}
            aria-label="Previous slide"
            className="absolute left-3 sm:left-5 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white/80 hover:bg-white text-text-main flex items-center justify-center shadow-lg backdrop-blur-sm transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer"
          >
            <svg
              className="w-5 h-5 text-text-main"
              fill="none"
              stroke="currentColor"
              strokeWidth={2.2}
              viewBox="0 0 24 24"
            >
              <path d="m15 18-6-6 6-6" />
            </svg>
          </button>
          <button
            onClick={() => paginate(1)}
            aria-label="Next slide"
            className="absolute right-3 sm:right-5 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white/80 hover:bg-white text-text-main flex items-center justify-center shadow-lg backdrop-blur-sm transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer"
          >
            <svg
              className="w-5 h-5 text-text-main"
              fill="none"
              stroke="currentColor"
              strokeWidth={2.2}
              viewBox="0 0 24 24"
            >
              <path d="m9 18 6-6-6-6" />
            </svg>
          </button>

          {/* Indicator dots */}
          <div
            className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/25 backdrop-blur-xs"
            role="tablist"
            aria-label="Slide indicators"
          >
            {slides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => goToSlide(idx)}
                role="tab"
                aria-selected={idx === current}
                aria-label={`Go to slide ${idx + 1}`}
                className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                  idx === current
                    ? "w-7 bg-white shadow-sm"
                    : "w-2 bg-white/50 hover:bg-white/80"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
}
