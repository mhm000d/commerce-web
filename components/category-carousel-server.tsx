import {CategoryCarouselClient} from '@/components/category-carousel';
import {Skeleton} from '@/components/ui/skeleton';
import {listProducts} from '@/lib/api/products';

interface CategoryCarouselServerProps {
  category: string;
  categoryLabel: string;
}

export async function CategoryCarousel({
                                         category,
                                         categoryLabel,
                                       }: CategoryCarouselServerProps) {
  let products: Awaited<ReturnType<typeof listProducts>>['data'] = [];
  let error: Error | null = null;

  try {
    const response = await listProducts({
      category,
      page: 1,
      search: '',
      sortBy: '',
    });
    products = response?.data ?? [];
  } catch (err) {
    error = err instanceof Error ? err : new Error(String(err));
    console.error(`Failed to fetch products for category ${category}:`, error);
  }

  // If there was an error or no products, show skeleton
  if (error || products.length === 0) {
    return (
      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-slate-900">{categoryLabel}</h2>
        <div className="flex gap-4 overflow-x-hidden">
          {Array.from({length: 12}).map((_, i) => (
            <Skeleton key={i} className="w-40 h-48 shrink-0 rounded-lg"/>
          ))}
        </div>
      </section>
    );
  }

  return (
    <CategoryCarouselClient
      categoryLabel={categoryLabel}
      products={products}
    />
  );
}