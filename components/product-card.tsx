import Image from "next/image";
import Link from "next/link";
import type {ProductSummary} from "@/lib/api/types";
import {RatingStars} from "@/components/rating-stars";


export function ProductCard({ product }: { product: ProductSummary }) {
  const primaryImage = product.images?.find((img) => img.isPrimary);
  const imageUrl = primaryImage?.imageUrl ?? null;

  return (
    <Link
      href={`/products/${product.id}`}
      className="group flex flex-col bg-white rounded-lg border border-slate-200 overflow-hidden hover:border-indigo-400 hover:shadow-md transition-all duration-200"
    >
      <div className="relative aspect-square bg-slate-100 overflow-hidden">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={product.name ?? "Product"}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-slate-300 text-sm">
            No image
          </div>
        )}
      </div>

      <div className="flex flex-col gap-2 p-4 flex-1">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-sm font-semibold text-slate-900 leading-tight line-clamp-2 group-hover:text-indigo-600 transition-colors">
            {product.name}
          </h3>
          <span className="text-sm font-bold text-slate-900 tabular-nums shrink-0">
            ${product.price?.toFixed(2)}
          </span>
        </div>
        <RatingStars average={product.averageRating} />
      </div>
    </Link>
  );
}