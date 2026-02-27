import { useEffect, useState } from "react";
import useApplicant from "@/admin/hooks/useApplicant";
import useJob from "@/admin/hooks/useJob";
import { getFirstName } from "@/utils/helpers";
import { CircularProgress, useToast } from "@chakra-ui/react";
import { useRouter } from "next/router";
import axios from "axios";

export default function ReportApplicant({ applicantId, reloadOnCompletion = true }) {
  const { applicant } = useApplicant({ applicantId });
  const { job } = useJob({ job_id: applicant?.job_applied });
  const router = useRouter();
  const toast = useToast();
  const [reportMessage, setReportMessage] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setReportMessage("This Candidate was not acting professionally.");
  }, [applicant, job]);

  if (!applicant) {
    return (
      <div className="flex justify-center mt-2 font-medium">Loading...</div>
    );
  }

  const handleReport = async () => {
    setIsSubmitting(true);
    try {
      await axios.patch("/api/applicant/reportApplicant", {
        applicant_id: applicantId,
        report_message: reportMessage,
      });
      toast({
        title: "Applicant reported",
        description: `${getFirstName(applicant.profile.name)} has been reported.`,
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      reloadOnCompletion && router.replace(`/admin`);
    } catch (error) {
      console.trace(error);
      toast({
        title: "Error reporting applicant",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col mb-8">
      <span className="mt-8 font-medium">
        Why are you reporting this candidate? <span className="text-red-600">*</span>
      </span>
      <textarea
        className="mt-2 border rounded p-4 h-96 resize-none outline-none w-full border-black"
        value={reportMessage}
        onChange={(e) => setReportMessage(e.target.value)}
      />
      <div className="flex flex-col items-end space-y-4 mt-4">
        <div className="flex flex-col w-96 bg-red-50 p-4 rounded text-sm text-red-600">
          <span className="font-medium">{`Once you report this candidate, they will also be taken out of consideration for this job post. You cannot undo this.`}</span>
        </div>
        <button
          onClick={handleReport}
          className={`border font-medium w-56 py-2 rounded ${isSubmitting
            ? "border-red-100 cursor-not-allowed"
            : "border-red-600 text-red-600 hover:bg-red-50"
            }`}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <CircularProgress isIndeterminate size="24px" color="red.300" />
          ) : (
            "Report Applicant"
          )}
        </button>
      </div>
    </div>
  );
}