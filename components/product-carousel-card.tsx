import Link from "next/link";
import Image from "next/image";
import { Star } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import {RatingStars} from "@/components/rating-stars";

interface ProductCarouselCardProps {
  id: string;
  name: string;
  price: number;
  averageRating?: number | null;
  imageUrl?: string;
}


export function ProductCarouselCard({
  id,
  name,
  price,
  averageRating,
  imageUrl,
}: ProductCarouselCardProps) {
  return (
    <Link 
      href={`/products/${id}`} 
      className="block h-full"
    >
      <div className="h-full flex flex-col bg-white rounded-lg border border-slate-200 overflow-hidden hover:border-indigo-400 hover:shadow-md transition-all duration-200 group/card">
        {/* Image */}
        <div className="relative w-full aspect-square bg-slate-100 overflow-hidden flex-shrink-0">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={name}
              fill
              className="object-cover group-hover/card:scale-105 transition-transform duration-300"
              sizes="(max-width: 640px) 160px, (max-width: 768px) 192px, 224px"
              priority={false}
            />
          ) : (
            <Skeleton className="w-full h-full" />
          )}
        </div>

        {/* Info - fixed height */}
        <div className="flex flex-col gap-2 p-3 sm:p-4 flex-1 min-h-[100px] justify-between">
          {/* Name and Price */}
          <div className="flex items-start justify-between gap-2 min-h-[2.5rem]">
            <h3 className="text-xs sm:text-sm font-semibold text-slate-900 leading-tight line-clamp-2 group-hover/card:text-indigo-600 transition-colors">
              {name}
            </h3>
            <span className="text-xs sm:text-sm font-bold text-slate-900 tabular-nums shrink-0 whitespace-nowrap">
              ${price.toFixed(2)}
            </span>
          </div>

          {/* Rating */}
          <RatingStars average={averageRating} />
        </div>
      </div>
    </Link>
  );
}
