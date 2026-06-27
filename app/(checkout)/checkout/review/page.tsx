import {SuspenseWrapper} from "@/components/suspense-wrapper";
import ReviewForm from "./review-form";

export default function ReviewPage() {
  return (
    <SuspenseWrapper>
      <ReviewForm/>
    </SuspenseWrapper>
  );
}