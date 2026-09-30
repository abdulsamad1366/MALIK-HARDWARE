/**
 * components/PromoBannerStrip.tsx — Promo banner tiles (08-homepage-layout.md §3).
 *
 * 2-3 large rectangular tiles in a row (image + title + "Shop Now" CTA).
 * Data: PromoBanner records, isActive = true, ordered by displayOrder.
 * Motion: Framer Motion whileHover lift on each tile.
 */

"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

interface PromoBanner {
  id: string;
  title: string;
  image: string;
  linkUrl: string;
}

interface PromoBannerStripProps {
  banners: PromoBanner[];
}

export default function PromoBannerStrip({ banners }: PromoBannerStripProps) {
  if (!banners.length) return null;

  return (
    <section className="py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {banners.map((banner) => (
          <motion.div
            key={banner.id}
            whileHover={{ y: -4 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
          >
            <Link
              href={banner.linkUrl}
              className="relative block h-44 sm:h-52 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow group"
              aria-label={`${banner.title} — Shop Now`}
            >
              <Image
                src={banner.image}
                alt={banner.title}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
              {/* Gradient overlay + text */}
              <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent flex flex-col justify-end p-4">
                <p className="text-white font-semibold text-base">{banner.title}</p>
                <span className="text-white/80 text-xs mt-1 font-medium">Shop Now →</span>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
