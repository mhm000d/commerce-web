import { CategoryCarouselClient } from '@/components/category-carousel';
import { Skeleton } from '@/components/ui/skeleton';
import { listProducts } from '@/lib/api/products';

interface CategoryCarouselServerProps {
  category: string;
  categoryLabel: string;
}

export async function CategoryCarousel({
  category,
  categoryLabel,
}: CategoryCarouselServerProps) {
  try {
    const response = await listProducts({
      category,
      page: 1,
      search: '',
      sortBy: '',
    });
    const products = response?.data ?? [];

    return (
      <CategoryCarouselClient
        categoryLabel={categoryLabel}
        products={products}
      />
    );
  } catch (error) {
    console.error(`Failed to fetch products for category ${category}:`, error);
    // Show loading skeleton on error
    return (
      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-slate-900">{categoryLabel}</h2>
        <div className="flex gap-4 overflow-x-hidden">
          {Array.from({ length: 12 }).map((_, i) => (
            <Skeleton key={i} className="w-40 h-48 shrink-0 rounded-lg" />
          ))}
        </div>
      </section>
    );
  }
}
