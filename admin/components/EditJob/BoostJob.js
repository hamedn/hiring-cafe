import { useEffect, useState } from "react";
import axios from "axios";

import "quill/dist/quill.snow.css";
import useJob from "@/admin/hooks/useJob";
import useJobBoost from "@/admin/hooks/useJobBoost";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import Head from "next/head";
import { useBilling } from "@/admin/hooks/useBilling";
import Link from "next/link";
import { boostPrice } from "@/utils/constants";
import { isJobBoosted } from "@/admin/utils/isJobBoosted";

const BoostJob = ({ jobID }) => {
  const [submitting, setSubmitting] = useState(false);
  const [boosted, setBoosted] = useState(false);
  const { job, loading, error } = useJob({ job_id: jobID });
  const {
    jobBoost,
    loading: loadingBoost,
    error: errorBoost,
  } = useJobBoost({ job_id: jobID });
  const { billingData, loading: loadingBilling } = useBilling();

  if (loading || loadingBoost || loadingBilling) return null;

  if (error || errorBoost) {
    return (
      <div className="flex items-center space-x-2 text-red-600">
        <ExclamationTriangleIcon className="flex-none h-5 w-5" />
        <span>Error loading job: {error.message || errorBoost.message}</span>
      </div>
    );
  }

  const boostJob = async () => {
    setSubmitting(true);
    try {
      await axios.post(`/api/admin/payment/boostJob`, { job_id: jobID });
      setBoosted(true);
    } catch (error) {}
    setSubmitting(false);
  };

  const renderBoostSection = () => {
    if (!["listed", "pending"].includes(job.status)) {
      return (
        <Link href={`/admin/edit-job/${jobID}/settings`} className="p-2 m-2 text-red-600 underline font-bold">
          {"Please list your job first!"}
        </Link>
      );
    }

    if (!billingData?.default_payment && !billingData?.credits < 300) {
      return (
        <div>
          <div className="p-2 m-2">
            {"You must add your payment information to use this feature. "}
          </div>
          <Link
            className="text-blue-500 underline p-2 m-2"
            href={"/admin/billing"}
          >
            Add Payment
          </Link>
        </div>
      );
    }

    if (boosted) {
      return (
        <div>
          <div className="p-2 m-2">
            {"Your job has been boosted! This will take effect immediately."}
          </div>
        </div>
      );
    }
    // if boost is active
    if (isJobBoosted(jobBoost)) {
      return (
        <div>
          <div className="p-2 m-2">
            {
              "Your job is currently boosted. You can boost it again once the current boost has expired."
            }
          </div>
        </div>
      );
    } else {
      return (
        <div>
          <div className="text-lg font-semibold p-2 m-2">
            {"Boost your job!"}
          </div>
          <div className="p-2 m-2">{`It costs $${boostPrice} to boost your job.`}</div>
          <div className="p-2 m-2">
            {
              "If you have enough credits, you can use credits on your account to boost a job."
            }
          </div>
          <div className="p-2 m-2">
            {
              "Otherwise, this will be charged to your account's default payment information. You can edit it on the payment dashboard."
            }
          </div>
          <Link
            className="text-blue-500 underline p-2 m-2"
            href={"/admin/billing"}
          >
            Edit Payment Information
          </Link>
          <div className="p-2 m-2">
            <button
              disabled={submitting}
              className={`font-semibold p-2 ${
                submitting ? "bg-gray-200" : "bg-blue-500 text-white"
              } rounded`}
              onClick={() => boostJob()}
            >
              Boost Now
            </button>
          </div>
        </div>
      );
    }
  };

  return (
    <>
      <Head>
        <title>Espresso - Hiringcafe</title>
      </Head>
      <div className="flex flex-auto flex-col items-center text-lg p-5 space-y-6">
        <div className="flex flex-col items-center pb-4">
          <span className="text-4xl font-medium">{`Purchase an Espresso Shot`}</span>
          <span className="text-xl mt-4 font-light">
            Get 10x More Visibility on HiringCafe
          </span>
          <span className="text-sm max-w-md mt-4 border border-black p-4 rounded">{`When you purchase an Espresso Shot, your job will receive up to 10x more visibility on HiringCafe. Additionally, it will be promoted by influencers on LinkedIn and Twitter, and shared across several Slack communities. Espresso Shots are a one-time purchase, but you can buy them as often as you like.`}</span>
        </div>
        {renderBoostSection()}
      </div>
    </>
  );
};

export default BoostJob;
