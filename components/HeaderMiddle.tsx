/**
 * components/HeaderMiddle.tsx — Part 2 of the 3-part nav (02-navigation.md).
 *
 * Three-column row:
 *   Left  → Logo + "Malik Hardware Mart" wordmark, links to /
 *   Centre → Search input (submits to /products?search=<query>)
 *   Right  → Cart icon (badge) + Profile icon
 *
 * On mobile the search collapses to an icon-triggered overlay to prevent
 * row wrapping. Client component because it needs useAuth/useCart state.
 */

"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useRef, type FormEvent } from "react";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";

export default function HeaderMiddle() {
  const router = useRouter();
  const { user } = useAuth();
  const { itemCount } = useCart();
  const [searchOpen, setSearchOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  /** Submit the search form — navigates to /products?search=<query>. */
  function handleSearch(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const q = searchInputRef.current?.value.trim() ?? "";
    if (q) {
      router.push(`/products?search=${encodeURIComponent(q)}`);
      setSearchOpen(false);
    }
  }

  /** User initial from name (for the logged-in avatar). */
  const initial = user?.name?.[0]?.toUpperCase() ?? "";

  return (
    <div className="bg-bg-primary border-b border-border-subtle">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center gap-4">

        {/* ---- LEFT: Logo + wordmark ---- */}
        <Link
          href="/"
          className="flex items-center gap-2 shrink-0 group"
          aria-label="Malik Hardware Mart — Home"
        >
          {/* Simple geometric logo mark using CSS — no external image dep */}
          <div
            className="w-9 h-9 rounded-lg flex items-center justify-center text-white font-bold text-base"
            style={{ background: "var(--color-amber)" }}
            aria-hidden="true"
          >
            M
          </div>
          <span className="hidden sm:block font-semibold text-text-main leading-tight text-sm">
            Malik Hardware<br />
            <span className="text-text-muted font-normal text-xs">Mart</span>
          </span>
        </Link>

        {/* ---- CENTRE: Search (desktop) ---- */}
        <form
          onSubmit={handleSearch}
          className="hidden sm:flex flex-1 items-center gap-2 max-w-xl mx-auto"
          role="search"
        >
          <div className="relative flex-1">
            {/* Search icon inside input */}
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-dim pointer-events-none"
              fill="none" stroke="currentColor" strokeWidth={2}
              viewBox="0 0 24 24" aria-hidden="true"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
            <input
              ref={searchInputRef}
              type="search"
              placeholder="Search products, brands, SKUs…"
              aria-label="Search products"
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-border-medium bg-bg-secondary text-text-main text-sm placeholder:text-text-dim focus:outline-none focus:border-amber focus:ring-1 focus:ring-amber transition-colors"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 rounded-lg text-sm font-medium text-white transition-opacity hover:opacity-90"
            style={{ background: "var(--color-amber)" }}
          >
            Search
          </button>
        </form>

        {/* ---- RIGHT: actions ---- */}
        <div className="flex items-center gap-2 sm:gap-3 ml-auto sm:ml-0">

          {/* Mobile search toggle */}
          <button
            className="sm:hidden p-2 rounded-lg text-text-muted hover:text-text-main hover:bg-bg-secondary transition-colors"
            aria-label="Open search"
            onClick={() => {
              setSearchOpen(true);
              // Focus the mobile input after it appears
              setTimeout(() => searchInputRef.current?.focus(), 50);
            }}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
            </svg>
          </button>

          {/* Cart icon + badge */}
          <Link
            href="/cart"
            className="relative p-2 rounded-lg text-text-muted hover:text-text-main hover:bg-bg-secondary transition-colors"
            aria-label={`Cart${itemCount > 0 ? ` — ${itemCount} items` : ""}`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <path d="M16 10a4 4 0 0 1-8 0" />
            </svg>
            {itemCount > 0 && (
              <span
                className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 rounded-full text-white text-[10px] font-bold flex items-center justify-center"
                style={{ background: "var(--color-rose)" }}
                aria-hidden="true"
              >
                {itemCount > 99 ? "99+" : itemCount}
              </span>
            )}
          </Link>

          {/* Profile icon / initials avatar */}
          <Link
            href={user ? "/account" : "/login"}
            className="p-2 rounded-lg text-text-muted hover:text-text-main hover:bg-bg-secondary transition-colors"
            aria-label={user ? `Account — ${user.name}` : "Login"}
          >
            {user ? (
              /* Initials avatar when logged in */
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold"
                style={{ background: "var(--color-amber)" }}
                aria-hidden="true"
              >
                {initial}
              </div>
            ) : (
              /* Outline icon for guests */
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            )}
          </Link>
        </div>
      </div>

      {/* Mobile search overlay */}
      {searchOpen && (
        <div className="sm:hidden px-4 pb-3 border-t border-border-subtle">
          <form onSubmit={handleSearch} className="flex gap-2 mt-3" role="search">
            <input
              ref={searchInputRef}
              type="search"
              placeholder="Search products…"
              aria-label="Search products"
              className="flex-1 px-3 py-2 rounded-lg border border-border-medium bg-bg-secondary text-text-main text-sm placeholder:text-text-dim focus:outline-none focus:border-amber focus:ring-1 focus:ring-amber"
            />
            <button
              type="submit"
              className="px-4 py-2 rounded-lg text-sm font-medium text-white"
              style={{ background: "var(--color-amber)" }}
            >
              Go
            </button>
            <button
              type="button"
              onClick={() => setSearchOpen(false)}
              className="px-3 py-2 rounded-lg text-sm text-text-muted border border-border-subtle"
            >
              Cancel
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
