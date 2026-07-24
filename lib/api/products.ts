import {serverFetch} from "@/lib/api/client";
import type {PagedResponse, Product, ProductSummary} from "@/lib/api/types";

export interface ListProductsParams {
  page?: number;
  pageSize?: number;
  category?: string;
  search?: string;
  sortBy?: string;
}

export function listProducts(params: ListProductsParams = {}) {
  const qs = new URLSearchParams();

  if (params.page)     qs.set("Page",     String(params.page));
  if (params.pageSize) qs.set("PageSize", String(params.pageSize));
  if (params.category) qs.set("Category", params.category);
  if (params.search)   qs.set("Search",   params.search);
  if (params.sortBy)   qs.set("SortBy",   params.sortBy);

  return serverFetch<PagedResponse<ProductSummary>>(
    `/api/products?${qs}`,
    { next: { revalidate: 60 } }
  );
}

export function getProduct(identifier: string) {
  return serverFetch<Product>(
    `/api/products/${encodeURIComponent(identifier)}`,
    { next: { revalidate: 60 } }
  );
}
