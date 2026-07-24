"use client";

import Link from "next/link";
import { AuthNav } from "@/components/auth-nav";
import { useHideOnScroll } from "@/hooks/use-hide-on-scroll";
import { SearchAutocomplete } from "@/components/search-autocomplete";
import { CATEGORIES } from "@/constants/categories";
import { MobileHeader } from "@/components/MobileHeader";

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  const showHeader = useHideOnScroll({ threshold: 80 });

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <header
        className="fixed inset-x-0 top-0 z-50 transition-transform duration-200 ease-out"
        style={{
          transform: showHeader ? "translateY(0)" : "translateY(-100%)",
          willChange: "transform",
        }}
      >
        <div className="w-full bg-indigo-700 text-white rounded-b-2xl shadow-md border-b border-white/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* ─── Mobile ─── */}
            <MobileHeader />

            {/* ─── Desktop: full header ─── */}
            <div className="hidden lg:flex items-center py-3">
              <div className="shrink-0 w-32">
                <Link href="/" className="text-xl font-bold tracking-tight text-white">
                  Commerce
                </Link>
              </div>

              <div className="flex-1 flex justify-center min-w-0">
                <div className="w-full max-w-[38rem] ml-9">
                  <SearchAutocomplete />
                </div>
              </div>

              <div className="shrink-0 w-32 flex justify-end">
                <AuthNav className="text-white" />
              </div>
            </div>

            <div className="hidden md:flex lg:hidden items-center justify-between gap-3 py-3">
              <Link href="/" className="text-xl font-bold tracking-tight text-white shrink-0">
                Commerce
              </Link>
              <SearchAutocomplete />
              <AuthNav className="text-white" />
            </div>

            {/* ─── Desktop categories ─── */}
            <div className="hidden md:flex items-center justify-center gap-6 overflow-x-auto pb-3 pt-1 scrollbar-hide pl-10">
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
        </div>
      </header>

      <main className="flex-1 pt-27 md:pt-32 lg:pt-36">
        {children}
      </main>

      <footer className="mt-16 w-full bg-indigo-700 text-white rounded-t-3xl">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-12 md:pb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Column 1: Company Info */}
            <div className="space-y-4">
              <Link href="/" className="text-xl font-bold tracking-tight text-white">
                Commerce
              </Link>
              <p className="text-sm text-white/90 max-w-sm">
                Your premium destination for electronics, smart home appliances, and high-performance devices.
              </p>
              <p className="text-xs text-white/80">
                © {new Date().getFullYear()} Commerce. All rights reserved.
              </p>
            </div>

            {/* Column 2: Customer Service */}
            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-white uppercase tracking-wider">
                Customer Service
              </h4>
              <Link
                href="/connect-us"
                className="text-sm text-white/90 hover:text-white transition-colors"
              >
                Connect Us
              </Link>
            </div>

            {/* Column 3: More (Policies) */}
            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-white uppercase tracking-wider">
                More Information
              </h4>
              <ul className="space-y-2">
                <li>
                  <Link href="/returns-policy" className="text-sm text-white/90 hover:text-white transition-colors">
                    Return & Refund Policy
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="text-sm text-white/90 hover:text-white transition-colors">
                    Terms & Conditions
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="text-sm text-white/90 hover:text-white transition-colors">
                    Privacy Policy
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}