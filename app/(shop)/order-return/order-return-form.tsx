"use client";

import {useEffect} from "react";
import {useSearchParams, useRouter} from "next/navigation";
import {clientFetch} from "@/lib/client-fetch";
import {toast} from "sonner";
import getErrorMessage from "@/lib/error-messages";

export default function OrderReturnPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const sessionId = searchParams.get("session_id");

  useEffect(() => {
    if (!sessionId) {
      router.push("/");
      return;
    }

    async function checkStatus() {
      try {
        const res = await clientFetch(`/api/checkout/session-status?sessionId=${sessionId}`);
        if (!res.ok) {
          toast.error("Failed to verify payment status.");
          router.push("/orders");
          return;
        }
        const data = await res.json();
        if (data.status === "complete" || data.status === "paid") {
          if (data.orderId) {
            router.push(`/orders/confirmation?orderId=${data.orderId}`);
          } else {
            router.push("/orders");
          }
        } else {
          toast.error("Payment was not completed. Please try again.");
          router.push("/checkout/payment?error=payment_failed");
        }
      } catch (err) {
        toast.error(getErrorMessage(err));
        router.push("/orders");
      }
    }

    checkStatus();
  }, [sessionId, router]);

  return (
    <div className="max-w-2xl mx-auto px-4 py-12 text-center">
      <p className="text-slate-500">Processing your payment...</p>
    </div>
  );
}