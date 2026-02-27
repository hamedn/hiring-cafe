import useURLSearchStateV4, {
  URLSearchStateUpdateType,
} from "@/hooks/useURLSearchStateV4";
import { workplacePhysicalEnvironmentTypes } from "@/utils/constants";
import { Checkbox, Stack } from "@chakra-ui/react";
import { useCurrentSearchFilters } from "contexts/CurrentSearchFiltersContext";
import { useState, useEffect } from "react";

export default function WorkplacePhysicalEnvironmentV5() {
  const { state: currentSearchState } = useCurrentSearchFilters();
  const [selectedType, setSelectedType] = useState([]);
  const { update } = useURLSearchStateV4();

  useEffect(() => {
    setSelectedType(currentSearchState.physicalEnvironments || []);
  }, [currentSearchState.physicalEnvironments]);

  const handleCheckboxChange = (type) => {
    const newType = selectedType.includes(type)
      ? selectedType.filter((item) => item !== type)
      : [...selectedType, type];
    update({
      type: URLSearchStateUpdateType.PHYSICAL_ENVIRONMENTS,
      payload: newType,
    });
  };

  return (
    <div className="flex flex-col space-y-2 w-fit">
      <span className="text-sm font-bold">Physical Environment</span>
      <Stack spacing={1} direction="column">
        {workplacePhysicalEnvironmentTypes.map((option) => (
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
