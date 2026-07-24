"use client";

import { useEffect, useState } from "react";
import { notFound, useParams, useRouter } from "next/navigation";
import { Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ProductImageGallery } from "@/components/product-image-gallery";
import { AddToCartButton } from "@/components/add-to-cart-button";
import { BuyNowButton } from "@/components/buy-now-button";
import { ProductDetailsAccordion } from "@/components/product-details-accordion";
import { BreadcrumbNav } from "@/components/breadcrumb-nav";
import { ProductCarousel } from "@/components/product-carousel";
import { RecentlyViewed } from "@/components/recently-viewed";
import { ProductReviews } from "@/components/product-reviews";
import { ShareButton } from "@/components/share-button";
import { JsonLd } from "@/components/json-ld";
import { getProduct, listProducts } from "@/lib/api/products";
import type { Product, ProductSummary } from "@/lib/api/types";

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const identifier = params.id as string;

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [relatedProducts, setRelatedProducts] = useState<ProductSummary[]>([]);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleReviewChange = () => {
    setRefreshKey((prev) => prev + 1);
  };

  // ── Handle URL normalization (ID to Slug) ──
  useEffect(() => {
    if (product?.slug && identifier === product.id) {
      router.replace(`/products/${product.slug}`);
    }
  }, [product, identifier, router]);

  // ── Fetch product ──
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await getProduct(identifier);
        setProduct(data);
        setLoading(false);

        // Fetch related products
        if (data.category) {
          const response = await listProducts({
            category: data.category,
            page: 1,
            pageSize: 10,
          });
          const related = (response?.data ?? [])
            .filter((p) => p.id !== data.id)
            .slice(0, 6);
          setRelatedProducts(related);
        }
      } catch {
        notFound();
      }
    };

    fetchProduct();
  }, [identifier, refreshKey]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse space-y-8">
          <div className="h-8 bg-slate-100 rounded w-32" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="aspect-square bg-slate-100 rounded-xl" />
            <div className="space-y-4">
              <div className="h-6 bg-slate-100 rounded w-1/4" />
              <div className="h-10 bg-slate-100 rounded w-3/4" />
              <div className="h-6 bg-slate-100 rounded w-1/2" />
              <div className="h-12 bg-slate-100 rounded w-1/3" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return notFound();
  }

  const sortedImages = [...(product.images ?? [])].sort(
    (a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0)
  );

  const stockQuantity = product.stockQuantity ?? 0;
  const stockStatus =
    stockQuantity === 0
      ? { label: "Out of stock", className: "bg-red-100 text-red-700 border-red-200" }
      : stockQuantity <= 5
        ? { label: `Only ${stockQuantity} left`, className: "bg-amber-100 text-amber-700 border-amber-200" }
        : { label: "In stock", className: "bg-emerald-100 text-emerald-700 border-emerald-200" };

  return (
    <>
      <JsonLd product={product} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-0 pt-2 sm:py-2 lg:py-6">
      {/* Breadcrumb */}
      <div className="mb-1 sm:mb-4 lg:mb-3">
        <BreadcrumbNav
          items={[
            { label: "Products", href: "/products" },
            {
              label: product.category ?? "Category",
              href: product.category ? `/products?category=${encodeURIComponent(product.category)}` : "/products",
            },
            { label: product.name ?? "Product", isCurrent: true },
          ]}
        />
      </div>

      {/* Main Product Section */}
      <div className="flex flex-col lg:grid lg:grid-cols-2 gap-4 pt-1 sm:gap-8 lg:gap-20">
        {/* Info for small screens: Above the image */}
        <div className="flex lg:hidden flex-col gap-1">
          <div className="flex justify-between items-start gap-4">
            <h1
              className="text-lg font-bold text-slate-900 leading-tight transition-all cursor-default flex-1"
              title={product.name}
            >
              {product.name}
            </h1>
            <ShareButton title={product.name ?? ""} className="mt-1 flex-shrink-0" />
          </div>
        </div>

        <ProductImageGallery images={sortedImages} name={product.name ?? ""} />

        <div className="flex flex-col gap-6">
          <div className="hidden lg:flex flex-col gap-2">
            <div className="flex justify-between items-start gap-4">
              <h1
                className="text-4xl font-bold text-slate-900 leading-tight transition-all cursor-default flex-1"
                title={product.name}
              >
                {product.name}
              </h1>
              <ShareButton title={product.name ?? ""} className="mt-1 flex-shrink-0" />
            </div>
          </div>

          {product.averageRating && product.ratingCount && product.ratingCount > 0 ? (
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-0.5">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star
                    key={i}
                    size={16}
                    className={
                      i <= Math.round(product.averageRating!)
                        ? "fill-amber-400 text-amber-400"
                        : "fill-slate-200 text-slate-200"
                    }
                  />
                ))}
              </div>
              <span className="text-sm text-slate-600">
                {product.averageRating.toFixed(1)} · {product.ratingCount}{" "}
                {product.ratingCount === 1 ? "review" : "reviews"}
              </span>
            </div>
          ) : (
            <span className="text-sm text-slate-400">No reviews yet</span>
          )}

          <div className="flex flex-wrap items-center gap-4 py-2">
            <span className="text-4xl font-bold text-slate-900 tabular-nums">
              ${(product.price ?? 0).toFixed(2)}
            </span>
            <Badge className={`${stockStatus.className} text-sm px-3 py-1`}>
              {stockStatus.label}
            </Badge>
          </div>

          <div className="border-t border-slate-200" />

          <div className="flex flex-col gap-3">
            <AddToCartButton product={product} disabled={stockQuantity === 0} />
            <BuyNowButton product={product} disabled={stockQuantity === 0} />
          </div>
        </div>
      </div>

      {/* Product Details */}
      <div className="mt-16 lg:mt-20 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8">
        <ProductDetailsAccordion
          description={product.description ?? ""}
          specifications={product.specifications}
        />
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="mt-16 lg:mt-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ProductCarousel products={relatedProducts} title="You May Also Like" />
        </div>
      )}

      {/* Recently Viewed */}
      <div className="mt-16 lg:mt-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <RecentlyViewed productId={product.id} />
      </div>

      {/* Product Reviews */}
      <ProductReviews productId={product.id!} onReviewChange={handleReviewChange} />
    </div>
    </>
  );
}
