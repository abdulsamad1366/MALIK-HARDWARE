/**
 * lib/db.ts — Prisma client singleton.
 *
 * Why singleton: Next.js hot-reloads modules in development, which would create a
 * new PrismaClient on every reload and quickly exhaust Postgres connection limits.
 * We attach the instance to `globalThis` so hot-reload reuses the same client.
 * In production, module-level singletons are fine (no hot-reload).
 */

import { PrismaClient } from "@prisma/client";

// Extend global type so TypeScript accepts our cache key.
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "warn", "error"]
        : ["warn", "error"],
  });

// Cache in development; in production the assignment is a no-op (module is
// cached by Node.js for the lifetime of the process).
if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = db;
}
