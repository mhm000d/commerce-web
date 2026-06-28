"use client";

import {useEffect, useState} from "react";
import Link from "next/link";
import {useSearchParams} from "next/navigation";
import {clientFetch} from "@/lib/client-fetch";
import {OrderStatusBadge} from "@/components/order-status-badge";
import {PaginationNav} from "@/components/pagination-nav";
import {toast} from "sonner";
import getErrorMessage from "@/lib/error-messages";
import type {Order} from "@/lib/api/types";
import {FileText} from "lucide-react";

export default function AdminOrdersPage() {
  const searchParams = useSearchParams();
  const page = parseInt(searchParams.get("page") || "1");
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    let isMounted = true;

    const fetchOrders = async () => {
      setLoading(true);
      try {
        const res = await clientFetch(`/api/admin/orders?page=${page}&pageSize=20`);
        if (!isMounted) return;
        if (!res.ok) throw new Error("Failed to fetch orders");
        const data = await res.json();
        if (isMounted) {
          setOrders(data.data || []);
          setTotalPages(data.pagination?.totalPages || 1);
        }
      } catch (err) {
        if (isMounted) toast.error(getErrorMessage(err));
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchOrders();

    return () => {
      isMounted = false;
    };
  }, [page]);

  if (loading) {
    return <p className="text-slate-500">Loading orders...</p>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900 mb-8">Orders</h1>

      <div className="bg-white rounded-lg border border-slate-200 overflow-x-auto">
        <table className="w-full text-sm min-w-150">
          <thead className="bg-slate-50 border-b border-slate-200">
          <tr>
            <th className="text-left px-4 py-3 font-medium text-slate-600">Order #</th>
            <th className="text-left px-4 py-3 font-medium text-slate-600">Customer</th>
            <th className="text-left px-4 py-3 font-medium text-slate-600">Total</th>
            <th className="text-left px-4 py-3 font-medium text-slate-600">Status</th>
            <th className="text-left px-4 py-3 font-medium text-slate-600">Date</th>
            <th className="text-right px-4 py-3 font-medium text-slate-600">Actions</th>
          </tr>
          </thead>
          <tbody>
          {orders.length === 0 ? (
            <tr>
              <td colSpan={6} className="text-center py-8 text-slate-500">
                No orders found.
              </td>
            </tr>
          ) : (
            orders.map((order) => (
              <tr key={order.id} className="border-b border-slate-100 hover:bg-slate-50">
                <td className="px-4 py-3 font-medium text-slate-900">#{order.orderNumber}</td>
                <td className="px-4 py-3 text-slate-600">
                  {order.shippingAddress?.fullName || "N/A"}
                </td>
                <td className="px-4 py-3 font-medium text-slate-900">${(order.totalAmount ?? 0).toFixed(2)}</td>
                <td className="px-4 py-3">
                  <OrderStatusBadge status={order.status!}/>
                </td>
                <td className="px-4 py-3 text-slate-500">
                  {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : "N/A"}
                </td>
                <td className="px-4 py-3 text-right">
                  <Link
                    href={`/admin/orders/${order.id}`}
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-indigo-600 hover:text-indigo-800 transition-colors"
                  >
                    <FileText size={14}/>
                    <span className="hidden sm:inline">View</span>
                  </Link>
                </td>
              </tr>
            ))
          )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="mt-6 flex justify-center">
          <PaginationNav
            currentPage={page}
            totalPages={totalPages}
            search=""
          />
        </div>
      )}
    </div>
  );
}