"use client";

import { useAuthStore } from "@/store/auth";

export async function clientFetch(
  path: string,
  init: RequestInit = {}
) {
  const token = useAuthStore.getState().token;
  const isFormData = init.body instanceof FormData;

  const headers: Record<string, string> = {};

  // Add authorization token if present
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  // Copy custom headers from init.headers
  if (init.headers) {
    if (init.headers instanceof Headers) {
      init.headers.forEach((value, key) => {
        headers[key] = value;
      });
    } else if (Array.isArray(init.headers)) {
      init.headers.forEach(([key, value]) => {
        headers[key] = value;
      });
    } else {
      Object.assign(headers, init.headers);
    }
  }

  // Only set Content-Type for JSON requests (skip FormData)
  if (!isFormData && !headers["Content-Type"]) {
    headers["Content-Type"] = "application/json";
  }

  const res = await fetch(path, {
    ...init,
    headers,
  });

  // Handle 401 – refresh token and retry
  if (res.status === 401) {
    const refreshRes = await fetch("/api/auth/refresh", { method: "POST" });
    if (!refreshRes.ok) {
      useAuthStore.getState().clearSession();
      throw new Error("Session expired. Please log in again.");
    }
    const data = await refreshRes.json();
    useAuthStore.getState().setToken(data.accessToken);

    // Build retry headers
    const retryHeaders: Record<string, string> = {};
    if (data.accessToken) {
      retryHeaders.Authorization = `Bearer ${data.accessToken}`;
    }

    // Copy custom headers from original init
    if (init.headers) {
      if (init.headers instanceof Headers) {
        init.headers.forEach((value, key) => {
          retryHeaders[key] = value;
        });
      } else if (Array.isArray(init.headers)) {
        init.headers.forEach(([key, value]) => {
          retryHeaders[key] = value;
        });
      } else {
        Object.assign(retryHeaders, init.headers);
      }
    }

    if (!isFormData && !retryHeaders["Content-Type"]) {
      retryHeaders["Content-Type"] = "application/json";
    }

    return fetch(path, {
      ...init,
      headers: retryHeaders,
    });
  }

  return res;
}