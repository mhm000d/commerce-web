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
              <Skeleton className="h-[330px] sm:h-[350px] w-full" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (products.length === 0) return null;

  return <ProductCarousel products={products} title="Recently Viewed" />;
}