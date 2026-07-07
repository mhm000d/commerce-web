"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Compass, ShoppingBag } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[85vh] w-full flex items-center justify-center p-4 bg-slate-50/50">
      <div className="max-w-md w-full text-center space-y-8 bg-white/80 backdrop-blur-md border border-slate-200/50 shadow-xl rounded-2xl p-8 relative overflow-hidden">
        {/* Decorative backdrop glow */}
        <div className="absolute -top-12 -left-12 w-24 h-24 bg-indigo-500/10 rounded-full blur-2xl" />
        <div className="absolute -bottom-12 -right-12 w-28 h-28 bg-rose-500/10 rounded-full blur-2xl" />

        <div className="relative space-y-6">
          {/* Animated Graphic */}
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-indigo-50 text-indigo-600 animate-pulse mb-2">
            <Compass size={40} className="stroke-[1.5]" />
          </div>

          <div className="space-y-2">
            <h1 className="text-8xl font-black tracking-tighter text-slate-200/80 select-none">
              404
            </h1>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
              Page Not Found
            </h2>
            <p className="text-slate-500 text-sm max-w-sm mx-auto">
              We could not find the page you are looking for. It might have been moved, deleted, or never existed.
            </p>
          </div>

          {/* Main CTA */}
          <div className="pt-2">
            <Link href="/" passHref>
              <Button className="w-full gap-2 text-base font-semibold py-6 shadow-md shadow-indigo-500/15">
                <ShoppingBag size={18} />
                Back to Shop
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
