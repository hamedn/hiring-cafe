import { useEffect, useState } from "react";
import useApplicant from "@/admin/hooks/useApplicant";
import useJob from "@/admin/hooks/useJob";
import { getFirstName } from "@/utils/helpers";
import { CircularProgress, useToast } from "@chakra-ui/react";
import { useRouter } from "next/router";
import axios from "axios";
import {
  rejectionReasonsA,
  rejectionReasonsB,
} from "@/utils/constants/rejectionReasons";

export default function RejectApplicant({
  applicantId,
  reloadOnCompletion = true,
}) {
  const { applicant } = useApplicant({ applicantId });
  const { job } = useJob({ job_id: applicant?.job_applied });
  const router = useRouter();
  const toast = useToast();
  const [rejectionMessage, setRejectionMessage] = useState("");
  const [isRejectingCandidate, setIsRejectingCandidate] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");

  useEffect(() => {
    const defaultRejectionMessage = () => {
      if (!applicant || !job) return "";
      return `Dear ${getFirstName(applicant.profile.name)},

Thank you for your interest in the ${job.job_info.title} position at ${
        job.board.title
      }.

After careful review, we have decided to move forward with other candidates who more closely match our requirements for this position.

We appreciate your application and encourage you to apply for future roles with us.

Best,
${job.board.title}`;
    };
    setRejectionMessage(defaultRejectionMessage());
  }, [applicant, job]);

  if (!applicant) {
    return (
      <div className="flex justify-center mt-2 font-medium">Loading...</div>
    );
  }

  const handleRejection = async () => {
    setIsRejectingCandidate(true);
    try {
      await axios.patch("/api/applicant/rejectApplicant", {
        applicant_id: applicantId,
        rejection_message: rejectionMessage,
        rejection_reason: rejectionReason,
      });
      toast({
        title: "Applicant rejected",
        description: `${getFirstName(
          applicant.profile.name
        )} has been rejected and notified.`,
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      reloadOnCompletion && router.replace(`/admin`);
    } catch (error) {
      console.trace(error);
      toast({
        title: "Error rejecting applicant",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsRejectingCandidate(false);
    }
  };

  return (
    <div className="flex flex-col mb-8">
      <div className="font-medium">
        Why are you rejecting this candidate?{" "}
        <span className="text-red-600">*</span>
      </div>
      <select
        className="mt-2 p-2 border border-1 rounded-lg"
        value={rejectionReason}
        onChange={(e) => {
          setRejectionReason(e.target.value);
        }}
      >
        <option value={""}>Select...</option>
        {Object.keys(rejectionReasonsA).map((key) => (
          <option key={key} value={key}>
            {rejectionReasonsA[key]}
          </option>
        ))}
      </select>
      <span className="mt-8 font-medium">
        Confirm Rejection Message <span className="text-red-600">*</span>
      </span>
      <textarea
        className="mt-2 border rounded p-4 h-96 resize-none outline-none w-full border-black"
        value={rejectionMessage}
        onChange={(e) => setRejectionMessage(e.target.value)}
      />
      <div className="flex flex-col items-end space-y-4 mt-4">
        <div className="flex flex-col w-96 bg-red-50 p-4 rounded text-sm text-red-600">
          <span className="font-medium">{`You will not be able to recover this applicant's profile once you reject them. They will have to reapply to your company for future consideration.`}</span>
        </div>
        <button
          onClick={handleRejection}
          className={`border font-medium w-56 py-2 rounded ${
            isRejectingCandidate || !rejectionReason || rejectionReason === ""
              ? "border-red-100 cursor-not-allowed"
              : "border-red-600 text-red-600 hover:bg-red-50"
          }`}
          disabled={
            isRejectingCandidate || !rejectionReason || rejectionReason === ""
          }
        >
          {isRejectingCandidate ? (
            <CircularProgress isIndeterminate size="24px" color="red.300" />
          ) : (
            "Reject and Send Message"
          )}
        </button>
      </div>
    </div>
  );
}
