import { useEffect, useState } from "react";
import { useCurrentSearchFilters } from "contexts/CurrentSearchFiltersContext";
import useURLSearchStateV4, {
  URLSearchStateUpdateType,
} from "@/hooks/useURLSearchStateV4";
import Link from "next/link";
import { ArrowTopRightOnSquareIcon } from "@heroicons/react/24/outline";

function JobDescriptionKeywordSelection() {
  const { update } = useURLSearchStateV4();
  const { state: currentSearchState } = useCurrentSearchFilters();

  const [jobDescriptionQuery, setJobDescriptionQuery] = useState("");

  useEffect(() => {
    setJobDescriptionQuery(currentSearchState.jobDescriptionQuery || "");
  }, [currentSearchState.jobDescriptionQuery]);

  return (
    <div className="flex flex-col space-y-4">
      <label htmlFor="jobDescriptionQuery" className="text-sm font-bold">
        Entire Job Description
      </label>
      <label
        htmlFor="jobDescriptionQuery"
        className="text-sm text-gray-500 italic"
      >
        Searches across the entire job description.
      </label>
      <textarea
        className="border border-gray-300 rounded-md p-2 h-24 placeholder:text-base"
        id="jobDescriptionQuery"
        value={jobDescriptionQuery}
        placeholder={`Add boolean query`}
        onChange={(e) => setJobDescriptionQuery(e.target.value)}
        onBlur={() => {
          if (jobDescriptionQuery !== currentSearchState.jobDescriptionQuery) {
            update({
              type: URLSearchStateUpdateType.JOB_DESCRIPTION_QUERY,
              payload: jobDescriptionQuery,
            });
          }
        }}
      />
      <Link
        href="https://en.wikipedia.org/wiki/Full-text_search#Boolean_queries"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center space-x-1 text-sm text-gray-500 italic w-fit"
      >
        <span>How boolean queries work</span>
        <ArrowTopRightOnSquareIcon className="h-4 w-4 text-gray-500" />
      </Link>
    </div>
  );
}

export default JobDescriptionKeywordSelection;
