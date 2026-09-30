/**
 * app/api/auth/me/route.ts — GET /api/auth/me
 *
 * Returns the currently authenticated user's live record, or 401.
 * Used by the client to rehydrate auth state after a page refresh.
 * Always fetches from the DB (via getAuthUser) — never trusts stale token claims.
 */

import { NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth";

export async function GET() {
  const user = await getAuthUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return NextResponse.json({ user });
}
