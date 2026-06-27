"use client";

import {useEffect, useState} from "react";
import {useParams, useRouter} from "next/navigation";
import Link from "next/link";
import {clientFetch} from "@/lib/client-fetch";
import {OrderStatusBadge} from "@/components/order-status-badge";
import {OrderItem} from "@/components/order-item";
import {OrderStatusDropdown} from "@/components/admin/order-status-dropdown";
import {ArrowLeft, MapPin, CreditCard, DollarSign} from "lucide-react";
import {toast} from "sonner";
import getErrorMessage from "@/lib/error-messages";
import type {Order} from "@/lib/api/types";
import {OrderProgress} from "@/components/order-progress";

export default function AdminOrderDetailPage() {
  const router = useRouter();
  const params = useParams();
  const orderId = params.id as string;
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const fetchOrder = async () => {
      setLoading(true);
      try {
        const res = await clientFetch(`/api/admin/orders/${orderId}`);
        if (!isMounted) return;
        if (!res.ok) throw new Error("Order not found");
        const data = await res.json();
        if (isMounted) setOrder(data);
      } catch (err) {
        if (isMounted) toast.error(getErrorMessage(err));
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchOrder();

    return () => {
      isMounted = false;
    };
  }, [orderId]);

  const handleStatusChange = async (newStatus: string) => {
    if (!order) return;

    // Optimistic update: immediately reflect the change
    const previousOrder = {...order};
    setOrder({...order, status: newStatus});

    setUpdating(true);
    try {
      const res = await clientFetch(`/api/admin/orders/${orderId}/status`, {
        method: "PUT",
        body: JSON.stringify({newStatus}),
      });

      if (!res.ok) {
        // Revert to previous state on error
        setOrder(previousOrder);
        const data = await res.json();
        throw new Error(data?.message || "Failed to update status");
      }

      // Use the server response directly (contains full updated order)
      const updatedOrder = await res.json();
      setOrder(updatedOrder);
      toast.success("Order status updated.");
    } catch (err) {
      setOrder(previousOrder);
      toast.error(getErrorMessage(err));
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return <p className="text-slate-500">Loading order...</p>;
  }

  if (!order) {
    return <p className="text-red-600">Order not found.</p>;
  }

  return (
    <div className="max-w-4xl">
      <Link
        href="/admin/orders"
        className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900 transition-colors mb-6"
      >
        <ArrowLeft size={16}/>
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
          <OrderStatusBadge status={order.status!}/>
          <OrderStatusDropdown
            currentStatus={order.status!}
            onStatusChange={handleStatusChange}
            disabled={updating}
          />
        </div>
      </div>

      {/* Rest of the page remains unchanged */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Items</h2>
          <div className="bg-white border border-slate-200 rounded-lg p-4">
            {order.items?.map((item) => (
              <OrderItem key={item.id} item={item}/>
            ))}
          </div>
        </div>

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
              </div>
            </div>

            {order.shippingAddress && (
              <div className="bg-white border border-slate-200 rounded-lg p-6">
                <h2 className="text-sm font-semibold text-slate-900 mb-3 flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-slate-400"/>
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

            {order.payment && (
              <div className="bg-white border border-slate-200 rounded-lg p-6">
                <h2 className="text-sm font-semibold text-slate-900 mb-3 flex items-center gap-2">
                  {order.payment.paymentMethod === "card" ? (
                    <CreditCard className="h-4 w-4 text-slate-400"/>
                  ) : (
                    <DollarSign className="h-4 w-4 text-slate-400"/>
                  )}
                  Payment Details
                </h2>
                <div className="text-sm space-y-1 text-slate-600">
                  <p>
                    Method:{" "}
                    <span className="font-medium text-slate-900">
                      {order.payment.paymentMethod === "card" ? "Credit / Debit Card" : "Cash on Delivery"}
                    </span>
                  </p>
                  <p>
                    Status:{" "}
                    <span className="font-medium text-slate-900">
                      {order.payment.status}
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