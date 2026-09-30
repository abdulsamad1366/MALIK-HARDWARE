/**
 * app/layout.tsx — Root layout for the entire app.
 *
 * SEO: title template and default description are set here; each page
 * overrides via its own generateMetadata export (11-seo-guidelines.md §2).
 * No Geist font — we use the system stack defined in globals.css to avoid
 * a render-blocking font request (09-design-motion-guidelines.md §2).
 */

import type { Metadata } from "next";
import "./globals.css";

/**
 * Default metadata — every public page should override `title` and
 * `description` via generateMetadata. This is the fallback for pages
 * that do not (admin, error pages, etc.).
 */
export const metadata: Metadata = {
  title: {
    default: "Malik Hardware Mart — B2B Wholesale Hardware & Fasteners",
    template: "%s | Malik Hardware Mart",
  },
  description:
    "Wholesale hardware, fasteners, locks, and tools for trade buyers. " +
    "Register and apply for pricing access.",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"
  ),
};

/** Root layout wraps every page in the app. */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full antialiased">
      {/*
       * flex + flex-col so the footer can be pushed to the bottom of the
       * viewport on short pages (min-h-full on body, flex-grow on <main>).
       */}
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
