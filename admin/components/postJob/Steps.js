import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import axios from "axios";
import StepOne from "./StepOne";
import StepTwo from "./StepTwo";
import StepThree from "./StepThree";
import StepBar from "./StepBar";
import PostCelebration from "./PostCelebration";
import useCheckCurrentStepCompletion from "./useCheckCurrentStepCompletion";
import useJob from "@/admin/hooks/useJob";
import { useBilling } from "@/admin/hooks/useBilling";
import {
  isBoardBillingConfigured,
  isJobFullyConfigured,
} from "@/admin/utils/validators";
import { CircularProgress } from "@chakra-ui/react";

const Steps = () => {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [subStep, setSubStep] = useState(1);
  const [jobID, stepParam] = router.query.slug;
  const [isComplete, setIsComplete] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const { isCurrentStepComplete } = useCheckCurrentStepCompletion({
    step,
    subStep,
    jobID,
  });
  const { job, loading: loadingJob } = useJob({ job_id: jobID });
  const { billingData, loading: loadingBilling } = useBilling();

  const fadeClasses = isAnimating
    ? "transition-all duration-500 opacity-0 translate-y-4"
    : "transition-all duration-500 opacity-100 translate-y-0";

  useEffect(() => {
    const stepEnd = async () => {
      // if (isJobFullyConfigured(job)) {
      //   const newStatus = isBoardBillingConfigured(billingData)
      //     ? "listed"
      //     : "unlisted";
      //   await axios.patch("/api/admin/job", {
      //     job_id: jobID,
      //     patch_data: { status: newStatus },
      //   });
      // }
      // return;
    };

    if (!job) return;

    switch (stepParam) {
      case "job-description":
        setStep(1);
        break;
      case "screen":
        setStep(2);
        break;
      case "review-post":
        setStep(3);
        break;
      case "post-celebration":
        setIsComplete(true);
        stepEnd();
        return;
      default:
        router.push(`/admin/post-a-job/${jobID}/job-description`);
        return;
    }
    setIsComplete(false);
  }, [billingData, job, jobID, router, stepParam]);

  const renderStep = () => {
    const component = () => {
      switch (step) {
        case 1:
          return (
            <div className="flex flex-col">
              <span className="text-lg font-medium flex justify-center mb-8">
                Set up your first job.
              </span>
              <StepOne subStep={subStep} job_id={jobID} />
            </div>
          );
        case 2:
          return <StepTwo subStep={subStep} jobID={jobID} />;
        case 3:
          return <StepThree subStep={subStep} jobID={jobID} />;
        default:
          return <StepOne subStep={subStep} job_id={jobID} />;
      }
    };
    return <div className="container mx-auto p-16">{component()}</div>;
  };

  const maxSubSteps = (step) => {
    switch (step) {
      case 1:
        return 2;
      case 2:
        return 1;
      case 3:
        return 1;
      default:
        return 0;
    }
  };

  const handleNext = () => {
    setIsAnimating(true);
    setTimeout(() => {
      if (subStep < maxSubSteps(step)) {
        setSubStep(subStep + 1);
      } else if (step < 2) {
        const nextStep = step + 1;
        const nextStepParam = getStepParam(nextStep);
        const newPath = updatePath(router.asPath, nextStepParam);
        setSubStep(1);
        router.push(newPath);
      } else {
        const newPath = updatePath(router.asPath, "post-celebration");
        setSubStep(1);
        router.push(newPath);
      }
      setIsAnimating(false);
    }, 500);
  };

  const handlePrev = () => {
    setIsAnimating(true);
    setTimeout(() => {
      if (subStep > 1) {
        setSubStep(subStep - 1);
      } else if (step > 1) {
        const prevStep = step - 1;
        const prevStepParam = getStepParam(prevStep);
        const newPath = updatePath(router.asPath, prevStepParam);
        router.replace(newPath);
        setSubStep(maxSubSteps(prevStep));
      }
      setIsAnimating(false);
    }, 500);
  };

  const getStepParam = (step) => {
    switch (step) {
      case 1:
        return "job-description";
      case 2:
        return "screen";
      case 3:
        return "review-post";
      default:
        return "job-description";
    }
  };

  const updatePath = (path, newSegment) => {
    const segments = path.split("/");
    const lastSegment = segments[segments.length - 1];

    if (
      lastSegment === "job-description" ||
      lastSegment === "screen" ||
      lastSegment === "review-post" ||
      lastSegment === "post-celebration"
    ) {
      segments[segments.length - 1] = newSegment;
    } else {
      segments.push(newSegment);
    }

    return segments.join("/");
  };

  if (loadingJob || loadingBilling)
    return (
      <div className="flex justify-center my-16">
        <CircularProgress isIndeterminate color="gray.900" size={"24px"} />
      </div>
    );

  return !isComplete ? (
    <div className="relative min-h-screen pb-20">
      <div className={`mb-24 ${fadeClasses}`}>{renderStep()}</div>
      <div className="fixed flex flex-col justify-between bottom-0 w-full px-2 pb-6 bg-white h-24 overflow-y-auto">
        <StepBar step={step} subStep={subStep} maxSubStep={maxSubSteps(step)} />
        <div className="save-div flex justify-between mx-10">
          <button
            className={`${
              step === 1 && subStep === 1 ? "invisible" : ""
            } underline text-lg font-medium`}
            onClick={handlePrev}
          >
            Back
          </button>
          <div className="flex items-center space-x-8">
            <button
              className="font-medium underline"
              onClick={() => {
                router.push(`/admin`);
              }}
            >
              Save and exit
            </button>
            <button
              className={`
              ${
                isCurrentStepComplete
                  ? "bg-gray-900 hover:bg-black"
                  : "bg-gray-300 cursor-not-allowed"
              } text-white px-8 py-2 outline-none rounded-lg text-lg font-medium
            `}
              onClick={handleNext}
              disabled={!isCurrentStepComplete}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  ) : (
    <PostCelebration jobID={jobID} />
  );
};

export default Steps;
