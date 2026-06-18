import { notFound } from "next/navigation";
import { Star, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { ProductImageGallery } from "@/components/product-image-gallery";
import { AddToCartButton } from "@/components/add-to-cart-button";
import {getProduct} from "@/lib/api/products";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { id } = await params;

  let product;
  try {
    product = await getProduct(id);
  } catch {
    notFound();
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <Link
        href="/products"
        className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900 transition-colors mb-8"
      >
        <ArrowLeft size={16} />
        Back to products
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
        {/* Left: image gallery (Client Component) */}
        <ProductImageGallery images={sortedImages} name={product.name ?? ""} />

        {/* Right: product info */}
        <div className="flex flex-col gap-6">
          {/* Category */}
          <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600">
            {product.category}
          </span>

          {/* Name */}
          <h1 className="text-3xl font-bold text-slate-900 leading-tight">
            {product.name}
          </h1>

          {/* Rating */}
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

          {/* Price */}
          <div className="flex items-baseline gap-3">
            <span className="text-4xl font-bold text-slate-900 tabular-nums">
              ${(product.price ?? 0).toFixed(2)}
            </span>
          </div>

          {/* Stock */}
          <Badge className={stockStatus.className}>{stockStatus.label}</Badge>

          {/* Description */}
          <p className="text-slate-600 leading-relaxed">{product.description}</p>

          {/* Divider */}
          <div className="border-t border-slate-200" />

          {/* Add to cart (Client Component island) */}
          <AddToCartButton
            product={product}
            disabled={stockQuantity === 0}
          />
        </div>
      </div>
    </div>
  );
}