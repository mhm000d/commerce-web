import { CategoryCarousel } from '@/components/category-carousel-server';

const FEATURED_CATEGORIES = [
  { value: 'Mobiles', label: 'Mobiles' },
  { value: 'Laptops', label: 'Laptops' },
  { value: 'Televisions', label: 'Televisions' },
  { value: 'Games', label: 'Games' },
  { value: 'Appliances', label: 'Appliances' },
  { value: 'Electronics', label: 'Electronics' },
  { value: 'Home', label: 'Home' },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero section */}
      <section className="bg-gradient-to-r from-indigo-600 to-indigo-700 text-white py-12 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl md:text-5xl font-bold mb-4">
            Welcome to Commerce
          </h1>
          <p className="text-base md:text-lg text-indigo-100 max-w-2xl">
            Discover thousands of products across all categories with fast shipping and great deals.
          </p>
        </div>
      </section>

      {/* Category carousels */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 space-y-12 md:space-y-16">
        {FEATURED_CATEGORIES.map((category) => (
          <CategoryCarousel
            key={category.value}
            category={category.value}
            categoryLabel={category.label}
          />
        ))}
      </main>
    </div>
  );
}