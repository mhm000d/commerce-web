import {SuspenseWrapper} from "@/components/suspense-wrapper";
import ConfirmationForm from "./confirmation-form";

export default function ConfirmationPage() {
  return (
    <SuspenseWrapper>
      <ConfirmationForm/>
    </SuspenseWrapper>
  );
}