/**
 * app/layout.tsx — Root layout for the entire app.
 *
 * SEO: title template and default description set here; each page overrides
 * via its own generateMetadata export (11-seo-guidelines.md §2).
 * No Geist font — system stack defined in globals.css (no render-blocking request).
 *
 * Providers: AuthProvider must wrap everything; CartProvider wraps below it
 * because it depends on useAuth. Header is a Server Component nested here
 * so it renders on every page without duplication.
 */

import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";
import Header from "@/components/Header";

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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full antialiased overflow-x-clip">
      <body className="min-h-full flex flex-col bg-bg-primary text-text-main overflow-x-clip max-w-full">
        {/*
         * AuthProvider is a Client Component — it fetches /api/auth/me on
         * mount to rehydrate user state. CartProvider sits inside it because
         * it depends on useAuth.
         */}
        <AuthProvider>
          <CartProvider>
            {/* Header is a Server Component: fetches marquee + categories from DB */}
            <Header />
            {/* main grows to push footer to the bottom of short pages */}
            <main className="flex-1">{children}</main>
            <footer className="bg-bg-secondary border-t border-border-subtle py-8 px-4 sm:px-6 lg:px-8">
              <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-text-muted">
                <p>© {new Date().getFullYear()} Malik Hardware Mart. All rights reserved.</p>
                <p>B2B Wholesale Hardware, Fasteners & Tools</p>
              </div>
            </footer>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
