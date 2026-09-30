/**
 * lib/auth.ts — JWT sign/verify + live database permission check.
 *
 * Design contract (ARCHITECTURE.md §3, AGENTS.md):
 * - JWT is signed server-side and delivered in an httpOnly cookie ("token").
 * - The token carries only { userId, role } — the minimum needed to look up
 *   the real user record on every request.
 * - isPriceVerified is NEVER trusted from the token. It is always re-checked
 *   against the database because an admin can flip it between the time a
 *   user's cookie was issued and their next request.
 * - If JWT_SECRET is missing from the environment, we throw immediately —
 *   no silent insecure fallback (ARCHITECTURE.md §7).
 */

import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { db } from "./db";
import type { User, Role } from "@prisma/client";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/** Payload baked into the JWT — minimal surface, no changeable fields. */
export interface JwtPayload {
  userId: string;
  role: Role;
}

/**
 * What callers receive from getAuthUser — the real, current DB record
 * (a subset of User to avoid returning passwordHash to route handlers).
 */
export type AuthUser = Pick<
  User,
  "id" | "name" | "email" | "role" | "isPriceVerified"
>;

// ---------------------------------------------------------------------------
// Secret
// ---------------------------------------------------------------------------

/**
 * Read JWT_SECRET from env. Throws if absent — we must never run without it.
 * Called lazily (at request time) rather than at module load so that any
 * startup error is surfaced clearly in the response log.
 */
function getSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error(
      "JWT_SECRET environment variable is not set. " +
        "Add it to .env.local and restart the dev server."
    );
  }
  return secret;
}

// ---------------------------------------------------------------------------
// Sign / verify
// ---------------------------------------------------------------------------

/**
 * Sign a new JWT containing userId and role.
 * Expiry: 7 days — long enough for convenience, short enough for security.
 * The token is intentionally minimal; sensitive fields like isPriceVerified
 * are NOT included and must be fetched from the DB on each request.
 */
export function signToken(payload: JwtPayload): string {
  return jwt.sign(payload, getSecret(), { expiresIn: "7d" });
}

/**
 * Verify a JWT string and return its decoded payload, or null if invalid/expired.
 * Does NOT hit the database — that happens in getAuthUser below.
 */
function verifyToken(token: string): JwtPayload | null {
  try {
    return jwt.verify(token, getSecret()) as JwtPayload;
  } catch {
    // Expired, tampered, or wrong secret — treat as unauthenticated.
    return null;
  }
}

// ---------------------------------------------------------------------------
// Primary export — use this in every API route handler
// ---------------------------------------------------------------------------

/**
 * Extract the JWT from the request cookie, verify it, and then look up the
 * real, current user record in the database.
 *
 * Returns null if:
 *   - No "token" cookie is present (guest).
 *   - The token is invalid or expired.
 *   - The user no longer exists in the database.
 *
 * Returns a live AuthUser if the token is valid and the user exists.
 *
 * Usage in a route handler:
 *   const user = await getAuthUser();
 *   if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
 *   if (!user.isPriceVerified) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
 */
export async function getAuthUser(): Promise<AuthUser | null> {
  // Read the cookie store (server-side only — this is an API route helper).
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  if (!token) return null;

  // Verify the JWT signature and expiry.
  const payload = verifyToken(token);
  if (!payload) return null;

  // Fetch the live record — this is where isPriceVerified is authoritative.
  const user = await db.user.findUnique({
    where: { id: payload.userId },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      isPriceVerified: true,
    },
  });

  return user; // null if the account was deleted after token was issued
}

// ---------------------------------------------------------------------------
// Cookie helpers (called from login/logout route handlers)
// ---------------------------------------------------------------------------

/**
 * Build the Set-Cookie header value for the JWT.
 * httpOnly + sameSite=lax + secure in production.
 * 7-day max-age matches the token expiry.
 */
export function buildTokenCookie(token: string): string {
  const secure = process.env.NODE_ENV === "production" ? "; Secure" : "";
  return `token=${token}; HttpOnly; SameSite=Lax; Path=/; Max-Age=${7 * 24 * 3600}${secure}`;
}

/**
 * Build a Set-Cookie header that immediately expires the token cookie,
 * effectively logging the user out.
 */
export function buildLogoutCookie(): string {
  return "token=; HttpOnly; SameSite=Lax; Path=/; Max-Age=0";
}
