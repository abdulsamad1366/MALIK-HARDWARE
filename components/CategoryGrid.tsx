/**
 * components/CategoryGrid.tsx — Portrait card grid / slider for categories and use cases.
 *
 * Designed for 12-15+ categories:
 * - Default: Smooth horizontal snap-scroll track with Prev / Next arrow buttons.
 * - Toggle: "View All (14)" / "Show Slider" switches between single-row carousel and responsive multi-column grid.
 * - Cards: High-visibility portrait ratio (aspect-[3/4], height > breadth) with subtle zoom, dark gradient, and amber highlights.
 * - Touch-friendly snap scrolling on mobile with hidden scrollbars.
 * - Auto-detects short lists (<= 4 items, like Shop by Use) to render balanced grid without carousel overhead.
 */

"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useRef, useEffect, useCallback } from "react";
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
  const [isGridMode, setIsGridMode] = useState(false);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const isShortList = items.length <= 4;

  /** Update scroll arrow disabled states */
  const checkScrollability = useCallback(() => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    setCanScrollLeft(scrollLeft > 8);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 8);
  }, []);

  useEffect(() => {
    if (isShortList || isGridMode) return;
    const el = scrollContainerRef.current;
    if (!el) return;

    checkScrollability();
    el.addEventListener("scroll", checkScrollability, { passive: true });
    window.addEventListener("resize", checkScrollability);

    return () => {
      el.removeEventListener("scroll", checkScrollability);
      window.removeEventListener("resize", checkScrollability);
    };
  }, [checkScrollability, isShortList, isGridMode]);

  /** Scroll left or right by card track step */
  const scroll = (direction: "left" | "right") => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const scrollAmount = Math.max(el.clientWidth * 0.75, 260);
    el.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  if (!items.length) return null;

  return (
    <section className="py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        {/* Title + Count */}
        <div className="flex items-center gap-3">
          <h2 className="text-lg sm:text-xl font-bold text-text-main tracking-widest uppercase">
            {heading}
          </h2>
          <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-bg-secondary text-text-muted border border-border-subtle">
            {items.length}
          </span>
        </div>

        {/* Controls: Only shown for larger collections (> 4 items) */}
        {!isShortList && (
          <div className="flex items-center gap-2.5">
            {/* View All / Slider Toggle */}
            <button
              onClick={() => setIsGridMode((prev) => !prev)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border border-border-subtle bg-bg-secondary hover:bg-bg-tertiary hover:border-border-medium text-text-muted hover:text-text-main transition-colors cursor-pointer"
              aria-label={isGridMode ? "Show carousel slider" : "View all categories in grid"}
            >
              {isGridMode ? (
                <>
                  <svg className="w-3.5 h-3.5 text-amber" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                  </svg>
                  <span>Show Slider</span>
                </>
              ) : (
                <>
                  <svg className="w-3.5 h-3.5 text-amber" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                  <span>View All ({items.length})</span>
                </>
              )}
            </button>

            {/* Slider Navigation Arrows (only active in slider mode) */}
            {!isGridMode && (
              <div className="flex items-center gap-1.5 ml-1">
                <button
                  onClick={() => scroll("left")}
                  disabled={!canScrollLeft}
                  className="w-8 h-8 rounded-lg border border-border-subtle bg-bg-card hover:bg-bg-secondary hover:border-amber text-text-main flex items-center justify-center transition-all disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:border-border-subtle disabled:hover:bg-bg-card cursor-pointer"
                  aria-label="Scroll left"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button
                  onClick={() => scroll("right")}
                  disabled={!canScrollRight}
                  className="w-8 h-8 rounded-lg border border-border-subtle bg-bg-card hover:bg-bg-secondary hover:border-amber text-text-main flex items-center justify-center transition-all disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:border-border-subtle disabled:hover:bg-bg-card cursor-pointer"
                  aria-label="Scroll right"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/*
       * Layout 1: Short list (<= 4 items, e.g. Shop by Use) -> Simple balanced grid
       */}
      {isShortList ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {items.map((item) => (
            <CategoryCard key={item.id} item={item} source={source} />
          ))}
        </div>
      ) : isGridMode ? (
        /*
         * Layout 2: Expanded Full Grid (View All mode)
         */
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-5">
          {items.map((item) => (
            <CategoryCard key={item.id} item={item} source={source} />
          ))}
        </div>
      ) : (
        /*
         * Layout 3: Horizontal Carousel Track (Default for 12-15 categories)
         * - Snap-to-start
         * - Hidden scrollbars
         * - Portrait aspect cards (aspect-[3/4])
         */
        <div className="relative">
          <div
            ref={scrollContainerRef}
            className="flex gap-4 sm:gap-5 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-3 pt-1 px-0.5 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {items.map((item) => (
              <div
                key={item.id}
                className="w-[185px] sm:w-[210px] md:w-[230px] shrink-0 snap-start"
              >
                <CategoryCard item={item} source={source} />
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}

/** Individual portrait card component */
function CategoryCard({
  item,
  source,
}: {
  item: GridItem;
  source: "category" | "useCase";
}) {
  const href =
    source === "category" ? `/category/${item.slug}` : `/use/${item.slug}`;
  const imgSrc = item.placeholderImage ?? item.image ?? null;

  return (
    <Link
      href={href}
      className="group focus:outline-none focus-visible:ring-2 focus-visible:ring-amber rounded-2xl block h-full"
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
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-108"
            sizes="(max-width: 640px) 185px, (max-width: 1024px) 210px, 230px"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-text-dim text-4xl font-bold bg-bg-tertiary">
            {item.name[0]}
          </div>
        )}

        {/* Dark gradient overlay for typography contrast */}
        <div className="absolute inset-0 bg-linear-to-t from-black/85 via-black/30 to-transparent flex flex-col justify-end p-4 sm:p-5 transition-opacity group-hover:from-black/90">
          <div className="transform transition-transform duration-200 group-hover:-translate-y-1">
            <h3 className="text-white font-semibold text-base sm:text-lg leading-snug tracking-tight drop-shadow-xs">
              {item.name}
            </h3>
            <div className="flex items-center gap-1.5 mt-1.5 text-xs font-medium text-amber">
              <span>Explore</span>
              <svg
                className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-1"
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
