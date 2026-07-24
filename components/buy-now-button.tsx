"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/store/cart";
import { useAuthStore } from "@/store/auth";
import { Button } from "@/components/ui/button";
import { ShoppingBag } from "lucide-react";
import type { Product } from "@/lib/api/types";

interface BuyNowButtonProps {
  product: Product;
  quantity?: number;
  disabled?: boolean;
}

export function BuyNowButton({ product, quantity = 1, disabled }: BuyNowButtonProps) {
  const router = useRouter();
  const { status } = useAuthStore();
  const { addItem } = useCartStore();
  const [loading, setLoading] = useState(false);

  const handleBuyNow = async () => {
    if (status !== "authenticated") {
      router.push(`/login?redirect=/products/${product.slug || product.id}`);
      return;
    }

    setLoading(true);
    try {
      await addItem(product.id!, quantity);
      router.push("/checkout/addresses");
    } catch {
      setLoading(false);
    }
  };

  return (
    <Button
      onClick={handleBuyNow}
      disabled={disabled || loading}
      size="lg"
      className="w-full bg-indigo-600 hover:bg-indigo-700 text-white gap-2"
    >
      <ShoppingBag size={18} />
      {loading ? "Processing..." : "Buy Now"}
    </Button>
  );
}