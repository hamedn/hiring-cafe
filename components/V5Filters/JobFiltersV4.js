import { useCurrentSearchFilters } from "contexts/CurrentSearchFiltersContext";
import JobTitleQueryBuilder from "./JobTitleQueryBuilder";
import JobDescriptionKeywordSelection from "./JobDescriptionKeywordSelection";
import RequirementsKeywordSelection from "./RequirementsKeywordSelection";
import TechnologyKeywordSelectionV5 from "./TechnologyKeywordSelectionV5";
import { isValidBooleanQuery } from "@/utils/helpers";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";

export default function JobFiltersV4() {
  const { state: currentSearchState } = useCurrentSearchFilters();

  const isValidJobTitleQuery = isValidBooleanQuery(
    currentSearchState.jobTitleQuery || ""
  );
  const isValidRequirementsKeywordQuery = isValidBooleanQuery(
    currentSearchState.requirementsKeywordsQuery || ""
  );
  const isValidTechnologyKeywordsQuery = isValidBooleanQuery(
    currentSearchState.technologyKeywordsQuery || ""
  );
  const isValidJobDescriptionQuery = isValidBooleanQuery(
    currentSearchState.jobDescriptionQuery || ""
  );

  return (
    <div className="flex flex-col">
      <div className="flex flex-col space-y-8 p-4">
        {/* Job Title Query */}
        <div
          className={`shadow-md rounded-lg p-4 ${
            currentSearchState.jobTitleQuery?.length > 0
              ? isValidJobTitleQuery
                ? "border border-green-600 bg-green-50/30"
                : "border border-red-600 bg-red-50"
              : "border-2"
          }`}
        >
          {!isValidJobTitleQuery &&
            currentSearchState.jobTitleQuery?.length > 0 && (
              <div className="flex items-center space-x-1 mb-4">
                <ExclamationTriangleIcon className="w-5 h-5 text-red-600 flex-none" />
                <span className="text-red-600 font-bold">
                  Incorrect Boolean Syntax
                </span>
              </div>
            )}
          <JobTitleQueryBuilder />
        </div>

        {/* Technology Keywords Query */}
        <div
          className={`flex flex-col shadow-md rounded-lg p-4 ${
            currentSearchState.technologyKeywordsQuery?.length > 0
              ? isValidTechnologyKeywordsQuery
                ? "border border-green-600 bg-green-50/30"
                : "border border-red-600 bg-red-50"
              : "border-2"
          }`}
        >
          {!isValidTechnologyKeywordsQuery &&
            currentSearchState.technologyKeywordsQuery?.length > 0 && (
              <div className="flex items-center space-x-1 mb-4">
                <ExclamationTriangleIcon className="w-5 h-5 text-red-600 flex-none" />
                <span className="text-red-600 font-bold">
                  Incorrect Boolean Syntax
                </span>
              </div>
            )}
          <TechnologyKeywordSelectionV5 />
        </div>

        {/* Job Description Query */}
        <div
          className={`shadow-md rounded-lg p-4 ${
            currentSearchState.jobDescriptionQuery?.length > 0
              ? isValidJobDescriptionQuery
                ? "border border-green-600 bg-green-50/30"
                : "border border-red-600 bg-red-50"
              : "border-2"
          }`}
        >
          {!isValidJobDescriptionQuery &&
            currentSearchState.jobDescriptionQuery?.length > 0 && (
              <div className="flex items-center space-x-1 mb-4">
                <ExclamationTriangleIcon className="w-5 h-5 text-red-600 flex-none" />
                <span className="text-red-600 font-bold">
                  Incorrect Boolean Syntax
                </span>
              </div>
            )}
          <JobDescriptionKeywordSelection />
        </div>

        {/* Requirements Keyword Query */}
        <div
          className={`shadow-md rounded-lg p-4 ${
            currentSearchState.requirementsKeywordsQuery?.length > 0
              ? isValidRequirementsKeywordQuery
                ? "border border-green-600 bg-green-50/30"
                : "border border-red-600 bg-red-50"
              : "border-2"
          }`}
        >
          {!isValidRequirementsKeywordQuery &&
            currentSearchState.requirementsKeywordsQuery?.length > 0 && (
              <div className="flex items-center space-x-1 mb-4">
                <ExclamationTriangleIcon className="w-5 h-5 text-red-600 flex-none" />
                <span className="text-red-600 font-bold">
                  Incorrect Boolean Syntax
                </span>
              </div>
            )}
          <RequirementsKeywordSelection />
        </div>
      </div>
    </div>
  );
}
