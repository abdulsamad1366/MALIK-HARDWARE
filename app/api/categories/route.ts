/**
 * app/api/categories/route.ts — GET /api/categories
 *
 * Returns all categories ordered by displayOrder.
 * Public endpoint — no auth required.
 * Used by: nav dropdown (NavBottom.tsx), "Shop by Category" grid (homepage).
 */

import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  const categories = await db.category.findMany({
    select: {
      id: true,
      name: true,
      slug: true,
      description: true,
      placeholderImage: true,
      displayOrder: true,
    },
    orderBy: { displayOrder: "asc" },
  });

  return NextResponse.json({ categories });
}
