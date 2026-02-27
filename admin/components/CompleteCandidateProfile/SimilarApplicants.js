import useApplicant from "@/admin/hooks/useApplicant";
import useApplicants from "@/admin/hooks/useApplicants";
import QuickCandidateSummaryCard from "../adminDashboard/candidateProfiles/QuickCandidateSummaryCard";

/// For now recommended candidates are just the first x candidates in the same stage
export default function SimilarApplicants({ applicantId }) {
  const { applicant } = useApplicant({ applicantId });
  const { applicants } = useApplicants({
    jobId: applicant?.job_applied,
    stage: applicant?.stage,
    limitApplicants: 6,
  });

  // If there are no applicants or only one applicant, don't show this section since there are no similar applicants
  if (!applicants || applicants.length < 2) return null;

  return (
    <div className="flex flex-col">
      <span className="text-2xl font-medium">
        More applicants in{" "}
        <span className="text-gray-500">
          {applicant?.stage || "this stage"}
        </span>
      </span>
      <div className="flex justify-center">
        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-16">
          {applicants
            .filter((a) => a.id !== applicantId)
            .map((applicant) => (
              <div key={applicant.id} className="flex justify-center">
                <QuickCandidateSummaryCard applicantId={applicant.id} />
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
