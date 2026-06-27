"use client";

import {Package, CreditCard, Truck, Home, Wallet} from "lucide-react";

interface OrderProgressProps {
  status: string;
  paymentMethod: string;
}

const STEP_LABELS: Record<string, Record<string, string>> = {
  card: {
    Placed: "Order Placed",
    Paid: "Payment Confirmed",
    Shipped: "Shipped",
    Delivered: "Delivered",
    Cancelled: "Cancelled",
  },
  cash_on_delivery: {
    Placed: "Order Placed",
    Paid: "Payment Collected",
    Shipped: "Shipped",
    Delivered: "Delivered",
    Cancelled: "Cancelled",
  },
};

const ICON_MAP = {
  card: {
    Placed: Package,
    Paid: CreditCard,
    Shipped: Truck,
    Delivered: Home,
  },
  cash_on_delivery: {
    Placed: Package,
    Shipped: Truck,
    Delivered: Home,
    Paid: Wallet,
  },
};

export function OrderProgress({status, paymentMethod}: OrderProgressProps) {
  const isCOD = paymentMethod?.toLowerCase() === "cash_on_delivery";
  const labels = isCOD ? STEP_LABELS.cash_on_delivery : STEP_LABELS.card;
  const icons = isCOD ? ICON_MAP.cash_on_delivery : ICON_MAP.card;

  const steps = isCOD
    ? ["Placed", "Shipped", "Delivered", "Paid"]
    : ["Placed", "Paid", "Shipped", "Delivered"];

  const currentIndex = steps.indexOf(status);

  if (status === "Cancelled") {
    return (
      <div className="flex items-center gap-2 text-red-600">
        <span className="text-sm font-medium">Order Cancelled</span>
      </div>
    );
  }

  // Build grid items: step, line, step, line, step, line, step
  const gridItems = steps.flatMap((step, index) => {
    const result: Array<{ type: "step"; stepIndex: number } | { type: "line"; lineIndex: number }> = [
      {type: "step", stepIndex: index},
    ];
    if (index < steps.length - 1) {
      result.push({type: "line", lineIndex: index});
    }
    return result;
  });

  return (
    <div className="w-full max-w-lg mx-auto px-4 py-4">
      <div className="grid grid-cols-7 gap-0 items-center">
        {gridItems.map((item, idx) => {
          if (item.type === "step") {
            const stepIndex = item.stepIndex;
            const step = steps[stepIndex];
            const isActive = stepIndex <= currentIndex;
            const isCurrent = stepIndex === currentIndex;
            const label = labels[step] || step;
            const Icon = icons[step as keyof typeof icons];

            return (
              <div key={idx} className="flex flex-col items-center">
                <div
                  className={`flex items-center justify-center w-10 h-10 rounded-full transition-all ${
                    isActive
                      ? "bg-indigo-600 text-white shadow-md"
                      : "bg-slate-200 text-slate-400"
                  } ${isCurrent ? "ring-2 ring-indigo-400 ring-offset-2" : ""}`}
                >
                  <Icon className="w-5 h-5"/>
                </div>
                <span
                  className={`mt-1.5 text-xs font-medium text-center ${
                    isActive ? "text-slate-900" : "text-slate-400"
                  }`}
                >
                  {label}
                </span>
              </div>
            );
          } else {
            const lineIndex = item.lineIndex;
            const isFilled = currentIndex > lineIndex;

            return (
              <div key={idx} className="flex items-center justify-center px-1">
                <div
                  className={`w-full h-0.5 rounded-full transition-all duration-500 ${
                    isFilled ? "bg-indigo-600" : "bg-slate-200"
                  }`}
                />
              </div>
            );
          }
        })}
      </div>
    </div>
  );
}