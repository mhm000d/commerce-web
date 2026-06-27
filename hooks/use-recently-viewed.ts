"use client";

import {useEffect, useState} from "react";
import type {ProductSummary} from "@/lib/api/types";
import {clientFetch} from "@/lib/client-fetch";

const STORAGE_KEY = "recently_viewed";
const MAX_ITEMS = 10;
const DAYS_TO_KEEP = 7;

interface ViewedProduct {
  id: string;
  timestamp: number;
}

export function useRecentlyViewed(currentProductId?: string) {
  const [products, setProducts] = useState<ProductSummary[]>([]);
  const [loading, setLoading] = useState(true);

  const saveViewedProduct = (productId: string) => {
    if (typeof window === "undefined") return;

    const stored = localStorage.getItem(STORAGE_KEY);
    const viewed: ViewedProduct[] = stored ? JSON.parse(stored) : [];

    const filtered = viewed.filter((item) => item.id !== productId);
    const updated = [{id: productId, timestamp: Date.now()}, ...filtered];
    const trimmed = updated.slice(0, MAX_ITEMS);

    localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
  };

  const fetchRecentlyViewed = async () => {
    if (typeof window === "undefined") {
      setLoading(false);
      return;
    }

    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      setLoading(false);
      return;
    }

    const viewed: ViewedProduct[] = JSON.parse(stored);
    const now = Date.now();
    const cutoff = now - DAYS_TO_KEEP * 24 * 60 * 60 * 1000;

    const recent = viewed.filter((item) => item.timestamp > cutoff);

    if (recent.length === 0) {
      setLoading(false);
      return;
    }

    const ids = recent
      .map((item) => item.id)
      .filter((id) => id !== currentProductId);

    if (ids.length === 0) {
      setLoading(false);
      return;
    }

    try {
      const limitedIds = ids.slice(0, 6);
      const productPromises = limitedIds.map((id) =>
        clientFetch(`/api/products/${id}`).then((res) => res.json())
      );
      const results = await Promise.all(productPromises);
      setProducts(results);
    } catch {
      // Silently fail
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      if (!isMounted) return;
      await fetchRecentlyViewed();
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [currentProductId]);

  return {products, loading, saveViewedProduct};
}