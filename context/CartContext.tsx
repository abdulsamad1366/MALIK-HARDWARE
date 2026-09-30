/**
 * context/CartContext.tsx — Client-side cart item count.
 *
 * Only tracks the item count (for the badge in HeaderMiddle) — the actual
 * cart contents are fetched by the /cart page directly from the API.
 * Verified users only: if isPriceVerified is false, count stays 0.
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
import { useAuth } from "./AuthContext";

interface CartContextValue {
  itemCount: number;
  /** Re-fetch the count from the server (call after add/remove). */
  refreshCount: () => Promise<void>;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [itemCount, setItemCount] = useState(0);

  const refreshCount = useCallback(async () => {
    // Only verified users have a cart — skip the API call otherwise.
    if (!user?.isPriceVerified) {
      setItemCount(0);
      return;
    }
    try {
      const r = await fetch("/api/cart");
      if (!r.ok) { setItemCount(0); return; }
      const data = await r.json();
      // Sum quantities across all cart items.
      const total = (data.items ?? []).reduce(
        (acc: number, item: { quantity: number }) => acc + item.quantity,
        0
      );
      setItemCount(total);
    } catch {
      setItemCount(0);
    }
  }, [user]);

  // Refresh count whenever the user changes (login / logout / verification).
  useEffect(() => { refreshCount(); }, [refreshCount]);

  return (
    <CartContext.Provider value={{ itemCount, refreshCount }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside <CartProvider>");
  return ctx;
}
