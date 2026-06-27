"use client";

import {EmbeddedCheckoutProvider, EmbeddedCheckout} from "@stripe/react-stripe-js";
import {loadStripe} from "@stripe/stripe-js";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

interface Props {
  clientSecret: string;
}

export function StripeEmbeddedCheckout({clientSecret}: Props) {
  return (
    <EmbeddedCheckoutProvider
      stripe={stripePromise}
      options={{clientSecret}}
    >
      <EmbeddedCheckout/>
    </EmbeddedCheckoutProvider>
  );
}