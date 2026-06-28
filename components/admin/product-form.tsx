"use client";

import {useState} from "react";
import {useRouter} from "next/navigation";
import Image from "next/image";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {Textarea} from "@/components/ui/textarea";
import {toast} from "sonner";
import getErrorMessage from "@/lib/error-messages";
import {clientFetch} from "@/lib/client-fetch";
import type {Product} from "@/lib/api/types";
import {Loader2, Upload, X} from "lucide-react";

const CATEGORIES = [
  "Electronics",
  "Mobiles",
  "Laptops",
  "Televisions",
  "Games",
  "Appliances",
  "Home",
  "Other",
];

interface Specification {
  key: string;
  value: string;
}

interface ProductFormProps {
  initialData?: (Partial<Product> & { id?: string }) | null;
  isEditing?: boolean;
}

export function ProductForm({initialData, isEditing = false}: ProductFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({current: 0, total: 0});
  const [form, setForm] = useState({
    name: initialData?.name || "",
    description: initialData?.description || "",
    price: initialData?.price?.toString() || "",
    stockQuantity: initialData?.stockQuantity?.toString() || "",
    category: initialData?.category || "",
    specifications: (initialData?.specifications || []) as Specification[],
  });
  const [specKey, setSpecKey] = useState("");
  const [specValue, setSpecValue] = useState("");
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length + selectedFiles.length > 5) {
      toast.error("Maximum 5 images allowed.");
      return;
    }
    setSelectedFiles((prev) => [...prev, ...files]);
    const newPreviews = files.map((file) => URL.createObjectURL(file));
    setImagePreviews((prev) => [...prev, ...newPreviews]);
    e.target.value = "";
  };

  const removeImage = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const addSpecification = () => {
    if (specKey.trim() && specValue.trim()) {
      setForm((prev) => ({
        ...prev,
        specifications: [...prev.specifications, {key: specKey.trim(), value: specValue.trim()}],
      }));
      setSpecKey("");
      setSpecValue("");
    }
  };

  const removeSpecification = (index: number) => {
    setForm((prev) => ({
      ...prev,
      specifications: prev.specifications.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setUploadProgress({current: 0, total: 0});

    try {
      // 1. Create product
      const productPayload = {
        name: form.name,
        description: form.description,
        price: parseFloat(form.price),
        stockQuantity: parseInt(form.stockQuantity, 10),
        category: form.category,
        specifications: form.specifications.map((s) => ({
          key: s.key,
          value: s.value,
        })),
      };

      const productRes = await clientFetch(
        isEditing ? `/api/admin/products/${initialData?.id}` : "/api/admin/products",
        {
          method: isEditing ? "PUT" : "POST",
          body: JSON.stringify(productPayload),
        }
      );

      if (!productRes.ok) {
        const errorData = await productRes.json();
        toast.error(errorData?.message || "Failed to save product");
        setLoading(false);
        return;
      }

      const product = await productRes.json();
      const productId = product.id;

      // 2. Upload images (only on create)
      if (selectedFiles.length > 0 && !isEditing) {
        setUploadProgress({current: 0, total: selectedFiles.length});
        for (let i = 0; i < selectedFiles.length; i++) {
          const file = selectedFiles[i];
          const formData = new FormData();
          formData.append("image", file);

          const imageRes = await clientFetch(`/api/admin/products/${productId}/images`, {
            method: "POST",
            body: formData,
          });

          if (!imageRes.ok) {
            const errorData = await imageRes.json();
            toast.error(`Failed to upload image ${i + 1}: ${errorData?.message || "Unknown error"}`);
          } else {
            setUploadProgress({current: i + 1, total: selectedFiles.length});
          }
        }
      }

      toast.success(
        isEditing
          ? "Product updated successfully."
          : "Product created and images uploaded successfully."
      );

      if (isEditing) {
        router.push("/admin/products");
      } else {
        router.push(`/admin/products/${productId}`);
      }
      router.refresh();
    } catch (err) {
      toast.error(getErrorMessage(err));
      setLoading(false);
    } finally {
      if (!isEditing && selectedFiles.length > 0) {
        imagePreviews.forEach((url) => URL.revokeObjectURL(url));
        setImagePreviews([]);
        setSelectedFiles([]);
      }
      setLoading(false);
      setUploadProgress({current: 0, total: 0});
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
      {/* ─── Product Name ─── */}
      <div>
        <Label>Product Name</Label>
        <Input
          value={form.name}
          onChange={(e) => setForm({...form, name: e.target.value})}
          required
        />
      </div>

      {/* ─── Description ─── */}
      <div>
        <Label>Description</Label>
        <Textarea
          value={form.description}
          onChange={(e) => setForm({...form, description: e.target.value})}
          rows={4}
        />
      </div>

      {/* ─── Price & Stock ─── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label>Price ($)</Label>
          <Input
            type="number"
            step="0.01"
            min="0"
            value={form.price}
            onChange={(e) => setForm({...form, price: e.target.value})}
            required
          />
        </div>
        <div>
          <Label>Stock Quantity</Label>
          <Input
            type="number"
            min="0"
            value={form.stockQuantity}
            onChange={(e) => setForm({...form, stockQuantity: e.target.value})}
            required
          />
        </div>
      </div>

      {/* ─── Category ─── */}
      <div>
        <Label>Category</Label>
        <select
          value={form.category}
          onChange={(e) => setForm({...form, category: e.target.value})}
          required
          className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="">Select category</option>
          {CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      {/* ─── Specifications ─── */}
      <div>
        <Label className="block mb-2">Specifications</Label>
        <div className="flex gap-2 mb-3">
          <Input
            placeholder="Key"
            value={specKey}
            onChange={(e) => setSpecKey(e.target.value)}
            className="flex-1"
          />
          <Input
            placeholder="Value"
            value={specValue}
            onChange={(e) => setSpecValue(e.target.value)}
            className="flex-1"
          />
          <Button type="button" onClick={addSpecification} variant="outline">
            Add
          </Button>
        </div>
        {form.specifications.length > 0 && (
          <div className="bg-slate-50 rounded-lg p-3 space-y-1">
            {form.specifications.map((spec, index) => (
              <div key={index} className="flex items-center justify-between text-sm">
                <span>
                  <strong>{spec.key}:</strong> {spec.value}
                </span>
                <button
                  type="button"
                  onClick={() => removeSpecification(index)}
                  className="text-red-500 hover:text-red-700 text-xs"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ─── Image Upload (Create only) ─── */}
      {!isEditing && (
        <div>
          <Label className="block mb-2">Product Images (max 5)</Label>
          <div className="flex flex-wrap gap-4 mb-3">
            {imagePreviews.map((src, index) => (
              <div key={index} className="relative w-20 h-20 rounded-lg overflow-hidden border border-slate-200">
                <Image
                  src={src}
                  alt={`Preview ${index + 1}`}
                  fill
                  className="object-cover"
                />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute top-1 right-1 p-0.5 bg-red-500 text-white rounded-full hover:bg-red-600"
                >
                  <X size={14}/>
                </button>
              </div>
            ))}
            {selectedFiles.length < 5 && (
              <label
                className="flex items-center justify-center w-20 h-20 border-2 border-dashed border-slate-300 rounded-lg cursor-pointer hover:border-indigo-400 transition-colors">
                <Upload size={24} className="text-slate-400"/>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleFileChange}
                  className="hidden"
                  multiple
                />
              </label>
            )}
          </div>
          <p className="text-xs text-slate-400">Upload up to 5 images (JPG, PNG, WEBP, max 5MB each).</p>
        </div>
      )}

      {/* ─── Upload Progress ─── */}
      {loading && uploadProgress.total > 0 && (
        <div className="space-y-1">
          <div className="flex justify-between text-sm text-slate-600">
            <span>Uploading images...</span>
            <span>{uploadProgress.current} / {uploadProgress.total}</span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-2">
            <div
              className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
              style={{width: `${(uploadProgress.current / uploadProgress.total) * 100}%`}}
            />
          </div>
        </div>
      )}

      {/* ─── Submit ─── */}
      <div className="flex gap-3 pt-4 border-t border-slate-200">
        <Button type="submit" disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin"/>
              {isEditing ? "Updating..." : "Creating..."}
            </>
          ) : isEditing ? (
            "Update Product"
          ) : (
            "Create Product"
          )}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.push("/admin/products")}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
