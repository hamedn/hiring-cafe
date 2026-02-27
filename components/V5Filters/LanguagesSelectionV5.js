import useURLSearchStateV4, {
  URLSearchStateUpdateType,
} from "@/hooks/useURLSearchStateV4";
import { useCurrentSearchFilters } from "contexts/CurrentSearchFiltersContext";
import {
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
} from "@chakra-ui/react";
import { QuestionMarkCircleIcon } from "@heroicons/react/24/outline";
import ElasticSearchComponent from "./ElasticSearchComponent";

export default function LanguagesSelectionV5() {
  const { state: currentSearchState } = useCurrentSearchFilters();
  const { update } = useURLSearchStateV4();

  return (
    <div
      className={`shadow-md rounded-lg m-4 text-sm ${
        currentSearchState.languageRequirements?.length > 0 ||
        currentSearchState.excludeJobsWithAdditionalLanguageRequirements
          ?.length > 0
          ? "border border-pink-600 bg-pink-50/30"
          : "border-2"
      }`}
    >
      <div className="flex flex-col space-y-8 p-4">
        <div className="flex flex-col space-y-2">
          <span className="font-bold">Language Requirements</span>
          {currentSearchState.languageRequirements?.length > 1 ? (
            <div className="flex items-center space-x-2 text-sm">
              <span className="font-medium text-xs">Operation:</span>
              <div className="flex items-center border rounded">
                {["OR", "AND"].map((op) => (
                  <button
                    className={`px-3 rounded font-medium ${
                      op === currentSearchState.languageRequirementsOperator
                        ? "bg-green-600 text-white"
                        : "bg-white"
                    }`}
                    onClick={() => {
                      if (
                        op !== currentSearchState.languageRequirementsOperator
                      ) {
                        update({
                          type: URLSearchStateUpdateType.LANGUAGE_REQUIREMENTS_LOGICAL_OPERATOR,
                          payload: op,
                        });
                      }
                    }}
                    key={op}
                  >
                    {op}
                  </button>
                ))}
              </div>
            </div>
          ) : null}
          <ElasticSearchComponent
            facetType={"language_requirements"}
            isMulti
            isCreatable
            selected={(currentSearchState.languageRequirements || []).map(
              (option) => ({
                label: option,
                value: option,
              })
            )}
            onSelected={(options) => {
              update({
                type: URLSearchStateUpdateType.LANGUAGE_REQUIREMENTS,
                payload: options,
              });
            }}
          />
        </div>
        {currentSearchState.languageRequirements?.length > 0 ? (
          <div className="flex flex-col space-y-2">
            <div className="flex items-center space-x-2">
              <span className="font-bold">
                Hide jobs that mention additional language requirements?
              </span>
              <Popover>
                <PopoverTrigger>
                  <button className="">
                    <QuestionMarkCircleIcon className="h-5 w-5 flex-none" />
                  </button>
                </PopoverTrigger>
                <PopoverContent>
                  <PopoverArrow />
                  <PopoverBody>
                    <span>
                      {`If enabled, only jobs with the selected languages will be shown. If disabled, jobs with additional language requirements will also be shown unless they are excluded.`}
                    </span>
                  </PopoverBody>
                </PopoverContent>
              </Popover>
            </div>
            <div className="flex space-x-4">
              <button
                onClick={() => {
                  update({
                    type: URLSearchStateUpdateType.EXCLUDE_JOBS_WITH_ADDITIONAL_LANGUAGE_REQUIREMENTS,
                    payload: true,
                  });
                }}
                className={`${
                  currentSearchState.excludeJobsWithAdditionalLanguageRequirements
                    ? "bg-pink-400 text-white"
                    : "bg-white border border-black"
                } rounded py-1 px-2`}
              >
                Yes
              </button>
              <button
                onClick={() => {
                  update({
                    type: URLSearchStateUpdateType.EXCLUDE_JOBS_WITH_ADDITIONAL_LANGUAGE_REQUIREMENTS,
                    payload: false,
                  });
                }}
                className={`${
                  currentSearchState.excludeJobsWithAdditionalLanguageRequirements
                    ? "bg-white border border-black"
                    : "bg-pink-400 text-white"
                } rounded py-1 px-2`}
              >
                No
              </button>
            </div>
          </div>
        ) : null}
        {!currentSearchState.excludeJobsWithAdditionalLanguageRequirements && (
          <div className="flex flex-col space-y-2">
            <div className="flex flex-col space-y-1">
              <div className="flex items-center space-x-1">
                <span className="font-bold">Exclude Language Requirements</span>
              </div>
            </div>
            <ElasticSearchComponent
              facetType={"language_requirements"}
              isMulti
              isCreatable
              selected={(
                currentSearchState.excludedLanguageRequirements || []
              ).map((option) => ({
                label: option,
                value: option,
              }))}
              onSelected={(options) => {
                update({
                  type: URLSearchStateUpdateType.EXCLUDED_LANGUAGE_REQUIREMENTS,
                  payload: options,
                });
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
