"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ShoppingCart } from "lucide-react";
import { useCartStore } from "@/store/cart";
import { useAuthStore } from "@/store/auth";
import type { ProductSummary } from "@/lib/api/types";
import { RatingStars } from "@/components/rating-stars";
import { toast } from "sonner";

export function ProductCard({ product }: { product: ProductSummary }) {
  const router = useRouter();
  const { status } = useAuthStore();
  const { addItem } = useCartStore();
  const [loading, setLoading] = useState(false);
  const [isAdded, setIsAdded] = useState(false);

  const images = product.images ?? [];
  const primaryImage = images.find((img) => img.isPrimary) ?? images[0];
  const secondaryImage = images.length > 1 ? images.find((img) => !img.isPrimary) ?? images[1] : null;

  const [currentImage, setCurrentImage] = useState(primaryImage);
  const imageUrl = currentImage?.imageUrl ?? null;

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (status !== "authenticated") {
      router.push(`/login?redirect=/products/${product.id}`);
      return;
    }

    setLoading(true);
    setIsAdded(true);
    try {
      await addItem(product.id!, 1);
      toast.success(`${product.name} added to cart.`);
      setTimeout(() => setIsAdded(false), 1500);
    } catch {
      toast.error("Failed to add item.");
      setIsAdded(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Link
      href={`/products/${product.id}`}
      className="group flex flex-col bg-white rounded-lg border border-slate-200 overflow-hidden hover:border-indigo-400 hover:shadow-md transition-all duration-200 relative h-full"
      onMouseEnter={() => {
        if (secondaryImage) setCurrentImage(secondaryImage);
      }}
      onMouseLeave={() => {
        setCurrentImage(primaryImage);
      }}
    >
      <div className="relative aspect-square bg-slate-100 overflow-hidden">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={product.name ?? "Product"}
            fill
            unoptimized
            className="object-cover transition-opacity duration-300 group-hover:scale-105"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            onError={(e) => {
              e.currentTarget.src = "/placeholder.png";
            }}
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
        <div className="mt-auto pt-1">
          <RatingStars average={product.averageRating} />
        </div>
      </div>

      {/* Add to Cart button – appears on hover */}
      <button
        onClick={handleAddToCart}
        disabled={loading}
        className={`absolute bottom-3 right-3 p-2 rounded-full shadow-lg transition-all duration-200 ${
          isAdded
            ? "bg-emerald-500 text-white hover:bg-emerald-600"
            : "bg-indigo-600 text-white hover:bg-indigo-700"
        } opacity-0 group-hover:opacity-100 disabled:opacity-50 disabled:cursor-not-allowed`}
        aria-label="Add to cart"
      >
        {loading ? (
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
        ) : (
          <ShoppingCart
            size={18}
            fill={isAdded ? "white" : "none"}
            className="transition-all duration-200"
          />
        )}
      </button>
    </Link>
  );
}