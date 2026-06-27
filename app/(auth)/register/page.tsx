import {SuspenseWrapper} from "@/components/suspense-wrapper";
import RegisterForm from "./register-form";

export default function RegisterPage() {
  return (
    <SuspenseWrapper>
      <RegisterForm/>
    </SuspenseWrapper>
  );
}