import useApplicants from "@/admin/hooks/useApplicants";
import QuickCandidateSummaryCard from "./candidateProfiles/QuickCandidateSummaryCard";
import { DocumentCheckIcon } from "@heroicons/react/24/outline";
import { useState } from "react";

export default function ApplicantsGrid({ jobId, stage }) {
  const [searchValue, setSearchValue] = useState("");
  const {
    applicants,
    loading: applicantsLoading,
    error: applicantsError,
  } = useApplicants({
    jobId: jobId,
    stage: stage,
  });

  if (applicantsLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-12 gap-y-16">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <div
            key={i}
            className="w-72 rounded-2xl h-52 bg-gray-300 animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (applicantsError) {
    return (
      <div className="flex justify-center">
        <span className="text-red-600 font-medium">
          {applicantsError?.message || "Error loading applicants"}
        </span>
      </div>
    );
  }

  if (applicants.length === 0) {
    return (
      <div className="flex justify-center bg-gray-100 py-12 rounded-xl">
        <div className="flex flex-col space-y-8 items-center">
          <DocumentCheckIcon className="h-12 w-12 text-gray-700" />
          <span className="text-sm font-medium">{`You don’t have candidates in the ${
            stage === "Initial Video Screen" ? "Screen" : stage
          } stage.`}</span>
        </div>
      </div>
    );
  }

  const handleFilter = (applicant) => {
    if (!searchValue?.length) return true;
    if (applicant.profile.name && applicant.profile.name.includes(searchValue))
      return true;
    if (
      applicant.profile.email &&
      applicant.profile.email.includes(searchValue)
    )
      return true;
    return false;
  };

  return (
    <div>
      {true && ( //TODO: Style this and move it somewhere visually better.
        <input
          type="text"
          placeholder="Search Name/Email"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          className="mb-8 border border-1 rounded-lg px-2 justify-center w-96"
        />
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 2xl:grid-cols-6 gap-x-8 gap-y-16 px-4 md:px-16 w-full">
        {applicants.map((applicant) => (
          <>
            {handleFilter(applicant) && (
              <div key={applicant.id}>
                <div className="flex justify-center">
                  <QuickCandidateSummaryCard
                    key={applicant.id}
                    applicantId={applicant.id}
                  />
                </div>
              </div>
            )}
          </>
        ))}
      </div>
    </div>
  );
}
