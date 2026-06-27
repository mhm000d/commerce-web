"use client";

import {useEffect, useState} from "react";
import {clientFetch} from "@/lib/client-fetch";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Package, ShoppingBag} from "lucide-react";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    products: 0,
    orders: 0,
    revenue: 0,
    customers: 0,
  });

  useEffect(() => {
    async function fetchStats() {
      try {
        const [productsRes, ordersRes] = await Promise.all([
          clientFetch("/api/admin/orders?pageSize=1"),
          clientFetch("/api/products"),
        ]);
        const ordersData = await productsRes.json();
        const productsData = await ordersRes.json();
        setStats({
          orders: ordersData.pagination?.totalItems || 0,
          products: productsData.pagination?.totalItems || 0,
          revenue: 0,
          customers: 0,
        });
      } catch {
        // fallback
      }
    }

    fetchStats();
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900 mb-8">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
            <Package className="h-4 w-4 text-slate-400"/>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{stats.products}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <ShoppingBag className="h-4 w-4 text-slate-400"/>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{stats.orders}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}