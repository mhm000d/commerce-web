"use client";

import { useEffect } from "react";
import { useRecentlyViewed } from "@/hooks/use-recently-viewed";
import { Skeleton } from "@/components/ui/skeleton";
import { RatingStars } from "@/components/rating-stars";
import Image from "next/image";
import Link from "next/link";
import type { ProductImage } from "@/lib/api/types";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  useCarousel,
} from "@/components/ui/carousel";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useMediaQuery } from "@/hooks/use-media-query";

interface RecentlyViewedProps {
  productId?: string;
}

function CarouselArrows() {
  const { scrollPrev, scrollNext, canScrollPrev, canScrollNext } = useCarousel();

  if (!canScrollPrev && !canScrollNext) return null;

  return (
    <div className="absolute inset-y-0 left-0 right-0 flex items-center justify-between px-2 pointer-events-none">
      <button
        onClick={scrollPrev}
        disabled={!canScrollPrev}
        className={`pointer-events-auto rounded-full bg-white/90 backdrop-blur-sm border border-slate-200 hover:bg-white shadow-lg w-10 h-10 flex items-center justify-center transition-all hover:scale-105 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
          !canScrollPrev ? "opacity-30 cursor-not-allowed hover:scale-100" : ""
        }`}
        aria-label="Previous slide"
      >
        <ChevronLeft className="h-5 w-5 text-slate-700" />
      </button>
      <button
        onClick={scrollNext}
        disabled={!canScrollNext}
        className={`pointer-events-auto rounded-full bg-white/90 backdrop-blur-sm border border-slate-200 hover:bg-white shadow-lg w-10 h-10 flex items-center justify-center transition-all hover:scale-105 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
          !canScrollNext ? "opacity-30 cursor-not-allowed hover:scale-100" : ""
        }`}
        aria-label="Next slide"
      >
        <ChevronRight className="h-5 w-5 text-slate-700" />
      </button>
    </div>
  );
}

export function ProductRectangularCard({
                                         id,
                                         name,
                                         price,
                                         averageRating,
                                         images = [],
                                       }: {
  id: string;
  name: string;
  price: number;
  averageRating?: number | null;
  images?: ProductImage[];
}) {
  const primaryImage = images.find((img) => img.isPrimary) ?? images[0];
  const imageUrl = primaryImage?.imageUrl ?? null;

  return (
    <Link href={`/products/${id}`} className="block h-full w-full">
      <div className="flex bg-white rounded-xl border border-slate-200/60 overflow-hidden hover:border-indigo-400 hover:shadow-md transition-all duration-200 p-3 gap-4 h-28 w-full">
        <div className="relative w-20 h-full bg-slate-50 rounded-lg overflow-hidden shrink-0">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={name}
              fill
              unoptimized
              className="object-cover"
              sizes="80px"
            />
          ) : (
            <div className="w-full h-full bg-slate-100" />
          )}
        </div>
        <div className="flex-1 min-w-0 grid grid-rows-[auto_auto] text-left">
          <div className="flex flex-col justify-end min-h-[3rem]">
            <h3 className="text-xs sm:text-sm font-bold text-slate-800 line-clamp-2 leading-snug">
              {name}
            </h3>
            <div className="mt-2">
              <RatingStars average={averageRating} />
            </div>
          </div>

          <div className="text-xs sm:text-sm font-semibold text-slate-900 tabular-nums self-end">
            ${price.toFixed(2)}
          </div>
        </div>
      </div>
    </Link>
  );
}

export function RecentlyViewed({ productId }: RecentlyViewedProps) {
  const { products, loading, saveViewedProduct } = useRecentlyViewed(productId);

  const isMobile = useMediaQuery("(max-width: 640px)");
  const isTablet = useMediaQuery("(min-width: 641px) and (max-width: 1024px)");

  const slidesToScroll = isMobile ? 1 : isTablet ? 2 : 3;

  useEffect(() => {
    if (productId) {
      saveViewedProduct(productId);
    }
  }, [productId, saveViewedProduct]);

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        <div className="flex gap-4 overflow-hidden">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-28 basis-72 sm:basis-80 md:basis-96 shrink-0 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  if (products.length === 0) return null;

  return (
    <section className="space-y-4">
      <h2 className="text-xl sm:text-2xl font-bold text-slate-900 text-center uppercase tracking-wider">Recently Viewed</h2>
      <div className="relative group/carousel">
        <div className="overflow-hidden rounded-lg">
          <Carousel
            key={slidesToScroll}
            opts={{
              align: "start",
              loop: false,
              slidesToScroll,
              containScroll: "trimSnaps",
              dragFree: false,
            }}
            className="w-full relative"
          >
            <CarouselContent className="-ml-4">
              {products.map((product, index) => (
                <CarouselItem
                  key={product.id || index}
                  className="pl-4 basis-[280px] sm:basis-[320px] md:basis-[340px]"
                >
                  <ProductRectangularCard
                    id={product.id || ""}
                    name={product.name || "Unnamed Product"}
                    price={product.price || 0}
                    averageRating={product.averageRating}
                    images={product.images || []}
                  />
                </CarouselItem>
              ))}
            </CarouselContent>

            <div className="hidden sm:block">
              <CarouselArrows />
            </div>
          </Carousel>
        </div>
      </div>
    </section>
  );
}