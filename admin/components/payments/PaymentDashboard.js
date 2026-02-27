import useSWRImmutable from "swr/immutable";
import fetcher from "@/utils/fetcher";
import axios from "axios";
import { useEffect, useState } from "react";
import {
  Button,
  CircularProgress,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import dynamic from "next/dynamic";
import { CheckCircleIcon, CreditCardIcon } from "@heroicons/react/24/outline";
import CardIcons from "./cardIcons/CardIcons";
import useBoard from "@/admin/hooks/useBoard";
import { useAuth } from "@/admin/hooks/useAuth";
import Link from "next/link";

const AddPaymentModal = dynamic(
  () => import("@/admin/components/payments/AddPaymentPopupModal"),
  {
    loading: () => "loading...",
  }
);

function PaymentDashboard() {
  const toast = useToast();
  const {
    isOpen: isWarningDialogOpen,
    onOpen: onWarningDialogOpen,
    onClose: onWarningDialogClose,
  } = useDisclosure();
  const {
    data,
    mutate: triggerPaymentMethods,
    error: paymentMethodsError,
  } = useSWRImmutable("/api/admin/payment/getPaymentMethods", fetcher);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [defaultMethod, setDefaultMethod] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAddPaymentModalOpen, setIsAddPaymentModalOpen] = useState(false);
  const [paymentMethodToDelete, setPaymentMethodToDelete] = useState(null);
  const { userData } = useAuth();
  const { board } = useBoard({
    board_id: userData?.board,
  });

  const isLoading = !data && !paymentMethodsError;

  useEffect(() => {
    if (data && data.paymentMethods && data.default_payment) {
      setPaymentMethods(data.paymentMethods.data);
      setDefaultMethod(data.default_payment);
    }
  }, [data]);

  const deletePaymentMethod = async (methodId) => {
    setIsSubmitting(true);
    const dataToSubmit = {
      to_delete: methodId,
    };
    // if this is the default, we need to specify a new default.
    // if this is the only payment method, we will set it as an empty string.
    if (methodId === defaultMethod) {
      let new_default = "";
      // _.first equivalent.
      for (let i = 0; i < paymentMethods.length; i++) {
        if (methodId !== paymentMethods[i].id) {
          new_default = paymentMethods[i].id;
          break;
        }
      }
      dataToSubmit.new_default = new_default;
    }
    try {
      await axios.post(`/api/admin/payment/updatePaymentMethod`, dataToSubmit);
      toast({
        title: "Successfully Updated.",
        status: "success",
        isClosable: true,
        duration: 9000,
      });
      await triggerPaymentMethods();
    } catch (error) {
      toast({
        title: "Unable to update.",
        description: error.message,
        status: "error",
        isClosable: true,
        duration: 9000,
      });
    }
    setIsSubmitting(false);
  };

  const setMethodAsDefault = async (methodId) => {
    setIsSubmitting(true);
    const dataToSubmit = {
      new_default: methodId,
    };
    try {
      await axios.post(`/api/admin/payment/updatePaymentMethod`, dataToSubmit);
      toast({
        title: "Successfully Updated.",
        status: "success",
        isClosable: true,
        duration: 9000,
      });
      await triggerPaymentMethods();
    } catch (error) {
      toast({
        title: "Unable to update.",
        description: error.message,
        status: "error",
        isClosable: true,
        duration: 9000,
      });
    }
    setIsSubmitting(false);
  };

  const getNumString = (number) => {
    return ("0" + number).slice(-2);
  };

  if (isLoading)
    return (
      <div className="flex justify-center">
        <CircularProgress isIndeterminate color="gray.600" size={"30px"} />
      </div>
    );

  if (paymentMethodsError || !paymentMethods) {
    return (
      <span className="flex justify-center mt-8 text-red-600 font-medium">
        {paymentMethodsError?.message || "Unable to load payment methods."}
      </span>
    );
  }

  return (
    <div className="flex flex-col">
      {board?.membership ? (
        <div className="flex flex-col mb-8">
          <span className="">
            Your Plan:{" "}
            <Link
              href={"/employers/pricing"}
              target="_blank"
              rel="noreferrer"
              className="font-bold underline"
            >
              EMPLOYER {board.membership.toUpperCase()}
            </Link>
          </span>
        </div>
      ) : null}
      <div className="flex justify-between items-center space-x-8">
        <span className="text-xl font-bold">Payment Methods</span>
        <button
          className="border border-black text-black px-6 py-1.5 rounded hover:bg-gray-100"
          onClick={() => setIsAddPaymentModalOpen(true)}
        >
          Add Payment Method
        </button>
      </div>
      {data?.paymentMethods?.data?.length > 0 ? (
        <div className="flex flex-col mt-4 border divide-y rounded">
          {data.paymentMethods.data.map((method, index) => (
            <div
              key={index}
              className={`${
                method.id === defaultMethod
                  ? "text-black font-medium"
                  : "text-gray-500"
              } py-4 w-full flex justify-between items-center`}
            >
              <div className="flex items-center space-x-2 w-1/8 mx-1 px-1">
                <CardIcons brand={method.card.brand} />
              </div>
              <div className="flex items-center space-x-2 w-1/3 mx-1 px-1">
                {method.id === defaultMethod && (
                  <CheckCircleIcon className="h-6 w-6 text-black" />
                )}
                <span className="">Card ending in {method.card.last4}</span>
              </div>
              <span className="w-1/6 mx-1 px-1">
                Exp: {getNumString(method.card.exp_month)}/
                {getNumString(method.card.exp_year)}
              </span>
              {method.id === defaultMethod ? (
                <span className="w-1/6 text-center mx-3">Current</span>
              ) : (
                <button
                  className={`w-1/6 ${
                    isSubmitting
                      ? "bg-gray-200"
                      : "text-black rounded border border-black"
                  } rounded mx-3`}
                  onClick={() => setMethodAsDefault(method.id)}
                  disabled={isSubmitting}
                >
                  Select
                </button>
              )}
              {index !== 0 && (
                <button
                  className={`w-1/6 ${
                    isSubmitting ? "bg-gray-200" : "bg-red-500 text-white"
                  } rounded mx-3`}
                  onClick={() => {
                    setPaymentMethodToDelete(method.id);
                    onWarningDialogOpen();
                  }}
                  disabled={isSubmitting}
                >
                  Remove
                </button>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="flex justify-center mt-8 bg-gray-200 font-medium h-32 items-center rounded-xl">
          <div className="flex flex-col space-y-2">
            <CreditCardIcon className="h-8 w-8 mx-auto" />
            <span> You have no payment methods saved.</span>
          </div>
        </div>
      )}
      {isAddPaymentModalOpen && (
        <AddPaymentModal
          onModalClose={() => {
            setIsAddPaymentModalOpen(false);
          }}
        />
      )}
      <Modal isOpen={isWarningDialogOpen} onClose={onWarningDialogClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Are you sure?</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {paymentMethods &&
              (paymentMethods.length > 1 ? (
                <span>
                  Are you sure you want to remove this payment method?
                </span>
              ) : (
                <span>
                  Your job will be unlisted. You will need to add a new payment
                  method in order to post your job again.
                </span>
              ))}
          </ModalBody>
          <ModalFooter>
            <Button
              colorScheme="blue"
              mr={3}
              onClick={() => {
                setPaymentMethodToDelete(null);
                onWarningDialogClose();
              }}
            >
              Nevermind
            </Button>
            <Button
              isLoading={isSubmitting}
              onClick={async () => {
                await deletePaymentMethod(paymentMethodToDelete);
                onWarningDialogClose();
              }}
              colorScheme="red"
            >
              Yes, I Confirm
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}

export default PaymentDashboard;
