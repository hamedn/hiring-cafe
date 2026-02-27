import useURLSearchStateV4 from "@/hooks/useURLSearchStateV4";
import { educationRequirementTypes } from "@/utils/constants";
import { useCurrentSearchFilters } from "contexts/CurrentSearchFiltersContext";

export const EducationRequirementsMapping = {
  ASSOCIATES: {
    field: "associatesDegreeRequirements",
    url: "ASSOCIATES_DEGREE_REQUIREMENTS",
  },
  BACHELORS: {
    field: "bachelorsDegreeRequirements",
    url: "BACHELORS_DEGREE_REQUIREMENTS",
  },
  MASTERS: {
    field: "mastersDegreeRequirements",
    url: "MASTERS_DEGREE_REQUIREMENTS",
  },
  DOCTORATE: {
    field: "doctorateDegreeRequirements",
    url: "DOCTORATE_DEGREE_REQUIREMENTS",
  },
};

export default function EducationRequirements({ education }) {
  const { state: currentSearchState } = useCurrentSearchFilters();
  const { update } = useURLSearchStateV4();

  if (!education || !EducationRequirementsMapping[education]) {
    return null;
  }

  return educationRequirementTypes.map((option) => {
    return (
      <button
        key={option}
        className={`flex items-center space-x-2 border p-2 text-xs rounded ${
          currentSearchState[
            EducationRequirementsMapping[education].field
          ]?.includes(option)
            ? "border-pink-600 bg-pink-50"
            : "border-gray-400"
        }`}
        onClick={() => {
          const currentValue =
            currentSearchState[EducationRequirementsMapping[education].field] ||
            [];

          const newValue = currentValue.includes(option)
            ? currentValue.filter((item) => item !== option)
            : [...currentValue, option];

          update({
            type: EducationRequirementsMapping[education].url,
            payload: newValue,
          });
        }}
      >
        {currentSearchState[
          EducationRequirementsMapping[education].field
        ]?.includes(option) ? (
          <div className="h-2.5 w-2.5 flex-none rounded bg-pink-500 ring-2 ring-pink-300 ring-offset-1" />
        ) : (
          <div className="h-2.5 w-2.5 flex-none bg-white border border-gray-400 rounded" />
        )}
        <span>{option}</span>
      </button>
    );
  });
}
