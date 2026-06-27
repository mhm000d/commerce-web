"use client";

import { useEffect } from "react";
import { useRecentlyViewed } from "@/hooks/use-recently-viewed";
import { ProductCarousel } from "@/components/product-carousel";

interface RecentlyViewedProps {
  productId?: string;
}

export function RecentlyViewed({ productId }: RecentlyViewedProps) {
  const { products, loading, saveViewedProduct } = useRecentlyViewed(productId);

  useEffect(() => {
    if (productId) {
      saveViewedProduct(productId);
    }
  }, [productId]);

  if (!productId) return null;
  if (loading) return null;
  if (products.length === 0) return null;

  return <ProductCarousel products={products} title="Recently Viewed" />;
}