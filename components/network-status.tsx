"use client";

import {useEffect, useState} from "react";
import {toast} from "sonner";
import {WifiOff} from "lucide-react";

export function NetworkStatus() {
  const [, setIsOnline] = useState(typeof window !== "undefined" ? navigator.onLine : true);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      toast.success("Back online!");
    };
    const handleOffline = () => {
      setIsOnline(false);
      toast.error("You are offline. Please check your connection.", {
        icon: <WifiOff className="h-5 w-5"/>,
        duration: Infinity,
      });
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  return null;
}