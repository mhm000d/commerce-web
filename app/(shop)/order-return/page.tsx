import {SuspenseWrapper} from "@/components/suspense-wrapper";
import ReturnForm from "./order-return-form";

export default function OrderReturnPage() {
  return (
    <SuspenseWrapper>
      <ReturnForm/>
    </SuspenseWrapper>
  );
}