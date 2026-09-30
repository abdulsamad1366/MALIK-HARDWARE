/**
 * app/api/auth/login/route.ts — POST /api/auth/login
 *
 * Verifies credentials and issues a JWT cookie.
 *
 * Body: { email, password }
 * Response: 200 { user: { id, name, email, role, isPriceVerified } } with token cookie.
 * Errors: 400 (missing fields), 401 (wrong credentials), 500.
 *
 * Note: isPriceVerified IS included in the login response body (so the client
 * knows whether to show prices on first load), but it is NOT trusted from the
 * JWT itself on subsequent requests — every request re-checks the DB.
 */

import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { signToken, buildTokenCookie } from "@/lib/auth";

export async function POST(request: NextRequest) {
  let body: { email?: string; password?: string };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { email, password } = body;

  if (!email?.trim() || !password) {
    return NextResponse.json(
      { error: "email and password are required" },
      { status: 400 }
    );
  }

  // Look up the user by email (case-insensitive via lowercase normalization).
  const user = await db.user.findUnique({
    where: { email: email.toLowerCase().trim() },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      isPriceVerified: true,
      passwordHash: true,
    },
  });

  // Return the same generic error for "not found" and "wrong password" to
  // avoid leaking whether an email is registered.
  if (!user) {
    return NextResponse.json(
      { error: "Invalid email or password" },
      { status: 401 }
    );
  }

  const passwordMatch = await bcrypt.compare(password, user.passwordHash);
  if (!passwordMatch) {
    return NextResponse.json(
      { error: "Invalid email or password" },
      { status: 401 }
    );
  }

  // Issue JWT. Token carries only userId + role — see lib/auth.ts for why.
  const token = signToken({ userId: user.id, role: user.role });

  // Return the user record (minus passwordHash) so the client can initialize
  // its auth state without a separate /api/auth/me call.
  const { passwordHash: _, ...safeUser } = user;
  const response = NextResponse.json({ user: safeUser });
  response.headers.set("Set-Cookie", buildTokenCookie(token));
  return response;
}
