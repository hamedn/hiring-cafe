import useURLSearchStateV4 from "@/hooks/useURLSearchStateV4";
import { TravelRequirementTypes } from "@/utils/constants";
import { Checkbox } from "@chakra-ui/react";
import { useCurrentSearchFilters } from "contexts/CurrentSearchFiltersContext";
import { useState, useEffect } from "react";
import { TravelRequirementMapping } from ".";

export default function TravelRequirementFilter({ type }) {
  const { state: currentSearchState } = useCurrentSearchFilters();
  const [selectedTypes, setSelectedTypes] = useState([]);
  const { update } = useURLSearchStateV4();

  useEffect(() => {
    setSelectedTypes(
      currentSearchState[TravelRequirementMapping?.[type]?.field] || []
    );
  }, [currentSearchState, type]);

  const handleCheckboxChange = (option) => {
    if (TravelRequirementMapping[type]?.url) {
      const newselectedTypes = selectedTypes.includes(option)
        ? selectedTypes.filter((item) => item !== option)
        : [...selectedTypes, option];
      update({
        type: TravelRequirementMapping[type].url,
        payload: newselectedTypes,
      });
    }
  };

  if (!type || !TravelRequirementMapping[type]) {
    return null;
  }

  return (
    <div className="flex flex-col space-y-2 w-fit">
      {TravelRequirementTypes.map((option) => (
        <Checkbox
          key={option}
          size={"lg"}
          colorScheme="pink"
          isChecked={selectedTypes.includes(option)}
          onChange={() => handleCheckboxChange(option)}
        >
          <span className="text-base font-light">{option}</span>
        </Checkbox>
      ))}
    </div>
  );
}
