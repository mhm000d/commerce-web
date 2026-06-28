"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useAuthStore } from "@/store/auth";
import { useCartStore } from "@/store/cart";
import { clientFetch } from "@/lib/client-fetch";
import { Button } from "@/components/ui/button";
import { OrderItem } from "@/components/order-item";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ArrowLeft, MapPin, CreditCard, DollarSign, AlertCircle, RotateCcw, Loader2 } from "lucide-react";
import { toast } from "sonner";
import getErrorMessage from "@/lib/error-messages";
import type { Order } from "@/lib/api/types";
import {OrderProgress} from "@/components/order-progress";

export default function OrderDetailPage() {
  const router = useRouter();
  const params = useParams();
  const orderId = params.id as string;
  const { status } = useAuthStore();
  const { addItem } = useCartStore();

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function fetchOrder() {
      if (status !== "authenticated") {
        if (isMounted) setLoading(false);
        return;
      }

      try {
        const res = await clientFetch(`/api/orders/${orderId}`);
        if (!res.ok) {
          const data = await res.json();
          const message = data?.message || "Failed to load order";
          if (isMounted) {
            setError(message);
            setLoading(false);
          }
          return;
        }
        const data = await res.json();
        if (isMounted) setOrder(data);
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : "Could not load order");
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    fetchOrder();

    return () => { isMounted = false; };
  }, [orderId, status]);

  if (status === "unauthenticated") {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-bold text-slate-900">Sign in to view order</h1>
        <Link href="/login">
          <Button className="mt-4">Sign in</Button>
        </Link>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 text-center">
        <p className="text-slate-500">Loading order...</p>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 text-center">
        <p className="text-red-600">{error || "Order not found"}</p>
        <Link href="/orders">
          <Button variant="outline" className="mt-4">Back to orders</Button>
        </Link>
      </div>
    );
  }

  // At this point `order` is guaranteed non-null
  const isPaid = order.status === "Paid" || order.status === "Shipped" || order.status === "Delivered";
  const canRetry = order.status === "Placed" && order.payment?.paymentMethod?.toLowerCase() === "card";
  const canCancel = order.status === "Placed";
  const canRepurchase = order.status === "Cancelled";

  const handleCancel = async () => {
    setIsCancelling(true);
    try {
      const res = await clientFetch(`/api/orders/${order.id}/cancel`, {
        method: "POST",
      });
      if (!res.ok) {
        const data = await res.json();
        const message = data?.message || "Failed to cancel order";
        toast.error(message);
        setError(message);
        setIsCancelling(false);
        return;
      }
      toast.success("Order cancelled successfully.");
      setCancelDialogOpen(false);
      router.refresh();
    } catch (err) {
      const message = getErrorMessage(err);
      toast.error(message);
      setError(message);
    } finally {
      setIsCancelling(false);
    }
  };

  const handleRepurchase = async () => {
    if (!order || order.status !== "Cancelled") return;
    try {
      for (const item of order.items || []) {
        await addItem(item.productId!, item.quantity!);
      }
      toast.success("Items added to your cart. Redirecting to checkout...");
      router.push("/checkout/addresses");
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Link
        href="/orders"
        className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900 transition-colors mb-6"
      >
        <ArrowLeft size={16} />
        Back to orders
      </Link>

      <div className="flex justify-center my-8">
        <OrderProgress
          status={order.status!}
          paymentMethod={order.payment?.paymentMethod || "card"}
        />
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-xl font-bold text-slate-900">
            Order #{order.orderNumber}
          </h1>
          <p className="text-sm text-slate-500">
            {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : "N/A"}
          </p>
        </div>
        <div className="flex items-center gap-3">
          {canRetry && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push(`/checkout/retry?orderId=${order.id}`)}
            >
              Retry Payment
            </Button>
          )}
          {canRepurchase && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleRepurchase}
              className="gap-2"
            >
              <RotateCcw size={14} />
              Repurchase
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Items */}
        <div className="lg:col-span-2">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Items</h2>
          <div className="bg-white border border-slate-200 rounded-lg p-4">
            {order.items?.map((item) => (
              <OrderItem key={item.id} item={item} />
            ))}
          </div>
        </div>

        {/* Summary */}
        <div className="lg:col-span-1">
          <div className="space-y-6">
            {/* Order Summary */}
            <div className="bg-white border border-slate-200 rounded-lg p-6">
              <h2 className="text-sm font-semibold text-slate-900 mb-4">Order Summary</h2>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal</span>
                  <span>${order.totalAmount?.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Shipping</span>
                  <span className="text-emerald-600">Free</span>
                </div>
                <div className="border-t border-slate-200 pt-2 mt-2">
                  <div className="flex justify-between text-base font-semibold text-slate-900">
                    <span>Total</span>
                    <span>${order.totalAmount?.toFixed(2)}</span>
                  </div>
                </div>

                {/* Cancel button – subtle, opens modal */}
                {canCancel && (
                  <div className="mt-4 pt-4 border-t border-slate-200">
                    <Dialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
                      <DialogTrigger asChild>
                        <button className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-red-500 transition-colors">
                          <AlertCircle size={14} />
                          Cancel Order
                        </button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Cancel Order</DialogTitle>
                          <DialogDescription>
                            Are you sure you want to cancel this order?
                            This action cannot be undone.
                          </DialogDescription>
                        </DialogHeader>
                        <DialogFooter>
                          <Button
                            variant="outline"
                            onClick={() => setCancelDialogOpen(false)}
                            disabled={isCancelling}
                          >
                            Keep Order
                          </Button>
                          <Button
                            variant="destructive"
                            onClick={handleCancel}
                            disabled={isCancelling}
                          >
                            {isCancelling ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Cancelling...
                              </>
                            ) : (
                              "Yes, cancel order"
                            )}
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                )}
              </div>
            </div>

            {/* Shipping Address */}
            {order.shippingAddress && (
              <div className="bg-white border border-slate-200 rounded-lg p-6">
                <h2 className="text-sm font-semibold text-slate-900 mb-3 flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-slate-400" />
                  Shipping Address
                </h2>
                <div className="text-sm space-y-1 text-slate-600">
                  <p className="font-medium text-slate-900">{order.shippingAddress.fullName}</p>
                  <p>{order.shippingAddress.phoneNumber}</p>
                  <p>{order.shippingAddress.street}</p>
                  <p>
                    {order.shippingAddress.area}, {order.shippingAddress.governorate}
                  </p>
                  <p>{order.shippingAddress.country}</p>
                </div>
              </div>
            )}

            {/* Payment Details */}
            {order.payment && (
              <div className="bg-white border border-slate-200 rounded-lg p-6">
                <h2 className="text-sm font-semibold text-slate-900 mb-3 flex items-center gap-2">
                  {order.payment.paymentMethod?.toLowerCase() === "card" ? (
                    <CreditCard className="h-4 w-4 text-slate-400" />
                  ) : (
                    <DollarSign className="h-4 w-4 text-slate-400" />
                  )}
                  Payment Details
                </h2>
                <div className="text-sm space-y-1 text-slate-600">
                  <p>
                    Method:{" "}
                    <span className="font-medium text-slate-900">
                      {order.payment.paymentMethod?.toLowerCase() === "card" ? "Credit / Debit Card" : "Cash on Delivery"}
                    </span>
                  </p>
                  <p>
                    Status:{" "}
                    <span className="font-medium text-slate-900">
                      {isPaid ? "Paid" : order.payment.status}
                    </span>
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}