"use client";

import {useEffect, useState} from "react";
import {useSearchParams, useRouter} from "next/navigation";
import Link from "next/link";
import {clientFetch} from "@/lib/client-fetch";
import {Button} from "@/components/ui/button";
import {CheckCircle, Loader2, AlertCircle, Clock} from "lucide-react";
import {toast} from "sonner";
import getErrorMessage from "@/lib/error-messages";
import type {Order} from "@/lib/api/types";

export default function OrderConfirmationPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!orderId) {
      router.push("/");
      return;
    }

    let isMounted = true;

    async function fetchOrder() {
      try {
        const res = await clientFetch(`/api/orders/${orderId}`);
        if (!res.ok) {
          const data = await res.json();
          throw new Error(data?.message || "Order not found");
        }
        const data = await res.json();
        if (isMounted) setOrder(data);
      } catch (err) {
        if (isMounted) {
          const message = getErrorMessage(err);
          setError(message);
          toast.error(message);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    fetchOrder();

    return () => {
      isMounted = false;
    };
  }, [orderId, router]);

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12 text-center">
        <Loader2 className="mx-auto h-8 w-8 animate-spin text-indigo-600"/>
        <p className="text-slate-500 mt-4">Loading order confirmation...</p>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12 text-center">
        <AlertCircle className="mx-auto h-12 w-12 text-red-500"/>
        <h1 className="text-2xl font-bold text-slate-900 mt-4">Something went wrong</h1>
        <p className="text-slate-500 mt-2">{error || "Order not found"}</p>
        <Button
          variant="outline"
          className="mt-4"
          onClick={() => window.location.reload()}
        >
          Retry
        </Button>
        <Link href="/">
          <Button className="mt-4 ml-2">Return to Home</Button>
        </Link>
      </div>
    );
  }

  const isPaid = order.status === "Paid" || order.status === "Shipped" || order.status === "Delivered";
  const isPlaced = order.status === "Placed";
  const isCancelled = order.status === "Cancelled";

  const isCOD = order.payment?.paymentMethod?.toLowerCase() === "cash_on_delivery";
  const placedMessage = isCOD
    ? "Your order has been placed. You will pay when your order arrives."
    : "Your order has been placed. Payment is being processed.";


  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
      {isPaid ? (
        <div className="flex justify-center">
          <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center">
            <CheckCircle className="w-10 h-10 text-emerald-600"/>
          </div>
        </div>
      ) : isPlaced && isCOD ? (
        <div className="flex justify-center">
          <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center">
            <Clock className="w-10 h-10 text-amber-600"/>
          </div>
        </div>
      ) : isPlaced ? (
        <div className="flex justify-center">
          <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center">
            <Loader2 className="w-10 h-10 text-yellow-600 animate-spin"/>
          </div>
        </div>
      ) : isCancelled ? (
        <div className="flex justify-center">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center">
            <AlertCircle className="w-10 h-10 text-red-600"/>
          </div>
        </div>
      ) : null}

      <h1 className="text-3xl font-bold text-slate-900 mt-6">
        {isPaid ? "Payment Successful!" : isPlaced ? "Order Placed" : "Order Status"}
      </h1>

      <p className="text-slate-500 mt-2">
        {isPaid
          ? "Thank you for your order. We'll send you a confirmation email shortly."
          : isPlaced
            ? placedMessage
            : "Your order status is: " + order.status}
      </p>

      <p className="text-sm text-slate-500 mt-2">
        We have sent a confirmation email to your email address.
      </p>

      <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8">
        <Link href={`/orders/${order.id}`}>
          <Button variant="outline">View Order Details</Button>
        </Link>
        <Link href="/">
          <Button>Continue Shopping</Button>
        </Link>
      </div>
    </div>
  );
}