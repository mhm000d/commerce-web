import { SuspenseWrapper } from "@/components/suspense-wrapper";
import CheckoutAddressesPage from "./addresses-form";

export default function AddressesPage() {
  return (
    <SuspenseWrapper>
      <CheckoutAddressesPage />
    </SuspenseWrapper>
  );
}