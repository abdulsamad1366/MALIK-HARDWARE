/**
 * app/api/auth/logout/route.ts — POST /api/auth/logout
 *
 * Clears the httpOnly token cookie by setting its Max-Age to 0.
 * No body needed; no database call needed.
 */

import { NextResponse } from "next/server";
import { buildLogoutCookie } from "@/lib/auth";

export async function POST() {
  const response = NextResponse.json({ ok: true });
  response.headers.set("Set-Cookie", buildLogoutCookie());
  return response;
}
