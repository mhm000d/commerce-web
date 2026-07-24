"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2 } from "lucide-react";
import type { CartItem as CartItemType } from "@/lib/api/types";

interface CartItemProps {
  item: CartItemType;
  onUpdateQuantity: (itemId: string, newQuantity: number) => void;
  onRemove: (itemId: string) => void;
}

export function CartItem({ item, onUpdateQuantity, onRemove }: CartItemProps) {
  const maxQuantity = 99;
  const totalPrice = (item.unitPriceSnapshot ?? 0) * (item.quantity ?? 0);

  const handleDecrease = () => {
    if ((item.quantity ?? 0) > 1) {
      onUpdateQuantity(item.id!, (item.quantity ?? 0) - 1);
    }
  };

  const handleIncrease = () => {
    if ((item.quantity ?? 0) < maxQuantity) {
      onUpdateQuantity(item.id!, (item.quantity ?? 0) + 1);
    }
  };

  return (
    <div className="flex items-stretch gap-4 border border-slate-200 rounded-lg p-4 bg-white hover:shadow-md transition-shadow">
      <Link href={`/products/${item.productSlug || item.productId}`} className="shrink-0 flex items-center">
        <div className="relative w-16 h-16 bg-slate-100 rounded-lg overflow-hidden">
          {item.primaryImageUrl ? (
            <Image
              src={item.primaryImageUrl}
              alt={item.productName!}
              fill
              className="object-cover"
              sizes="64px"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-slate-300 text-xs">
              No image
            </div>
          )}
        </div>
      </Link>

      {/* Middle: name (top) + quantity (bottom) */}
      <div className="flex-1 min-w-0 flex flex-col justify-between py-1 min-h-[72px]">
        <Link href={`/products/${item.productSlug || item.productId}`}>
          <h3 className="text-sm font-medium text-slate-900 hover:text-indigo-600 transition-colors line-clamp-2">
            {item.productName}
          </h3>
        </Link>

        {/* Quantity controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleDecrease}
            disabled={(item.quantity ?? 0) <= 1}
            className="p-1 text-slate-500 hover:text-slate-900 disabled:opacity-30 disabled:cursor-not-allowed transition-colors border border-slate-200 rounded"
          >
            <Minus size={14} />
          </button>
          <span className="w-8 text-center text-sm font-medium tabular-nums">
            {item.quantity}
          </span>
          <button
            onClick={handleIncrease}
            disabled={(item.quantity ?? 0) >= maxQuantity}
            className="p-1 text-slate-500 hover:text-slate-900 disabled:opacity-30 disabled:cursor-not-allowed transition-colors border border-slate-200 rounded"
          >
            <Plus size={14} />
          </button>
        </div>
      </div>

      <div className="flex flex-col justify-between items-end py-1 min-h-[72px] shrink-0">
        <button
          onClick={() => onRemove(item.id!)}
          className="p-1 text-slate-400 hover:text-red-600 transition-colors"
          aria-label="Remove item"
        >
          <Trash2 size={16} />
        </button>
        <span className="text-sm font-semibold text-slate-900 tabular-nums">
          ${totalPrice.toFixed(2)}
        </span>
      </div>
    </div>
  );
}