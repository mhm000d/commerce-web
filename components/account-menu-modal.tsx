"use client";

import Link from "next/link";
import {useRouter} from "next/navigation";
import {X, User, Package, MapPin, LayoutDashboard, LogOut} from "lucide-react";
import {Button} from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import {useAuthStore} from "@/store/auth";

interface AccountMenuModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AccountMenuModal({open, onOpenChange}: AccountMenuModalProps) {
  const router = useRouter();
  const {user, clearSession} = useAuthStore();

  const handleLogout = async () => {
    await fetch("/api/auth/logout", {method: "POST"});
    clearSession();
    onOpenChange(false);
    router.push("/");
  };

  const menuItems = [
    {label: "My Account", href: "/account", icon: User},
    {label: "My Orders", href: "/orders", icon: Package},
    {label: "My Addresses", href: "/addresses", icon: MapPin},
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-sm p-0 rounded-t-2xl rounded-b-none bg-white border-0 bottom-0 translate-y-0 data-[state=open]:animate-in data-[state=open]:slide-in-from-bottom data-[state=closed]:animate-out data-[state=closed]:slide-out-to-bottom">
        <div className="p-4 pb-8">
          <div className="flex items-center justify-between mb-4">
            <DialogTitle className="text-lg font-bold text-slate-900">
              My Account
            </DialogTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onOpenChange(false)}
              className="h-8 w-8 rounded-full hover:bg-slate-100"
            >
              <X size={18}/>
            </Button>
          </div>

          <div className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => onOpenChange(false)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-700 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                >
                  <Icon size={18}/>
                  {item.label}
                </Link>
              );
            })}

            {user?.role === "Admin" && (
              <Link
                href="/admin/dashboard"
                onClick={() => onOpenChange(false)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-700 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
              >
                <LayoutDashboard size={18}/>
                Admin Panel
              </Link>
            )}

            <button
              onClick={handleLogout}
              className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
            >
              <LogOut size={18}/>
              Sign out
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}