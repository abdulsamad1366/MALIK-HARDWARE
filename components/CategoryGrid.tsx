/**
 * components/CategoryGrid.tsx — Portrait card grid for categories and use cases (08-homepage-layout.md §2, §4).
 *
 * Reused for both "Shop by Category" and "Shop by Use" sections.
 * Design: Portrait cards (aspect-[3/4], height > breadth) for maximum product visibility.
 * Motion: Framer Motion whileHover for smooth vertical lift and image zoom.
 */

"use client";

import Image from "next/image";
import Link from "next/link";
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
  if (!items.length) return null;

  // Responsive column count based on item count
  const gridColsClass =
    items.length <= 4
      ? "grid-cols-2 md:grid-cols-4"
      : "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6";

  return (
    <section className="py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <h2 className="text-lg font-semibold text-text-main tracking-widest uppercase">
            {heading}
          </h2>
          <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-bg-secondary text-text-muted border border-border-subtle">
            {items.length}
          </span>
        </div>
      </div>

      {/*
       * Portrait cards grid (aspect-[3/4] — height exceeds breadth).
       * Enhances image prominence and hardware product visibility.
       */}
      <div className={`grid ${gridColsClass} gap-4 sm:gap-6`}>
        {items.map((item) => {
          const href =
            source === "category" ? `/category/${item.slug}` : `/use/${item.slug}`;
          const imgSrc = item.placeholderImage ?? item.image ?? null;

          return (
            <Link
              key={item.id}
              href={href}
              className="group focus:outline-none focus-visible:ring-2 focus-visible:ring-amber rounded-2xl block"
              aria-label={`${item.name} — ${source === "category" ? "Shop Category" : "Shop by Use"}`}
            >
              <motion.div
                whileHover={{ y: -6, boxShadow: "0 14px 28px rgba(0,0,0,0.12)" }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="relative aspect-3/4 rounded-2xl overflow-hidden bg-bg-secondary border border-border-subtle shadow-xs transition-colors group-hover:border-amber/60"
              >
                {/* Product / Category photography */}
                {imgSrc ? (
                  <Image
                    src={imgSrc}
                    alt={item.name}
                    fill
                    className="object-cover transition-transform duration-500 ease-out group-hover:scale-108"
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
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
        })}
      </div>
    </section>
  );
}
