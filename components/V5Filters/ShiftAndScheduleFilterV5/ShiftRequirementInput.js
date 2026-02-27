import useURLSearchStateV4 from "@/hooks/useURLSearchStateV4";
import { ShiftWorkRequirementTypes } from "@/utils/constants";
import { useCurrentSearchFilters } from "contexts/CurrentSearchFiltersContext";
import { useState, useEffect } from "react";
import { ShiftRequirementMapping } from "./ShiftRequirements";

export default function ShiftRequirementInput({ type }) {
  const { state: currentSearchState } = useCurrentSearchFilters();
  const [selectedTypes, setSelectedTypes] = useState([]);
  const { update } = useURLSearchStateV4();

  useEffect(() => {
    setSelectedTypes(
      currentSearchState[ShiftRequirementMapping?.[type]?.field] || []
    );
  }, [currentSearchState, type]);

  const handleCheckboxChange = (option) => {
    if (ShiftRequirementMapping[type]?.url) {
      const newselectedTypes = selectedTypes.includes(option)
        ? selectedTypes.filter((item) => item !== option)
        : [...selectedTypes, option];
      update({
        type: ShiftRequirementMapping[type].url,
        payload: newselectedTypes,
      });
    }
  };

  if (!type || !ShiftRequirementMapping[type]) {
    return null;
  }

  return (
    <div className="flex items-center space-x-2 w-fit">
      {ShiftWorkRequirementTypes.map((option) => (
        <button
          key={option}
          className={`flex items-center space-x-2 ${
            selectedTypes.includes(option)
              ? "bg-pink-50 border-pink-500"
              : "bg-white border-gray-400"
          } p-2 rounded border outline-none text-xs`}
          onClick={() => handleCheckboxChange(option)}
        >
          <div
            className={`w-3 h-3 rounded-full border ${
              selectedTypes.includes(option) ? "bg-pink-500" : "border-black"
            }`}
          ></div>
          <span>{option}</span>
        </button>
      ))}
    </div>
  );
}
