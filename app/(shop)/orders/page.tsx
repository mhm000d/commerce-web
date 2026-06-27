"use client";

import {useEffect, useState} from "react";
import Link from "next/link";
import {useAuthStore} from "@/store/auth";
import {clientFetch} from "@/lib/client-fetch";
import {Button} from "@/components/ui/button";
import {OrderStatusBadge} from "@/components/order-status-badge";
import type {Order} from "@/lib/api/types";
import {toast} from "sonner";
import getErrorMessage from "@/lib/error-messages";

export default function OrdersPage() {
  const {status} = useAuthStore();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchOrders = async () => {
      // If not authenticated, stop loading and return
      if (status !== "authenticated") {
        if (isMounted) setLoading(false);
        return;
      }

      try {
        const res = await clientFetch("/api/orders");
        if (!res.ok) {
          const data = await res.json();
          throw new Error(data?.message || "Failed to fetch orders");
        }
        const data = await res.json();
        if (isMounted) setOrders(data.data || []);
      } catch (err) {
        if (isMounted) {
          const message = getErrorMessage(err);
          setError(message);
          toast.error(message);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchOrders();

    return () => {
      isMounted = false;
    };
  }, [status]);

  if (status === "loading") {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 text-center">
        <p className="text-slate-500">Loading...</p>
      </div>
    );
  }

  if (status === "unauthenticated") {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-bold text-slate-900">Sign in to view orders</h1>
        <Link href="/login">
          <Button className="mt-4">Sign in</Button>
        </Link>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 text-center">
        <p className="text-slate-500">Loading orders...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 text-center">
        <p className="text-red-600">{error}</p>
        <Button
          variant="outline"
          className="mt-4"
          onClick={() => window.location.reload()}
        >
          Try again
        </Button>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-bold text-slate-900">No orders yet</h1>
        <p className="text-slate-500 mt-2">Start shopping to place your first order.</p>
        <Link href="/products">
          <Button className="mt-4">Browse products</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-2xl font-bold text-slate-900 mb-8">Your Orders</h1>
      <div className="space-y-4">
        {orders.map((order) => (
          <div
            key={order.id}
            className="border border-slate-200 rounded-lg p-4 bg-white hover:shadow-md transition-shadow"
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div>
                <p className="text-sm text-slate-500">Order #{order.orderNumber}</p>
                <p className="text-sm text-slate-500">
                  {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : "N/A"}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <OrderStatusBadge status={order.status || "Placed"}/>
                <span className="text-sm font-semibold text-slate-900">
                  ${(order.totalAmount ?? 0).toFixed(2)}
                </span>
                <Link href={`/orders/${order.id}`}>
                  <Button variant="outline" size="sm">
                    View
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}