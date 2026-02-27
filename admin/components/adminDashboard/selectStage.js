import { useAuth } from "@/admin/hooks/useAuth";
import useJob from "@/admin/hooks/useJob";
import { clientFirestore } from "@/admin/lib/firebaseClient";
import {
  collection,
  getCountFromServer,
  query,
  where,
} from "firebase/firestore";
import { useEffect, useState } from "react";

export default function SelectStage({ jobId, selectedStage, onStageSelect }) {
  const { userData } = useAuth();
  const { job, loading, error } = useJob({ job_id: jobId });
  const [applicantsCountForStage, setApplicantsCountForStage] = useState(null);

  useEffect(() => {
    if (!userData || !job || !jobId) return;
    const getApplicantsCountForStages = async () => {
      ["Initial Video Screen", ...(job.interview_process || [])].forEach(
        async (stage) => {
          const q = query(
            collection(clientFirestore, "applicants"),
            where("board_applied", "==", userData.board),
            where("job_applied", "==", jobId),
            where("stage", "==", stage)
          );
          const snapshot = await getCountFromServer(q);
          setApplicantsCountForStage((prev) => ({
            ...prev,
            [stage]: snapshot.data().count,
          }));
        }
      );
    };
    getApplicantsCountForStages();
  }, [job, jobId, userData]);

  if (loading) {
    return (
      <div className="flex items-center space-x-4 mt-8 overflow-x-auto">
        {[0, 1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className={`border rounded-full px-4 h-12 w-44 flex-none transition-colors duration-200 bg-gray-200 animate-pulse`}
          />
        ))}
      </div>
    );
  }

  if (error) {
    console.trace(error);
    return <span className="text-red-600 font-medium">{error.message}</span>;
  }

  return (
    <div className="flex items-center space-x-4 mt-8 overflow-x-auto">
      {["Initial Video Screen", ...(job.interview_process || [])].map(
        (stage) => (
          <button
            key={stage}
            className={`border rounded-full px-4 h-12 flex-none
               hover:border-2 hover:border-black transition-colors duration-200 ${
                 selectedStage === stage
                   ? "border-2 border-black"
                   : "hover:bg-gray-100"
               }
              `}
            onClick={() => onStageSelect(stage)}
          >
            {stage === "Initial Video Screen" ? "Screen" : stage}{" "}
            {applicantsCountForStage?.[stage]
              ? `(${applicantsCountForStage[stage]})`
              : `(0)`}
          </button>
        )
      )}
    </div>
  );
}
