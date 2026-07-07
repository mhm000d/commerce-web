import { listProducts } from "@/lib/api/products";
import type { ProductSummary } from "@/lib/api/types";
import { ProductCarousel } from "@/components/product-carousel";
import { RecentlyViewed } from "@/components/recently-viewed";
import { TopCategoriesTabs } from "@/components/top-categories-tabs";

export default async function HomePage() {
  // 1. Fetch Best Sellers (highest rated products)
  let bestSellers: ProductSummary[] = [];
  try {
    const res = await listProducts({
      sortBy: "rating",
      page: 1,
      pageSize: 8,
    });
    bestSellers = res?.data ?? [];
  } catch (err) {
    console.error("Failed to fetch best sellers:", err);
  }

  // 2. Fetch Top Seen Categories
  let mobiles: ProductSummary[] = [];
  let laptops: ProductSummary[] = [];
  let tvs: ProductSummary[] = [];
  let games: ProductSummary[] = [];
  try {
    const [mobilesRes, laptopsRes, tvsRes, gamesRes] = await Promise.all([
      listProducts({ category: "Mobiles", page: 1, pageSize: 8 }),
      listProducts({ category: "Laptops", page: 1, pageSize: 8 }),
      listProducts({ category: "Televisions", page: 1, pageSize: 8 }),
      listProducts({ category: "Games", page: 1, pageSize: 8 }),
    ]);
    mobiles = mobilesRes?.data ?? [];
    laptops = laptopsRes?.data ?? [];
    tvs = tvsRes?.data ?? [];
    games = gamesRes?.data ?? [];
  } catch (err) {
    console.error("Failed to fetch top categories:", err);
  }

  // 3. Fetch Commerce Recommendations (mixed categories)
  let recommendations: ProductSummary[] = [];
  try {
    const res = await listProducts({
      page: 1,
      pageSize: 10,
    });
    recommendations = res?.data ?? [];
  } catch (err) {
    console.error("Failed to fetch recommendations:", err);
  }

  return (
    <div className="min-h-screen bg-slate-50/50 pb-16 py-8 md:py-12">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 md:space-y-24">
        
        {/* 1. BEST SELLERS */}
        {bestSellers.length > 0 && (
          <ProductCarousel products={bestSellers} title="BEST SELLERS" />
        )}

        {/* 2. RECENTLY VIEWED (Rectangular Cards) */}
        <RecentlyViewed />

        {/* 3. OUR TOP SEEN (Tabs + Changing Carousel) */}
        <TopCategoriesTabs
          mobiles={mobiles}
          laptops={laptops}
          tvs={tvs}
          games={games}
        />

        {/* 4. COMMERCE RECOMMENDATIONS */}
        {recommendations.length > 0 && (
          <ProductCarousel products={recommendations} title="COMMERCE RECOMMENDATIONS" />
        )}

      </main>
    </div>
  );
}