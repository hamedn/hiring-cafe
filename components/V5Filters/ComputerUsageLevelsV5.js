import useURLSearchStateV4, {
  URLSearchStateUpdateType,
} from "@/hooks/useURLSearchStateV4";
import { computerUsageLevelTypes } from "@/utils/constants";
import { Checkbox, Stack } from "@chakra-ui/react";
import { useCurrentSearchFilters } from "contexts/CurrentSearchFiltersContext";
import { useState, useEffect } from "react";

export default function ComputerUsageLevelsV5() {
  const { state: currentSearchState } = useCurrentSearchFilters();
  const [selectedType, setSelectedType] = useState([]);
  const { update } = useURLSearchStateV4();

  useEffect(() => {
    setSelectedType(currentSearchState.computerUsageLevels || []);
  }, [currentSearchState.computerUsageLevels]);

  const handleCheckboxChange = (type) => {
    const newType = selectedType.includes(type)
      ? selectedType.filter((item) => item !== type)
      : [...selectedType, type];
    update({
      type: URLSearchStateUpdateType.COMPUTER_USAGE_LEVELS,
      payload: newType,
    });
  };

  return (
    <div className="flex flex-col space-y-2 w-fit">
      <span className="text-sm font-bold">Computer Usage Level</span>
      <Stack spacing={1} direction="column">
        {computerUsageLevelTypes.map((option) => (
          <Checkbox
            key={option}
            size={"lg"}
            colorScheme="pink"
            isChecked={selectedType.includes(option)}
            onChange={() => handleCheckboxChange(option)}
          >
            <span className="text-base font-light">{option}</span>
          </Checkbox>
        ))}
      </Stack>
    </div>
  );
}
