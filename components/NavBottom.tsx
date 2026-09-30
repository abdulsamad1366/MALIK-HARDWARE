/**
 * components/NavBottom.tsx — Part 3 of the 3-part nav (02-navigation.md).
 *
 * Centered navigation row: Home | Categories ▾ | Our Story | About Us | Contact Us | Blog
 * Dropdown floats cleanly above page content (z-50, overflow-visible).
 * Supports both click/tap and hover with smooth animation.
 */

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface NavBottomProps {
  /** Pre-fetched by the server parent (Header.tsx) — no client fetch needed. */
  categories: Category[];
}

/** Static nav links — no dynamic data needed. */
const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/our-story", label: "Our Story" },
  { href: "/about-us", label: "About Us" },
  { href: "/contact-us", label: "Contact Us" },
  { href: "/blog", label: "Blog" },
] as const;

export default function NavBottom({ categories }: NavBottomProps) {
  const pathname = usePathname();
  const [catOpen, setCatOpen] = useState(false);
  const dropdownRef = useRef<HTMLLIElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  /** Open with hover debounce */
  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setCatOpen(true);
  };

  /** Close with small delay to allow cursor travel */
  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setCatOpen(false);
    }, 180);
  };

  // Close dropdown on outside click or Escape key.
  useEffect(() => {
    if (!catOpen) return;
    function close(e: MouseEvent | KeyboardEvent) {
      if (e instanceof KeyboardEvent) {
        if (e.key === "Escape") setCatOpen(false);
        return;
      }
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setCatOpen(false);
      }
    }
    document.addEventListener("mousedown", close);
    document.addEventListener("keydown", close);
    return () => {
      document.removeEventListener("mousedown", close);
      document.removeEventListener("keydown", close);
    };
  }, [catOpen]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  /** True when the current path matches a nav link's href. */
  function isActive(href: string) {
    return href === "/" ? pathname === "/" : pathname.startsWith(href);
  }

  return (
    <nav
      className="bg-bg-primary border-b border-border-subtle relative z-30 overflow-visible"
      aria-label="Main navigation"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-center overflow-visible">
        {/*
         * Centered nav buttons row — overflow-visible ensures dropdown floats above
         * page content without clipping or triggering scroll.
         */}
        <ul
          className="flex items-center justify-center gap-1 sm:gap-3 md:gap-6 overflow-visible py-0.5"
          role="list"
        >
          {/* Home */}
          <li>
            <Link
              href="/"
              className={`block px-3 sm:px-4 py-2.5 sm:py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                isActive("/")
                  ? "border-amber text-text-main"
                  : "border-transparent text-text-muted hover:text-text-main hover:border-border-medium"
              }`}
            >
              Home
            </Link>
          </li>

          {/* Categories dropdown */}
          <li
            ref={dropdownRef}
            className="relative overflow-visible"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <button
              onClick={() => setCatOpen((v) => !v)}
              aria-expanded={catOpen}
              aria-haspopup="true"
              className={`flex items-center gap-1.5 px-3 sm:px-4 py-2.5 sm:py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors cursor-pointer ${
                catOpen || pathname.startsWith("/category") || pathname.startsWith("/products")
                  ? "border-amber text-text-main"
                  : "border-transparent text-text-muted hover:text-text-main hover:border-border-medium"
              }`}
            >
              Categories
              {/* Chevron rotates when open */}
              <svg
                className={`w-3.5 h-3.5 transition-transform duration-200 ${
                  catOpen ? "rotate-180 text-amber" : "text-text-dim"
                }`}
                fill="none"
                stroke="currentColor"
                strokeWidth={2.5}
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path d="m6 9 6 6 6-6" />
              </svg>
            </button>

            {/* Dropdown panel — positioned absolute, floating cleanly above the page */}
            <AnimatePresence>
              {catOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 6, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 4, scale: 0.98 }}
                  transition={{ duration: 0.15, ease: "easeOut" }}
                  className="absolute top-full left-1/2 -translate-x-1/2 z-50 mt-1 min-w-56 bg-bg-card rounded-xl shadow-xl border border-border-subtle py-2 overflow-hidden"
                  role="menu"
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                >
                  <div className="px-3.5 py-1 text-[11px] font-semibold tracking-wider text-text-dim uppercase border-b border-border-subtle mb-1">
                    Catalog Divisions
                  </div>
                  {categories.map((cat) => (
                    <Link
                      key={cat.id}
                      href={`/category/${cat.slug}`}
                      onClick={() => setCatOpen(false)}
                      role="menuitem"
                      className="flex items-center justify-between px-3.5 py-2 text-sm text-text-muted hover:text-text-main hover:bg-bg-secondary transition-colors rounded-lg mx-1"
                    >
                      <span>{cat.name}</span>
                      <span className="text-xs text-text-dim opacity-70">→</span>
                    </Link>
                  ))}
                  {/* Divider + View all */}
                  <div className="border-t border-border-subtle mt-1.5 pt-1.5 px-1">
                    <Link
                      href="/products"
                      onClick={() => setCatOpen(false)}
                      role="menuitem"
                      className="flex items-center justify-between px-3 py-2 text-sm font-medium text-amber hover:bg-bg-secondary rounded-lg transition-colors"
                    >
                      <span>All Products Catalog</span>
                      <span aria-hidden="true">→</span>
                    </Link>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </li>

          {/* Static links */}
          {NAV_LINKS.filter((l) => l.href !== "/").map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className={`block px-3 sm:px-4 py-2.5 sm:py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                  isActive(link.href)
                    ? "border-amber text-text-main"
                    : "border-transparent text-text-muted hover:text-text-main hover:border-border-medium"
                }`}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
