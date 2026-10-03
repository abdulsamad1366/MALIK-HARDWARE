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
    <section className="py-8 sm:py-12 md:py-14 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
      <div className="flex flex-col gap-4 sm:gap-6">
        {/* ====================================================================
            ROW 1: 3 Banners (Pulls 50%, Aldrop 25%, Mortise Locks 25%)
            ==================================================================== */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-4 sm:gap-6">
          {/* Tile 1: Pulls (50% on desktop) */}
          <motion.div
            whileHover={{ y: -4 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="col-span-1 sm:col-span-2 lg:col-span-6"
          >
            <Link
              href={pulls.linkUrl}
              className="relative block h-56 sm:h-64 md:h-72 lg:h-[300px] rounded-xl overflow-hidden shadow-xs hover:shadow-md transition-shadow group bg-bg-secondary border border-border-subtle"
              aria-label={`${pulls.title} — Shop Now`}
            >
              <Image
                src={pulls.image}
                alt={pulls.title}
                fill
                priority
                className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 100vw, 50vw"
              />

              {/* Code-rendered text overlay */}
              <div className="absolute top-5 left-5 sm:top-7 sm:left-7 z-10 pointer-events-none">
                <div className="inline-flex flex-col items-center">
                  <h3 className="text-sm sm:text-base md:text-lg font-bold tracking-widest uppercase text-text-main">
                    PULLS
                  </h3>
                  <div className="w-8 sm:w-10 h-0.5 bg-text-main mt-1 rounded-full transition-all duration-300 group-hover:w-full" />
                </div>
              </div>
            </Link>
          </motion.div>

          {/* Tile 2: Aldrop (25% on desktop) */}
          <motion.div
            whileHover={{ y: -4 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="col-span-1 sm:col-span-1 lg:col-span-3"
          >
            <Link
              href={aldrop.linkUrl}
              className="relative block h-56 sm:h-64 md:h-72 lg:h-[300px] rounded-xl overflow-hidden shadow-xs hover:shadow-md transition-shadow group bg-bg-secondary border border-border-subtle"
              aria-label={`${aldrop.title} — Shop Now`}
            >
              <Image
                src={aldrop.image}
                alt={aldrop.title}
                fill
                className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              />

              {/* Code-rendered text overlay */}
              <div className="absolute top-5 left-5 sm:top-7 sm:left-7 z-10 pointer-events-none">
                <div className="inline-flex flex-col items-center">
                  <h3 className="text-sm sm:text-base md:text-lg font-bold tracking-widest uppercase text-white drop-shadow-xs">
                    ALDROP
                  </h3>
                  <div className="w-8 sm:w-10 h-0.5 bg-white mt-1 rounded-full transition-all duration-300 group-hover:w-full" />
                </div>
              </div>
            </Link>
          </motion.div>

          {/* Tile 3: Mortise Locks (25% on desktop) */}
          <motion.div
            whileHover={{ y: -4 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="col-span-1 sm:col-span-1 lg:col-span-3"
          >
            <Link
              href={mortiseLocks.linkUrl}
              className="relative block h-56 sm:h-64 md:h-72 lg:h-[300px] rounded-xl overflow-hidden shadow-xs hover:shadow-md transition-shadow group bg-bg-secondary border border-border-subtle"
              aria-label={`${mortiseLocks.title} — Shop Now`}
            >
              <Image
                src={mortiseLocks.image}
                alt={mortiseLocks.title}
                fill
                className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              />

              {/* Code-rendered text overlay */}
              <div className="absolute top-5 left-5 sm:top-7 sm:left-7 z-10 pointer-events-none">
                <div className="inline-flex flex-col items-start">
                  <h3 className="text-sm sm:text-base md:text-lg font-bold tracking-wider uppercase text-text-main">
                    MORTISE LOCKS
                  </h3>
                  <div className="w-14 sm:w-16 h-0.5 bg-text-main mt-1 rounded-full transition-all duration-300 group-hover:w-full" />
                </div>
              </div>
            </Link>
          </motion.div>
        </div>

        {/* ====================================================================
            ROW 2: Asymmetric 2-Column Grid
            - Left: Large Door Lock banner (~66% on desktop)
            - Right: 2 Stacked banners: Door Stopper + Tower Bolt (~33% on desktop)
            ==================================================================== */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6">
          {/* Tile 4: Door Lock (Wide Left Banner — spans full height of right stack) */}
          <motion.div
            whileHover={{ y: -4 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="col-span-1 lg:col-span-8"
          >
            <Link
              href={doorLock.linkUrl}
              className="relative block h-72 sm:h-96 md:h-[460px] lg:h-[500px] rounded-xl overflow-hidden shadow-xs hover:shadow-md transition-shadow group bg-bg-secondary border border-border-subtle"
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
              <div className="absolute top-1/2 -translate-y-1/2 left-6 sm:left-10 md:left-12 z-10 pointer-events-none">
                <h3 className="text-xl sm:text-2xl md:text-3xl font-extrabold tracking-wide uppercase text-text-main leading-tight">
                  DOOR LOCK
                </h3>
                <div className="inline-block mt-2 sm:mt-2.5">
                  <span className="block text-xs sm:text-sm font-bold tracking-widest uppercase text-text-main">
                    SHOP NOW
                  </span>
                  <div className="w-full h-0.5 bg-text-main mt-1 rounded-full transition-all duration-300 group-hover:scale-x-110 origin-left" />
                </div>
              </div>
            </Link>
          </motion.div>

          {/* Right Column: 2 Stacked Banners */}
          <div className="col-span-1 lg:col-span-4 flex flex-col gap-4 sm:gap-6 h-auto lg:h-[500px]">
            {/* Tile 5: Door Stopper (Top) */}
            <motion.div
              whileHover={{ y: -4 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="flex-1"
            >
              <Link
                href={doorStopper.linkUrl}
                className="relative block h-52 sm:h-56 lg:h-full rounded-xl overflow-hidden shadow-xs hover:shadow-md transition-shadow group bg-bg-secondary border border-border-subtle"
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
                <div className="absolute top-1/2 -translate-y-1/2 right-6 sm:right-8 md:right-10 z-10 text-right pointer-events-none">
                  <h3 className="text-base sm:text-lg md:text-xl font-bold tracking-wide uppercase text-white">
                    DOOR STOPPER
                  </h3>
                  <div className="inline-block mt-1 sm:mt-1.5 text-right">
                    <span className="block text-xs sm:text-sm font-bold tracking-widest uppercase text-white/95">
                      SHOP NOW
                    </span>
                    <div className="w-full h-0.5 bg-white mt-1 rounded-full transition-all duration-300 group-hover:scale-x-110 origin-right" />
                  </div>
                </div>
              </Link>
            </motion.div>

            {/* Tile 6: Tower Bolt (Bottom) */}
            <motion.div
              whileHover={{ y: -4 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="flex-1"
            >
              <Link
                href={towerBolt.linkUrl}
                className="relative block h-52 sm:h-56 lg:h-full rounded-xl overflow-hidden shadow-xs hover:shadow-md transition-shadow group bg-bg-secondary border border-border-subtle"
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
                <div className="absolute top-1/2 -translate-y-1/2 right-6 sm:right-8 md:right-10 z-10 text-right pointer-events-none">
                  <h3 className="text-base sm:text-lg md:text-xl font-bold tracking-wide uppercase text-white">
                    TOWER BOLT
                  </h3>
                  <div className="inline-block mt-1 sm:mt-1.5 text-right">
                    <span className="block text-xs sm:text-sm font-bold tracking-widest uppercase text-white/95">
                      SHOP NOW
                    </span>
                    <div className="w-full h-0.5 bg-white mt-1 rounded-full transition-all duration-300 group-hover:scale-x-110 origin-right" />
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
