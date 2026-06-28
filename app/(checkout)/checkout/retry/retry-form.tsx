"use client";

import {useEffect, useState} from "react";
import {useSearchParams, useRouter} from "next/navigation";
import {clientFetch} from "@/lib/client-fetch";
import {StripeEmbeddedCheckout} from "@/components/embedded-checkout";
import {Button} from "@/components/ui/button";

export default function RetryPaymentPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const orderId = searchParams.get("orderId");
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!orderId) {
      router.push("/orders");
      return;
    }

    async function createRetrySession() {
      try {
        const res = await clientFetch(`/api/orders/${orderId}/retry-payment`, {
          method: "POST",
        });
        const data = await res.json();
        if (!res.ok) {
          setError(data?.message || "Failed to retry payment");
          setLoading(false);
          return;
        }
        const decodedSecret = decodeURIComponent(data.clientSecret);
        setClientSecret(decodedSecret);
        setLoading(false);
      } catch {
        setError("Something went wrong. Please try again.");
        setLoading(false);
      }
    }

    createRetrySession();
  }, [orderId, router]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 text-center">
        <p className="text-slate-500">Preparing retry...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 text-center">
        <p className="text-red-600">{error}</p>
        <Button variant="outline" className="mt-4" onClick={() => router.push("/orders")}>
          Back to orders
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-2xl font-bold text-slate-900 mb-6">Retry Payment</h1>
      <div className="border border-slate-200 rounded-lg overflow-hidden bg-white">
        {clientSecret ? (
          <StripeEmbeddedCheckout clientSecret={clientSecret}/>
        ) : (
          <div className="p-12 text-center text-slate-500">No payment session available.</div>
        )}
      </div>
    </div>
  );
}
