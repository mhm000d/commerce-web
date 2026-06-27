import {SuspenseWrapper} from "@/components/suspense-wrapper";
import LoginForm from "./login-form";

export default function LoginPage() {
  return (
    <SuspenseWrapper>
      <LoginForm/>
    </SuspenseWrapper>
  );
}