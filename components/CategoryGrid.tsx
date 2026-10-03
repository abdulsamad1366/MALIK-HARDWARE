/**
 * components/CategoryGrid.tsx — Portrait card carousel for categories and use cases.
 *
 * Features:
 * - Left and Right navigation arrow buttons floating on the left and right sides of the carousel.
 * - "View All (14)" button in the section header redirects directly to the categories catalog page (/categories).
 * - Continuous Smooth Glide: Seamless infinite loop auto-slide with zero jerk or stutter.
 * - Stops cleanly on hover, focus, or touch, resuming smoothly on mouse leave.
 * - Fully responsive across mobile, tablet, desktop, and big/ultra-wide screens.
 * - Hardware-accelerated GSAP animation on transform only.
 * - Accessibility: prefers-reduced-motion fallback.
 */

"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useEffect, useCallback } from "react";
import { motion } from "framer-motion";

interface GridItem {
  id: string;
  name: string;
  slug: string;
  /** Category uses placeholderImage; UseCase uses image */
  placeholderImage?: string;
  image?: string;
}

interface CategoryGridProps {
  items: GridItem[];
  /** Determines URL prefix for links */
  source: "category" | "useCase";
  /** Section heading displayed above the grid */
  heading: string;
}

export default function CategoryGrid({ items, source, heading }: CategoryGridProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const set1Ref = useRef<HTMLDivElement>(null);
  const tweenRef = useRef<gsap.core.Tween | null>(null);
  const gsapRef = useRef<typeof import("gsap")["gsap"] | null>(null);

  const durationRef = useRef<number>(60);
  const oneSetWidthRef = useRef<number>(0);
  const isHoveredRef = useRef(false);
  const isDraggingRef = useRef(false);
  const startXRef = useRef(0);
  const hasDraggedRef = useRef(false);
  const prefersReducedRef = useRef(false);

  const isShortList = items.length <= 4;
  const viewAllHref = source === "category" ? "/categories" : "/use";

  useEffect(() => {
    if (isShortList) return;

    let cancelled = false;

    // Lazy-load GSAP client-side to keep initial bundles lean
    import("gsap").then(({ gsap }) => {
      if (cancelled || !trackRef.current || !set1Ref.current) return;
      gsapRef.current = gsap;

      const prefersReduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;
      prefersReducedRef.current = prefersReduced;

      const initGlide = () => {
        if (!trackRef.current || !set1Ref.current) return;

        // Clean up previous tween
        if (tweenRef.current) {
          tweenRef.current.kill();
          tweenRef.current = null;
        }

        const set1Width = set1Ref.current.offsetWidth;
        const gap =
          parseFloat(
            window.getComputedStyle(trackRef.current).columnGap || "20"
          ) || 20;
        const oneSetWidth = set1Width + gap;
        oneSetWidthRef.current = oneSetWidth;

        // Glide speed (~38 pixels per second for smooth, serene glide)
        const speed = 38;
        const duration = Math.max(oneSetWidth / speed, 12);
        durationRef.current = duration;

        gsap.set(trackRef.current, { x: 0 });

        if (prefersReduced) return;

        // Hardware-accelerated infinite linear translation
        const tween = gsap.to(trackRef.current, {
          x: -oneSetWidth,
          duration,
          ease: "none",
          repeat: -1,
        });

        // Large totalTime offset so backward step never reaches zero
        tween.totalTime(duration * 1000);

        if (isHoveredRef.current || isDraggingRef.current) {
          tween.pause();
        }

        tweenRef.current = tween;
      };

      initGlide();

      const handleResize = () => {
        initGlide();
      };
      window.addEventListener("resize", handleResize);

      return () => {
        window.removeEventListener("resize", handleResize);
      };
    });

    return () => {
      cancelled = true;
      if (tweenRef.current) {
        tweenRef.current.kill();
        tweenRef.current = null;
      }
    };
  }, [isShortList, items.length]);

  /** Pause auto-slide smoothly on hover */
  const handleMouseEnter = () => {
    isHoveredRef.current = true;
    if (!isDraggingRef.current && tweenRef.current) {
      tweenRef.current.pause();
    }
  };

  /** Resume auto-slide smoothly on mouse leave */
  const handleMouseLeave = () => {
    isHoveredRef.current = false;
    if (!isDraggingRef.current && tweenRef.current && !prefersReducedRef.current) {
      tweenRef.current.resume();
    }
  };

  /** Step forward or backward smoothly using easing curve */
  const scroll = (direction: "left" | "right") => {
    const gsap = gsapRef.current;
    const tween = tweenRef.current;
    if (!gsap || !trackRef.current) return;

    const cardStep = oneSetWidthRef.current
      ? oneSetWidthRef.current / items.length
      : 240;

    if (tween && durationRef.current && oneSetWidthRef.current) {
      const stepDuration =
        (cardStep / oneSetWidthRef.current) * durationRef.current;
      const timeDelta = direction === "right" ? stepDuration : -stepDuration;

      gsap.to(tween, {
        totalTime: `+=${timeDelta}`,
        duration: 0.55,
        ease: "power2.out",
        overwrite: "auto",
      });
    } else {
      const currentX = (gsap.getProperty(trackRef.current, "x") as number) || 0;
      const targetX =
        direction === "right" ? currentX - cardStep : currentX + cardStep;
      gsap.to(trackRef.current, {
        x: targetX,
        duration: 0.55,
        ease: "power2.out",
      });
    }
  };

  /** Pointer / touch drag handlers */
  const handlePointerDown = (e: React.PointerEvent) => {
    if (e.button !== 0 && e.pointerType === "mouse") return;
    isDraggingRef.current = true;
    startXRef.current = e.clientX;
    hasDraggedRef.current = false;
    tweenRef.current?.pause();
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDraggingRef.current || !tweenRef.current) return;
    const deltaX = e.clientX - startXRef.current;
    if (Math.abs(deltaX) > 6) {
      hasDraggedRef.current = true;
    }
    startXRef.current = e.clientX;

    if (oneSetWidthRef.current && durationRef.current) {
      const timeShift =
        (deltaX / oneSetWidthRef.current) * durationRef.current;
      const current = tweenRef.current.totalTime();
      tweenRef.current.totalTime(current - timeShift);
    }
  };

  const handlePointerUp = () => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;
    setTimeout(() => {
      hasDraggedRef.current = false;
    }, 60);

    if (!isHoveredRef.current && tweenRef.current && !prefersReducedRef.current) {
      tweenRef.current.resume();
    }
  };

  /** Suppress link navigation if user was actively dragging */
  const handleCardClick = useCallback((e: React.MouseEvent) => {
    if (hasDraggedRef.current) {
      e.preventDefault();
      e.stopPropagation();
    }
  }, []);

  if (!items.length) return null;

  return (
    <section className="py-8 sm:py-10 md:py-12 w-full overflow-hidden">
      {/* Section Header: Title, Count, and View All link (NO arrows here) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-4 sm:mb-6">
        <div className="flex items-center justify-between gap-3 sm:gap-4">
          {/* Title + Count */}
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <h2 className="text-base sm:text-lg md:text-xl font-bold text-text-main tracking-wider sm:tracking-widest uppercase truncate">
              {heading}
            </h2>
            <span className="text-[11px] sm:text-xs font-semibold px-2 sm:px-2.5 py-0.5 rounded-full bg-bg-secondary text-text-muted border border-border-subtle shrink-0">
              {items.length}
            </span>
          </div>

          {/* View All Button — Redirects directly to the categories page */}
          {!isShortList && (
            <Link
              href={viewAllHref}
              className="inline-flex items-center gap-1.5 sm:gap-2 px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-semibold rounded-xl border border-border-subtle bg-bg-card hover:bg-bg-secondary hover:border-amber text-text-muted hover:text-text-main shadow-xs hover:shadow-sm transition-all duration-200 shrink-0 group cursor-pointer"
              aria-label={`View all ${items.length} ${heading.toLowerCase()}`}
            >
              <svg
                className="w-3.5 h-3.5 text-amber transition-transform duration-200 group-hover:scale-110"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                />
              </svg>
              <span>View All ({items.length})</span>
              <svg
                className="w-3.5 h-3.5 text-text-dim group-hover:text-amber transition-transform duration-200 group-hover:translate-x-0.5"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          )}
        </div>
      </div>

      {/*
       * Short list (<= 4 items, e.g. Shop by Use) -> Simple balanced responsive grid
       */}
      {isShortList ? (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6">
            {items.map((item) => (
              <CategoryCard key={item.id} item={item} source={source} />
            ))}
          </div>
        </div>
      ) : (
        /*
         * Carousel with Left & Right Arrow Buttons directly on the sides of the track
         */
        <div
          className="relative overflow-hidden py-2 sm:py-3 group/carousel"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onFocusCapture={() => tweenRef.current?.pause()}
          onBlurCapture={(e) => {
            if (!e.currentTarget.contains(e.relatedTarget as Node)) {
              if (!isHoveredRef.current && !prefersReducedRef.current) {
                tweenRef.current?.resume();
              }
            }
          }}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
        >
          {/* Left Arrow Button — positioned directly on left side of carousel */}
          <button
            type="button"
            onClick={() => scroll("left")}
            onMouseEnter={() => {
              isHoveredRef.current = true;
              tweenRef.current?.pause();
            }}
            onMouseLeave={() => {
              isHoveredRef.current = false;
              if (!isDraggingRef.current && !prefersReducedRef.current) {
                tweenRef.current?.resume();
              }
            }}
            className="absolute left-2 sm:left-4 lg:left-6 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/95 hover:bg-white text-text-main shadow-lg border border-border-subtle hover:border-amber hover:text-amber flex items-center justify-center transition-all duration-200 cursor-pointer active:scale-90 hover:scale-105"
            aria-label="Previous categories"
          >
            <svg
              className="w-5 h-5 sm:w-6 sm:h-6"
              fill="none"
              stroke="currentColor"
              strokeWidth={2.5}
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {/* Right Arrow Button — positioned directly on right side of carousel */}
          <button
            type="button"
            onClick={() => scroll("right")}
            onMouseEnter={() => {
              isHoveredRef.current = true;
              tweenRef.current?.pause();
            }}
            onMouseLeave={() => {
              isHoveredRef.current = false;
              if (!isDraggingRef.current && !prefersReducedRef.current) {
                tweenRef.current?.resume();
              }
            }}
            className="absolute right-2 sm:right-4 lg:right-6 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/95 hover:bg-white text-text-main shadow-lg border border-border-subtle hover:border-amber hover:text-amber flex items-center justify-center transition-all duration-200 cursor-pointer active:scale-90 hover:scale-105"
            aria-label="Next categories"
          >
            <svg
              className="w-5 h-5 sm:w-6 sm:h-6"
              fill="none"
              stroke="currentColor"
              strokeWidth={2.5}
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* Gliding Track */}
          <div
            ref={trackRef}
            className="flex gap-3 sm:gap-4 md:gap-5 lg:gap-6 flex-nowrap will-change-transform select-none cursor-grab active:cursor-grabbing pl-4 sm:pl-6 lg:pl-8"
          >
            {/* Set 1: Primary set (accessible for keyboard and screen readers) */}
            <div ref={set1Ref} className="flex gap-3 sm:gap-4 md:gap-5 lg:gap-6 shrink-0">
              {items.map((item) => (
                <div
                  key={`set1-${item.id}`}
                  className="w-40 sm:w-48 md:w-56 lg:w-60 xl:w-64 2xl:w-72 shrink-0"
                >
                  <CategoryCard
                    item={item}
                    source={source}
                    onCardClick={handleCardClick}
                  />
                </div>
              ))}
            </div>

            {/* Set 2: Duplicate for seamless infinite loop */}
            <div
              className="flex gap-3 sm:gap-4 md:gap-5 lg:gap-6 shrink-0"
              aria-hidden="true"
            >
              {items.map((item) => (
                <div
                  key={`set2-${item.id}`}
                  className="w-40 sm:w-48 md:w-56 lg:w-60 xl:w-64 2xl:w-72 shrink-0"
                >
                  <CategoryCard
                    item={item}
                    source={source}
                    onCardClick={handleCardClick}
                    tabIndex={-1}
                  />
                </div>
              ))}
            </div>

            {/* Set 3: Triplicate for ultra-wide / 4K monitors */}
            <div
              className="flex gap-3 sm:gap-4 md:gap-5 lg:gap-6 shrink-0"
              aria-hidden="true"
            >
              {items.map((item) => (
                <div
                  key={`set3-${item.id}`}
                  className="w-40 sm:w-48 md:w-56 lg:w-60 xl:w-64 2xl:w-72 shrink-0"
                >
                  <CategoryCard
                    item={item}
                    source={source}
                    onCardClick={handleCardClick}
                    tabIndex={-1}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

interface CategoryCardProps {
  item: GridItem;
  source: "category" | "useCase";
  onCardClick?: (e: React.MouseEvent) => void;
  tabIndex?: number;
}

/** Individual portrait card component */
function CategoryCard({
  item,
  source,
  onCardClick,
  tabIndex,
}: CategoryCardProps) {
  const href =
    source === "category" ? `/category/${item.slug}` : `/use/${item.slug}`;
  const imgSrc = item.placeholderImage ?? item.image ?? null;

  return (
    <Link
      href={href}
      tabIndex={tabIndex}
      onClick={onCardClick}
      className="group focus:outline-none focus-visible:ring-2 focus-visible:ring-amber rounded-2xl block h-full select-none"
      aria-label={`${item.name} — ${source === "category" ? "Shop Category" : "Shop by Use"}`}
    >
      <motion.div
        whileHover={{ y: -6, boxShadow: "0 14px 28px rgba(0,0,0,0.12)" }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        className="relative aspect-3/4 rounded-2xl overflow-hidden bg-bg-secondary border border-border-subtle shadow-xs transition-colors group-hover:border-amber/60 h-full"
      >
        {/* Product / Category photography */}
        {imgSrc ? (
          <Image
            src={imgSrc}
            alt={item.name}
            fill
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-108 pointer-events-none"
            sizes="(max-width: 640px) 160px, (max-width: 1024px) 210px, (max-width: 1536px) 260px, 288px"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-text-dim text-3xl sm:text-4xl font-bold bg-bg-tertiary">
            {item.name[0]}
          </div>
        )}

        {/* Dark gradient overlay for typography contrast */}
        <div className="absolute inset-0 bg-linear-to-t from-black/85 via-black/30 to-transparent flex flex-col justify-end p-3 sm:p-4 md:p-5 transition-opacity group-hover:from-black/90 pointer-events-none">
          <div className="transform transition-transform duration-200 group-hover:-translate-y-1">
            <h3 className="text-white font-semibold text-sm sm:text-base md:text-lg leading-snug tracking-tight drop-shadow-xs line-clamp-2">
              {item.name}
            </h3>
            <div className="flex items-center gap-1 sm:gap-1.5 mt-1 sm:mt-1.5 text-[11px] sm:text-xs font-medium text-amber">
              <span>Explore</span>
              <svg
                className="w-3 h-3 sm:w-3.5 sm:h-3.5 transition-transform duration-200 group-hover:translate-x-1"
                fill="none"
                stroke="currentColor"
                strokeWidth={2.5}
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path d="m9 18 6-6-6-6" />
              </svg>
            </div>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
