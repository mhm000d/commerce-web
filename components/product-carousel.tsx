"use client";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  useCarousel,
} from "@/components/ui/carousel";
import {ProductCarouselCard} from "@/components/product-carousel-card";
import type {ProductSummary} from "@/lib/api/types";
import {ChevronLeft, ChevronRight} from "lucide-react";
import {useMediaQuery} from "@/hooks/use-media-query";

interface ProductCarouselProps {
  products: ProductSummary[];
  title: string;
}

function CarouselArrows() {
  const {scrollPrev, scrollNext, canScrollPrev, canScrollNext} = useCarousel();

  if (!canScrollPrev && !canScrollNext) return null;

  return (
    <div className="absolute inset-y-0 left-0 right-0 flex items-center justify-between px-2 pointer-events-none">
      <button
        onClick={scrollPrev}
        disabled={!canScrollPrev}
        className={`pointer-events-auto rounded-full bg-white/90 backdrop-blur-sm border border-slate-200 hover:bg-white shadow-lg w-11 h-11 flex items-center justify-center transition-all hover:scale-105 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
          !canScrollPrev ? "opacity-30 cursor-not-allowed hover:scale-100" : ""
        }`}
        aria-label="Previous slide"
      >
        <ChevronLeft className="h-5 w-5 text-slate-700"/>
      </button>
      <button
        onClick={scrollNext}
        disabled={!canScrollNext}
        className={`pointer-events-auto rounded-full bg-white/90 backdrop-blur-sm border border-slate-200 hover:bg-white shadow-lg w-11 h-11 flex items-center justify-center transition-all hover:scale-105 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
          !canScrollNext ? "opacity-30 cursor-not-allowed hover:scale-100" : ""
        }`}
        aria-label="Next slide"
      >
        <ChevronRight className="h-5 w-5 text-slate-700"/>
      </button>
    </div>
  );
}

export function ProductCarousel({products, title}: ProductCarouselProps) {
  const isMobile = useMediaQuery("(max-width: 640px)");
  const isTablet = useMediaQuery("(min-width: 641px) and (max-width: 1024px)");

  const slidesToScroll = isMobile ? 1 : isTablet ? 2 : 4;
  const validProducts = products.filter(
    (p): p is ProductSummary & { id: string; name: string } =>
      !!(p.id && p.name)
  );

  if (validProducts.length === 0) return null;

  return (
    <section className="space-y-4">
      <h2 className="text-xl sm:text-2xl font-bold text-slate-900">{title}</h2>
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
              {validProducts.map((product, index) => (
                <CarouselItem
                  key={product.id || index}
                  className="pl-4 basis-40 sm:basis-48 md:basis-52 lg:basis-56"
                >
                  <div className="h-[330px] sm:h-[350px]">
                    <ProductCarouselCard
                      id={product.id}
                      name={product.name}
                      price={product.price || 0}
                      averageRating={product.averageRating}
                      images={product.images || []}
                    />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>

            {/* Arrows – hidden on mobile */}
            <div className="hidden sm:block">
              <CarouselArrows/>
            </div>
          </Carousel>
        </div>
      </div>
    </section>
  );
}
