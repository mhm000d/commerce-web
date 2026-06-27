import { create } from "zustand";
import type { User } from "@/lib/api/types";

interface AuthState {
  token: string | null;
  user: User | null;
  status: "loading" | "authenticated" | "unauthenticated";
  setSession: (token: string, user: User) => void;
  setToken: (token: string) => void;
  clearSession: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  user: null,
  status: "loading", // "loading" until SessionProvider's silent refresh resolves
  setSession: (token, user) => set({ token, user, status: "authenticated" }),
  setToken: (token) => set({ token, status: "authenticated" }),
  clearSession: () => set({ token: null, user: null, status: "unauthenticated" }),
}));