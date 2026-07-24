"use client";

import {useEffect, useState} from "react";
import {useParams} from "next/navigation";
import {clientFetch} from "@/lib/client-fetch";
import {ProductForm} from "@/components/admin/product-form";
import {ProductImageManager} from "@/components/admin/product-image-manager";
import {toast} from "sonner";
import getErrorMessage from "@/lib/error-messages";
import type {Product} from "@/lib/api/types";

export default function EditProductPage() {
  const params = useParams();
  const id = params.id as string;
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    let isMounted = true;

    const fetchProduct = async () => {
      try {
        const res = await clientFetch(`/api/products/${encodeURIComponent(id)}`);
        if (!isMounted) return;
        if (!res.ok) throw new Error("Product not found");
        const data = await res.json();
        if (isMounted) setProduct(data);
      } catch (err) {
        if (isMounted) toast.error(getErrorMessage(err));
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchProduct();

    return () => {
      isMounted = false;
    };
  }, [id, refreshKey]);

  if (loading) return <p className="text-slate-500">Loading...</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900 mb-8">Edit Product</h1>
      <ProductForm initialData={product} isEditing/>

      {/* Images Section */}
      <div className="mt-12 pt-8 border-t border-slate-200">
        <ProductImageManager
          productId={id}
          images={product?.images || []}
          onRefresh={() => setRefreshKey((prev) => prev + 1)}
        />
      </div>
    </div>
  );
}