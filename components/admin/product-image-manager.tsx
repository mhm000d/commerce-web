"use client";

import {useState} from "react";
import Image from "next/image";
import {clientFetch} from "@/lib/client-fetch";
import {Button} from "@/components/ui/button";
import {toast} from "sonner";
import getErrorMessage from "@/lib/error-messages";
import {Star, Trash2, Upload, Loader2} from "lucide-react";
import type {ProductImage} from "@/lib/api/types";

interface ProductImageManagerProps {
  productId: string;
  images: ProductImage[];
  onRefresh: () => void;
}

export function ProductImageManager({
                                      productId,
                                      images,
                                      onRefresh,
                                    }: ProductImageManagerProps) {
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error("File exceeds 5MB limit.");
      return;
    }
    const ext = file.name.split(".").pop()?.toLowerCase();
    if (!["jpg", "jpeg", "png", "webp"].includes(ext || "")) {
      toast.error("Only JPG, PNG, and WEBP files are allowed.");
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await clientFetch(`/api/admin/products/${encodeURIComponent(productId)}/images`, {
        method: "POST",
        body: formData,
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data?.message || "Failed to upload image");
      }
      toast.success("Image uploaded successfully.");
      onRefresh();
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const handleDelete = async (imageId: string) => {
    if (!confirm("Are you sure you want to delete this image?")) return;
    try {
      const res = await clientFetch(
        `/api/admin/products/${encodeURIComponent(productId)}/images/${imageId}`,
        {method: "DELETE"}
      );
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data?.message || "Failed to delete image");
      }
      toast.success("Image deleted.");
      onRefresh();
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  const handleSetPrimary = async (imageId: string) => {
    try {
      const res = await clientFetch(
        `/api/admin/products/${encodeURIComponent(productId)}/images/${imageId}/set-primary`,
        {method: "PUT"}
      );
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data?.message || "Failed to set primary image");
      }
      toast.success("Primary image updated.");
      onRefresh();
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-slate-900">Product Images</h3>
        <div className="relative">
          <Button
            variant="outline"
            size="sm"
            className="gap-2"
            disabled={uploading || images.length >= 5}
          >
            {uploading ? (
              <Loader2 className="h-4 w-4 animate-spin"/>
            ) : (
              <Upload size={14}/>
            )}
            {uploading ? "Uploading..." : "Upload Image"}
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleUpload}
              className="absolute inset-0 opacity-0 cursor-pointer"
              disabled={uploading || images.length >= 5}
            />
          </Button>
          {images.length >= 5 && (
            <p className="text-xs text-amber-600 mt-1">Maximum 5 images reached.</p>
          )}
        </div>
      </div>

      {images.length === 0 ? (
        <p className="text-sm text-slate-500">No images uploaded yet.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {images.map((img) => (
            <div
              key={img.id}
              className="relative group bg-white border border-slate-200 rounded-lg overflow-hidden"
            >
              <div className="aspect-square relative">
                <Image
                  src={img.imageUrl!}
                  alt="Product image"
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 50vw, 200px"
                />
                {img.isPrimary && (
                  <div
                    className="absolute top-2 left-2 bg-indigo-600 text-white text-xs font-medium px-2 py-0.5 rounded-full flex items-center gap-1">
                    <Star size={12} className="fill-white"/>
                    Primary
                  </div>
                )}
              </div>
              <div
                className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                {!img.isPrimary && (
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => handleSetPrimary(img.id!)}
                    className="text-xs"
                  >
                    Set Primary
                  </Button>
                )}
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDelete(img.id!)}
                  className="text-xs"
                >
                  <Trash2 size={14}/>
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}