import JobSummaryCard from "./JobSummaryCard";
import {
  PlusIcon,
  EllipsisHorizontalIcon,
} from "@heroicons/react/24/outline";
import axios from "axios";
import { useToast, Tooltip } from "@chakra-ui/react";
import { useState } from "react";
import { useRouter } from "next/router";
import { freeJobsLimit } from "@/utils/constants";

export default function JobsGrid({ jobs, subscription }) {
  const router = useRouter();
  const toast = useToast();
  const [submitting, setSubmitting] = useState(false);

  const createJob = async () => {
    if (submitting) return;
    setSubmitting(true);
    try {
      const res = await axios.post("/api/admin/job");
      toast({
        title: "Job Created.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      router.push(`/admin/post-a-job/${res.data.job_id}`);
    } catch (error) {
      toast({
        title: "Failed to Create Job. Please contact support.",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
    setSubmitting(false);
  };

  const allowCreateJobs = () => {
    if (jobs.length <= freeJobsLimit) return true;
    if (subscription.active && subscription.level >= 2) return true;
    return false;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4 gap-x-8 gap-y-16">
      {jobs.map((job) => (
        <div key={job.id} className="m-2 border border-1 rounded p-4">
          <div className="flex justify-center">
            <JobSummaryCard
              key={job.id}
              job={job}
            />
          </div>
        </div>
      ))}
      <div className="flex flex-items items-center m-2 border border-1 rounded p-4 justify-center">
        {allowCreateJobs() ?
          <div
            onClick={() => createJob()}
            className={`m-2 p-4 w-3/4 ${!submitting && "cursor-pointer"}`}
          >
            {submitting ? <EllipsisHorizontalIcon /> : <PlusIcon />}
          </div>
          :
          <div
            className={`m-2 p-1 w-3/4`}
          >
            <div className="text-sm">
              {`You have reached the limit for free jobs. Contact Support`}
              {false /*TODO: ADD a page for subscriptions*/ && ` or subscribe`}
              {` to increase this limit.`}
              {` You can contact hi@hiring.cafe if you have not contacted us previously.`}
            </div>
          </div>
        }
      </div>
    </div>
  );
}
