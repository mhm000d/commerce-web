"use client";

import {useEffect, useState, useRef} from "react";
import Link from "next/link";
import Image from "next/image";
import {clientFetch} from "@/lib/client-fetch";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Plus, Search, Edit, Trash2, Loader2} from "lucide-react";
import {toast} from "sonner";
import getErrorMessage from "@/lib/error-messages";
import {PaginationNav} from "@/components/pagination-nav";
import type {Product} from "@/lib/api/types";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      // Reset to page 1 when search changes
      if (search !== debouncedSearch && page !== 1) {
        setPage(1);
      }
    }, 300); // wait 300ms after last keystroke

    return () => clearTimeout(timer);
  }, [search, debouncedSearch, page]);

  useEffect(() => {
    const fetchProducts = async () => {
      // Cancel previous request if exists
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      const controller = new AbortController();
      abortControllerRef.current = controller;

      setLoading(true);

      try {
        const qs = new URLSearchParams();
        qs.set("page", String(page));
        qs.set("pageSize", "20");
        if (debouncedSearch) qs.set("Search", debouncedSearch);

        const res = await clientFetch(`/api/products?${qs}`, {
          signal: controller.signal,
        });

        if (!res.ok) throw new Error("Failed to fetch products");

        const data = await res.json();
        setProducts(data.data || []);
        setTotalPages(data.pagination?.totalPages || 1);
      } catch (err) {
        // Ignore abort errors – they're intentional
        if (err instanceof Error && err.name === "AbortError") return;
        toast.error(getErrorMessage(err));
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();

    // Cleanup: abort on unmount or effect re-run
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [debouncedSearch, page]);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    try {
      const res = await clientFetch(`/api/admin/products/${id}`, {method: "DELETE"});
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data?.message || "Failed to delete product");
      }
      toast.success("Product deleted successfully.");
      setPage(1);
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Products</h1>
        <Link href="/admin/products/new">
          <Button className="gap-2">
            <Plus size={16}/>
            Add Product
          </Button>
        </Link>
      </div>

      {/* ── Search Bar with Loading Indicator ── */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16}/>
          <Input
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 pr-10"
          />
          {loading && (
            <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 h-4 w-4 animate-spin"/>
          )}
        </div>
        {/* Optional: show how many results */}
        {!loading && products.length > 0 && (
          <p className="text-xs text-slate-400 mt-1">
            {products.length} result{products.length > 1 ? "s" : ""}
          </p>
        )}
      </div>

      {/* ── Table ── */}
      <div className="bg-white rounded-lg border border-slate-200 overflow-x-auto">
        <table className="w-full text-sm min-w-150">
          <thead className="bg-slate-50 border-b border-slate-200">
          <tr>
            <th className="text-left px-4 py-3 font-medium text-slate-600">Name</th>
            <th className="text-left px-4 py-3 font-medium text-slate-600">Image</th>
            <th className="text-left px-4 py-3 font-medium text-slate-600">Price</th>
            <th className="text-left px-4 py-3 font-medium text-slate-600">Stock</th>
            <th className="text-right px-4 py-3 font-medium text-slate-600">Actions</th>
          </tr>
          </thead>
          <tbody>
          {loading && products.length === 0 ? (
            <tr>
              <td colSpan={5} className="text-center py-8 text-slate-500">Loading products...</td>
            </tr>
          ) : products.length === 0 ? (
            <tr>
              <td colSpan={5} className="text-center py-8 text-slate-500">
                No products found{debouncedSearch ? ` for “${debouncedSearch}”` : ""}.
              </td>
            </tr>
          ) : (
            products.map((product, index) => (
              <tr key={product.id || index} className="border-b border-slate-100 hover:bg-slate-50">
                <td className="px-4 py-3 font-medium text-slate-900">{product.name}</td>
                <td className="px-4 py-3">
                  {product.images?.[0]?.imageUrl ? (
                    <div className="relative w-10 h-10 rounded overflow-hidden">
                      <Image
                        src={product.images[0].imageUrl}
                        alt={product.name || "Product image"}
                        fill
                        className="object-cover"
                        sizes="40px"
                      />
                    </div>
                  ) : (
                    <div
                      className="w-10 h-10 bg-slate-100 rounded flex items-center justify-center text-xs text-slate-300">
                      No img
                    </div>
                  )}
                </td>
                <td className="px-4 py-3 text-slate-600">${Number(product.price).toFixed(2)}</td>
                <td className="px-4 py-3">
                    <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
                      product.stockQuantity === 0
                        ? "bg-red-100 text-red-700"
                        : (product.stockQuantity ?? 0) <= 5
                          ? "bg-amber-100 text-amber-700"
                          : "bg-emerald-100 text-emerald-700"
                    }`}>
                      {product.stockQuantity}
                    </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-2">
                    {product.id && (
                      <>
                        <Link href={`/admin/products/${product.id}`}>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Edit size={16}/>
                          </Button>
                        </Link>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                          onClick={() => handleDelete(product.id!)}
                        >
                          <Trash2 size={16}/>
                        </Button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))
          )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="mt-6 flex justify-center">
          <PaginationNav
            currentPage={page}
            totalPages={totalPages}
            search={debouncedSearch}
          />
        </div>
      )}
    </div>
  );
}
