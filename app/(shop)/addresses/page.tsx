import {SuspenseWrapper} from "@/components/suspense-wrapper";
import AddressesForm from "./addresses-form";

export default function AddressesPage() {
  return (
    <SuspenseWrapper>
      <AddressesForm/>
    </SuspenseWrapper>
  );
}