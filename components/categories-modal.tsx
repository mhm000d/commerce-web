"use client";

import Link from "next/link";
import {X} from "lucide-react";
import {Button} from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { CATEGORIES } from "@/constants/categories";

interface CategoriesModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CategoriesModal({open, onOpenChange}: CategoriesModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-sm p-0 rounded-t-2xl rounded-b-none bg-white border-0 bottom-0 translate-y-0 data-[state=open]:animate-in data-[state=open]:slide-in-from-bottom data-[state=closed]:animate-out data-[state=closed]:slide-out-to-bottom">
        <div className="p-4 pb-8">
          <div className="flex items-center justify-between mb-4">
            <DialogTitle className="text-lg font-bold text-slate-900">
              Categories
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
          <div className="grid grid-cols-2 gap-2">
            {CATEGORIES.map((cat) => {
              const qs = new URLSearchParams();
              if (cat.value) qs.set("category", cat.value);
              const href = `/products${qs.toString() ? `?${qs}` : ""}`;
              return (
                <Link
                  key={cat.value}
                  href={href}
                  onClick={() => onOpenChange(false)}
                  className="block px-4 py-3 text-sm font-medium text-slate-700 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors text-center"
                >
                  {cat.label}
                </Link>
              );
            })}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}