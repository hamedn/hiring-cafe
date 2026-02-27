import useApplicant from "@/admin/hooks/useApplicant";
import useJob from "@/admin/hooks/useJob";
import { clientFirestore } from "@/admin/lib/firebaseClient";
import { getFirstName } from "@/utils/helpers";
import { useToast } from "@chakra-ui/react";
import { doc, setDoc } from "firebase/firestore";

export default function MoveStage({ applicantId }) {
  const toast = useToast();
  const { applicant } = useApplicant({ applicantId });
  const { job } = useJob({ job_id: applicant?.job_applied });

  if (!applicant || !job) return null;

  const handleMoveStage = (newStage) => {
    setDoc(
      doc(clientFirestore, "applicants", applicantId),
      {
        stage: newStage,
      },
      { merge: true }
    )
      .then(() => {
        toast({
          title: "Stage moved",
          description: `${getFirstName(
            applicant.profile.name
          )} has been moved to ${newStage}`,
          status: "success",
          colorScheme: "green",
          duration: 5000,
          isClosable: true,
        });
      })
      .catch((error) => {
        console.trace(error);
        toast({
          title: "Error moving stage",
          description: error.message,
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      });
  };

  return (
    <div className="flex flex-col">
      <span className="font-medium text-xl">
        Move {getFirstName(applicant.profile.name)} to another stage
      </span>
      <div className="grid grid-cols-2 gap-8 items-start mt-8">
        <div className="text-sm">
          <span className="italic">
            Advance {getFirstName(applicant.profile.name)} to another stage in
            your interview pipeline, or move{" "}
            {getFirstName(applicant.profile.name)} to an earlier stage.
          </span>
        </div>
        <div className="flex flex-col space-y-4 text-sm">
          {["Initial Video Screen", ...(job.interview_process || [])].map(
            (stage) => (
              <button
                key={stage}
                onClick={() => handleMoveStage(stage)}
                className={`border rounded-full py-2 px-2 ${
                  stage === applicant.stage
                    ? "text-gray-500 cursor-not-allowed"
                    : "border-black text-black hover:bg-gray-100"
                }`}
              >
                {stage}
              </button>
            )
          )}
        </div>
      </div>
    </div>
  );
}
