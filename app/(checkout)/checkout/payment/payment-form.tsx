"use client";

import {useEffect} from "react";
import {useRouter, useSearchParams} from "next/navigation";
import {useCartStore} from "@/store/cart";
import {useAddressStore} from "@/store/addresses";
import {CheckoutSteps} from "@/components/checkout-steps";
import {ArrowLeft, CreditCard, DollarSign} from "lucide-react";

type PaymentMethod = "CashOnDelivery" | "Card";

export default function CheckoutPaymentPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const addressId = searchParams.get("addressId");
  const {fetchCart} = useCartStore();
  const {fetchAddresses} = useAddressStore();

  useEffect(() => {
    if (!addressId) {
      router.push("/checkout/addresses");
      return;
    }
    fetchCart();
    fetchAddresses();
  }, [addressId, router, fetchCart, fetchAddresses]);

  const handleMethodSelect = (method: PaymentMethod) => {
    router.push(`/checkout/review?addressId=${addressId}&method=${method}`);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
      {/* Back button */}
      <div className="flex items-center justify-start mb-4">
        <button
          onClick={() => router.push(`/checkout/addresses`)}
          className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-600 transition-colors"
        >
          <ArrowLeft size={14}/>
          <span>Back to addresses</span>
        </button>
      </div>

      {/* Steps */}
      <div className="mb-8">
        <CheckoutSteps currentStep={2}/>
      </div>

      <h1 className="text-2xl font-bold text-slate-900 mb-6">Choose Payment Method</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div
          className="border rounded-lg p-6 cursor-pointer hover:border-indigo-500 hover:bg-indigo-50 transition-all"
          onClick={() => handleMethodSelect("CashOnDelivery")}
        >
          <div className="flex items-center gap-3">
            <DollarSign className="h-6 w-6 text-slate-500"/>
            <div>
              <h3 className="font-medium text-slate-900">Cash on Delivery</h3>
              <p className="text-sm text-slate-500">Pay when your order arrives</p>
            </div>
          </div>
        </div>

        <div
          className="border rounded-lg p-6 cursor-pointer hover:border-indigo-500 hover:bg-indigo-50 transition-all"
          onClick={() => handleMethodSelect("Card")}
        >
          <div className="flex items-center gap-3">
            <CreditCard className="h-6 w-6 text-slate-500"/>
            <div>
              <h3 className="font-medium text-slate-900">Credit / Debit Card</h3>
              <p className="text-sm text-slate-500">Pay securely with Stripe</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}