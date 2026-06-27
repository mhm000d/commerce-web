"use client";

import {useEffect} from "react";
import {useAuthStore} from "@/store/auth";

export function SessionProvider({children}: { children: React.ReactNode }) {
  useEffect(() => {
    let active = true;

    fetch("/api/auth/refresh", {method: "POST"})
      .then(async (res) => {
        if (!active) return;
        if (res.ok) {
          const data = await res.json();
          useAuthStore.getState().setSession(data.accessToken, data.user);
        } else {
          useAuthStore.getState().clearSession();
        }
      })
      .catch(() => {
        if (active) useAuthStore.getState().clearSession();
      });

    return () => {
      active = false;
    };
  }, []);

  return <>{children}</>;
}