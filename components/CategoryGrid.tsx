/**
 * components/CategoryGrid.tsx — Circular icon grid (08-homepage-layout.md §2, §4).
 *
 * Reused for both "Shop by Category" and "Shop by Use" sections.
 * The `source` prop controls which link pattern to use:
 *   "category" → /category/[slug]
 *   "useCase"  → /use/[slug]
 *
 * Motion: subtle hover scale via Framer Motion whileHover (09-design-motion-guidelines.md §7).
 * No entrance animation — performance budget kept (only hover/interaction states).
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

  return (
    <section className="py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <h2 className="text-lg font-semibold text-text-main tracking-widest uppercase mb-6">
        {heading}
      </h2>
      <div className="flex flex-wrap gap-6 justify-start">
        {items.map((item) => {
          const href = source === "category"
            ? `/category/${item.slug}`
            : `/use/${item.slug}`;
          const imgSrc = item.placeholderImage ?? item.image ?? null;

          return (
            <Link
              key={item.id}
              href={href}
              className="flex flex-col items-center gap-2 group focus:outline-none focus-visible:ring-2 focus-visible:ring-amber rounded-xl"
              aria-label={item.name}
            >
              {/* Hover lift via Framer Motion — only transform, no layout props */}
              <motion.div
                whileHover={{ scale: 1.06 }}
                transition={{ duration: 0.18, ease: "easeOut" }}
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-bg-tertiary border-2 border-border-subtle overflow-hidden shadow-sm group-hover:shadow-md transition-shadow"
              >
                {imgSrc ? (
                  <Image
                    src={imgSrc}
                    alt={item.name}
                    width={96}
                    height={96}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  /* Placeholder initials when no image */
                  <div className="w-full h-full flex items-center justify-center text-text-dim text-xl font-bold">
                    {item.name[0]}
                  </div>
                )}
              </motion.div>
              <span className="text-xs sm:text-sm text-text-muted group-hover:text-text-main font-medium text-center transition-colors max-w-[80px] leading-tight">
                {item.name}
              </span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
