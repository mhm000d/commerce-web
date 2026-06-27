import Link from "next/link";
import {Lock} from "lucide-react";

export default function AuthLayout({children}: { children: React.ReactNode }) {
  return (
    <div
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-slate-50 px-4 py-12">
      {/* Subtle background pattern */}
      <div
        className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:radial-gradient(ellipse_at_center,white,transparent)] opacity-10 pointer-events-none"/>

      <div className="relative w-full max-w-sm animate-in fade-in slide-in-from-bottom-4 duration-700">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block group">
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
              Commerce
            </h1>
            <p className="text-sm text-slate-500 mt-1">Your one-stop shop</p>
          </Link>
          {/* Decorative separator */}
          <div className="w-12 h-0.5 bg-gradient-to-r from-indigo-400 to-transparent mx-auto mt-3 rounded-full"/>
        </div>

        {/* Card */}
        <div
          className="bg-white/80 backdrop-blur-sm border border-slate-200/60 rounded-xl shadow-xl shadow-slate-200/50 p-6 sm:p-8 transition-all duration-300 hover:shadow-indigo-100/80 hover:border-indigo-200/50">
          {children}
        </div>

        <div className="mt-6 text-center">
          <span className="inline-flex items-center gap-1.5 text-xs text-slate-400">
            <Lock size={12} className="text-indigo-400"/>
            Secure checkout · Powered by Commerce
          </span>
        </div>
      </div>
    </div>
  );
}