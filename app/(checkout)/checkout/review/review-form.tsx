"use client";

import {useEffect, useState, useRef} from "react";
import {useRouter, useSearchParams} from "next/navigation";
import {useCartStore} from "@/store/cart";
import {useAddressStore} from "@/store/addresses";
import {Button} from "@/components/ui/button";
import {clientFetch} from "@/lib/client-fetch";
import {StripeEmbeddedCheckout} from "@/components/embedded-checkout";
import {CheckoutSteps} from "@/components/checkout-steps";
import {ProductSummaryItem} from "@/components/product-summary-item";
import {ArrowLeft, MapPin, DollarSign} from "lucide-react";
import {toast} from "sonner";
import getErrorMessage from "@/lib/error-messages";

type PaymentMethod = "Card" | "CashOnDelivery";

export default function CheckoutReviewPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const addressId = searchParams.get("addressId");
  const methodParam = searchParams.get("method") as PaymentMethod | null;
  const {cart, fetchCart} = useCartStore();
  const {addresses, fetchAddresses} = useAddressStore();

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | null>(methodParam);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [isOrderCreating, setIsOrderCreating] = useState(false);
  const hasTriggered = useRef(false);

  const selectedAddress = addresses.find((a) => a.id === addressId);

  useEffect(() => {
    if (!addressId || !paymentMethod) {
      router.push("/checkout/addresses");
      return;
    }
    fetchCart();
    fetchAddresses();
  }, [addressId, paymentMethod, router, fetchCart, fetchAddresses]);

  const createCardOrder = async () => {
    if (!addressId) return;
    setLoading(true);
    setError(null);
    setIsOrderCreating(true);

    try {
      const res = await clientFetch("/api/checkout", {
        method: "POST",
        body: JSON.stringify({
          addressId,
          paymentMethod: "Card",
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        const message = data?.message || data?.error || "Failed to create order";
        setError(message);
        setLoading(false);
        setIsOrderCreating(false);
        return;
      }
      const decodedSecret = decodeURIComponent(data.stripeClientSecret);
      setClientSecret(decodedSecret);
      setLoading(false);
      setIsOrderCreating(false);
    } catch (err) {
      const message = getErrorMessage(err);
      setError(message);
      toast.error(message);
      setLoading(false);
      setIsOrderCreating(false);
    }
  };

  const handlePlaceCashOrder = async () => {
    if (!addressId || paymentMethod !== "CashOnDelivery") return;
    setLoading(true);
    setError(null);
    try {
      const res = await clientFetch("/api/checkout", {
        method: "POST",
        body: JSON.stringify({
          addressId,
          paymentMethod: "CashOnDelivery",
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        const message = data?.message || data?.error || "Failed to place order";
        toast.error(message);
        setLoading(false);
        return;
      }
      await fetchCart();
      toast.success("Order placed successfully!");
      router.push(`/orders/confirmation?orderId=${data.orderId}`);
    } catch (err) {
      toast.error(getErrorMessage(err));
      setLoading(false);
    }
  };

  useEffect(() => {
    if (
      paymentMethod === "Card" &&
      !clientSecret &&
      !isOrderCreating &&
      !hasTriggered.current
    ) {
      hasTriggered.current = true;
      createCardOrder();
    }
    if (paymentMethod !== "Card") {
      hasTriggered.current = false;
    }
  }, [paymentMethod, clientSecret, isOrderCreating]);

  const subtotal = cart?.subtotal || 0;
  const itemCount = cart?.items?.reduce((sum, item) => sum + (item.quantity ?? 0), 0) || 0;

  if (!cart) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 text-center">
        <p className="text-slate-500">Loading...</p>
      </div>
    );
  }

  if (!paymentMethod) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 text-center">
        <p className="text-slate-500">No payment method selected.</p>
        <Button
          variant="outline"
          onClick={() => router.push(`/checkout/payment?addressId=${addressId}`)}
        >
          Choose payment method
        </Button>
      </div>
    );
  }

  const isCard = paymentMethod === "Card";

  // ── Card mode: full‑screen checkout ──
  if (isCard) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50">
        {/* Top bar */}
        <div className="border-b border-slate-200 bg-white px-4 py-3 sm:px-6 grid grid-cols-3 items-center">
          <button
            onClick={() => router.push(`/checkout/payment?addressId=${addressId}`)}
            className="text-sm text-slate-500 hover:text-slate-900 transition-colors flex items-center gap-1 justify-self-start"
          >
            <ArrowLeft size={16}/>
            <span className="hidden sm:inline">Back to payment</span>
          </button>
          <div className="flex justify-center">
            <CheckoutSteps currentStep={3}/>
          </div>
          <div/>
          {/* empty spacer */}
        </div>

        {/* Error message */}
        {error && (
          <div className="bg-red-50 text-red-600 p-4 text-sm flex flex-wrap items-center gap-4">
            {error}
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                hasTriggered.current = false;
                createCardOrder();
              }}
              className="text-red-600 border-red-200 hover:bg-red-50"
            >
              Retry
            </Button>
          </div>
        )}

        {/* Stripe form */}
        <div className="flex-1 bg-white">
          {loading || isOrderCreating ? (
            <div className="h-full flex items-center justify-center">
              <div className="text-center">
                <div
                  className="animate-spin rounded-full h-8 w-8 border-2 border-indigo-600 border-t-transparent mx-auto"/>
                <p className="text-slate-500 mt-4">Preparing secure payment...</p>
              </div>
            </div>
          ) : clientSecret ? (
            <div className="h-full">
              <StripeEmbeddedCheckout clientSecret={clientSecret}/>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center text-slate-500">
              Unable to load payment form. Click &quot;Retry&quot; to try again.
            </div>
          )}
        </div>
      </div>
    );
  }

  // ── COD mode: full layout with sidebar ──
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* ─── Subtle Back Button (above steps) ─── */}
      <div className="flex items-center justify-start mb-4">
        <button
          onClick={() => router.push(`/checkout/payment?addressId=${addressId}`)}
          className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-600 transition-colors"
        >
          <ArrowLeft size={14}/>
          <span>Back to payment</span>
        </button>
      </div>

      {/* ─── Step Indicator ─── */}
      <div className="mb-8">
        <CheckoutSteps currentStep={3}/>
      </div>

      <h1 className="text-2xl font-bold text-slate-900 mb-6">Review & Confirm</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-white border border-slate-200 rounded-lg p-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Order Summary</h2>
            <div className="divide-y divide-slate-100">
              {cart.items?.map((item) => (
                <ProductSummaryItem key={item.id} item={item}/>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="sticky top-24 space-y-6">
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
              <div className="mt-4 pt-4 border-t border-slate-200">
                <h3 className="text-sm font-semibold text-slate-900 mb-2 flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-slate-400"/>
                  Payment Method
                </h3>
                <p className="text-sm text-slate-600">Cash on Delivery</p>
              </div>
            </div>

            {selectedAddress && (
              <div className="bg-white border border-slate-200 rounded-lg p-6">
                <h3 className="text-sm font-semibold text-slate-900 mb-3 flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-slate-400"/>
                  Shipping Address
                </h3>
                <div className="text-sm space-y-1 text-slate-600">
                  <p className="font-medium text-slate-900">{selectedAddress.fullName}</p>
                  <p>{selectedAddress.phoneNumber}</p>
                  <p>{selectedAddress.street}</p>
                  <p>{selectedAddress.area}, {selectedAddress.governorate}</p>
                  <p>{selectedAddress.country}</p>
                </div>
              </div>
            )}

            <Button
              className="w-full gap-2"
              size="lg"
              onClick={handlePlaceCashOrder}
              disabled={loading}
            >
              {loading ? "Processing..." : "Place Order Now"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}