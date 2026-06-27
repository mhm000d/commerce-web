"use client";

import {useState} from "react";
import {useRouter} from "next/navigation";
import {Elements, PaymentElement, useStripe, useElements} from "@stripe/react-stripe-js";
import {loadStripe, Appearance} from "@stripe/stripe-js";
import {Button} from "@/components/ui/button";
import {Loader2} from "lucide-react";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

interface StripePaymentProps {
  clientSecret: string;
  orderId: string;
}

function CheckoutForm({orderId}: { orderId: string }) {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      setError("Stripe is not ready. Please try again.");
      return;
    }

    setIsLoading(true);
    setError(null);

    const {error: confirmError, paymentIntent} = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/orders/confirmation?orderId=${orderId}`,
      },
      redirect: "if_required",
    });

    if (confirmError) {
      setError(confirmError.message || "Payment failed. Please try again.");
      setIsLoading(false);
      return;
    }

    if (paymentIntent?.status === "succeeded") {
      router.push(`/orders/confirmation?orderId=${orderId}`);
    } else {
      router.push(`/orders/confirmation?orderId=${orderId}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <PaymentElement/>
      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
          {error}
        </div>
      )}
      <Button
        type="submit"
        disabled={!stripe || isLoading}
        className="w-full"
        size="lg"
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin"/>
            Processing...
          </>
        ) : (
          "Confirm Payment"
        )}
      </Button>
    </form>
  );
}

export function StripePayment({clientSecret, orderId}: StripePaymentProps) {
  const appearance: Appearance = {
    theme: "stripe",
  };

  const options = {
    clientSecret,
    appearance,
  };

  return (
    <Elements stripe={stripePromise} options={options}>
      <CheckoutForm orderId={orderId}/>
    </Elements>
  );
}