/**
 * components/MarqueeBar.tsx — Part 1 of the 3-part nav (02-navigation.md).
 *
 * Full-width scrolling text strip above everything.
 * Content from SiteSettings.marqueeMessage (not hardcoded).
 * Empty message → collapses to 0 height (no blank bar).
 * Motion: GSAP infinite scroll, paused on hover, no-scroll when
 *         prefers-reduced-motion is active (09-design-motion-guidelines.md §5).
 *
 * Receives `message` as a prop — the parent (Header.tsx, a Server Component)
 * fetches it from the DB and passes it down so this Client Component does
 * not need its own fetch.
 */

"use client";

import { useEffect, useRef } from "react";

interface MarqueeBarProps {
  message: string;
}

export default function MarqueeBar({ message }: MarqueeBarProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  // Store the GSAP tween so we can pause/resume on hover.
  const tweenRef = useRef<gsap.core.Tween | null>(null);

  useEffect(() => {
    // Collapse: nothing to animate when message is empty.
    if (!message.trim() || !trackRef.current) return;

    // Respect prefers-reduced-motion — show static text instead of scrolling.
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReduced) return;

    // Lazy-load GSAP only on pages that render this component (homepage / all
    // public pages). Avoids adding GSAP to the admin/checkout bundle.
    let cancelled = false;
    import("gsap").then(({ gsap }) => {
      if (cancelled || !trackRef.current) return;
      const el = trackRef.current;
      // Measure the width of one copy of the text track.
      const width = el.scrollWidth / 2; // two copies rendered for seamless loop
      tweenRef.current = gsap.to(el, {
        x: -width,
        duration: message.length * 0.08, // ~0.08s per char — adjustable
        ease: "none",
        repeat: -1,
        // Reset transform to 0 at repeat so we don't accumulate floating-point drift.
        onRepeat: () => gsap.set(el, { x: 0 }),
      });
    });

    return () => {
      cancelled = true;
      tweenRef.current?.kill();
    };
  }, [message]);

  // Collapse the bar entirely when there's no message.
  if (!message.trim()) return null;

  return (
    <div
      className="bg-bg-tertiary border-b border-border-subtle overflow-hidden"
      aria-label="Site announcement"
      // Pause marquee on hover so users can read without chasing text.
      onMouseEnter={() => tweenRef.current?.pause()}
      onMouseLeave={() => tweenRef.current?.resume()}
    >
      {/*
       * Two identical copies of the text inside one div.
       * GSAP translates the div left by exactly one copy's width,
       * then jumps back to 0 — creating a seamless infinite loop
       * without any visible seam.
       */}
      <div
        ref={trackRef}
        className="flex whitespace-nowrap py-2 text-sm text-text-muted"
        aria-hidden="true" // decorative — screen readers get the aria-label above
      >
        <span className="px-8">{message}</span>
        <span className="px-8" aria-hidden="true">{message}</span>
      </div>
      {/* Static fallback: visible to screen readers, hidden visually */}
      <p className="sr-only">{message}</p>
    </div>
  );
}
