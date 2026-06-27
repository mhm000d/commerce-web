"use client";

import {useState} from "react";
import {Button} from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {ChevronDown, Loader2} from "lucide-react";

const ORDER_STATUSES = ["Placed", "Paid", "Shipped", "Delivered", "Cancelled"];

interface OrderStatusDropdownProps {
  currentStatus: string;
  onStatusChange: (newStatus: string) => Promise<void>;
  disabled?: boolean;
}

export function OrderStatusDropdown({
                                      currentStatus,
                                      onStatusChange,
                                      disabled,
                                    }: OrderStatusDropdownProps) {
  const [loading, setLoading] = useState(false);

  const handleChange = async (status: string) => {
    if (status === currentStatus) return;
    setLoading(true);
    await onStatusChange(status);
    setLoading(false);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" disabled={disabled || loading} className="gap-2">
          {loading ? <Loader2 className="h-4 w-4 animate-spin"/> : "Update Status"}
          <ChevronDown size={14}/>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {ORDER_STATUSES.map((status) => (
          <DropdownMenuItem
            key={status}
            onClick={() => handleChange(status)}
            className={status === currentStatus ? "bg-indigo-50 text-indigo-600" : ""}
          >
            {status}
            {status === currentStatus && " ✓"}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}