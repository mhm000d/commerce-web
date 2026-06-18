import Link from "next/link";
import { ProductCard } from "@/components/product-card";
import { SortDropdown } from "@/components/sort-dropdown";
import {listProducts} from "@/lib/api/products";


interface PageProps {
  searchParams: Promise<{
    page?: string;
    search?: string;
    category?: string;
    sortBy?: string;
  }>;
}

export default async function ProductsPage({ searchParams }: PageProps) {
  const params = await searchParams;

  const page = Number(params.page ?? 1);
  const search = params.search ?? "";
  const category = params.category ?? "";
  const sortBy = params.sortBy ?? "";

  const response = await listProducts({
    page,
    search,
    category,
    sortBy,
  });

  const products = response?.data ?? [];
  const pagination = response?.pagination;

  const buildUrl = (overrides: Record<string, string | number>) => {
    const next = { page, search, category, sortBy, ...overrides };
    const qs = new URLSearchParams();
    if (next.page && next.page !== 1) qs.set("page", String(next.page));
    if (next.search) qs.set("search", next.search);
    if (next.category) qs.set("category", next.category);
    if (next.sortBy) qs.set("sortBy", next.sortBy);
    return `/products${qs.toString() ? `?${qs}` : ""}`;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Page header with sort */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Products</h1>
          <p className="text-sm text-slate-500 mt-1">
            {pagination?.totalItems ?? 0} items
          </p>
        </div>
        <SortDropdown 
          sortBy={sortBy}
          page={page}
          search={search}
          category={category}
        />
      </div>

      {/* Grid */}
      {products.length === 0 ? (
        <div className="text-center py-24">
          <p className="text-lg font-medium text-slate-900">No products found</p>
          <p className="text-sm text-slate-500 mt-2">
            Try a different search or filter.
          </p>
          <Link
            href="/products"
            className="inline-block mt-4 text-sm font-medium text-indigo-600 hover:underline"
          >
            Clear filters
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}

      {/* Pagination */}
      {pagination && (pagination.totalPages ?? 0) > 1 && (
        <div className="flex items-center justify-center gap-2 mt-12">
          {pagination.hasPrevious && (
            <Link
              href={buildUrl({ page: page - 1 })}
              className="px-4 py-2 text-sm font-medium text-slate-600 border border-slate-200 rounded-lg hover:border-indigo-400 transition-colors"
            >
              ← Previous
            </Link>
          )}

          <span className="px-4 py-2 text-sm text-slate-500">
            Page {pagination.page ?? 1} of {pagination.totalPages ?? 1}
          </span>

          {pagination.hasNext && (
            <Link
              href={buildUrl({ page: page + 1 })}
              className="px-4 py-2 text-sm font-medium text-slate-600 border border-slate-200 rounded-lg hover:border-indigo-400 transition-colors"
            >
              Next →
            </Link>
          )}
        </div>
      )}
    </div>
  );
}