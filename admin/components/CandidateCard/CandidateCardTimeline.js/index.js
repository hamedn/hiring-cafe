import { useAuth } from "@/admin/hooks/useAuth";
import useCandidateIntroRequest from "@/admin/hooks/useCandidateIntroRequest";
import useJob from "@/admin/hooks/useJob";
import { capitalizeFirstLetter } from "@/utils/helpers";
import { CircularProgress } from "@chakra-ui/react";
import { ClockIcon, XMarkIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

export default function CandidateCardTimeline({ candidate }) {
  const { introRequest, loading } = useCandidateIntroRequest({
    candidate_id: candidate.id,
  });
  const { job } = useJob({ job_id: introRequest?.job_id });
  const { user } = useAuth();

  if (user && loading) {
    return (
      <div className="px-4 h-56 flex items-center justify-center">
        <CircularProgress isIndeterminate size={"24px"} color="black" />
      </div>
    );
  }

  if (!introRequest) {
    return (
      <div className="flex justify-center items-center">
        <div className="flex flex-col justify-center items-center text-center space-y-4 py-4 px-2 h-56">
          <ClockIcon className="h-6 w-6 flex-none" />
          <span className="text-xs">
            {`The status of this candidate's invitation will be shown here once
            you invite them to apply.`}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col space-y-2 text-xs h-56 overflow-y-auto">
      <div className="flex flex-col space-y-1 px-2">
        <span className="font-bold">Invitation Status</span>
        {job && (
          <span>
            Job invited:{" "}
            <Link
              href={`/admin/edit-job/${job.id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="underline"
            >
              {job.job_info.title}
            </Link>
          </span>
        )}
      </div>
      <div className="flex flex-col divide-y">
        {introRequest.status_timeline
          .map((status, index) => (
            <div key={`${status.status}-${index}`} className="px-2 py-2">
              {status.date.toDate().toLocaleDateString()} -{" "}
              {capitalizeFirstLetter(status.status)}{" "}
              {status.owner_type !== "system" &&
                `by ${capitalizeFirstLetter(status.owner_type)}`}
            </div>
          ))
          .reverse()}
      </div>
    </div>
  );
}
