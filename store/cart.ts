import { create } from "zustand";
import { clientFetch } from "@/lib/client-fetch";
import { toast } from "sonner";
import type { Cart } from "@/lib/api/types";

interface CartState {
  cart: Cart | null;
  isLoading: boolean;
  fetchCart: () => Promise<void>;
  addItem: (productId: string, quantity: number) => Promise<void>;
  updateItem: (itemId: string, quantity: number) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
  clearCart: () => Promise<void>;
}

async function fetchCartData(): Promise<Cart | null> {
  const res = await clientFetch("/api/cart");
  if (res.ok) {
    if (res.status === 204) return null;
    return res.json();
  }
  return null;
}

export const useCartStore = create<CartState>((set) => ({
  cart: null,
  isLoading: false,

  fetchCart: async () => {
    set({ isLoading: true });
    try {
      const cart = await fetchCartData();
      set({ cart, isLoading: false });
    } catch {
      set({ cart: null, isLoading: false });
    }
  },

  addItem: async (productId, quantity) => {
    try {
      const res = await clientFetch("/api/cart/items", {
        method: "POST",
        body: JSON.stringify({ productId, quantity }),
      });
      if (res.ok) {
        if (res.status === 204) {
          const cart = await fetchCartData();
          set({ cart });
        } else {
          const cart = await res.json();
          set({ cart });
        }
      } else {
        const error = await res.json();
        toast.error(error?.message || "Failed to add item.");
      }
    } catch {
      toast.error("Something went wrong. Please try again.");
    }
  },

  updateItem: async (itemId, quantity) => {
    try {
      const res = await clientFetch(`/api/cart/items/${itemId}`, {
        method: "PUT",
        body: JSON.stringify({ quantity }),
      });
      if (res.ok) {
        if (res.status === 204) {
          const cart = await fetchCartData();
          set({ cart });
        } else {
          const cart = await res.json();
          set({ cart });
        }
        toast.success("Cart updated.");
      } else {
        const error = await res.json();
        toast.error(error?.message || "Failed to update cart.");
      }
    } catch {
      toast.error("Something went wrong. Please try again.");
    }
  },

  removeItem: async (itemId) => {
    try {
      const res = await clientFetch(`/api/cart/items/${itemId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        const cart = await fetchCartData();
        set({ cart });
        toast.success("Item removed from cart.");
      } else {
        const error = await res.json();
        toast.error(error?.message || "Failed to remove item.");
      }
    } catch {
      toast.error("Something went wrong. Please try again.");
    }
  },

  clearCart: async () => {
    try {
      const res = await clientFetch("/api/cart", { method: "DELETE" });
      if (res.ok) {
        set({ cart: null });
        toast.success("Cart cleared.");
      } else {
        const error = await res.json();
        toast.error(error?.message || "Failed to clear cart.");
      }
    } catch {
      toast.error("Something went wrong. Please try again.");
    }
  },
}));