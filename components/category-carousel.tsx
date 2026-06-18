'use client';

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { ProductCarouselCard } from '@/components/product-carousel-card';
import type { ProductSummary } from '@/lib/api/types';

interface CategoryCarouselClientProps {
  categoryLabel: string;
  products: ProductSummary[];
}

export function CategoryCarouselClient({
  categoryLabel,
  products,
}: CategoryCarouselClientProps) {
  if (products.length === 0) {
    return null;
  }

  return (
    <section className="space-y-4">
      <h2 className="text-xl sm:text-2xl font-bold text-slate-900">{categoryLabel}</h2>
      <div className="relative group/carousel">
        <Carousel
          opts={{
            align: 'start',
            loop: false,
          }}
          className="w-full"
        >
          <CarouselContent className="-ml-4">
            {products.map((product) => (
              <CarouselItem key={product.id} className="pl-4 basis-40 sm:basis-48 md:basis-56">
                <ProductCarouselCard
                  id={product.id || ''}
                  name={product.name || 'Unnamed Product'}
                  price={product.price || 0}
                  averageRating={product.averageRating}
                  imageUrl={product.images?.[0]?.imageUrl}
                />
              </CarouselItem>
            ))}
          </CarouselContent>
          
          {/* Navigation buttons - show on carousel hover */}
          <CarouselPrevious 
            className="absolute left-2 top-1/3 sm:top-2/5 md:top-1/2 -translate-y-1/2 opacity-0 group-hover/carousel:opacity-100 transition-opacity duration-200 z-20 rounded-full bg-white/95 border border-slate-300 hover:bg-slate-100 shadow-lg w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center" 
          />
          <CarouselNext 
            className="absolute right-2 top-1/3 sm:top-2/5 md:top-1/2 -translate-y-1/2 opacity-0 group-hover/carousel:opacity-100 transition-opacity duration-200 z-20 rounded-full bg-white/95 border border-slate-300 hover:bg-slate-100 shadow-lg w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center" 
          />
        </Carousel>
      </div>
    </section>
  );
}
