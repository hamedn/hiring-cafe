import { useBilling } from "@/admin/hooks/useBilling";
import useJob from "@/admin/hooks/useJob";
import useJobBudget from "@/admin/hooks/useJobBudget";
import { useEffect, useState } from "react";

const useCheckCurrentStepCompletion = ({ step, subStep, jobID }) => {
  const { job } = useJob({ job_id: jobID });
  const [isCurrentStepComplete, setIsCurrentStepComplete] = useState(false);
  const { jobBudget } = useJobBudget({ jobID });
  const { billingData } = useBilling();

  useEffect(() => {
    if (job === null) {
      setIsCurrentStepComplete(false);
      return;
    }

    const checkIfCurrentStepIsComplete = async () => {
      switch (step) {
        case 1:
          switch (subStep) {
            case 1:
              setIsCurrentStepComplete(
                ((job.job_info.workplace_address_type === "anywhere" || job.job_info.workplace_address?.length > 0) && job.job_info.workplace_location?.length > 0)
              );
              return;
            case 2:
              setIsCurrentStepComplete(
                job.job_info?.title?.length > 0 &&
                job.job_info?.job_description?.length > 0 &&
                job.job_info?.salary?.length > 0
              );
              return;
            default:
              setIsCurrentStepComplete(false);
              return;
          }
        case 2:
          switch (subStep) {
            case 1:
              setIsCurrentStepComplete(job.initial_screen_id !== null);
              return;
            case 2:
              setIsCurrentStepComplete(
                job.interview_process !== null &&
                job.interview_process.length > 0
              );
              return;
            default:
              setIsCurrentStepComplete(false);
              return;
          }
        case 3:
          switch (subStep) {
            case 1:
              if (!jobBudget?.desired_budget) {
                setIsCurrentStepComplete(false);
                return;
              }
              /* if (!billingData?.default_payment) {
                setIsCurrentStepComplete(false);
                return;
              } */
              setIsCurrentStepComplete(true);
              return;
            case 2:
              /* setIsCurrentStepComplete(
                job.job_info?.quick_responsibilities?.length > 0 &&
                job.job_info?.quick_requirements?.length > 0
              ); */
              setIsCurrentStepComplete(true);
              return;
            default:
              setIsCurrentStepComplete(false);
              return;
          }
        default:
          setIsCurrentStepComplete(false);
          return;
      }
    };
    checkIfCurrentStepIsComplete();
  }, [billingData, job, jobBudget, step, subStep]);

  return { isCurrentStepComplete };
};

export default useCheckCurrentStepCompletion;
