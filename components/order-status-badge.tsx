"use client";

export function OrderStatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    Placed: "bg-yellow-100 text-yellow-700",
    Paid: "bg-green-100 text-green-700",
    Shipped: "bg-blue-100 text-blue-700",
    Delivered: "bg-purple-100 text-purple-700",
    Cancelled: "bg-red-100 text-red-700",
  };
  return (
    <span
      className={`px-2 py-0.5 rounded-full text-xs font-medium ${
        colors[status] || "bg-slate-100 text-slate-700"
      }`}
    >
      {status}
    </span>
  );
}