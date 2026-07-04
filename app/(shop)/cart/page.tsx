"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/store/cart";
import { useAuthStore } from "@/store/auth";
import { CartItem } from "@/components/cart-item";
import { Button } from "@/components/ui/button";
import { ShoppingBag, ArrowRight } from "lucide-react";

export default function CartPage() {
  const router = useRouter();
  const { status } = useAuthStore();
  const { cart, isLoading, fetchCart, updateItem, removeItem, clearCart } = useCartStore();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
      return;
    }
    if (status === "authenticated") {
      fetchCart();
    }
  }, [status, fetchCart, router]);

  if (isLoading || status === "loading") {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4 animate-pulse">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex gap-4 py-4 border border-slate-200 rounded-lg p-4">
                <div className="w-16 h-16 bg-slate-100 rounded-lg" />
                <div className="flex-1">
                  <div className="h-4 bg-slate-100 rounded w-3/4" />
                  <div className="h-4 bg-slate-100 rounded w-1/4 mt-2" />
                  <div className="flex gap-3 mt-2">
                    <div className="h-8 w-16 bg-slate-100 rounded" />
                    <div className="h-8 w-8 bg-slate-100 rounded" />
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="lg:col-span-1">
            <div className="h-48 bg-slate-100 rounded animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  if (!cart || cart.items!.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
        <ShoppingBag className="mx-auto h-16 w-16 text-slate-300" />
        <h1 className="text-2xl font-bold text-slate-900 mt-4">Your cart is empty</h1>
        <p className="text-slate-500 mt-2">Browse our products and add items you like.</p>
        <Link href="/products">
          <Button className="mt-6">Start Shopping</Button>
        </Link>
      </div>
    );
  }

  const subtotal = cart.subtotal || 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-2xl font-bold text-slate-900 mb-8">Your Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Items list - 2 columns on large screens */}
        <div className="lg:col-span-2 space-y-4">
          {cart.items!.map((item) => (
            <CartItem
              key={item.id}
              item={item}
              onUpdateQuantity={updateItem}
              onRemove={removeItem}
            />
          ))}
          <div className="flex justify-end">
            <Button
              variant="ghost"
              size="sm"
              className="text-slate-400 hover:text-red-600"
              onClick={() => clearCart()}
            >
              Clear cart
            </Button>
          </div>
        </div>

        {/* Payment Summary - 1 column on large screens */}
        <div className="lg:col-span-1">
          <div className="bg-white border border-slate-200 rounded-lg p-6 sticky top-24">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Payment Summary</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Shipping Fees</span>
                <span className="text-slate-400">To be calculated</span>
              </div>
              <div className="border-t border-slate-200 pt-2 mt-2">
                <div className="flex justify-between text-base font-semibold text-slate-900">
                  <span>Total (VAT included)</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
              </div>
            </div>
            <Link href="/checkout/addresses">
              <Button className="w-full mt-6 gap-2">
                Proceed to Checkout
                <ArrowRight size={16} />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}