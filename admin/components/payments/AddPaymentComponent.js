import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import PaymentComponent from "./AddPaymentMethodComponent";
import { useEffect, useState } from "react";
import axios from "axios";
import { CircularProgress } from "@chakra-ui/react";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_KEY);
const options = {};

/*
    Use this component to set a payment method to the board.
    Create a stripe customer ID and store it.
*/
export default function AddPaymentComponent() {
  const [setupIntent, setSetupIntent] = useState(null);

  useEffect(() => {
    const getSetupIntent = async () => {
      await axios
        .get(`/api/admin/payment/stripeSetupIntent`)
        .then((response) => {
          const serverSetupIntent = response.data.setupIntent;
          setSetupIntent(serverSetupIntent);
          options.clientSecret = serverSetupIntent.client_secret;
        });
    };

    getSetupIntent();
  }, []);

  return setupIntent && options.clientSecret ? (
    <Elements stripe={stripePromise} options={options}>
      <PaymentComponent setupIntent={setupIntent} />
    </Elements>
  ) : (
    <div className="flex justify-center">
      <CircularProgress isIndeterminate color="black" size="24px" />
    </div>
  );
}
