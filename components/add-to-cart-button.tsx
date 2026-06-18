"use client";

import { useState } from "react";
import { ShoppingCart, Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Product } from "@/lib/api/types";

interface Props {
  product: Product;
  disabled?: boolean;
}

export function AddToCartButton({ product, disabled }: Props) {
  const [quantity, setQuantity] = useState(1);

  const max = Math.min(product.stockQuantity ?? 0, 99);

  return (
    <div className="flex flex-col gap-4">
      {/* Quantity selector */}
      <div className="flex items-center gap-3">
        <span className="text-sm font-medium text-slate-700">Quantity</span>
        <div className="flex items-center border border-slate-200 rounded-lg">
          <button
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            disabled={quantity <= 1 || disabled}
            className="p-2 text-slate-500 hover:text-slate-900 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <Minus size={16} />
          </button>
          <span className="w-12 text-center text-sm font-medium tabular-nums">
            {quantity}
          </span>
          <button
            onClick={() => setQuantity((q) => Math.min(max, q + 1))}
            disabled={quantity >= max || disabled}
            className="p-2 text-slate-500 hover:text-slate-900 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <Plus size={16} />
          </button>
        </div>
      </div>

      {/* Add to cart */}
      <Button
        disabled={disabled}
        size="lg"
        className="w-full bg-slate-900 hover:bg-slate-700 text-white gap-2"
        onClick={() => {
          // TODO: wire to Zustand cart store
          console.log("Add to cart:", product.id, "×", quantity);
        }}
      >
        <ShoppingCart size={18} />
        {disabled ? "Out of stock" : "Add to cart"}
      </Button>
    </div>
  );
}