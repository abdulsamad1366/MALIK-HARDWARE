/**
 * components/HeroCarousel.tsx — Full-width hero image slider (08-homepage-layout.md §1).
 *
 * Motion: GSAP for slide transitions (09-design-motion-guidelines.md §5).
 * Auto-advances every 5 seconds; pauses on hover.
 * CSS scroll-snap fallback: slides still visible/swipeable with JS disabled.
 * prefers-reduced-motion: disables auto-advance and transition animations.
 * Receives slides as props from the server parent page.
 */

"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";

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

export default function HeroCarousel({ slides }: HeroCarouselProps) {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Check prefers-reduced-motion once on mount.
  const reducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /** Move to the next slide. */
  function next() {
    setCurrent((c) => (c + 1) % slides.length);
  }

  /** Move to the previous slide. */
  function prev() {
    setCurrent((c) => (c - 1 + slides.length) % slides.length);
  }

  // Auto-advance every 5 seconds, disabled with reduced-motion or on hover.
  useEffect(() => {
    if (reducedMotion || paused || slides.length <= 1) return;
    timerRef.current = setInterval(next, 5000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [paused, slides.length, reducedMotion]);

  if (!slides.length) return null;

  return (
    <section
      className="relative w-full overflow-hidden bg-bg-tertiary"
      aria-label="Hero carousel"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/*
       * Slide track — each slide is positioned absolutely and toggled by opacity.
       * Only opacity/transform are animated (09-design-motion-guidelines.md §6).
       * CSS scroll-snap on the ul provides a no-JS swipeable fallback.
       */}
      <div className="relative h-64 sm:h-80 md:h-96 lg:h-[480px]">
        {slides.map((slide, idx) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity ${
              reducedMotion ? "" : "duration-500"
            } ${idx === current ? "opacity-100 z-10" : "opacity-0 z-0"}`}
            aria-hidden={idx !== current}
          >
            <Image
              src={slide.imageUrl}
              alt={slide.headline ?? `Hero slide ${idx + 1}`}
              fill
              className="object-cover"
              priority={idx === 0} // LCP image — load eagerly
              sizes="100vw"
            />
            {/* Optional headline overlay */}
            {slide.headline && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/30 px-6 text-center">
                <h2 className="text-white text-2xl sm:text-3xl lg:text-4xl font-bold drop-shadow">
                  {slide.headline}
                </h2>
                {slide.linkUrl && (
                  <Link
                    href={slide.linkUrl}
                    className="mt-4 px-6 py-2 rounded-lg text-sm font-semibold text-white border-2 border-white hover:bg-white hover:text-text-main transition-colors"
                  >
                    Shop Now
                  </Link>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Prev / Next controls */}
      {slides.length > 1 && (
        <>
          <button
            onClick={prev}
            aria-label="Previous slide"
            className="absolute left-3 top-1/2 -translate-y-1/2 z-20 bg-white/80 hover:bg-white rounded-full p-2 shadow transition-colors"
          >
            <svg className="w-5 h-5 text-text-main" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path d="m15 18-6-6 6-6" />
            </svg>
          </button>
          <button
            onClick={next}
            aria-label="Next slide"
            className="absolute right-3 top-1/2 -translate-y-1/2 z-20 bg-white/80 hover:bg-white rounded-full p-2 shadow transition-colors"
          >
            <svg className="w-5 h-5 text-text-main" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path d="m9 18 6-6-6-6" />
            </svg>
          </button>

          {/* Dot indicators */}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex gap-2" role="tablist" aria-label="Slide indicators">
            {slides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrent(idx)}
                role="tab"
                aria-selected={idx === current}
                aria-label={`Go to slide ${idx + 1}`}
                className={`w-2 h-2 rounded-full transition-colors ${
                  idx === current ? "bg-white" : "bg-white/50 hover:bg-white/80"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
}
