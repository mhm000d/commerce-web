"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CATEGORIES } from "@/constants/categories";
import {
  ChevronDown,
  ChevronUp,
  Menu,
  ShoppingCart,
  User,
  LogOut,
  Grid3x3,
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Separator } from "@/components/ui/separator";
import { useAuthStore } from "@/store/auth";
import { useCartStore } from "@/store/cart";

import { SearchAutocomplete } from "@/components/search-autocomplete";

export function MobileHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, status, clearSession } = useAuthStore();
  const cart = useCartStore((state) => state.cart);
  const { fetchCart } = useCartStore();

  const firstName = user?.name?.split(" ")[0] || user?.name || "Account";

  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);

  const closeMenu = () => {
    setCategoriesOpen(false);
    setAccountOpen(false);
    setMenuOpen(false);
  };

  const itemCount =
    cart?.items?.reduce(
      (sum, item) => sum + (item.quantity ?? 0),
      0
    ) || 0;

  useEffect(() => {
    if (status === "authenticated") {
      fetchCart();
    }
  }, [status, fetchCart]);

  async function handleLogout() {
    await fetch("/api/auth/logout", {
      method: "POST",
    });

    clearSession();
    useCartStore.setState({ cart: null });

    closeMenu();
  }

  return (
    <div className="md:hidden">
      <div className="grid grid-cols-[auto_1fr_auto] items-center py-3 gap-3">
        <Sheet open={menuOpen}
          onOpenChange={(open) => {
            setMenuOpen(open);

            if (!open) {
              setCategoriesOpen(false);
              setAccountOpen(false);
            }
          }}
        >
          <SheetTrigger asChild>
            <button className="justify-self-start p-1">
              <Menu size={24} />
            </button>
          </SheetTrigger>

          <SheetContent
            side="left"
            className="w-72"
            aria-describedby={undefined}
          >
            <SheetHeader>
              <SheetTitle className="text-xl font-bold">
                Menu
              </SheetTitle>
            </SheetHeader>

            <div className="space-y-3">

              {/* Browse */}
              <div>
                <Collapsible
                  open={categoriesOpen}
                  onOpenChange={setCategoriesOpen}
                >
                  <CollapsibleTrigger className="flex w-full items-center justify-between rounded-lg px-3 py-2 hover:bg-slate-100">
                    <div className="flex items-center gap-3">
                      <Grid3x3 size={18} />
                      Categories
                    </div>

                    {categoriesOpen ? (
                      <ChevronUp size={18} />
                    ) : (
                      <ChevronDown size={18} />
                    )}
                  </CollapsibleTrigger>

                  <CollapsibleContent className="mt-1 space-y-1 pl-8">
                    {CATEGORIES.map((cat) => {
                      const qs = new URLSearchParams();

                      if (cat.value) {
                        qs.set("category", cat.value);
                      }

                      const href = `/products${qs.toString() ? `?${qs}` : ""
                        }`;

                      return (
                        <Link
                          key={cat.value}
                          href={href}
                          onClick={closeMenu}
                          className="block rounded-lg px-3 py-2 text-sm text-slate-600 hover:bg-slate-100"
                        >
                          {cat.label}
                        </Link>
                      );
                    })}
                  </CollapsibleContent>
                </Collapsible>
              </div>

              <Separator />

              {/* Account */}
              <div>
                {status === "authenticated" ? (
                  <Collapsible
                    open={accountOpen}
                    onOpenChange={setAccountOpen}
                  >
                    <CollapsibleTrigger className="flex w-full items-center justify-between rounded-lg px-3 py-2 hover:bg-slate-100">
                      <div className="flex items-center gap-3">
                        <User size={18} />
                        {firstName}
                      </div>

                      {accountOpen ? (
                        <ChevronUp size={18} />
                      ) : (
                        <ChevronDown size={18} />
                      )}
                    </CollapsibleTrigger>

                    <CollapsibleContent className="mt-1 space-y-1 pl-8">
                      <Link
                        href="/account"
                        onClick={closeMenu}
                        className="block rounded-lg px-3 py-2 text-sm text-slate-600 hover:bg-slate-100"
                      >
                        Profile
                      </Link>

                      <Link
                        href="/orders"
                        onClick={closeMenu}
                        className="block rounded-lg px-3 py-2 text-sm text-slate-600 hover:bg-slate-100"
                      >
                        Orders
                      </Link>

                      <Link
                        href="/addresses"
                        onClick={closeMenu}
                        className="block rounded-lg px-3 py-2 text-sm text-slate-600 hover:bg-slate-100"
                      >
                        Addresses
                      </Link>

                      {user?.role === "Admin" && (
                        <Link
                          href="/admin/dashboard"
                          onClick={closeMenu}
                          className="block rounded-lg px-3 py-2 text-sm text-slate-600 hover:bg-slate-100"
                        >
                          Admin Panel
                        </Link>
                      )}
                    </CollapsibleContent>
                  </Collapsible>
                ) : (
                  <Link
                    href="/login"
                    onClick={closeMenu}
                    className="flex items-center gap-3 rounded-lg px-3 py-2 hover:bg-slate-100"
                  >
                    <User size={18} />
                    Sign in
                  </Link>
                )}
              </div>

              {status === "authenticated" && (
                <>
                  <Separator />

                  <button
                    onClick={handleLogout}
                    className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-red-600 hover:bg-red-50"
                  >
                    <LogOut size={18} />
                    Sign out
                  </button>
                </>
              )}
            </div>
          </SheetContent>
        </Sheet>

        <Link
          href="/"
          className="justify-self-center text-lg font-bold tracking-tight text-white"
        >
          Commerce
        </Link>

        <Link href="/cart" className="justify-self-end relative p-1">
          <ShoppingCart size={24} />

          {itemCount > 0 && (
            <span className="absolute -top-1 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-amber-500 text-xs font-bold text-white">
              {itemCount > 9 ? "9+" : itemCount}
            </span>
          )}
        </Link>
      </div>

      <div className="pb-3">
        <SearchAutocomplete />
      </div>
    </div>
  );
}