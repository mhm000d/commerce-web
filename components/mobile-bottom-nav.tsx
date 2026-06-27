"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, ShoppingCart, User, Grid3x3 } from "lucide-react";
import { useCartStore } from "@/store/cart";
import { useAuthStore } from "@/store/auth";
import { cn } from "@/lib/utils";
import { CategoriesModal } from "./categories-modal";
import { AccountMenuModal } from "./account-menu-modal";

export function MobileBottomNav() {
  const pathname = usePathname();
  const { cart } = useCartStore();
  const { status } = useAuthStore();
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);

  const itemCount = cart?.items?.reduce((sum, item) => sum + (item.quantity ?? 0), 0) || 0;
  const isAuthenticated = status === "authenticated";

  // Hide on non‑shop pages
  const isShopRoute =
    pathname.startsWith("/products") ||
    pathname.startsWith("/cart") ||
    pathname.startsWith("/account") ||
    pathname.startsWith("/orders") ||
    pathname.startsWith("/addresses") ||
    pathname === "/";

  if (!isShopRoute) return null;

  return (
    <>
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-slate-200 md:hidden">
        <div className="flex items-center justify-around h-16 max-w-md mx-auto">
          {/* Home */}
          <Link
            href="/"
            className={cn(
              "flex flex-col items-center justify-center flex-1 h-full gap-0.5 transition-colors",
              pathname === "/" ? "text-indigo-600" : "text-slate-500 hover:text-slate-900"
            )}
          >
            <Home size={22} />
            <span className="text-[10px] font-medium">Home</span>
          </Link>

          {/* Categories */}
          <button
            onClick={() => setCategoriesOpen(true)}
            className="flex flex-col items-center justify-center flex-1 h-full gap-0.5 text-slate-500 hover:text-slate-900 transition-colors"
          >
            <Grid3x3 size={22} />
            <span className="text-[10px] font-medium">Categories</span>
          </button>

          {/* Cart */}
          <Link
            href="/cart"
            className={cn(
              "flex flex-col items-center justify-center flex-1 h-full gap-0.5 transition-colors",
              pathname === "/cart" ? "text-indigo-600" : "text-slate-500 hover:text-slate-900"
            )}
          >
            <div className="relative">
              <ShoppingCart size={22} />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-2 flex items-center justify-center w-5 h-5 bg-amber-500 text-white text-xs font-bold rounded-full shadow-md">
                  {itemCount > 9 ? "9+" : itemCount}
                </span>
              )}
            </div>
            <span className="text-[10px] font-medium">Cart</span>
          </Link>

          {/* Account */}
          <button
            onClick={() => setAccountMenuOpen(true)}
            className={cn(
              "flex flex-col items-center justify-center flex-1 h-full gap-0.5 transition-colors",
              pathname === "/account" ? "text-indigo-600" : "text-slate-500 hover:text-slate-900"
            )}
          >
            <User size={22} />
            <span className="text-[10px] font-medium">
              {isAuthenticated ? "Account" : "Sign in"}
            </span>
          </button>
        </div>
      </nav>

      <CategoriesModal open={categoriesOpen} onOpenChange={setCategoriesOpen} />
      <AccountMenuModal open={accountMenuOpen} onOpenChange={setAccountMenuOpen} />
    </>
  );
}

// "use client";
//
// import { useState } from "react";
// import Link from "next/link";
// import { usePathname } from "next/navigation";
// import { Home, ShoppingCart, User, Grid3x3 } from "lucide-react";
// import { useCartStore } from "@/store/cart";
// import { useAuthStore } from "@/store/auth";
// import { cn } from "@/lib/utils";
// import { CategoriesModal } from "./categories-modal";
// import { AccountMenuModal } from "./account-menu-modal";
// import { useHideOnScroll } from "@/hooks/use-hide-on-scroll";
//
// export function MobileBottomNav() {
//   const pathname = usePathname();
//   const { cart } = useCartStore();
//   const { status } = useAuthStore();
//   const [categoriesOpen, setCategoriesOpen] = useState(false);
//   const [accountMenuOpen, setAccountMenuOpen] = useState(false);
//
//   const itemCount = cart?.items?.reduce((sum, item) => sum + (item.quantity ?? 0), 0) || 0;
//   const isAuthenticated = status === "authenticated";
//
//   // Hide bottom nav on scroll down, show on scroll up
//   const showNav = useHideOnScroll({ threshold: 50, initialVisibility: true });
//
//   // Hide on non‑shop pages
//   const isShopRoute =
//     pathname.startsWith("/products") ||
//     pathname.startsWith("/cart") ||
//     pathname.startsWith("/account") ||
//     pathname.startsWith("/orders") ||
//     pathname.startsWith("/addresses") ||
//     pathname === "/";
//
//   if (!isShopRoute) return null;
//
//   return (
//     <>
//       <nav
//         className={cn(
//           "fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-slate-200 md:hidden transition-transform duration-300",
//           showNav ? "translate-y-0" : "translate-y-full"
//         )}
//       >
//         <div className="flex items-center justify-around h-16 max-w-md mx-auto">
//           {/* Home */}
//           <Link
//             href="/"
//             className={cn(
//               "flex flex-col items-center justify-center flex-1 h-full gap-0.5 transition-colors",
//               pathname === "/" ? "text-indigo-600" : "text-slate-500 hover:text-slate-900"
//             )}
//           >
//             <Home size={22} />
//             <span className="text-[10px] font-medium">Home</span>
//           </Link>
//
//           {/* Categories (opens modal) */}
//           <button
//             onClick={() => setCategoriesOpen(true)}
//             className="flex flex-col items-center justify-center flex-1 h-full gap-0.5 text-slate-500 hover:text-slate-900 transition-colors"
//           >
//             <Grid3x3 size={22} />
//             <span className="text-[10px] font-medium">Categories</span>
//           </button>
//
//           {/* Cart – same icon as desktop */}
//           <Link
//             href="/cart"
//             className={cn(
//               "flex flex-col items-center justify-center flex-1 h-full gap-0.5 transition-colors",
//               pathname === "/cart" ? "text-indigo-600" : "text-slate-500 hover:text-slate-900"
//             )}
//           >
//             <div className="relative">
//               <ShoppingCart size={22} />
//               {itemCount > 0 && (
//                 <span className="absolute -top-1 -right-2 flex items-center justify-center w-5 h-5 bg-amber-500 text-white text-xs font-bold rounded-full shadow-md">
//                   {itemCount > 9 ? "9+" : itemCount}
//                 </span>
//               )}
//             </div>
//             <span className="text-[10px] font-medium">Cart</span>
//           </Link>
//
//           {/* Account – opens menu modal */}
//           <button
//             onClick={() => setAccountMenuOpen(true)}
//             className={cn(
//               "flex flex-col items-center justify-center flex-1 h-full gap-0.5 transition-colors",
//               pathname === "/account" ? "text-indigo-600" : "text-slate-500 hover:text-slate-900"
//             )}
//           >
//             <User size={22} />
//             <span className="text-[10px] font-medium">
//               {isAuthenticated ? "Account" : "Sign in"}
//             </span>
//           </button>
//         </div>
//       </nav>
//
//       <CategoriesModal open={categoriesOpen} onOpenChange={setCategoriesOpen} />
//       <AccountMenuModal open={accountMenuOpen} onOpenChange={setAccountMenuOpen} />
//     </>
//   );
// }
