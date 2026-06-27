"use client";

import {useState} from "react";
import Link from "next/link";
import {useRouter} from "next/navigation";
import Image from "next/image";
import {ShoppingCart} from "lucide-react";
import {Skeleton} from "@/components/ui/skeleton";
import {RatingStars} from "@/components/rating-stars";
import {useCartStore} from "@/store/cart";
import {useAuthStore} from "@/store/auth";
import {toast} from "sonner";
import type {ProductImage} from "@/lib/api/types";

interface ProductCarouselCardProps {
  id: string;
  name: string;
  price: number;
  averageRating?: number | null;
  images?: ProductImage[];
}

export function ProductCarouselCard({
                                      id,
                                      name,
                                      price,
                                      averageRating,
                                      images = [],
                                    }: ProductCarouselCardProps) {
  const router = useRouter();
  const {status} = useAuthStore();
  const {addItem} = useCartStore();
  const [loading, setLoading] = useState(false);
  const [isAdded, setIsAdded] = useState(false);

  const primaryImage = images.find((img) => img.isPrimary) ?? images[0];
  const secondaryImage = images.length > 1 ? images.find((img) => !img.isPrimary) ?? images[1] : null;

  const [currentImage, setCurrentImage] = useState(primaryImage);
  const imageUrl = currentImage?.imageUrl ?? null;

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (status !== "authenticated") {
      router.push(`/login?redirect=/products/${id}`);
      return;
    }

    setLoading(true);
    setIsAdded(true);
    try {
      await addItem(id, 1);
      toast.success(`${name} added to cart.`);
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
      href={`/products/${id}`}
      className="block h-full relative group/card"
      onMouseEnter={() => {
        if (secondaryImage) setCurrentImage(secondaryImage);
      }}
      onMouseLeave={() => {
        setCurrentImage(primaryImage);
      }}
    >
      <div
        className="h-full flex flex-col bg-white rounded-lg border border-slate-200 overflow-hidden hover:border-indigo-400 hover:shadow-md transition-all duration-200">
        <div className="relative w-full aspect-square bg-slate-100 overflow-hidden shrink-0">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={name}
              fill
              unoptimized
              className="object-cover transition-transform duration-300 group-hover/card:scale-105"
              sizes="(max-width: 640px) 160px, (max-width: 768px) 192px, 224px"
              priority={false}
              onError={(e) => {
                e.currentTarget.src = "/placeholder.png";
              }}
            />
          ) : (
            <Skeleton className="w-full h-full"/>
          )}
        </div>

        {/* Info – grid layout ensures rating stays at bottom */}
        <div className="grid grid-rows-[1fr_auto] p-3 sm:p-4 h-[88px]">
          <div className="flex items-start justify-between gap-2 overflow-hidden min-h-0">
            <h3
              className="text-xs sm:text-sm font-semibold text-slate-900 leading-tight line-clamp-2 group-hover/card:text-indigo-600 transition-colors flex-1 min-w-0">
              {name}
            </h3>
            <span className="text-xs sm:text-sm font-bold text-slate-900 tabular-nums shrink-0 whitespace-nowrap">
              ${price.toFixed(2)}
            </span>
          </div>
          <div className="pt-1">
            <RatingStars average={averageRating}/>
          </div>
        </div>
      </div>

      <button
        onClick={handleAddToCart}
        disabled={loading}
        className={`absolute bottom-3 right-3 p-2 rounded-full shadow-lg transition-all duration-200 ${
          isAdded
            ? "bg-emerald-500 text-white hover:bg-emerald-600"
            : "bg-indigo-600 text-white hover:bg-indigo-700"
        } opacity-0 group-hover/card:opacity-100 disabled:opacity-50 disabled:cursor-not-allowed`}
        aria-label="Add to cart"
      >
        {loading ? (
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"/>
        ) : (
          <ShoppingCart
            size={16}
            fill={isAdded ? "white" : "none"}
            className="transition-all duration-200"
          />
        )}
      </button>
    </Link>
  );
}
