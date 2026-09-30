/**
 * components/ProductCard.tsx — Reusable product card for grids.
 *
 * Price gate: The `price` prop is optional — it will be undefined/absent
 * when the API response was for an unverified user. The card renders a
 * "Login for pricing" or "Pending approval" CTA in that case.
 * Motion: Framer Motion whileHover for the lift effect.
 */

"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";

interface ProductCardProps {
  id: string;
  name: string;
  slug: string;
  brand: string;
  imageUrl?: string | null;
  /** Present only when the API returned it (verified user). */
  price?: number | string | null;
  stockStatus: "IN_STOCK" | "OUT_OF_STOCK" | "ON_REQUEST";
  category: { name: string; slug: string };
}

export default function ProductCard({
  name, slug, brand, imageUrl, price, stockStatus, category,
}: ProductCardProps) {
  const { user } = useAuth();

  return (
    <motion.div
      whileHover={{ y: -4, boxShadow: "0 8px 24px rgba(0,0,0,0.10)" }}
      transition={{ duration: 0.18, ease: "easeOut" }}
      className="bg-bg-card rounded-xl border border-border-subtle overflow-hidden shadow-sm group"
    >
      <Link href={`/products/${slug}`} aria-label={`${name} by ${brand}`}>
        {/* Product image */}
        <div className="relative h-44 bg-bg-secondary overflow-hidden">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={`${name} by ${brand}`}
              fill
              className="object-contain p-4 transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            />
          ) : (
            /* Placeholder when no image */
            <div className="w-full h-full flex items-center justify-center text-text-dim text-4xl font-bold">
              {name[0]}
            </div>
          )}
          {/* Stock badge */}
          {stockStatus !== "IN_STOCK" && (
            <span
              className={`absolute top-2 right-2 px-2 py-0.5 rounded text-xs font-medium ${
                stockStatus === "OUT_OF_STOCK"
                  ? "bg-rose/10 text-rose"
                  : "bg-amber/10 text-amber"
              }`}
            >
              {stockStatus === "OUT_OF_STOCK" ? "Out of Stock" : "On Request"}
            </span>
          )}
        </div>

        {/* Card body */}
        <div className="p-4">
          <p className="text-xs text-text-dim uppercase tracking-wide mb-1">{brand}</p>
          <h3 className="text-sm font-semibold text-text-main leading-snug line-clamp-2 mb-2">
            {name}
          </h3>
          <p className="text-xs text-text-muted mb-3">{category.name}</p>

          {/* Price section — gated */}
          {price != null ? (
            <p className="text-base font-bold text-text-main">
              ₹{Number(price).toLocaleString("en-IN")}
              <span className="text-xs font-normal text-text-dim ml-1">/ unit</span>
            </p>
          ) : (
            <p className="text-xs text-text-muted italic">
              {!user
                ? "Login for wholesale pricing"
                : !user.isPriceVerified
                ? "Pending approval — pricing restricted"
                : null /* Should not reach here — if verified, price should be present */}
            </p>
          )}
        </div>
      </Link>
    </motion.div>
  );
}
