import {ProductForm} from "@/components/admin/product-form";

export default function NewProductPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900 mb-8">Create Product</h1>
      <ProductForm/>
    </div>
  );
}