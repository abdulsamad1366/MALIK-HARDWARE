/**
 * app/page.tsx — Homepage (08-homepage-layout.md).
 *
 * Server Component: fetches all data directly from the DB.
 * Section order:
 *   1. Hero carousel (HeroSlides)
 *   2. Shop by Category grid
 *   3. Promo banner strip
 *   4. Shop by Use grid
 *   5. Featured products grid
 *
 * SEO: Organization JSON-LD on homepage (11-seo-guidelines.md §3).
 * Price gate on featured products: the API route handles this; here we
 * just pass what the server received.
 */

import type { Metadata } from "next";
import { db } from "@/lib/db";
import { getAuthUser } from "@/lib/auth";
import HeroCarousel from "@/components/HeroCarousel";
import CategoryGrid from "@/components/CategoryGrid";
import PromoBannerStrip from "@/components/PromoBannerStrip";
import ProductCard from "@/components/ProductCard";

export const metadata: Metadata = {
  title: "Malik Hardware Mart — B2B Wholesale Hardware & Fasteners",
  description:
    "Browse our wholesale catalog of locks, hinges, handles, fasteners and more. " +
    "Register as a trade buyer to unlock pricing.",
};

export default async function HomePage() {
  // Check auth so we can apply the price gate on featured products.
  const user = await getAuthUser();
  const showPrice = !!user && (user.isPriceVerified || user.role === "ADMIN");

  // Fetch all homepage data in one parallel batch.
  const [heroSlides, categories, useCases, promobanners, featuredProducts] =
    await Promise.all([
      db.heroSlide.findMany({
        where: { isActive: true },
        orderBy: { displayOrder: "asc" },
      }),
      db.category.findMany({
        orderBy: { displayOrder: "asc" },
        select: { id: true, name: true, slug: true, placeholderImage: true },
      }),
      db.useCase.findMany({
        orderBy: { displayOrder: "asc" },
        select: { id: true, name: true, slug: true, image: true },
      }),
      db.promoBanner.findMany({
        where: { isActive: true },
        orderBy: { displayOrder: "asc" },
      }),
      db.product.findMany({
        where: { featured: true },
        select: {
          id: true,
          name: true,
          slug: true,
          brand: true,
          imageUrl: true,
          stockStatus: true,
          category: { select: { name: true, slug: true } },
          // Price gated at select level — never fetched for unverified users.
          ...(showPrice ? { price: true } : {}),
        },
        take: 8, // show up to 8 featured products
        orderBy: { createdAt: "desc" },
      }),
    ]);

  // JSON-LD: Organization schema for the homepage (11-seo-guidelines.md §3).
  const orgJsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "Malik Hardware Mart",
    description:
      "B2B wholesale hardware, fasteners, locks, and tools for trade buyers.",
    url: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
  };

  return (
    <>
      {/* JSON-LD structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
      />

      {/* 1 — Hero carousel */}
      <HeroCarousel slides={heroSlides} />

      {/* 2 — Shop by Category */}
      {categories.length > 0 && (
        <div className="border-t border-border-subtle">
          <CategoryGrid
            items={categories}
            source="category"
            heading="Shop by Category"
          />
        </div>
      )}

      {/* 3 — Promo banners */}
      {promobanners.length > 0 && (
        <div className="bg-bg-secondary border-t border-border-subtle">
          <PromoBannerStrip banners={promobanners} />
        </div>
      )}

      {/* 4 — Shop by Use */}
      {useCases.length > 0 && (
        <div className="border-t border-border-subtle">
          <CategoryGrid
            items={useCases.map((u) => ({ ...u, placeholderImage: u.image }))}
            source="useCase"
            heading="Shop by Use"
          />
        </div>
      )}

      {/* 5 — Featured products */}
      {featuredProducts.length > 0 && (
        <section className="border-t border-border-subtle py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
          <h2 className="text-lg font-semibold text-text-main tracking-widest uppercase mb-6">
            Featured Products
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {featuredProducts.map((p) => (
              <ProductCard
                key={p.id}
                id={p.id}
                name={p.name}
                slug={p.slug}
                brand={p.brand}
                imageUrl={p.imageUrl}
                price={"price" in p ? (p as { price: unknown }).price as number : undefined}
                stockStatus={p.stockStatus}
                category={p.category}
              />
            ))}
          </div>
        </section>
      )}

      {/* Price gate CTA — shown only to non-verified logged-in users */}
      {user && !user.isPriceVerified && user.role === "CUSTOMER" && (
        <div className="border-t border-border-subtle bg-amber/5 py-6 px-4 text-center">
          <p className="text-sm text-text-muted">
            Your account is pending verification.{" "}
            <span className="font-medium text-text-main">
              An admin will approve your pricing access shortly.
            </span>
          </p>
        </div>
      )}

      {/* Guest pricing prompt */}
      {!user && (
        <div className="border-t border-border-subtle bg-bg-secondary py-6 px-4 text-center">
          <p className="text-sm text-text-muted">
            Trade buyers:{" "}
            <a href="/register" className="font-medium text-amber hover:underline">
              Register for an account
            </a>{" "}
            to apply for wholesale pricing access.
          </p>
        </div>
      )}
    </>
  );
}
