import {SuspenseWrapper} from "@/components/suspense-wrapper";
import PaymentForm from "./payment-form";

export default function PaymentPage() {
  return (
    <SuspenseWrapper>
      <PaymentForm/>
    </SuspenseWrapper>
  );
}