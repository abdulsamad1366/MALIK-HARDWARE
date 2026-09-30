/**
 * components/Header.tsx — Composes the 3-part navigation.
 *
 * Server Component: fetches marquee message and categories from the DB
 * directly (no API hop — we're already on the server) and passes them as
 * props to the client sub-components.
 *
 * Structure (top to bottom):
 *   1. MarqueeBar    — scrolling announcement text
 *   2. HeaderMiddle  — logo | search | cart + profile
 *   3. NavBottom     — Home | Categories ▾ | Our Story | About Us | Contact | Blog
 */

import { db } from "@/lib/db";
import MarqueeBar from "./MarqueeBar";
import HeaderMiddle from "./HeaderMiddle";
import NavBottom from "./NavBottom";

export default async function Header() {
  // Fetch both in parallel — one DB round-trip each, no waterfall.
  const [settings, categories] = await Promise.all([
    // SiteSettings is a single-row table; findFirst is the correct accessor.
    db.siteSettings.findFirst({ select: { marqueeMessage: true } }),
    db.category.findMany({
      select: { id: true, name: true, slug: true },
      orderBy: { displayOrder: "asc" },
    }),
  ]);

  const marqueeMessage = settings?.marqueeMessage ?? "";

  return (
    <header className="sticky top-0 z-40 bg-bg-primary shadow-sm">
      {/* Part 1 — scrolling marquee strip */}
      <MarqueeBar message={marqueeMessage} />
      {/* Part 2 — logo / search / cart+profile */}
      <HeaderMiddle />
      {/* Part 3 — main nav row */}
      <NavBottom categories={categories} />
    </header>
  );
}
