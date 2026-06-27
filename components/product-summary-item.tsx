"use client";

import Image from "next/image";
import type {CartItem} from "@/lib/api/types";

interface ProductSummaryItemProps {
  item: CartItem;
}

export function ProductSummaryItem({item}: ProductSummaryItemProps) {
  const totalPrice = (item.unitPriceSnapshot ?? 0) * (item.quantity ?? 0);

  return (
    <div className="flex items-center gap-3 py-2 border-b border-slate-100 last:border-0">
      {/* Image */}
      <div className="relative w-10 h-10 bg-slate-100 rounded overflow-hidden shrink-0">
        {item.primaryImageUrl ? (
          <Image
            src={item.primaryImageUrl}
            alt={item.productName!}
            fill
            className="object-cover"
            sizes="40px"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-slate-300 text-[10px]">
            No img
          </div>
        )}
      </div>

      {/* Name and quantity */}
      <div className="flex-1 min-w-0">
        <p className="text-sm text-slate-900 truncate">{item.productName}</p>
        <p className="text-xs text-slate-400">Qty: {item.quantity}</p>
      </div>

      {/* Price */}
      <span className="text-sm font-medium text-slate-900 tabular-nums">
        ${totalPrice.toFixed(2)}
      </span>
    </div>
  );
}