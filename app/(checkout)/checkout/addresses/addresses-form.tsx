"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Plus, MapPin, Check, ArrowRight } from "lucide-react";
import { useAddressStore } from "@/store/addresses";
import { useCartStore } from "@/store/cart";
import { useAuthStore } from "@/store/auth";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import AddressForm from "@/components/address-form";
import { ProductSummaryItem } from "@/components/product-summary-item";
import { CheckoutSteps } from "@/components/checkout-steps";

export default function AddressesForm() {
  const router = useRouter();
  const { status } = useAuthStore();
  const {
    addresses,
    selectedAddressId,
    isLoading,
    fetchAddresses,
    addAddress,
    setSelectedAddressId,
  } = useAddressStore();
  const { cart, isLoading: cartLoading, fetchCart } = useCartStore();

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [addError, setAddError] = useState<string | null>(null);

  useEffect(() => {
    if (status === "authenticated") {
      fetchAddresses();
      fetchCart();
    }
  }, [status, fetchAddresses, fetchCart]);

  const handleAddAddress = async (data: any) => {
    setAddError(null);
    try {
      const newAddr = await addAddress(data);
      if (newAddr) {
        setSelectedAddressId(newAddr.id!);
        setIsAddDialogOpen(false);
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to add address";
      setAddError(message);
    }
  };

  const subtotal = cart?.subtotal || 0;
  const itemCount = cart?.items?.reduce((sum, item) => sum + (item.quantity ?? 0), 0) || 0;

  if (status === "unauthenticated") {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-bold text-slate-900">Sign in to view addresses</h1>
        <Link href="/login">
          <Button className="mt-4">Sign in</Button>
        </Link>
      </div>
    );
  }

  if (isLoading || cartLoading || !cart) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 text-center">
        <p className="text-slate-500">Loading...</p>
      </div>
    );
  }

  const selectedAddress = addresses.find((a) => a.id === selectedAddressId);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex items-center justify-start mb-4">
        <button
          onClick={() => router.push("/cart")}
          className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-600 transition-colors"
        >
          <ArrowLeft size={14} />
          <span>Back to cart</span>
        </button>
      </div>

      {/* ─── Step Indicator ─── */}
      <div className="mb-8">
        <CheckoutSteps currentStep={1} />
      </div>

      <h1 className="text-2xl font-bold text-slate-900 mb-6">Select Shipping Address</h1>

      {/* ─── Grid ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Address selection - 2 columns */}
        <div className="lg:col-span-2 space-y-6">
          {addresses.length === 0 ? (
            <div className="text-center py-12 bg-slate-50 rounded-lg border border-slate-200">
              <MapPin className="mx-auto h-12 w-12 text-slate-300" />
              <p className="text-slate-600 mt-4">No addresses saved yet.</p>
              <p className="text-sm text-slate-400">Add your first address to continue.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {addresses.map((address) => (
                <div
                  key={address.id}
                  className={`flex items-start gap-4 p-4 border rounded-lg cursor-pointer transition-colors ${
                    selectedAddressId === address.id
                      ? "border-indigo-500 bg-indigo-50 ring-2 ring-indigo-500"
                      : "border-slate-200 hover:border-slate-300"
                  }`}
                  onClick={() => setSelectedAddressId(address.id!)}
                >
                  <div className="flex items-center gap-2 mt-0.5">
                    <div
                      className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                        selectedAddressId === address.id
                          ? "border-indigo-600 bg-indigo-600"
                          : "border-slate-300"
                      }`}
                    >
                      {selectedAddressId === address.id && (
                        <Check className="w-3 h-3 text-white" />
                      )}
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-slate-900">
                        {address.addressName || "Home"}
                      </span>
                      {address.isDefault && (
                        <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full flex items-center gap-1">
                          Default
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-slate-600 mt-1">{address.fullName}</p>
                    <p className="text-sm text-slate-600">{address.phoneNumber}</p>
                    <p className="text-sm text-slate-500">
                      {address.street}, {address.area}, {address.governorate}
                    </p>
                    <p className="text-sm text-slate-500">{address.country}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Plus size={16} />
                Add new address
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl w-full md:min-w-[600px] max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Add New Address</DialogTitle>
                <DialogDescription>
                  Enter the details for your new shipping address.
                </DialogDescription>
              </DialogHeader>
              <AddressForm
                onSubmit={handleAddAddress}
                submitLabel="Save Address"
                error={addError}
                onCancel={() => setIsAddDialogOpen(false)}
              />
            </DialogContent>
          </Dialog>
        </div>

        {/* Sidebar – Payment Summary + Product Summary + Button */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 space-y-6">
            {/* Payment Summary */}
            <div className="bg-white border border-slate-200 rounded-lg p-6">
              <h2 className="text-sm font-semibold text-slate-900 mb-4">Payment Summary</h2>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-slate-600">
                  <span>Items ({itemCount})</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Shipping</span>
                  <span className="text-emerald-600">Free</span>
                </div>
                <div className="border-t border-slate-200 pt-2 mt-2">
                  <div className="flex justify-between text-base font-semibold text-slate-900">
                    <span>Total</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Product Summary */}
            <div className="bg-white border border-slate-200 rounded-lg p-6">
              <h3 className="text-sm font-medium text-slate-900 mb-3">Products Summary</h3>
              <div className="space-y-3 max-h-48 overflow-y-auto">
                {cart.items?.map((item) => (
                  <ProductSummaryItem key={item.id} item={item} />
                ))}
              </div>
            </div>

            {/* Proceed to Payment Button */}
            <Button
              className="w-full gap-2"
              size="lg"
              onClick={() => {
                if (selectedAddressId) {
                  router.push(`/checkout/payment?addressId=${selectedAddressId}`);
                }
              }}
              disabled={!selectedAddressId}
            >
              Proceed to Payment
              <ArrowRight size={16} />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}