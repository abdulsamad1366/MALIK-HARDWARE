/**
 * app/api/products/route.ts — GET /api/products
 *
 * Required role: none (public endpoint).
 * Price gate: `price` is OMITTED from the Prisma select for any request that
 * does not come from a verified user. This is enforced at the query level —
 * the field is never fetched, never serialized, never present in the JSON
 * response — not stripped after the fact.
 *
 * Access tiers (ARCHITECTURE.md §4, 04-access-control.md):
 *   Guest              → no price field in response
 *   Logged-in, pending → no price field in response  (isPriceVerified = false)
 *   Logged-in, verified → price field included
 *   Admin              → price field included
 *
 * Query params:
 *   ?search=<string>   Full-text search across name, brand, description.
 *   ?category=<slug>   Filter by category slug.
 *   ?useCase=<slug>    Filter by use-case slug.
 *   ?featured=true     Return only featured products.
 *   ?page=<n>          1-based page number (default: 1).
 *   ?limit=<n>         Results per page (default: 24, max: 100).
 */

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getAuthUser } from "@/lib/auth";
import type { Prisma } from "@prisma/client";

export async function GET(request: NextRequest) {
  // Determine whether this request is from a price-verified user.
  // getAuthUser re-checks isPriceVerified against the database on every call.
  const user = await getAuthUser();
  const showPrice = !!user && (user.isPriceVerified || user.role === "ADMIN");

  // Parse query parameters.
  const { searchParams } = request.nextUrl;
  const search = searchParams.get("search")?.trim() ?? "";
  const categorySlug = searchParams.get("category") ?? "";
  const useCaseSlug = searchParams.get("useCase") ?? "";
  const featuredOnly = searchParams.get("featured") === "true";
  const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10));
  const limit = Math.min(
    100,
    Math.max(1, parseInt(searchParams.get("limit") ?? "24", 10))
  );
  const skip = (page - 1) * limit;

  // Build the Prisma where clause from active filters.
  const where: Prisma.ProductWhereInput = {};

  if (search) {
    // Case-insensitive substring match across the three most useful text fields.
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { brand: { contains: search, mode: "insensitive" } },
      { description: { contains: search, mode: "insensitive" } },
    ];
  }

  if (categorySlug) {
    // Filter via the category relation — no join needed, Prisma handles it.
    where.category = { slug: categorySlug };
  }

  if (useCaseSlug) {
    // Filter via the many-to-many useCase relation.
    where.useCases = { some: { slug: useCaseSlug } };
  }

  if (featuredOnly) {
    where.featured = true;
  }

  // Build the Prisma select. The `price` field is included ONLY when the
  // caller is a verified user — it is structurally absent otherwise, not
  // a null or a redacted string. This is the price gate.
  const select: Prisma.ProductSelect = {
    id: true,
    name: true,
    slug: true,
    brand: true,
    description: true,
    specs: true,
    imageUrl: true,
    stockStatus: true,
    featured: true,
    category: { select: { id: true, name: true, slug: true } },
    useCases: { select: { id: true, name: true, slug: true } },
    createdAt: true,
    ...(showPrice ? { price: true } : {}), // price gated here, at query level
  };

  // Run the query and a parallel count for pagination metadata.
  const [products, total] = await Promise.all([
    db.product.findMany({ where, select, skip, take: limit, orderBy: { createdAt: "desc" } }),
    db.product.count({ where }),
  ]);

  return NextResponse.json({
    products,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
    // Expose the gate status so the client can show the right UI state
    // (e.g. "Request price access" CTA) without a separate auth call.
    priceVisible: showPrice,
  });
}
