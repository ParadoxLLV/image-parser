import {
  EmbeddedCheckout,
  EmbeddedCheckoutProvider,
} from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { useCallback } from 'react';

const stripePromise = loadStripe(process.env.STRIPE_PUBLISHABLE_KEY!);

const CheckoutForm = () => {
  const fetchClientSecret = useCallback(() => {
    return fetch('/create-checkout-session', {
      method: 'POST',
    })
      .then((res) => res.json())
      .then((data) => data.clientSecret);
  }, []);

  const options = { fetchClientSecret };

  return (
    <div id="checkout">
      <EmbeddedCheckoutProvider stripe={stripePromise} options={options}>
        <EmbeddedCheckout />
      </EmbeddedCheckoutProvider>
    </div>
  );
};

export default CheckoutForm;
