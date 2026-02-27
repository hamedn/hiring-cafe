import { useCurrentSearchFilters } from "contexts/CurrentSearchFiltersContext";
import { ChevronDownIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import FieldsOfStudySelectionV5, {
  EducationFieldsOfStudyMapping,
} from "./FieldsOfStudySelectionV5";
import EducationRequirements from "./EducationRequirements";

export default function EducationOptionV5({ education }) {
  const { state: currentSearchState } = useCurrentSearchFilters();
  const [showFieldsOfStudy, setShowFieldsOfStudy] = useState(false);

  const numIncluded =
    currentSearchState[EducationFieldsOfStudyMapping[education].field]
      ?.length || 0;

  const numExcluded =
    currentSearchState[EducationFieldsOfStudyMapping[education].excludeField]
      ?.length || 0;

  const countLabel =
    !numIncluded && !numExcluded
      ? "None Selected"
      : `${numIncluded || "0"} Included · ${numExcluded || "0"} Excluded`;

  if (!education || !EducationFieldsOfStudyMapping[education]) {
    return null;
  }

  return (
    <div className="flex flex-col text-sm">
      <span className="font-bold">
        {EducationFieldsOfStudyMapping[education].title}
      </span>
      <div className="flex items-center space-x-3 mt-2 mb-2">
        <EducationRequirements education={education} />
      </div>
      <div
        className={`flex flex-col text-xs ${
          showFieldsOfStudy ? "border border-gray-400 rounded-lg" : ""
        }`}
      >
        <div
          className={`flex items-center space-x-2 justify-between p-2 ${
            showFieldsOfStudy ? "border-b border-gray-400" : ""
          }`}
        >
          <button
            className={`w-fit flex items-center space-x-2 font-medium hover:text-pink-600`}
            onClick={() => setShowFieldsOfStudy(!showFieldsOfStudy)}
          >
            <span>{showFieldsOfStudy ? "▼" : "▶"}</span>
            <span>{`${EducationFieldsOfStudyMapping[education].title} Majors`}</span>
            {!showFieldsOfStudy && (numIncluded || numExcluded) ? (
              <span
                className={
                  numIncluded || numExcluded ? "text-green-600 font-medium" : ""
                }
              >
                {" "}
                - {countLabel}
              </span>
            ) : null}
          </button>
          {showFieldsOfStudy && (
            <button
              className={`w-fit flex items-center space-x-2 font-light hover:text-pink-600`}
              onClick={() => setShowFieldsOfStudy(!showFieldsOfStudy)}
            >
              <span className="">{`${countLabel}`}</span>
            </button>
          )}
        </div>
        {showFieldsOfStudy && (
          <div className="p-4">
            <FieldsOfStudySelectionV5 education={education} />
          </div>
        )}
      </div>
    </div>
  );
}
