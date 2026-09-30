/**
 * app/api/auth/register/route.ts — POST /api/auth/register
 *
 * Creates a new CUSTOMER account. Does not auto-verify pricing — an admin
 * must explicitly set isPriceVerified = true for the new user.
 *
 * Body: { name, email, password, phone?, companyName?, gstin? }
 * Response: 201 { user: { id, name, email, role } } with token cookie set.
 * Errors: 400 (validation), 409 (email taken), 500.
 */

import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { signToken, buildTokenCookie } from "@/lib/auth";

export async function POST(request: NextRequest) {
  let body: {
    name?: string;
    email?: string;
    password?: string;
    phone?: string;
    companyName?: string;
    gstin?: string;
  };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { name, email, password, phone, companyName, gstin } = body;

  // Basic field presence validation — no library needed for this small surface.
  if (!name?.trim() || !email?.trim() || !password) {
    return NextResponse.json(
      { error: "name, email, and password are required" },
      { status: 400 }
    );
  }

  if (password.length < 8) {
    return NextResponse.json(
      { error: "Password must be at least 8 characters" },
      { status: 400 }
    );
  }

  // Check for existing account before hashing to avoid wasted CPU.
  const existing = await db.user.findUnique({
    where: { email: email.toLowerCase() },
    select: { id: true },
  });

  if (existing) {
    return NextResponse.json(
      { error: "An account with this email already exists" },
      { status: 409 }
    );
  }

  // Hash the password with bcrypt (cost factor 12 — reasonable for 2025 hardware).
  const passwordHash = await bcrypt.hash(password, 12);

  // Create the user. Role defaults to CUSTOMER, isPriceVerified to false.
  const user = await db.user.create({
    data: {
      name: name.trim(),
      email: email.toLowerCase().trim(),
      passwordHash,
      phone: phone?.trim() || null,
      companyName: companyName?.trim() || null,
      gstin: gstin?.trim() || null,
    },
    select: { id: true, name: true, email: true, role: true },
  });

  // Issue a JWT and set it in an httpOnly cookie.
  const token = signToken({ userId: user.id, role: user.role });
  const response = NextResponse.json({ user }, { status: 201 });
  response.headers.set("Set-Cookie", buildTokenCookie(token));
  return response;
}
