import Link from "next/link";
import { Lock, ArrowLeft } from "lucide-react";

export default function CheckoutLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <header className="border-b border-slate-200 bg-indigo-700 shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
          <Link
            href="/"
            className="text-lg font-bold tracking-tight text-white hover:text-white/80 transition-colors"
          >
            Commerce
          </Link>
          <div className="flex items-center gap-3">
            <Link
              href="/cart"
              className="text-sm text-white/80 hover:text-white transition-colors flex items-center gap-1"
            >
              <ArrowLeft size={14} />
              <span className="hidden sm:inline">Back to cart</span>
              <span className="sm:hidden">Cart</span>
            </Link>
            <span className="flex items-center gap-1.5 text-xs text-white/70 border-l border-white/20 pl-3">
              <Lock size={14} className="text-white/70" />
              Secure checkout
            </span>
          </div>
        </div>
      </header>

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

      <footer className="border-t border-slate-200 mt-8 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 text-center text-sm text-slate-400">
          <p>© {new Date().getFullYear()} Commerce. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}