"use client";

import { useState } from "react";
import { ProductCarousel } from "@/components/product-carousel";
import type { ProductSummary } from "@/lib/api/types";

interface TopCategoriesTabsProps {
  mobiles: ProductSummary[];
  laptops: ProductSummary[];
  tvs: ProductSummary[];
  games: ProductSummary[];
}

type TabKey = "mobiles" | "laptops" | "tvs" | "games";

export function TopCategoriesTabs({ mobiles, laptops, tvs, games }: TopCategoriesTabsProps) {
  const [activeTab, setActiveTab] = useState<TabKey>("mobiles");

  const tabs = [
    { key: "mobiles", label: "Mobiles", products: mobiles },
    { key: "laptops", label: "Laptops", products: laptops },
    { key: "tvs", label: "Televisions", products: tvs },
    { key: "games", label: "Games", products: games },
  ] as const;

  const activeProducts = tabs.find((t) => t.key === activeTab)?.products ?? [];

  return (
    <div className="space-y-8">
      {/* Category selection header */}
      <div className="flex flex-col items-center text-center space-y-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 uppercase tracking-wider">Our Top Seen</h2>
          <p className="text-xs text-slate-500 mt-1">Discover what is trending across our major categories</p>
        </div>
        {/* Simple text tabs aligned in the center (responsive layout) */}
        <div className="flex items-center justify-center gap-4 sm:gap-8 border-b border-slate-100 pb-2 w-full flex-wrap">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`text-xs sm:text-sm md:text-base font-semibold transition-all relative pb-2 focus:outline-none shrink-0 ${
                activeTab === tab.key
                  ? "text-indigo-600 font-bold"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              {tab.label}
              {activeTab === tab.key && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600 rounded-full animate-in fade-in slide-in-from-bottom-1 duration-200" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Carousel below them */}
      <div className="transition-all duration-300">
        {activeProducts.length > 0 ? (
          <ProductCarousel products={activeProducts} title="" />
        ) : (
          <div className="text-center py-12 bg-slate-50/50 rounded-xl border border-dashed border-slate-200 text-slate-400 text-sm">
            No products found in this category.
          </div>
        )}
      </div>
    </div>
  );
}
