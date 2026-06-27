"use client";

import {useState, useEffect} from "react";
import Link from "next/link";
import {ShoppingCart, User, Package, MapPin, LogOut, ChevronDown, ChevronUp, LayoutDashboard} from "lucide-react";
import {useAuthStore} from "@/store/auth";
import {useCartStore} from "@/store/cart";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface AuthNavProps {
  className?: string;
}

export function AuthNav({className}: AuthNavProps) {
  const {user, status, clearSession} = useAuthStore();
  const cart = useCartStore((state) => state.cart);
  const {fetchCart} = useCartStore();
  const [isOpen, setIsOpen] = useState(false);

  const itemCount = cart?.items?.reduce((sum, item) => sum + (item.quantity ?? 0), 0) || 0;

  useEffect(() => {
    if (status === "authenticated") {
      fetchCart();
    }
  }, [status, fetchCart]);

  async function handleLogout() {
    await fetch("/api/auth/logout", {method: "POST"});
    clearSession();
    useCartStore.setState({cart: null});
  }

  const firstName = user?.name?.split(" ")[0] || user?.name || "Account";

  return (
    <div className={`flex items-center gap-2 ${className || ""}`}>
      {/* Cart icon – larger */}
      <Link href="/cart" className="relative p-2 transition-colors text-inherit hover:text-white/80">
        <ShoppingCart size={24} className="text-inherit"/>
        {itemCount > 0 && (
          <span
            className="absolute -top-1 -right-1 flex items-center justify-center w-5 h-5 bg-amber-500 text-white text-xs font-bold rounded-full shadow-md">
            {itemCount}
          </span>
        )}
      </Link>

      {/* Desktop user dropdown – hidden on mobile */}
      <div className="hidden md:block">
        {status === "loading" ? (
          <div className="w-16 h-4 bg-white/20 rounded animate-pulse"/>
        ) : status === "authenticated" && user ? (
          <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
            <DropdownMenuTrigger asChild>
              <button
                className="flex items-center gap-1.5 text-sm font-medium transition-colors text-inherit hover:text-white/80 select-none">
                <User size={16} className="text-inherit"/>
                {firstName}
                {isOpen ? <ChevronUp size={14} className="text-inherit"/> :
                  <ChevronDown size={14} className="text-inherit"/>}
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator/>
              <DropdownMenuItem asChild>
                <Link href="/account" className="flex items-center gap-2 cursor-pointer">
                  <User size={16}/>
                  Account
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/orders" className="flex items-center gap-2 cursor-pointer">
                  <Package size={16}/>
                  Orders
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/addresses" className="flex items-center gap-2 cursor-pointer">
                  <MapPin size={16}/>
                  Addresses
                </Link>
              </DropdownMenuItem>
              {user?.role === "Admin" && (
                <>
                  <DropdownMenuSeparator/>
                  <DropdownMenuItem asChild>
                    <Link href="/admin/dashboard" className="flex items-center gap-2 cursor-pointer">
                      <LayoutDashboard size={16}/>
                      Admin Panel
                    </Link>
                  </DropdownMenuItem>
                </>
              )}
              <DropdownMenuSeparator/>
              <DropdownMenuItem onClick={handleLogout} className="text-red-600 focus:text-red-600">
                <LogOut size={16}/>
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Link
            href="/login"
            className="text-sm font-medium transition-colors text-white/90 hover:text-white hover:underline underline-offset-2"
          >
            Sign in
          </Link>
        )}
      </div>
    </div>
  );
}