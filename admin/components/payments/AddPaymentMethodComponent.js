import { useState } from "react";
import axios from "axios";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import { CircularProgress, useToast } from "@chakra-ui/react";
import { CheckCircleIcon } from "@heroicons/react/24/outline";
import useSWRImmutable from 'swr/immutable';
import fetcher from "@/utils/fetcher";

export default function PaymentComponent({ setupIntent }) {
  const stripe = useStripe();
  const elements = useElements();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPaymentMethodSaved, setIsPaymentMethodSaved] = useState(false);
  const toast = useToast();
  const {
    mutate: triggerPaymentMethods,
  } = useSWRImmutable("/api/admin/payment/getPaymentMethods", fetcher);

  const isButtonsDisabled = () => {
    if (!stripe) return true;
    if (!elements) return true;
    if (isSubmitting) return true;
    return false;
  };

  const onSubmit = async () => {
    if (!stripe || !elements) {
      return;
    }

    setIsSubmitting(true);

    const cardElement = elements.getElement(CardElement);

    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card: cardElement,
    });

    if (error) {
      toast({
        title: "Error.",
        description: error.message,
        status: "error",
        isClosable: true,
        duration: 9000,
      });
    } else {
      const { id } = paymentMethod;
      // Pass the payment method ID to your backend to save the card details
      // Make a request to your backend API to save the payment method ID
      // along with the SetupIntent object
      try {
        const submitData = {
          payment_method_id: id,
          setup_intent_id: setupIntent.id,
        };
        await axios.post(`/api/admin/payment/savePaymentInfo`, submitData);
        toast({
          title: "Successfully Saved.",
          status: "success",
          isClosable: true,
          duration: 9000,
        });
        setIsPaymentMethodSaved(true);
        triggerPaymentMethods();
      } catch (error) {
        toast({
          title: "Unable to save.",
          description: error.message,
          status: "error",
          isClosable: true,
          duration: 9000,
        });
      }
    }
    setIsSubmitting(false);
  };

  if (isPaymentMethodSaved) {
    return (
      <div className="flex justify-center font-medium">
        <div className="flex flex-col items-center">
          <CheckCircleIcon className="h-8 w-8 text-green-500" />
          <span className="text-sm mt-4">Payment Method Saved</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <div className="m-2 p-4 rounded-lg border border-1">
        <CardElement />
      </div>
      <div className="flex mt-2">
        <button
          disabled={isButtonsDisabled()}
          className={`${"bg-black text-white"} bold p-2 text-sm font-bold m-2 rounded w-48`}
          onClick={() => onSubmit()}
        >
          {isSubmitting ? (
            <CircularProgress isIndeterminate color="black" size="20px" />
          ) : (
            "Save Payment Method"
          )}
        </button>
      </div>
    </div>
  );
}
