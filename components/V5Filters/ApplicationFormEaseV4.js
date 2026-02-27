import useURLSearchStateV4, {
  URLSearchStateUpdateType,
} from "@/hooks/useURLSearchStateV4";
import { useCurrentSearchFilters } from "contexts/CurrentSearchFiltersContext";
import { useState, useEffect } from "react";

const prefInfo = {
  All: {
    title: "All",
    description: "All application forms - simple or time-consuming.",
  },
  Simple: {
    title: "Simple",
    description:
      "Application forms that don't require account creation. Don't require resume formatting most of the time.",
  },
  "Time Consuming": {
    title: "Time Consuming",
    description:
      "Application forms that require account creation and/or resume formatting.",
  },
};

export default function ApplicationFormEaseV4({ onSelectClose }) {
  const { state: currentSearchState } = useCurrentSearchFilters();
  const { update } = useURLSearchStateV4();
  const [selectedApplicationFormStyles, setSelectedApplicationFormStyles] =
    useState([]);

  useEffect(() => {
    setSelectedApplicationFormStyles(
      currentSearchState.applicationFormEase?.length > 0
        ? currentSearchState.applicationFormEase
        : ["All"]
    );
  }, [currentSearchState.applicationFormEase]);

  const handleCheckboxChange = (type) => {
    setSelectedApplicationFormStyles([type]);
    if (type === "All") {
      update({
        type: URLSearchStateUpdateType.APPLICATION_FORM_EASE,
        payload: [],
      });
    } else {
      update({
        type: URLSearchStateUpdateType.APPLICATION_FORM_EASE,
        payload: [type],
      });
    }
    if (onSelectClose) onSelectClose();
  };

  return (
    <div className="flex flex-col space-y-4 text-sm">
      {Object.keys(prefInfo).map((option) => (
        <div
          className={`border flex flex-col space-y-2 rounded p-3 cursor-pointer ${
            selectedApplicationFormStyles.includes(option)
              ? "border-pink-500 bg-pink-50"
              : ""
          }`}
          key={option}
          onClick={() => handleCheckboxChange(option)}
        >
          <div className="flex items-center space-x-4">
            {selectedApplicationFormStyles.includes(option) ? (
              <div className="h-3 w-3 flex-none bg-pink-600 ring-2 ring-pink-300 ring-offset-1 rounded-full" />
            ) : (
              <div className="h-3 w-3 flex-none bg-white border border-gray-400 rounded-full" />
            )}
            <span className="font-medium">
              {prefInfo[option].title} Application Forms
            </span>
          </div>
          {prefInfo[option].description && (
            <span className="text-xs">{prefInfo[option].description}</span>
          )}
        </div>
      ))}
    </div>
  );
}
