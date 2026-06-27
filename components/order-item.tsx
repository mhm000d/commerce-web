"use client";

import Image from "next/image";
import Link from "next/link";

interface OrderItemProps {
  item: {
    id?: string;
    productId?: string;
    productName?: string;
    primaryImageUrl?: string | null;
    quantity?: number;
    unitPrice?: number;
  };
}

export function OrderItem({ item }: OrderItemProps) {
  const totalPrice = (item.unitPrice ?? 0) * (item.quantity ?? 0);

  return (
    <div className="flex items-center gap-4 py-4 border-b border-slate-100 last:border-0">
      <Link href={`/products/${item.productId}`} className="shrink-0">
        <div className="relative w-16 h-16 bg-slate-100 rounded-lg overflow-hidden">
          {item.primaryImageUrl ? (
            <Image
              src={item.primaryImageUrl}
              alt={item.productName ?? "Product"}
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
      <div className="flex-1 min-w-0">
        <Link href={`/products/${item.productId}`}>
          <h4 className="text-sm font-medium text-slate-900 hover:text-indigo-600 transition-colors line-clamp-2">
            {item.productName}
          </h4>
        </Link>
        <p className="text-sm text-slate-500">
          Qty: {item.quantity} × ${item.unitPrice?.toFixed(2)}
        </p>
      </div>
      <span className="text-sm font-semibold text-slate-900 tabular-nums">
        ${totalPrice.toFixed(2)}
      </span>
    </div>
  );
}