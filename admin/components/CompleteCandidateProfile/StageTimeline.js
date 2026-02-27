import useApplicant from "@/admin/hooks/useApplicant";
import useJob from "@/admin/hooks/useJob";
import { ArrowRightIcon } from "@heroicons/react/20/solid";
import { useEffect, useState } from "react";

export default function StageTimeline({ applicantId }) {
  const { applicant, error: applicantError } = useApplicant({ applicantId });
  const { job, error: errorJob } = useJob({ job_id: applicant?.job_applied });
  const [stages, setStages] = useState(null);

  useEffect(() => {
    if (!job) return;
    setStages(["Initial Video Screen", ...(job.interview_process || [])]);
  }, [job]);

  if (!applicantId) return null;

  if (!stages) {
    return (
      <div className="flex items-center space-x-6">
        {["1", "2", "3", "4", "5"].map((i) => (
          <div
            key={i}
            className="flex flex-col justify-center px-4 h-12 w-40 border-2 rounded-lg text-xs border-gray-300 bg-gray-200 animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (applicantError || errorJob) {
    return (
      <div className="flex flex-col justify-center px-4 h-12 w-fit border-2 rounded-lg text-xs border-red-300">
        <span className="text-red-600 font-medium">
          {applicantError?.message ||
            errorJob?.message ||
            "Error loading applicant"}
        </span>
      </div>
    );
  }

  return (
    <ol className="flex items-center overflow-x-auto">
      {stages.map((stage, index) => (
        <li key={stage}>
          <div className="flex items-center">
            <div
              className={`z-10 flex flex-col justify-center px-4 h-12 border-2 max-w-xs rounded-lg text-xs ${
                stage === applicant.stage
                  ? "border-black text-black font-bold"
                  : "border-gray-300 text-gray-500"
              }`}
            >
              <span className="flex-none block truncate">
                {stage === "Initial Video Screen" ? "Screen" : stage}
              </span>
            </div>
            {index !== stages.length - 1 && (
              <ArrowRightIcon className="flex-none w-8 h-8 text-gray-400 mx-2" />
            )}
          </div>
        </li>
      ))}
    </ol>
  );
}
