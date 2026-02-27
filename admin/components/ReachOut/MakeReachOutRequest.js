import { useState } from "react";
import ReachOutOptions from "./ReachOutOptions";
import useJobs from "@/admin/hooks/useJobs";
import Link from "next/link";
import { BoltIcon, ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import axios from "axios";
import { CircularProgress, useToast } from "@chakra-ui/react";
import { useAuth } from "@/admin/hooks/useAuth";

export default function MakeReachOutRequest({ candidate, onFinish }) {
  const toast = useToast();

  const { jobs, loading } = useJobs();
  const { user, loadingUser } = useAuth();

  const [selectedOption, setSelectedOption] = useState("standard");
  const [selectedJob, setSelectedJob] = useState("");
  const [message, setMessage] = useState();
  const [sendingInvite, setSendingInvite] = useState(false);

  const onSendInvitation = async () => {
    setSendingInvite(true);
    try {
      await axios.post("/api/admin/talent_network/invite_candidate", {
        candidate_id: candidate.id,
        job_id: selectedJob,
        invite_type: selectedOption,
        message: message,
      });
      toast({
        title: "Invitation sent",
        description:
          "You've successfully sent an invitation to this candidate.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      onFinish();
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description:
          error?.response?.data?.error ||
          error?.response?.data ||
          "Something went wrong. Please contact support.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setSendingInvite(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col">
      <ReachOutOptions
        onReachoutOptionSelect={(selectedOption) => {
          setSelectedOption(selectedOption);
        }}
      />
      <div className="flex flex-col space-y-8 mt-4">
        {selectedOption !== "standard" && (
          <div className="flex flex-col space-y-1 items-center">
            <span className="font-light text-sm">Your Message</span>
            <textarea
              className="border rounded resize-none text-sm h-20 w-full md:w-2/3 focus:outline-none px-2 py-1"
              placeholder={`We're really impressed with your background and are interested in connecting with you to learn more about your experience.`}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </div>
        )}
        <div className="flex flex-col items-center space-y-2 mt-4">
          {loading || loadingUser ? (
            <CircularProgress isIndeterminate size="24px" color="black" />
          ) : user ? (
            !jobs?.length ? (
              <Link
                href="/admin/jobs"
                target="_blank"
                rel="noopener noreferrer"
                className="text-red-600 mb-4 w-fit font-bold"
              >
                <div className="flex items-center space-x-2">
                  <ExclamationTriangleIcon className="h-4 w-4 flex-none" />
                  <span>Create a job to reach out to candidates</span>
                </div>
              </Link>
            ) : (
              <div className="flex items-center space-x-2 mb-4 w-fit">
                <span className="text-sm font-medium flex-none">
                  Select job
                </span>
                <select
                  value={selectedJob}
                  onChange={(e) => {
                    setSelectedJob(e.target.value);
                  }}
                  className="border border-black rounded-lg px-2 py-1 text-sm focus:outline-none w-full"
                >
                  <option value={""} disabled>
                    Choose a job
                  </option>
                  {jobs.map((job) => (
                    <option key={job.id} value={job.id}>
                      {job.job_info.title}
                    </option>
                  ))}
                </select>
              </div>
            )
          ) : null}
          {user ? (
            <button
              disabled={!selectedJob || sendingInvite}
              onClick={async () => onSendInvitation()}
              className={`w-full border transition-colors font-medium rounded px-8 py-2 ${
                !selectedJob || sendingInvite
                  ? "border-gray-300 text-gray-400"
                  : selectedOption === "standard"
                  ? "border-black text-black hover:bg-black hover:text-white"
                  : "border-yellow-600 text-yellow-600 font-bold hover:text-white hover:bg-yellow-600"
              }`}
            >
              {sendingInvite ? (
                "Please wait..."
              ) : selectedOption === "standard" ? (
                "Send Invitation"
              ) : (
                <div className="flex items-center justify-center text-center space-x-1">
                  <BoltIcon className="h-4 w-4 flex-none" />
                  <span>Send Turbo Invite</span>
                </div>
              )}
            </button>
          ) : (
            <Link
              href={"/employers"}
              className={`flex justify-center w-full border transition-colors font-medium rounded px-8 py-2 ${
                selectedOption === "standard"
                  ? "border-black text-black hover:bg-black hover:text-white"
                  : "border-yellow-600 text-yellow-600 font-bold hover:text-white hover:bg-yellow-600"
              }`}
            >
              {selectedOption === "standard" ? (
                "Get Recruiter Pro to send invite"
              ) : (
                <div className="flex items-center justify-center text-center space-x-2">
                  <BoltIcon className="h-4 w-4 flex-none" />
                  <span>Get Recruiter Pro to send Turbo Invite</span>
                </div>
              )}
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
