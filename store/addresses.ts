import { create } from "zustand";
import { clientFetch } from "@/lib/client-fetch";
import type { Address, AddressRequest } from "@/lib/api/types";

interface AddressState {
  addresses: Address[];
  defaultAddress: Address | null; // computed from the list
  selectedAddressId: string | null;
  isLoading: boolean;
  fetchAddresses: () => Promise<void>;
  addAddress: (data: AddressRequest) => Promise<Address>;
  updateAddress: (id: string, data: AddressRequest) => Promise<boolean>;
  deleteAddress: (id: string) => Promise<void>;
  setSelectedAddressId: (id: string) => void;
}

export const useAddressStore = create<AddressState>((set, get) => ({
  addresses: [],
  defaultAddress: null,
  selectedAddressId: null,
  isLoading: false,

  fetchAddresses: async () => {
    set({ isLoading: true });
    const res = await clientFetch("/api/addresses");
    if (res.ok) {
      const addresses = await res.json();
      // Compute default from the list – reliable because backend ensures only one default
      const defaultAddr = addresses.find((a: Address) => a.isDefault) || addresses[0] || null;
      set({
        addresses,
        defaultAddress: defaultAddr,
        selectedAddressId: defaultAddr?.id || null,
        isLoading: false,
      });
    } else {
      set({ isLoading: false });
    }
  },

  addAddress: async (data) => {
    const res = await clientFetch("/api/addresses", {
      method: "POST",
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error?.message || "Failed to add address");
    }
    // Re‑fetch to get the latest state (including default)
    await get().fetchAddresses();
    // After fetch, set the selected address to the new default (if any)
    const currentState = get();
    const newDefault = currentState.addresses.find(a => a.isDefault);
    if (newDefault) {
      set({ selectedAddressId: newDefault.id });
    }
    // Return the new address (the default one)
    return currentState.addresses.find((a) => a.fullName === data.fullName && a.phoneNumber === data.phoneNumber)!;
  },

  updateAddress: async (id, data) => {
    const previousAddresses = get().addresses;
    const previousDefault = get().defaultAddress;
    const previousSelected = get().selectedAddressId;

    // Optimistic update
    if (data.isDefault) {
      set({
        addresses: previousAddresses.map(a => ({
          ...a,
          isDefault: a.id === id
        })),
        defaultAddress: previousAddresses.find(a => a.id === id) || previousDefault,
        selectedAddressId: id
      });
    }

    const payload = {
      fullName: data.fullName,
      phoneNumber: data.phoneNumber,
      country: data.country,
      governorate: data.governorate,
      area: data.area,
      street: data.street,
      buildingNumber: data.buildingNumber ?? null,
      floor: data.floor ?? null,
      apartment: data.apartment ?? null,
      addressName: data.addressName ?? null,
      isDefault: data.isDefault,
    };
    const res = await clientFetch(`/api/addresses/${id}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const error = await res.json();
      set({
        addresses: previousAddresses,
        defaultAddress: previousDefault,
        selectedAddressId: previousSelected
      });
      throw new Error(error?.message || "Failed to update address");
    }
    // Re-fetch to sync default state
    await get().fetchAddresses();
    return true;
  },

  deleteAddress: async (id) => {
    const previousAddresses = get().addresses;
    const previousDefault = get().defaultAddress;
    const previousSelected = get().selectedAddressId;

    // Optimistic update
    set({
      addresses: previousAddresses.filter(a => a.id !== id),
      defaultAddress: previousDefault?.id === id ? null : previousDefault,
      selectedAddressId: previousSelected === id ? null : previousSelected
    });

    const res = await clientFetch(`/api/addresses/${id}`, {
      method: "DELETE",
    });
    if (!res.ok) {
      const error = await res.json();
      set({
        addresses: previousAddresses,
        defaultAddress: previousDefault,
        selectedAddressId: previousSelected
      });
      throw new Error(error?.message || "Failed to delete address");
    }
    await get().fetchAddresses();
  },

  setSelectedAddressId: (id) => set({ selectedAddressId: id }),
}));