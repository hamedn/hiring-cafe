import useURLSearchStateV4, {
  URLSearchStateUpdateType,
} from "@/hooks/useURLSearchStateV4";
import { workplaceTypeOptions } from "@/utils/constants";
import { Checkbox, Stack } from "@chakra-ui/react";
import { useCurrentSearchFilters } from "contexts/CurrentSearchFiltersContext";
import { useState, useEffect } from "react";

export default function WorkplaceTypeSelectionV4() {
  const { state: currentSearchState } = useCurrentSearchFilters();
  const [selectedWorkplaceTypes, setSelectedWorkplaceTypes] = useState([]);
  const { update, searchState } = useURLSearchStateV4();

  useEffect(() => {
    setSelectedWorkplaceTypes(currentSearchState.workplaceTypes || []);
  }, [currentSearchState.workplaceTypes]);

  const handleCheckboxChange = (type) => {
    const newSelectedWorkplaceTypes = selectedWorkplaceTypes.includes(type)
      ? selectedWorkplaceTypes.filter((item) => item !== type)
      : [...selectedWorkplaceTypes, type];
    update({
      type: URLSearchStateUpdateType.WORKPLACE_TYPES,
      payload: newSelectedWorkplaceTypes,
    });
  };

  if (searchState.locations?.length > 0) {
    return null;
  }

  return (
    <div className="flex flex-col space-y-2 w-fit">
      <span className="text-sm font-bold">Workplace Type</span>
      <Stack spacing={1} direction="column">
        {workplaceTypeOptions.map((option) => (
          <Checkbox
            key={option}
            size={"lg"}
            colorScheme="pink"
            isChecked={selectedWorkplaceTypes.includes(option)}
            onChange={() => handleCheckboxChange(option)}
          >
            <span className="text-base font-light">{option}</span>
          </Checkbox>
        ))}
      </Stack>
    </div>
  );
}
