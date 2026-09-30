/**
 * context/AuthContext.tsx — Client-side auth state.
 *
 * Provides the currently logged-in user (or null) to client components.
 * Rehydrates from GET /api/auth/me on mount — so every page load gets a
 * fresh isPriceVerified from the database, not a stale client-side cache.
 *
 * Access-control gating for UI display ONLY — never trust this for security.
 * Real security gating happens server-side in every API route handler.
 */

"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from "react";

/** The subset of User the client needs to render UI state. */
export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: "CUSTOMER" | "ADMIN";
  isPriceVerified: boolean;
}

interface AuthContextValue {
  user: AuthUser | null;
  /** True while the initial /api/auth/me fetch is in flight. */
  loading: boolean;
  /** Call after login/register to update state without a page reload. */
  setUser: (user: AuthUser | null) => void;
  /** Calls POST /api/auth/logout then clears state. */
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch the live user record on mount — this ensures isPriceVerified is
  // always current (an admin may have changed it since the cookie was issued).
  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => setUser(data?.user ?? null))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  const logout = useCallback(async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, setUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

/** Must be used inside <AuthProvider>. */
export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
