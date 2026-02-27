import useURLSearchStateV4, {
  URLSearchStateUpdateType,
} from "@/hooks/useURLSearchStateV4";
import { seniorityLevelTypes } from "@/utils/constants";
import { Checkbox, Stack } from "@chakra-ui/react";
import { useCurrentSearchFilters } from "contexts/CurrentSearchFiltersContext";
import { useState, useEffect } from "react";

export default function SeniorityLevelSelectionV5() {
  const { state: currentSearchState } = useCurrentSearchFilters();
  const { update } = useURLSearchStateV4();
  const [selectedSeniorityLevels, setSelectedSeniorityLevels] = useState([]);

  useEffect(() => {
    setSelectedSeniorityLevels(currentSearchState.seniorityLevel || []);
  }, [currentSearchState.seniorityLevel]);

  const handleCheckboxChange = (option) => {
    let newselectedSeniorityLevels;
    if (selectedSeniorityLevels.includes(option)) {
      // Remove the option if it's already selected
      newselectedSeniorityLevels = selectedSeniorityLevels.filter(
        (item) => item !== option
      );
    } else {
      // Add the option if it's not selected
      newselectedSeniorityLevels = [...selectedSeniorityLevels, option];
    }

    setSelectedSeniorityLevels(newselectedSeniorityLevels);
    update({
      type: URLSearchStateUpdateType.SENIORITY_LEVELS,
      payload: newselectedSeniorityLevels,
    });
  };

  return (
    <div className="flex flex-col space-y-2">
      <span className="text-sm font-bold">Seniority</span>
      <Stack spacing={1} direction="column">
        {seniorityLevelTypes.map((option) => (
          <Checkbox
            key={option}
            size={"lg"}
            colorScheme="pink"
            isChecked={selectedSeniorityLevels.includes(option)}
            onChange={() => handleCheckboxChange(option)}
          >
            <span className="text-base font-light">{option}</span>
          </Checkbox>
        ))}
      </Stack>
    </div>
  );
}
