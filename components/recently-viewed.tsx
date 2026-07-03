"use client";

import { useEffect } from "react";
import { useRecentlyViewed } from "@/hooks/use-recently-viewed";
import { ProductCarousel } from "@/components/product-carousel";
import { Skeleton } from "@/components/ui/skeleton";

interface RecentlyViewedProps {
  productId?: string;
}

export function RecentlyViewed({ productId }: RecentlyViewedProps) {
  const { products, loading, saveViewedProduct } = useRecentlyViewed(productId);

  useEffect(() => {
    if (productId) {
      saveViewedProduct(productId);
    }
  }, [productId, saveViewedProduct]);

  if (!productId) return null;

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        <div className="flex -ml-4 overflow-hidden">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="pl-4 basis-40 sm:basis-48 md:basis-52 lg:basis-56 shrink-0">
              <div className="flex flex-col bg-white rounded-lg border border-slate-200 overflow-hidden">
                <Skeleton className="aspect-square w-full rounded-none" />
                <div className="p-3 sm:p-4 h-[88px] flex flex-col justify-between">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (products.length === 0) return null;

  return <ProductCarousel products={products} title="Recently Viewed" />;
}