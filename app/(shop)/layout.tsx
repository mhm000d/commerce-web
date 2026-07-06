"use client";

import Link from "next/link";
import { AuthNav } from "@/components/auth-nav";
import { MobileBottomNav } from "@/components/mobile-bottom-nav";
import { useHideOnScroll } from "@/hooks/use-hide-on-scroll";
import {SearchAutocomplete} from "@/components/search-autocomplete";
import { CATEGORIES } from "@/constants/categories";

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  const showHeader = useHideOnScroll({ threshold: 80 });

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <header
        className={`sticky top-0 z-50 bg-indigo-700 shadow-md transition-transform duration-300 ${
          showHeader ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* ─── Mobile: only search ─── */}
          <div className="flex items-center py-3 md:hidden">
            <SearchAutocomplete />
          </div>

          {/* ─── Desktop: full header ─── */}
          <div className="hidden md:flex items-center justify-between gap-2 py-3">
            <Link href="/" className="text-xl font-bold tracking-tight text-white shrink-0">
              Commerce
            </Link>

            <SearchAutocomplete />

            <AuthNav className="text-white" />
          </div>

          {/* ─── Desktop categories ─── */}
          <div className="hidden md:flex items-center justify-center gap-6 overflow-x-auto pb-3 pt-1 scrollbar-hide">
            {CATEGORIES.map((cat) => {
              const qs = new URLSearchParams();
              if (cat.value) qs.set("category", cat.value);
              const href = `/products${qs.toString() ? `?${qs}` : ""}`;
              return (
                <Link
                  key={cat.value}
                  href={href}
                  className="shrink-0 text-sm font-medium text-white/80 hover:text-white transition-colors whitespace-nowrap pb-2 border-b-2 border-transparent hover:border-white"
                >
                  {cat.label}
                </Link>
              );
            })}
          </div>
        </div>
      </header>

      <main className="flex-1 pb-20 md:pb-0">
        {children}
      </main>

      <MobileBottomNav />

      <footer className="border-t border-slate-200 mt-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <p className="text-sm text-slate-400">
            © {new Date().getFullYear()} Commerce. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}