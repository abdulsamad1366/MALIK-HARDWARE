/**
 * components/PromoBannerStrip.tsx — Promo banner showcase section (08-homepage-layout.md §3).
 *
 * Implements the exact 6-tile promotional showcase layout from the reference:
 * - Clean background photography with text removed.
 * - Code-rendered typography overlays (HTML/CSS) for pixel-crisp vector text at all resolutions:
 *     • Row 1:
 *         - Left: "PULLS" with accent underline
 *         - Middle: "ALDROP" with white accent underline
 *         - Right: "MORTISE LOCKS" with accent underline
 *     • Row 2:
 *         - Left: "DOOR LOCK" + "SHOP NOW" with accent underline
 *         - Right Top: "DOOR STOPPER" + "SHOP NOW" with white accent underline
 *         - Right Bottom: "TOWER BOLT" + "SHOP NOW" with white accent underline
 * - Motion: Subtle hover lift and image zoom on each card.
 * - Responsive: Collapses cleanly on mobile, aligns symmetrically on tablet, desktop, and ultra-wide.
 */

"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

interface PromoBannerItem {
  id: string;
  title: string;
  image: string;
  linkUrl: string;
}

interface PromoBannerStripProps {
  banners?: PromoBannerItem[];
}

const defaultShowcaseBanners = {
  pulls: {
    title: "Pulls",
    image: "/images/promo/pulls_clean_v2.jpg",
    linkUrl: "/category/cabinet-fittings",
  },
  aldrop: {
    title: "Aldrop",
    image: "/images/promo/aldrop_clean_v2.jpg",
    linkUrl: "/category/aldrops",
  },
  mortiseLocks: {
    title: "Mortise Locks",
    image: "/images/promo/mortise_locks_clean_v2.jpg",
    linkUrl: "/category/locks",
  },
  doorLock: {
    title: "Door Lock",
    image: "/images/promo/door_lock_clean_v2.jpg",
    linkUrl: "/category/locks",
  },
  doorStopper: {
    title: "Door Stopper",
    image: "/images/promo/door_stopper_clean_v2.jpg",
    linkUrl: "/category/door-closers",
  },
  towerBolt: {
    title: "Tower Bolt",
    image: "/images/promo/tower_bolt_clean_v2.jpg",
    linkUrl: "/category/aldrops",
  },
};

