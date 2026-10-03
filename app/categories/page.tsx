/**
 * app/categories/page.tsx — All Categories Catalog Page
 *
 * Full responsive grid listing all hardware categories.
 * Breadcrumbs, category count, portrait cards with photography,
 * dark gradient overlays, and links to /category/[slug].
 */

import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { db } from "@/lib/db";

export const metadata: Metadata = {
  title: "All Categories — Malik Hardware Mart",
  description:
    "Explore our complete wholesale catalog of hardware categories: locks, hinges, handles, fasteners, cabinet fittings, and more.",
};

export default async function CategoriesPage() {
  const categories = await db.category.findMany({
    orderBy: { displayOrder: "asc" },
  });

  return (
    <main className="min-h-screen bg-bg-primary py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="mb-6">
          <ol className="flex items-center gap-2 text-xs sm:text-sm text-text-muted">
            <li>
              <Link
                href="/"
                className="hover:text-text-main hover:underline transition-colors"
              >
                Home
              </Link>
            </li>
            <li aria-hidden="true" className="text-text-dim">
              /
            </li>
            <li className="text-text-main font-medium" aria-current="page">
              Categories
            </li>
          </ol>
        </nav>

        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 mb-8 border-b border-border-subtle">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-text-main tracking-tight">
                All Hardware Categories
              </h1>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-bg-secondary text-text-muted border border-border-subtle">
                {categories.length}
              </span>
            </div>
            <p className="text-sm sm:text-base text-text-muted max-w-2xl">
              Browse our architectural hardware, security systems, fittings, fasteners, and tools engineered for trade buyers and commercial contractors.
            </p>
          </div>

          <Link
            href="/products"
            className="inline-flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-semibold rounded-xl bg-bg-secondary hover:bg-bg-tertiary border border-border-subtle hover:border-amber text-text-main transition-colors shrink-0 w-fit"
          >
            <span>Browse All Products</span>
            <span aria-hidden="true">→</span>
          </Link>
        </div>

        {/* Full Category Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6">
          {categories.map((category) => {
            const imgSrc = category.placeholderImage ?? null;

            return (
              <Link
                key={category.id}
                href={`/category/${category.slug}`}
                className="group focus:outline-none focus-visible:ring-2 focus-visible:ring-amber rounded-2xl block h-full select-none"
                aria-label={`${category.name} — View products`}
              >
                <div className="relative aspect-3/4 rounded-2xl overflow-hidden bg-bg-secondary border border-border-subtle shadow-xs transition-all duration-300 group-hover:border-amber/70 group-hover:shadow-md group-hover:-translate-y-1.5 h-full">
                  {imgSrc ? (
                    <Image
                      src={imgSrc}
                      alt={category.name}
                      fill
                      className="object-cover transition-transform duration-500 ease-out group-hover:scale-108"
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-text-dim text-4xl font-bold bg-bg-tertiary">
                      {category.name[0]}
                    </div>
                  )}

                  {/* Dark gradient overlay for contrast */}
                  <div className="absolute inset-0 bg-linear-to-t from-black/85 via-black/30 to-transparent flex flex-col justify-end p-4 sm:p-5 transition-opacity group-hover:from-black/90">
                    <div className="transform transition-transform duration-200 group-hover:-translate-y-1">
                      <h2 className="text-white font-semibold text-base sm:text-lg leading-snug tracking-tight drop-shadow-xs">
                        {category.name}
                      </h2>
                      <div className="flex items-center gap-1.5 mt-1.5 text-xs font-medium text-amber">
                        <span>Explore</span>
                        <svg
                          className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-1"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth={2.5}
                          viewBox="0 0 24 24"
                          aria-hidden="true"
                        >
                          <path d="m9 18 6-6-6-6" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </main>
  );
}
