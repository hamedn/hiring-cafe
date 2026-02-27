import React, { useEffect, useState } from "react";
import { doc, updateDoc } from "@firebase/firestore";
import { clientFirestore } from "@/admin/lib/firebaseClient";
import {
  CircularProgress,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@chakra-ui/react";
import AddPaymentComponent from "../payments/AddPaymentComponent";
import { useBilling } from "@/admin/hooks/useBilling";
import useJobBudget from "@/admin/hooks/useJobBudget";
import Head from "next/head";

const SetBudget = ({ jobID }) => {
  const toast = useToast();
  const {
    billingData,
    loading: loadingBilling,
    error: billingError,
  } = useBilling();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { jobBudget, loading, error } = useJobBudget({ jobID });
  const [budget, setBudget] = useState("");
  const [isUpdatingBudget, setIsUpdatingBudget] = useState(false);

  const defaultBudget = "3654";

  useEffect(() => {
    if (jobBudget?.desired_budget && jobBudget.desired_budget > 0) {
      if (!budget) {
        setBudget(jobBudget.desired_budget);
      }
    }
  }, [budget, jobBudget]);

  const handleConfirmBudget = async () => {
    if (!budgetNeedsToUpdate()) {
      return;
    }
    const docRef = doc(clientFirestore, "job_budgets", jobID);
    setIsUpdatingBudget(true);
    updateDoc(docRef, {
      desired_budget: Number(getBudget()),
    })
      .catch((error) => {
        toast({
          title: "Error updating budget.",
          description: error.message,
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      })
      .then(() => {
        toast({
          title: "Budget updated.",
          description: "Your budget has been updated.",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
      })
      .finally(() => {
        setIsUpdatingBudget(false);
      });
  };

  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  });

  const getBudget = () => {
    return budget || jobBudget.desired_budget || defaultBudget;
  };

  const budgetNeedsToUpdate = () => {
    if (isUpdatingBudget) return false;
    if (jobBudget.desired_budget !== getBudget()) return true;
    return false;
  };

  const numApplicantsForBudget = () =>
    Math.floor(getBudget() / jobBudget.cost_per_introduction);

  return (
    <>
      <Head>
        <title>Job Budget - Hiring cafe</title>
      </Head>
      <div className="flex justify-center flex-auto">
        <div className="flex flex-col text-lg max-w-xl">
          <div className="flex flex-col text-center">
            <span className="text-5xl font-medium text-start">{`Set Your Budget`}</span>
          </div>
          {billingError ? (
            <div className="mt-8 text-red-600 font-bold">
              Error fetching billing data: {billingError.message}
            </div>
          ) : (
            !loadingBilling &&
            (!billingData || !billingData.default_payment) && (
              <div className="flex flex-col mt-16 w-full space-y-2">
                <span className="text-gray-700 font-bold ml-2">
                  Add payment method
                </span>
                <AddPaymentComponent />
              </div>
            )
          )}
          {loading ? (
            <div className="mt-16">
              <CircularProgress isIndeterminate size="24px" color="black" />
            </div>
          ) : error ? (
            <div>
              <span className="text-2xl font-medium text-red-500 text-center mt-16 mb-4 block w-full px-4 py-2 bg-red-100 rounded-md border border-red-200">
                {error.message}
              </span>
            </div>
          ) : (
            <div className="flex flex-col mt-16">
              <div className="flex flex-col">
                <label
                  className="block text-gray-700 font-bold mb-2"
                  htmlFor="budget"
                >
                  {`Receive`}{" "}
                  <span
                    className="font-bold text-green-600
                "
                  >
                    {numApplicantsForBudget()} screened
                  </span>{" "}
                  applicants
                </label>
                <input
                  className="slider accent-black h-1 max-w-xs rounded-full focus:outline-none focus:shadow-outline mt-8"
                  id="budget"
                  type="range"
                  min="1890"
                  max="12600"
                  step={jobBudget.cost_per_introduction}
                  value={getBudget()}
                  onChange={(e) => {
                    setBudget(e.target.value);
                  }}
                />
                <span className="text-gray-700 text-sm mt-8">
                  Your desired budget:{" "}
                  <span className="font-bold">
                    {formatter.format(getBudget()).replace(/\D00(?=\D*$)/, "")}{" "}
                    USD
                  </span>
                </span>
              </div>
              <p className="text-gray-600 text-sm mt-8">
                By setting your budget, you agree to our payment terms.
              </p>
              <div className="flex items-center space-x-8 mt-4">
                <button
                  className={`bg-gray-900 hover:bg-black text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-44 ${!budgetNeedsToUpdate() && "opacity-50 cursor-not-allowed"
                    }`}
                  type="button"
                  onClick={handleConfirmBudget}
                  disabled={!budgetNeedsToUpdate()}
                >
                  {isUpdatingBudget ? (
                    <div>
                      <CircularProgress
                        isIndeterminate
                        size="24px"
                        color="white"
                      />
                    </div>
                  ) : (
                    "Confirm Budget"
                  )}
                </button>
                <button
                  onClick={onOpen}
                  className="text-base focus:outline-none focus:shadow-outline underline hover:text-gray-700 font-bold"
                >
                  Understand our charging process
                </button>
              </div>
              <div className="flex flex-col mt-8">
                <span className="text-gray-600 mt-8 text-base font-bold">
                  How payments work
                </span>
                <p className="text-gray-600 text-sm mt-4">
                  {`The budget amount you set represents the total funds you’re willing to commit towards accessing applicants who complete the video screening process.`}
                </p>
                <p className="text-gray-600 text-sm mt-4">
                  {`If you receive fewer applicants than your set budget allows, you will only be charged for the number of applicants who complete the video screening process.`}
                </p>
                <span className="text-gray-600 text-base mt-8 font-bold">
                  Protection against unsuitable applicants
                </span>
                <p className="text-gray-600 text-sm mt-4">
                  {`If you receive applications from unsuitable candidates, such as a Digital Marketing Special applying for a Customer Success position, or if the application is identified as spam - originating from a consulting agency, a recruitment firm, or elsewhere - we will issue a full refund for any costs incurred due to these applications.`}
                </p>
              </div>
            </div>
          )}
        </div>
        <Modal isOpen={isOpen} size={"3xl"} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Understand Our Charging Process</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              {jobBudget && (
                <div className="flex flex-col">
                  <div className="flex flex-col">
                    <span className="mt-4">
                      {`We aim to provide you with the best candidates for your job posting. As part of our service, we request applicants to submit video screenings after their initial applications. For each completed video screening, a charge of ${formatter
                        .format(jobBudget.cost_per_introduction)
                        .replace(
                          /\D00(?=\D*$)/,
                          ""
                        )} will be made against your set budget.`}
                    </span>
                    <span className="mt-4">
                      Please note that charges are incurred only when an
                      applicant submits a completed video screening.
                    </span>
                  </div>
                  <div className="flex flex-col mt-4">
                    <span className="text-xl font-bold">
                      Budget Utilization
                    </span>
                    <span className="mt-4">
                      {`Your set budget allows you to receive and review up to ${numApplicantsForBudget()} screened applicants. Please be aware that the number of applications and pending video screenings can fluctuate.`}
                    </span>
                  </div>
                  <div className="flex flex-col mt-4">
                    <span className="text-xl font-bold">
                      Please Note: Potential Over-Budget Situations
                    </span>
                    <span className="mt-4">
                      {`In scenarios where multiple applicants are in the process of completing their video screenings, and your remaining budget is nearing exhaustion, there may be cases where the final cost slightly exceeds your set budget. This is due to the fact that these charges are applied only upon completion of the video screening by the applicant.`}
                    </span>
                    <span className="mt-4">
                      {`We're committed to keeping you updated on your budget status and
                you'll receive notifications as your budget nears its limit.`}
                    </span>
                  </div>
                </div>
              )}
            </ModalBody>
            <ModalFooter>
              <button
                onClick={onClose}
                className="bg-black hover:bg-gray-900 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-32"
              >
                Close
              </button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </div>
    </>
  );
};

export default SetBudget;
