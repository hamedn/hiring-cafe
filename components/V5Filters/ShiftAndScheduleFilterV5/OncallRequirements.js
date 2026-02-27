import useURLSearchStateV4, {
  URLSearchStateUpdateType,
} from "@/hooks/useURLSearchStateV4";
import { OncallRequirementTypes } from "@/utils/constants";
import { Checkbox, Stack } from "@chakra-ui/react";
import { useCurrentSearchFilters } from "contexts/CurrentSearchFiltersContext";
import { useState, useEffect } from "react";

export default function OncallRequirements() {
  const { state: currentSearchState } = useCurrentSearchFilters();
  const [selectedType, setSelectedType] = useState([]);
  const { update } = useURLSearchStateV4();

  useEffect(() => {
    setSelectedType(currentSearchState.onCallRequirements || []);
  }, [currentSearchState.onCallRequirements]);

  const handleCheckboxChange = (type) => {
    const newType = selectedType.includes(type)
      ? selectedType.filter((item) => item !== type)
      : [...selectedType, type];
    update({
      type: URLSearchStateUpdateType.ON_CALL_REQUIREMENTS,
      payload: newType,
    });
  };

  return (
    <div className="flex flex-col space-y-2 w-fit">
      <span className="text-sm font-bold">Oncall Requirements</span>
      <Stack spacing={1} direction="column">
        {OncallRequirementTypes.map((option) => (
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
