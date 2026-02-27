import { useEffect, useState } from "react";
import { useCurrentSearchFilters } from "contexts/CurrentSearchFiltersContext";
import useURLSearchStateV4, {
  URLSearchStateUpdateType,
} from "@/hooks/useURLSearchStateV4";
import Link from "next/link";
import { ArrowTopRightOnSquareIcon } from "@heroicons/react/24/outline";

function RequirementsKeywordSelection() {
  const { update } = useURLSearchStateV4();
  const { state: currentSearchState } = useCurrentSearchFilters();

  const [requirementsQuery, setRequirementsQuery] = useState("");

  useEffect(() => {
    setRequirementsQuery(currentSearchState.requirementsKeywordsQuery || "");
  }, [currentSearchState.requirementsKeywordsQuery]);

  return (
    <div className="flex flex-col space-y-4">
      <label htmlFor="requirementsQuery" className="text-sm font-bold">
        Requirements Keywords
      </label>
      <textarea
        className="border border-gray-300 rounded-md p-2 h-24 placeholder:text-base"
        id="requirementsQuery"
        value={requirementsQuery}
        placeholder={`Add boolean query`}
        onChange={(e) => setRequirementsQuery(e.target.value)}
        onBlur={() => {
          if (
            requirementsQuery !== currentSearchState.requirementsKeywordsQuery
          ) {
            update({
              type: URLSearchStateUpdateType.REQUIREMENTS_KEYWORDS_QUERY,
              payload: requirementsQuery,
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

export default RequirementsKeywordSelection;
