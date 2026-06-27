import {SuspenseWrapper} from "@/components/suspense-wrapper";
import RetryForm from "./retry-form";

export default function RetryPage() {
  return (
    <SuspenseWrapper>
      <RetryForm/>
    </SuspenseWrapper>
  );
}