"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { EGYPT_GOVERNORATES, EGYPT_GOVERNORATE_NAMES } from "@/constants/governorates";
import type { Address, AddressRequest } from "@/lib/api/types";

interface AddressFormProps {
  initialData?: Address | Partial<AddressRequest>;
  onSubmit: (data: AddressRequest) => Promise<void>;
  onCancel?: () => void;
  submitLabel?: string;
  isLoading?: boolean;
  error?: string | null;
  disableDefaultToggle?: boolean;
}

export default function AddressForm({
                                      initialData = {},
                                      onSubmit,
                                      onCancel,
                                      submitLabel = "Save Address",
                                      isLoading = false,
                                      error = null,
                                      disableDefaultToggle = false,
                                    }: AddressFormProps) {
  const [form, setForm] = useState<AddressRequest>({
    fullName: initialData.fullName || "",
    phoneNumber: initialData.phoneNumber || "",
    country: "Egypt",
    governorate: initialData.governorate || "",
    area: initialData.area || "",
    street: initialData.street || "",
    buildingNumber: initialData.buildingNumber || "",
    floor: initialData.floor || "",
    apartment: initialData.apartment || "",
    addressName: initialData.addressName || "",
    isDefault: initialData.isDefault || false,
  });

  const handleGovernorateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const governorate = e.target.value;
    setForm((prev) => ({
      ...prev,
      governorate,
      area: "",
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(form);
  };

  const availableAreas = form.governorate
    ? EGYPT_GOVERNORATES[form.governorate] || []
    : [];

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
          {error}
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <Label>Full Name</Label>
          <Input
            value={form.fullName}
            onChange={(e) => setForm({ ...form, fullName: e.target.value })}
            required
          />
        </div>
        <div className="md:col-span-2">
          <Label>Phone Number</Label>
          <Input
            type="tel"
            value={form.phoneNumber}
            onChange={(e) => setForm({ ...form, phoneNumber: e.target.value })}
            required
          />
        </div>
        <div className="md:col-span-2">
          <Label>Country</Label>
          <div className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-slate-50 text-slate-700 text-sm">
            Egypt
          </div>
        </div>
        <div>
          <Label>Governorate</Label>
          <select
            value={form.governorate}
            onChange={handleGovernorateChange}
            required
            className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
          >
            <option value="">Select governorate</option>
            {EGYPT_GOVERNORATE_NAMES.map((gov) => (
              <option key={gov} value={gov}>
                {gov}
              </option>
            ))}
          </select>
        </div>
        <div>
          <Label>Area</Label>
          <select
            value={form.area}
            onChange={(e) => setForm({ ...form, area: e.target.value })}
            required
            disabled={!form.governorate}
            className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm disabled:bg-slate-100 disabled:cursor-not-allowed"
          >
            <option value="">Select area</option>
            {availableAreas.map((area) => (
              <option key={area} value={area}>
                {area}
              </option>
            ))}
          </select>
        </div>
        <div className="md:col-span-2">
          <Label>Street</Label>
          <Input
            value={form.street}
            onChange={(e) => setForm({ ...form, street: e.target.value })}
            required
          />
        </div>
        <div>
          <Label>Building Number</Label>
          <Input
            value={form.buildingNumber || ""}
            onChange={(e) => setForm({ ...form, buildingNumber: e.target.value })}
          />
        </div>
        <div>
          <Label>Floor</Label>
          <Input
            value={form.floor || ""}
            onChange={(e) => setForm({ ...form, floor: e.target.value })}
          />
        </div>
        <div>
          <Label>Apartment</Label>
          <Input
            value={form.apartment || ""}
            onChange={(e) => setForm({ ...form, apartment: e.target.value })}
          />
        </div>
        <div>
          <Label>Address Name (e.g. Home, Work)</Label>
          <Input
            value={form.addressName || ""}
            onChange={(e) => setForm({ ...form, addressName: e.target.value })}
            placeholder="Home"
          />
        </div>
      </div>
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="isDefault"
          checked={form.isDefault}
          onChange={(e) => setForm({ ...form, isDefault: e.target.checked })}
          disabled={disableDefaultToggle}
          className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
        />
        <Label htmlFor="isDefault" className="text-sm font-normal cursor-pointer">
          Set as default address
        </Label>
      </div>
      <div className="flex gap-3 pt-2">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Saving..." : submitLabel}
        </Button>
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
}