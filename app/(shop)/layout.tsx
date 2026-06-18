import Link from "next/link";
import { Search, ShoppingCart } from "lucide-react";

const CATEGORIES = [
  { value: "", label: "All" },
  { value: "Mobiles", label: "Mobiles" },
  { value: "Laptops", label: "Laptops" },
  { value: "Televisions", label: "Televisions" },
  { value: "Games", label: "Games" },
  { value: "Appliances", label: "Appliances" },
  { value: "Electronics", label: "Electronics" },
  { value: "Home", label: "Home" },
  { value: "Other", label: "Other" },
];

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <header className="sticky top-0 z-50 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-6 py-3">
            <Link href="/" className="text-xl font-bold tracking-tight text-slate-900 shrink-0">
              Commerce
            </Link>

            <form action="/products" method="GET" className="flex-1 relative max-w-md">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              <input
                name="search"
                placeholder="Search products..."
                className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </form>

            <div className="flex items-center gap-4 shrink-0">
              <button className="relative p-2 text-slate-600 hover:text-slate-900 transition-colors">
                <ShoppingCart size={20} />
              </button>
              <Link href="/login" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">
                Sign in
              </Link>
            </div>
          </div>

          <div className="flex items-center justify-center gap-6 overflow-x-auto pb-3 pt-1">
            {CATEGORIES.map((cat) => {
              const qs = new URLSearchParams();
              if (cat.value) qs.set("category", cat.value);
              const href = `/products${qs.toString() ? `?${qs}` : ""}`;
              return (
                <Link
                  key={cat.value}
                  href={href}
                  className="shrink-0 text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors whitespace-nowrap pb-2 border-b-2 border-transparent hover:border-indigo-600"
                >
                  {cat.label}
                </Link>
              );
            })}
          </div>
        </div>
      </header>

      <main className="flex-1">{children}</main>

      <footer className="border-t border-slate-200 mt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <p className="text-sm text-slate-400">
            © {new Date().getFullYear()} Commerce. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}