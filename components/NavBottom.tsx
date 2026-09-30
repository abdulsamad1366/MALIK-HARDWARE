/**
 * components/NavBottom.tsx — Part 3 of the 3-part nav (02-navigation.md).
 *
 * Left-to-right row: Home | Categories ▾ | Our Story | About Us | Contact Us | Blog
 * Horizontally scrollable on mobile (CSS scroll-snap).
 * Categories item has a hover/tap dropdown listing all categories + "View all products".
 * Client component for dropdown toggle state.
 */

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useRef, useEffect } from "react";

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

  /** True when the current path matches a nav link's href. */
  function isActive(href: string) {
    return href === "/" ? pathname === "/" : pathname.startsWith(href);
  }

  return (
    <nav
      className="bg-bg-primary border-b border-border-subtle"
      aria-label="Main navigation"
    >
      {/* Horizontal scroll on mobile — same pattern as .category-nav-strip */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ul
          className="flex items-center gap-0 overflow-x-auto scrollbar-none"
          role="list"
        >
          {/* Home */}
          <li>
            <Link
              href="/"
              className={`block px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                isActive("/")
                  ? "border-amber text-text-main"
                  : "border-transparent text-text-muted hover:text-text-main hover:border-border-medium"
              }`}
            >
              Home
            </Link>
          </li>

          {/* Categories dropdown */}
          <li ref={dropdownRef} className="relative">
            <button
              onClick={() => setCatOpen((v) => !v)}
              aria-expanded={catOpen}
              aria-haspopup="true"
              className={`flex items-center gap-1 px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                pathname.startsWith("/category") || pathname.startsWith("/products")
                  ? "border-amber text-text-main"
                  : "border-transparent text-text-muted hover:text-text-main hover:border-border-medium"
              }`}
            >
              Categories
              {/* Chevron rotates when open */}
              <svg
                className={`w-3 h-3 transition-transform duration-200 ${catOpen ? "rotate-180" : ""}`}
                fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path d="m6 9 6 6 6-6" />
              </svg>
            </button>

            {/* Dropdown panel */}
            {catOpen && (
              <div
                className="absolute top-full left-0 z-50 mt-1 min-w-48 bg-bg-card rounded-lg shadow-lg border border-border-subtle py-1"
                role="menu"
              >
                {categories.map((cat) => (
                  <Link
                    key={cat.id}
                    href={`/category/${cat.slug}`}
                    onClick={() => setCatOpen(false)}
                    role="menuitem"
                    className="block px-4 py-2 text-sm text-text-muted hover:text-text-main hover:bg-bg-secondary transition-colors"
                  >
                    {cat.name}
                  </Link>
                ))}
                {/* Divider + View all */}
                <div className="border-t border-border-subtle mt-1 pt-1">
                  <Link
                    href="/products"
                    onClick={() => setCatOpen(false)}
                    role="menuitem"
                    className="block px-4 py-2 text-sm font-medium text-amber hover:bg-bg-secondary transition-colors"
                  >
                    View all products →
                  </Link>
                </div>
              </div>
            )}
          </li>

          {/* Static links */}
          {NAV_LINKS.filter((l) => l.href !== "/").map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className={`block px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
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
