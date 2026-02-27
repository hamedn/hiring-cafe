import { useState } from "react";
import { useBilling } from "@/admin/hooks/useBilling";
import {
  getCurrentYYYYMM,
  convertYYYYMMToString,
} from "@/utils/constants/mmToMonthName";
import { CircularProgress, Tooltip } from "@chakra-ui/react";
import PaymentDashboard from "../payments/PaymentDashboard";
import axios from "axios";
import { useToast } from "@chakra-ui/react";
import Head from "next/head";
import { DocumentCheckIcon } from "@heroicons/react/24/outline";
import { withBoard } from "../withUserCheck";

const addMinimum = 250;

function Billing() {
  const { billingData, allBills, loading, error } = useBilling();
  const [selectedMonth, setSelectedMonth] = useState(getCurrentYYYYMM());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const toast = useToast();
  const [showAllBills, setShowAllBills] = useState(false);
  const [addAmount, setAddAmount] = useState(0);

  if (loading)
    return (
      <>
        <Head>
          <title>Billing - Hiring Cafe</title>
        </Head>
        <div className="flex justify-center mt-8 items-center h-96">
          <CircularProgress isIndeterminate color="gray.600" size={"30px"} />
        </div>
      </>
    );

  if (error)
    return (
      <>
        <Head>
          <title>Billing - Hiring Cafe</title>
        </Head>
        <div className="flex justify-center mt-8 p-8 items-center h-44">
          <span className="text-red-600 font-medium">{error.message}</span>
        </div>
      </>
    );

  const addCredits = async () => {
    if (addAmount < addMinimum) return;
    setIsSubmitting(true);
    try {
      await axios.post(`/api/admin/payment/addCredits`, {
        addAmount: addAmount,
      });
      toast({
        title: "Credits Added",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      setAddAmount(0);
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const billKeys = Object.keys(allBills || {}).reverse();

  const getBillArray = () => {
    if (selectedMonth) {
      return (
        allBills[selectedMonth]?.sort((a, b) => {
          return b.charge_date.toDate() - a.charge_date.toDate();
        }) || []
      );
    } else return [];
  };

  const getFormattedDate = (fsDate) => {
    return fsDate.toDate().toDateString();
  };

  const getPrice = (value) => {
    return (value / 100).toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
    });
  };

  /*const getUnpaidBills = () => {
    let unpaid = [];
    const currentMonth = getCurrentYYYYMM();
    const paid_bills = billingData.paid_bills || {};
    billKeys.forEach((billKey) => {
      if (!paid_bills[billKey] && billKey != currentMonth) unpaid.push(billKey);
    });
    return unpaid;
  }; 
  
  const getMonthBillValue = (monthKey) => {
    const targetMonthBill = allBills[monthKey] || [];

    let totalAmount = 0;
    targetMonthBill.forEach((charge) => {
      totalAmount += Number(`${charge.amount}`);
    });

    return getPrice(totalAmount);
  };

  const payBill = async (monthKey) => {
    setIsSubmitting(true);
    try {
      await axios.post(`/api/admin/payment/payBillByMonth`, {
        monthKey: monthKey,
      });
      toast({
        title: "Bill Paid",
        description: "Bill has been paid successfully",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      console.trace(error);
      toast({
        title: "Error",
        description: "Something went wrong",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const isPayButtonDisabled = () => {
    if (isSubmitting) return true;
    if (!billingData.default_payment) return true;
    if (billingData.default_payment.length < 1) return true;
    return false;
  }; */

  const renderSelectMonth = () => {
    return (
      <select
        onChange={(e) => setSelectedMonth(e.target.value)}
        value={selectedMonth}
        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
      >
        {billKeys.map((billKey) => (
          <option key={billKey} value={billKey}>
            {convertYYYYMMToString(billKey)}
          </option>
        ))}
      </select>
    );
  };

  const renderCredits = () => {
    const credits = billingData?.credits || 0;
    const readableCredits = credits.toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
    });
    const isChargeButtonDisabled = () => {
      if (isSubmitting) return true;
      if (!billingData) return true;
      if (!billingData.default_payment) return true;
      if (isNaN(addAmount)) return true;
      if (addAmount < addMinimum) return true;
      return false;
    };
    return (
      <div className="flex flex-col">
        <span className="text-xl font-medium">Credits</span>
        <div className="text-xs text-red-500">
          {
            "We will be migrating to a per-job payment system. Credits can still be used in the new system but will no longer be required for listing jobs as long as a payment method is on file."
          }
        </div>
        <div className="flex flex-col border rounded-xl divide-y mt-8">
          <div className="flex divide-x items-center font-medium bg-gray-100">
            <span className="p-4 w-1/2 text-center">
              Total Credits Remaining:
            </span>
            <span className="p-4 w-1/2 text-center">{readableCredits}</span>
          </div>
          <div className="flex divide-x items-center font-medium bg-gray-100">
            <span className="p-4 w-1/2 text-center">Add Credits (USD):</span>
            <span className="p-4 w-1/2 text-center">
              <input
                type="number"
                value={addAmount.toString()}
                className={`border border-1 px-2 w-full rounded text-right`}
                onChange={(e) => {
                  let value = Number(e.target.value);
                  const valueStringTokens = value.toString().split(".");
                  if (
                    valueStringTokens.length > 1 &&
                    valueStringTokens[1].length > 2
                  ) {
                    let newValueString = `${
                      valueStringTokens[0]
                    }.${valueStringTokens[1].slice(0, 2)}`;
                    value = Number(newValueString).toFixed(2);
                  }
                  setAddAmount(value);
                }}
              />
            </span>
          </div>
          <div className="flex divide-x items-center font-medium bg-gray-100">
            <span className="p-4 w-1/2 text-center">New Total:</span>
            <span className="p-4 w-1/2 text-center">
              ${Number(addAmount) + Number(billingData.credits)}
            </span>
          </div>
          <div className="flex divide-x items-center font-medium bg-gray-100">
            <span className="p-4 w-1/2 text-center">
              <span className="text-xs text-red-500">
                (Minimum Charge: ${addMinimum}.00)
              </span>
            </span>
            <span className="p-4 w-1/2 text-center">
              <button
                className={`${
                  isChargeButtonDisabled()
                    ? "bg-gray-200"
                    : "bg-blue-500 text-white"
                } px-2 py-1 mx-1 semibold rounded`}
                disabled={isChargeButtonDisabled()}
                onClick={() => addCredits()}
              >
                Pay
              </button>
            </span>
          </div>
        </div>
      </div>
    );
  };

  const renderBills = () => {
    return (
      <div>
        <div className="flex flex-col">
          <span className="text-xl font-medium">Billing History</span>
          <div className="mt-4">{renderSelectMonth()}</div>
          <div className="flex flex-col border rounded-xl divide-y mt-4">
            <div className="flex divide-x items-center font-medium bg-gray-100">
              <span className="p-4 w-1/3 text-center">Date</span>
              <div className="p-4 w-1/3 text-center">Detail</div>
              <span className="p-4 w-1/3 text-center">{"Amount"}</span>
            </div>
            <div className="flex flex-col max-h-96 overflow-y-auto">
              {getBillArray()
                .slice(0, showAllBills ? getBillArray().length : 5)
                .map((bill, index) => (
                  <div key={index} className="flex divide-x items-center">
                    <span className="p-1 w-1/3 text-center">
                      {getFormattedDate(bill.charge_date)}
                    </span>
                    <Tooltip title={bill.charge_details}>
                      <span className="p-1 w-1/3 text-center">
                        {bill.charge_name}
                      </span>
                    </Tooltip>
                    <span className="p-1 w-1/3 text-center">
                      {getPrice(bill.amount)}
                    </span>
                  </div>
                ))}
            </div>
            {!showAllBills && (
              <button
                className="py-2 font-medium underline"
                onClick={() => {
                  setShowAllBills(true);
                }}
              >
                Show all bills
              </button>
            )}
          </div>
        </div>
      </div>
    );
  };

  /* const renderUnpaidBills = () => {
    const unpaidBillKeys = getUnpaidBills();
    if (unpaidBillKeys.length === 0) return null;
    return (
      <div className="flex flex-col">
        <span className="text-xl font-medium">Unpaid Bills</span>
        <div className="flex flex-col border rounded-xl divide-y mt-8">
          <div className="flex divide-x items-center font-medium bg-gray-100">
            <span className="p-4 w-1/3 text-center">Date</span>
            <div className="p-4 w-1/3 text-center">Amount</div>
            <span className="p-4 w-1/3 text-center">Action</span>
          </div>
          {unpaidBillKeys.map((billKey, index) => (
            <div key={index} className="flex divide-x items-center">
              <span className="p-1 w-1/3 text-center">
                {convertYYYYMMToString(billKey)}
              </span>
              <div className="p-4 w-1/3 text-center">
                {getMonthBillValue(billKey)}
              </div>
              <div className="p-4 w-1/3 text-center">
                <button
                  className={`${!isPayButtonDisabled()
                    ? "font-medium underline"
                    : "text-gray-400 cursor-not-allowed"
                    } px-2 rounded`}
                  disabled={isPayButtonDisabled()}
                  onClick={() => payBill(billKey)}
                >
                  Pay Bill
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }; */

  const renderNoBills = () => {
    return (
      <>
        <div className="flex flex-col items-center text-center border p-8 w-full rounded-2xl space-y-8">
          <DocumentCheckIcon className="h-16 w-16 text-gray-700" />
          <span className="font-medium mt-4">
            {`You do not have any billing data yet.`}
          </span>
        </div>
      </>
    );
  };

  return (
    <>
      <Head>
        <title>Billing - Hiring Cafe</title>
      </Head>
      <div className="flex justify-center mt-16 mb-32">
        <div className="flex flex-col flex-auto max-w-3xl space-y-16">
          <PaymentDashboard />
          {/* {renderCredits()} */}
          {billKeys.length ? renderBills() : renderNoBills()}
        </div>
      </div>
    </>
  );
}

export default withBoard(Billing);
