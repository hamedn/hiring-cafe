import { useRouter } from "next/router";
import Sidebar from "./SideBar";
import RemoteSetup from "../postJob/RemoteSetup";
import InterviewProcess from "../postJob/InterviewProcess";
import JobDescription from "../postJob/JobDescription";
import SetScreen from "../postJob/SetScreen";
import SetBudget from "../postJob/SetBudget";
import ReviewJobPost from "../postJob/ReviewJobPost";
import EditCompanyProfile from "../EditCompanyProfile";
import Link from "next/link";
import useJob from "@/admin/hooks/useJob";
import { ArrowTopRightOnSquareIcon } from "@heroicons/react/24/outline";
import JobPostSettings from "../JobPostSettings";
import BoostJob from "./BoostJob";

export default function EditJob() {
  const router = useRouter();
  const [, jobID, componentRequest] = router.query.slug;
  const { job } = useJob({ job_id: jobID });

  const component = () => {
    if (!componentRequest) return <RemoteSetup job_id={jobID} />;
    switch (componentRequest) {
      case "remote-setup":
        return <RemoteSetup job_id={jobID} />;
      case "job-description":
        return <JobDescription job_id={jobID} />;
      case "interview-process":
        return <InterviewProcess jobID={jobID} />;
      case "settings":
        return <JobPostSettings jobId={jobID} />;
      default:
        return <RemoteSetup job_id={jobID} />;
    }
  };

  return (
    <div className="flex flex-col p-8">
      {false && (
        <div className="flex justify-end">
          <Link
            className="font-medium border px-6 py-1 rounded-lg text-sm border-black hover:bg-gray-100"
            href={`https://hiring.cafe/req/${job.requisition_id}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <div className="flex items-center space-x-2">
              <span>View Job Post</span>
              <ArrowTopRightOnSquareIcon className="h-4 w-4" />
            </div>
          </Link>
        </div>
      )}
      <div className="flex justify-center mt-4">
        <div className="mt-8">
          <Sidebar />
        </div>
        <div className="w-full bg-white p-5">{component()}</div>
      </div>
    </div>
  );
}