export default function PromoBannerStrip({ banners }: PromoBannerStripProps) {
  const pulls =
    banners?.find((b) => b.title.toLowerCase() === "pulls") ||
    defaultShowcaseBanners.pulls;
  const aldrop =
    banners?.find((b) => b.title.toLowerCase() === "aldrop") ||
    defaultShowcaseBanners.aldrop;
  const mortiseLocks =
    banners?.find((b) => b.title.toLowerCase() === "mortise locks") ||
    defaultShowcaseBanners.mortiseLocks;
  const doorLock =
    banners?.find((b) => b.title.toLowerCase() === "door lock") ||
    defaultShowcaseBanners.doorLock;
  const doorStopper =
    banners?.find((b) => b.title.toLowerCase() === "door stopper") ||
    defaultShowcaseBanners.doorStopper;
  const towerBolt =
    banners?.find((b) => b.title.toLowerCase() === "tower bolt") ||
    defaultShowcaseBanners.towerBolt;

  return (
    <section className="py-6 sm:py-10 md:py-14 px-3.5 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
      <div className="flex flex-col gap-3.5 sm:gap-5 lg:gap-6">
        {/* ====================================================================
            ROW 1:
            - Mobile: 2-column grid. Pulls spans both columns (100%),
              Aldrop & Mortise Locks sit side-by-side (50% / 50%).
            - Desktop: 12-column grid. Pulls (50%), Aldrop (25%), Mortise Locks (25%).
            ==================================================================== */}
        <div className="grid grid-cols-2 lg:grid-cols-12 gap-3.5 sm:gap-5 lg:gap-6">
          {/* Tile 1: Pulls (Full width on mobile, 50% on desktop) */}
          <motion.div
            whileHover={{ y: -4 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="col-span-2 lg:col-span-6"
          >
            <Link
              href={pulls.linkUrl}
              className="relative block aspect-[1.65/1] sm:aspect-[2/1] lg:aspect-auto lg:h-[300px] rounded-lg sm:rounded-xl overflow-hidden shadow-xs hover:shadow-md transition-shadow group bg-bg-secondary border border-border-subtle"
              aria-label={`${pulls.title} — Shop Now`}
            >
              <Image
                src={pulls.image}
                alt={pulls.title}
                fill
                priority
                className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />

              {/* Code-rendered text overlay */}
              <div className="absolute top-4 left-4 sm:top-7 sm:left-7 z-10 pointer-events-none">
                <div className="inline-flex flex-col items-center">
                  <h3 className="text-xs sm:text-base md:text-lg font-bold tracking-widest uppercase text-text-main">
                    PULLS
                  </h3>
                  <div className="w-7 sm:w-10 h-0.5 bg-text-main mt-1 rounded-full transition-all duration-300 group-hover:w-full" />
                </div>
              </div>
            </Link>
          </motion.div>

          {/* Tile 2: Aldrop (50% on mobile, 25% on desktop) */}
          <motion.div
            whileHover={{ y: -4 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="col-span-1 lg:col-span-3"
          >
            <Link
              href={aldrop.linkUrl}
              className="relative block aspect-[0.87/1] sm:aspect-[1/1] lg:aspect-auto lg:h-[300px] rounded-lg sm:rounded-xl overflow-hidden shadow-xs hover:shadow-md transition-shadow group bg-bg-secondary border border-border-subtle"
              aria-label={`${aldrop.title} — Shop Now`}
            >
              <Image
                src={aldrop.image}
                alt={aldrop.title}
                fill
                className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                sizes="(max-width: 1024px) 50vw, 25vw"
              />

              {/* Code-rendered text overlay */}
              <div className="absolute top-4 left-4 sm:top-7 sm:left-7 z-10 pointer-events-none">
                <div className="inline-flex flex-col items-center">
                  <h3 className="text-xs sm:text-base md:text-lg font-bold tracking-widest uppercase text-white drop-shadow-xs">
                    ALDROP
                  </h3>
                  <div className="w-7 sm:w-10 h-0.5 bg-white mt-1 rounded-full transition-all duration-300 group-hover:w-full" />
                </div>
              </div>
            </Link>
          </motion.div>

          {/* Tile 3: Mortise Locks (50% on mobile, 25% on desktop) */}
          <motion.div
            whileHover={{ y: -4 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="col-span-1 lg:col-span-3"
          >
            <Link
              href={mortiseLocks.linkUrl}
              className="relative block aspect-[0.87/1] sm:aspect-[1/1] lg:aspect-auto lg:h-[300px] rounded-lg sm:rounded-xl overflow-hidden shadow-xs hover:shadow-md transition-shadow group bg-bg-secondary border border-border-subtle"
              aria-label={`${mortiseLocks.title} — Shop Now`}
            >
              <Image
                src={mortiseLocks.image}
                alt={mortiseLocks.title}
                fill
                className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                sizes="(max-width: 1024px) 50vw, 25vw"
              />

              {/* Code-rendered text overlay */}
              <div className="absolute top-4 left-4 sm:top-7 sm:left-7 z-10 pointer-events-none">
                <div className="inline-flex flex-col items-start">
                  <h3 className="text-[11px] sm:text-sm md:text-base lg:text-lg font-bold tracking-wider uppercase text-text-main whitespace-nowrap">
                    MORTISE LOCKS
                  </h3>
                  <div className="w-9 sm:w-14 h-0.5 bg-text-main mt-1 rounded-full transition-all duration-300 group-hover:w-full" />
                </div>
              </div>
            </Link>
          </motion.div>
        </div>

        {/* ====================================================================
            ROW 2:
            - Mobile: Full-width stacked banners (Door Lock, Door Stopper, Tower Bolt)
            - Desktop: Left 66% Door Lock, Right 33% 2 stacked banners
            ==================================================================== */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5 sm:gap-5 lg:gap-6">
          {/* Tile 4: Door Lock (Wide landscape on mobile, 66% span on desktop) */}
          <motion.div
            whileHover={{ y: -4 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="col-span-1 lg:col-span-8"
          >
            <Link
              href={doorLock.linkUrl}
              className="relative block aspect-[1.82/1] sm:aspect-[1.85/1] lg:aspect-auto lg:h-[500px] rounded-lg sm:rounded-xl overflow-hidden shadow-xs hover:shadow-md transition-shadow group bg-bg-secondary border border-border-subtle"
              aria-label={`${doorLock.title} — Shop Now`}
            >
              <Image
                src={doorLock.image}
                alt={doorLock.title}
                fill
                className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                sizes="(max-width: 1024px) 100vw, 66vw"
              />

              {/* Code-rendered text overlay */}
              <div className="absolute top-1/2 -translate-y-1/2 left-4 sm:left-10 md:left-12 z-10 pointer-events-none">
                <h3 className="text-base sm:text-2xl md:text-3xl font-extrabold tracking-wide uppercase text-text-main leading-tight">
                  DOOR LOCK
                </h3>
                <div className="inline-block mt-1 sm:mt-2.5">
                  <span className="block text-[10px] sm:text-xs md:text-sm font-bold tracking-widest uppercase text-text-main">
                    SHOP NOW
                  </span>
                  <div className="w-full h-0.5 bg-text-main mt-0.5 sm:mt-1 rounded-full transition-all duration-300 group-hover:scale-x-110 origin-left" />
                </div>
              </div>
            </Link>
          </motion.div>

          {/* Right Column: 2 Stacked Banners (individual full width on mobile) */}
          <div className="col-span-1 lg:col-span-4 flex flex-col gap-3.5 sm:gap-5 lg:gap-6 h-auto lg:h-[500px]">
            {/* Tile 5: Door Stopper */}
            <motion.div
              whileHover={{ y: -4 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="flex-1"
            >
              <Link
                href={doorStopper.linkUrl}
                className="relative block aspect-[1.83/1] sm:aspect-[1.85/1] lg:aspect-auto lg:h-full rounded-lg sm:rounded-xl overflow-hidden shadow-xs hover:shadow-md transition-shadow group bg-bg-secondary border border-border-subtle"
                aria-label={`${doorStopper.title} — Shop Now`}
              >
                <Image
                  src={doorStopper.image}
                  alt={doorStopper.title}
                  fill
                  className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                  sizes="(max-width: 1024px) 100vw, 33vw"
                />

                {/* Code-rendered text overlay */}
                <div className="absolute top-1/2 -translate-y-1/2 right-4 sm:right-8 md:right-10 z-10 text-right pointer-events-none">
                  <h3 className="text-sm sm:text-lg md:text-xl font-bold tracking-wide uppercase text-white">
                    DOOR STOPPER
                  </h3>
                  <div className="inline-block mt-0.5 sm:mt-1.5 text-right">
                    <span className="block text-[10px] sm:text-xs md:text-sm font-bold tracking-widest uppercase text-white/95">
                      SHOP NOW
                    </span>
                    <div className="w-full h-0.5 bg-white mt-0.5 sm:mt-1 rounded-full transition-all duration-300 group-hover:scale-x-110 origin-right" />
                  </div>
                </div>
              </Link>
            </motion.div>

            {/* Tile 6: Tower Bolt */}
            <motion.div
              whileHover={{ y: -4 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="flex-1"
            >
              <Link
                href={towerBolt.linkUrl}
                className="relative block aspect-[1.83/1] sm:aspect-[1.85/1] lg:aspect-auto lg:h-full rounded-lg sm:rounded-xl overflow-hidden shadow-xs hover:shadow-md transition-shadow group bg-bg-secondary border border-border-subtle"
                aria-label={`${towerBolt.title} — Shop Now`}
              >
                <Image
                  src={towerBolt.image}
                  alt={towerBolt.title}
                  fill
                  className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                  sizes="(max-width: 1024px) 100vw, 33vw"
                />

                {/* Code-rendered text overlay */}
                <div className="absolute top-1/2 -translate-y-1/2 right-4 sm:right-8 md:right-10 z-10 text-right pointer-events-none">
                  <h3 className="text-sm sm:text-lg md:text-xl font-bold tracking-wide uppercase text-white">
                    TOWER BOLT
                  </h3>
                  <div className="inline-block mt-0.5 sm:mt-1.5 text-right">
                    <span className="block text-[10px] sm:text-xs md:text-sm font-bold tracking-widest uppercase text-white/95">
                      SHOP NOW
                    </span>
                    <div className="w-full h-0.5 bg-white mt-0.5 sm:mt-1 rounded-full transition-all duration-300 group-hover:scale-x-110 origin-right" />
                  </div>
                </div>
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
