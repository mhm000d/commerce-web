"use client";

import {useEffect, useState} from "react";
import Link from "next/link";
import {useAddressStore} from "@/store/addresses";
import {useAuthStore} from "@/store/auth";
import {Button} from "@/components/ui/button";
import {Plus, MapPin, Edit, Trash2} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import AddressForm from "@/components/address-form";
import {toast} from "sonner";
import { AddressRequest } from "@/lib/api/types";

const MAX_ADDRESSES = 5;

export default function AddressesForm() {
  const {status} = useAuthStore();
  const {
    addresses,
    isLoading,
    fetchAddresses,
    deleteAddress,
    addAddress,
    updateAddress,
  } = useAddressStore();

  const [defaultLoadingId, setDefaultLoadingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [addError, setAddError] = useState<string | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  useEffect(() => {
    if (status === "authenticated") {
      fetchAddresses();
    }
  }, [status, fetchAddresses]);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this address?")) return;
    setDeletingId(id);
    try {
      await deleteAddress(id);
      toast.success("Address deleted successfully.");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to delete address";
      toast.error(message);
    } finally {
      setDeletingId(null);
    }
  };

  const handleSetDefault = async (id: string) => {
    const address = addresses.find((a) => a.id === id);
    if (!address) return;
    setDefaultLoadingId(id);
    try {
      await updateAddress(id, {...address, isDefault: true});
      toast.success(`"${address.addressName || "Address"}" is now your default.`);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to set default";
      toast.error(message);
    } finally {
      setDefaultLoadingId(null);
    }
  };

  const handleAddAddress = async (data: AddressRequest) => {
    setAddError(null);
    try {
      await addAddress(data);
      toast.success("Address added successfully.");
      setIsAddDialogOpen(false);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to add address";
      toast.error(message);
      setAddError(message);
    }
  };

  if (status === "unauthenticated") {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-bold text-slate-900">Sign in to view addresses</h1>
        <Link href="/login">
          <Button className="mt-4">Sign in</Button>
        </Link>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 text-center">
        <p className="text-slate-500">Loading addresses...</p>
      </div>
    );
  }

  const isAtLimit = addresses.length >= MAX_ADDRESSES;
  const isOnlyAddress = addresses.length === 1;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Your Addresses</h1>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2" disabled={isAtLimit}>
              <Plus size={16}/>
              {isAtLimit ? "Limit Reached" : "Add Address"}
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl w-full md:min-w-150 max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add New Address</DialogTitle>
              <DialogDescription>
                {isAtLimit
                  ? `You have reached the maximum of ${MAX_ADDRESSES} addresses.`
                  : "Enter the details for your new shipping address."}
              </DialogDescription>
            </DialogHeader>
            {!isAtLimit && (
              <AddressForm
                onSubmit={handleAddAddress}
                submitLabel="Save Address"
                error={addError}
              />
            )}
          </DialogContent>
        </Dialog>
      </div>

      {addresses.length === 0 ? (
        <div className="text-center py-12 bg-slate-50 rounded-lg">
          <MapPin className="mx-auto h-12 w-12 text-slate-300"/>
          <p className="text-slate-600 mt-4">No addresses saved yet.</p>
          <p className="text-sm text-slate-400">Add your first address to make checkout easier.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {addresses.map((address) => (
            <div
              key={address.id}
              className="bg-white border border-slate-200 rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium text-slate-900">
                      {address.addressName || "Home"}
                    </h3>
                    {address.isDefault && (
                      <span
                        className="text-xs bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full flex items-center gap-1">
                        Default
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-slate-600 mt-1">{address.fullName}</p>
                  <p className="text-sm text-slate-600">{address.phoneNumber}</p>
                  <p className="text-sm text-slate-500">
                    {address.street}, {address.area}, {address.governorate}
                  </p>
                  <p className="text-sm text-slate-500">{address.country}</p>
                </div>
                <div className="flex flex-col gap-1 ml-4">
                  <Link href={`/addresses/${address.id}`}>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Edit size={16}/>
                    </Button>
                  </Link>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                    onClick={() => handleDelete(address.id!)}
                    disabled={deletingId === address.id}
                  >
                    {deletingId === address.id ? (
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-red-500 border-t-transparent"/>
                    ) : (
                      <Trash2 size={16}/>
                    )}
                  </Button>
                </div>
              </div>
              {!address.isDefault && !isOnlyAddress && (
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-3 w-full"
                  onClick={() => handleSetDefault(address.id!)}
                  disabled={defaultLoadingId === address.id}
                >
                  {defaultLoadingId === address.id ? (
                    <div
                      className="h-4 w-4 animate-spin rounded-full border-2 border-indigo-500 border-t-transparent mr-2"/>
                  ) : null}
                  {defaultLoadingId === address.id ? "Setting..." : "Set as Default"}
                </Button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}