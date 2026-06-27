"use client";

import {useEffect, useState} from "react";
import {useParams, useRouter} from "next/navigation";
import Link from "next/link";
import {useAddressStore} from "@/store/addresses";
import {useAuthStore} from "@/store/auth";
import {Button} from "@/components/ui/button";
import {ArrowLeft} from "lucide-react";
import AddressForm from "@/components/address-form";
import {AddressRequest} from "@/lib/api/types";
import {toast} from "sonner";
import getErrorMessage from "@/lib/error-messages";

export default function AddressDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const {status} = useAuthStore();
  const {addresses, fetchAddresses, updateAddress, deleteAddress} = useAddressStore();
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const address = addresses.find((a) => a.id === id);

  useEffect(() => {
    let isMounted = true;

    const loadAddress = async () => {
      if (status !== "authenticated") {
        if (isMounted) setLoading(false);
        return;
      }
      await fetchAddresses();
      if (isMounted) setLoading(false);
    };

    loadAddress();

    return () => {
      isMounted = false;
    };
  }, [status, fetchAddresses]);

  const handleSave = async (data: AddressRequest) => {
    setIsSaving(true);
    try {
      await updateAddress(id, data);
      toast.success("Address updated successfully.");
      router.push("/addresses");
    } catch (err) {
      const message = getErrorMessage(err);
      toast.error(message);
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this address?")) return;
    setIsDeleting(true);
    try {
      await deleteAddress(id);
      toast.success("Address deleted successfully.");
      router.push("/addresses");
    } catch (err) {
      const message = getErrorMessage(err);
      toast.error(message);
      setIsDeleting(false);
    }
  };

  if (status === "unauthenticated") {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-bold text-slate-900">Sign in to edit addresses</h1>
        <Link href="/login">
          <Button className="mt-4">Sign in</Button>
        </Link>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 text-center">
        <p className="text-slate-500">Loading address...</p>
      </div>
    );
  }

  if (!address) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 text-center">
        <p className="text-red-600">Address not found</p>
        <Link href="/addresses">
          <Button variant="outline" className="mt-4">Back to addresses</Button>
        </Link>
      </div>
    );
  }

  const isOnlyAddress = addresses.length === 1;

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Link
        href="/addresses"
        className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900 transition-colors mb-6"
      >
        <ArrowLeft size={16}/>
        Back to addresses
      </Link>

      <h1 className="text-2xl font-bold text-slate-900 mb-6">Edit Address</h1>

      <div className="bg-white border border-slate-200 rounded-lg p-6">
        <AddressForm
          initialData={address}
          onSubmit={handleSave}
          submitLabel="Save Changes"
          onCancel={() => router.push("/addresses")}
          isLoading={isSaving}
          disableDefaultToggle={isOnlyAddress}
        />
        <div className="mt-6 pt-6 border-t border-slate-200">
          <Button variant="destructive" onClick={handleDelete} disabled={isDeleting}>
            {isDeleting ? "Deleting..." : "Delete Address"}
          </Button>
        </div>
      </div>
    </div>
  );
}