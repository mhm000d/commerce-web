"use client";

import {useEffect, useState, useCallback, useRef} from "react";
import {useSearchParams, useRouter} from "next/navigation";
import Link from "next/link";
import {ProductCard} from "@/components/product-card";
import {SortDropdown} from "@/components/sort-dropdown";
import {clientFetch} from "@/lib/client-fetch";
import {BreadcrumbNav, BreadcrumbItem} from "@/components/breadcrumb-nav";
import {PaginationNav} from "@/components/pagination-nav";
import {Loader2} from "lucide-react";
import type {ProductSummary} from "@/lib/api/types";

export default function ProductsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const pageParam = Number(searchParams.get("page")) || 1;
  const search = searchParams.get("search") || "";
  const category = searchParams.get("category") || "";
  const sortBy = searchParams.get("sortBy") || "";

  const [products, setProducts] = useState<ProductSummary[]>([]);
  const [currentPage, setCurrentPage] = useState(pageParam);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [allLoaded, setAllLoaded] = useState(false);

  const sentinelRef = useRef<HTMLDivElement>(null);
  const isMountedRef = useRef(true);

  const fetchProducts = useCallback(
    async (pageNum: number, reset = false) => {
      if (!isMountedRef.current) return;

      if (reset) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }

      try {
        const qs = new URLSearchParams();
        qs.set("Page", String(pageNum));
        qs.set("PageSize", "20");
        if (search) qs.set("Search", search);
        if (category) qs.set("Category", category);
        if (sortBy) qs.set("SortBy", sortBy);

        const res = await clientFetch(`/api/products?${qs}`);
        if (!res.ok) throw new Error("Failed to fetch products");
        const data = await res.json();

        const items = data.data || [];
        const total = data.pagination?.totalPages || 1;

        if (reset) {
          setProducts(items);
        } else {
          // Avoid duplicates: only add items that are not already in the list
          setProducts((prev) => {
            const existingIds = new Set(prev.map((p) => p.id));
            const newItems = items.filter(
              (item: ProductSummary) => item.id && !existingIds.has(item.id)
            );
            return [...prev, ...newItems];
          });
        }
        setTotalPages(total);
        setCurrentPage(pageNum);
        setAllLoaded(pageNum >= total);
      } catch {
        // silent
      } finally {
        if (reset) {
          setLoading(false);
        } else {
          setLoadingMore(false);
        }
      }
    },
    [search, category, sortBy]
  );

  // Initial load
  useEffect(() => {
    isMountedRef.current = true;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchProducts(1, true);
    return () => {
      isMountedRef.current = false;
    };
  }, [fetchProducts]);

  // Infinite scroll – Intersection Observer
  useEffect(() => {
    if (!sentinelRef.current || allLoaded || loading || loadingMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !allLoaded && !loadingMore) {
          const nextPage = currentPage + 1;
          if (nextPage <= totalPages) {
            const params = new URLSearchParams();
            if (nextPage > 1) params.set("page", String(nextPage));
            if (search) params.set("search", search);
            if (category) params.set("category", category);
            if (sortBy) params.set("sortBy", sortBy);
            router.replace(
              `/products${params.toString() ? `?${params}` : ""}`,
              {scroll: false}
            );
            fetchProducts(nextPage, false);
          }
        }
      },
      {rootMargin: "200px"}
    );

    const currentSentinel = sentinelRef.current;
    observer.observe(currentSentinel);
    return () => observer.disconnect();
  }, [currentPage, totalPages, allLoaded, loading, loadingMore, fetchProducts, search, category, sortBy, router]);

  const breadcrumbItems: BreadcrumbItem[] = [{label: "Products", href: "/products"}];
  if (category) {
    breadcrumbItems.push({label: category, isCurrent: true});
  } else {
    breadcrumbItems[breadcrumbItems.length - 1].isCurrent = true;
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className="flex flex-col bg-white rounded-lg border border-slate-200 overflow-hidden animate-pulse"
            >
              <div className="aspect-square bg-slate-100"/>
              <div className="p-4 flex flex-col gap-3">
                <div className="h-4 bg-slate-100 rounded w-3/4"/>
                <div className="h-3 bg-slate-100 rounded w-1/2"/>
                <div className="h-5 bg-slate-100 rounded w-1/4"/>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <BreadcrumbNav items={breadcrumbItems}/>

      <div className="flex items-center justify-between mt-6 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Products</h1>
          <p className="text-sm text-slate-500 mt-1">
            {products.length} items
          </p>
        </div>
        <SortDropdown
          sortBy={sortBy}
          page={currentPage}
          search={search}
          category={category}
        />
      </div>

      {products.length === 0 ? (
        <div className="text-center py-24">
          <p className="text-lg font-medium text-slate-900">
            No results found for “{search}”
          </p>
          <p className="text-sm text-slate-500 mt-2">
            Try checking your spelling, using simpler keywords, or browsing our categories.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link href="/products" className="text-indigo-600 hover:underline">
              View all products
            </Link>
            {category && (
              <Link href="/products" className="text-indigo-600 hover:underline">
                Clear category filter
              </Link>
            )}
            <Link href="/products?category=Electronics" className="text-indigo-600 hover:underline">
              Browse Electronics
            </Link>
          </div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {products.map((product, index) => (
              <ProductCard key={product.id || index} product={product}/>
            ))}
          </div>

          {/* Loading indicator at bottom */}
          {loadingMore && (
            <div className="mt-8 text-center py-4">
              <Loader2 className="h-6 w-6 animate-spin text-indigo-600 mx-auto"/>
              <p className="text-sm text-slate-500 mt-2">Loading more products...</p>
            </div>
          )}

          {/* Sentinel element for Intersection Observer */}
          {!allLoaded && !loadingMore && (
            <div ref={sentinelRef} className="h-10 w-full"/>
          )}

          {/* Fallback pagination – visible when all products are loaded */}
          {allLoaded && products.length > 0 && (
            <div className="mt-12 flex justify-center">
              <PaginationNav
                currentPage={currentPage}
                totalPages={totalPages}
                search={search}
                category={category}
                sortBy={sortBy}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
}