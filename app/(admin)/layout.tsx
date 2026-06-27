"use client";

import {useEffect, useState} from "react";
import Link from "next/link";
import {usePathname, useRouter} from "next/navigation";
import {useAuthStore} from "@/store/auth";
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import {cn} from "@/lib/utils";

const navItems = [
  {href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard},
  {href: "/admin/products", label: "Products", icon: Package},
  {href: "/admin/orders", label: "Orders", icon: ShoppingBag},
];

export default function AdminLayout({
                                      children,
                                    }: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const {user, status, clearSession} = useAuthStore();
  const [sidebarOpen, setSidebarOpen] = useState(() => {
    if (typeof window !== "undefined") {
      return window.innerWidth >= 1024;
    }
    return true;
  });

  // Auth guard
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
      return;
    }
    if (status === "authenticated" && user?.role !== "Admin") {
      router.push("/");
    }
  }, [status, user, router]);

  if (status === "loading" || user?.role !== "Admin") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-slate-500">Loading...</p>
      </div>
    );
  }

  const handleLogout = async () => {
    await fetch("/api/auth/logout", {method: "POST"});
    clearSession();
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-200 transition-transform duration-300",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Header with logo + toggle */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
            <Link href="/admin/dashboard" className="text-xl font-bold text-slate-900">
              Commerce Admin
            </Link>
            <button
              onClick={() => setSidebarOpen(false)}
              className="p-1 -mr-2 text-slate-500 hover:text-slate-900 transition-colors"
              aria-label="Close sidebar"
            >
              <X size={20}/>
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                    isActive
                      ? "bg-indigo-50 text-indigo-600"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                  )}
                >
                  <Icon size={18}/>
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Logout */}
          <div className="px-4 py-4 border-t border-slate-200">
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors"
            >
              <LogOut size={18}/>
              Sign out
            </button>
          </div>
        </div>
      </aside>

      {/* ─── Floating menu button – visible when sidebar is closed, on ALL screens ─── */}
      {!sidebarOpen && (
        <button
          onClick={() => setSidebarOpen(true)}
          className="fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-md"
          aria-label="Open sidebar"
        >
          <Menu size={20}/>
        </button>
      )}

      {/* ─── Main content ─── */}
      <main
        className={cn(
          "flex-1 transition-all duration-300",
          sidebarOpen ? "ml-64" : "ml-0",
          // Add left padding when floating button is visible
          !sidebarOpen ? "pl-16" : "pl-0"
        )}
      >
        <div className="p-6 lg:p-8">{children}</div>
      </main>
    </div>
  );
}
