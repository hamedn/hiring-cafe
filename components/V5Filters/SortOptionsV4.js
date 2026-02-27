import useURLSearchStateV4, {
  URLSearchStateUpdateType,
} from "@/hooks/useURLSearchStateV4";
import { Radio } from "@chakra-ui/react";
import { useCurrentSearchFilters } from "contexts/CurrentSearchFiltersContext";
import { sortOptions } from "contexts/CurrentSearchFiltersContext";

export default function SortOptionsV4({ onSelectClose }) {
  const { state: currentSearchState } = useCurrentSearchFilters();
  const { update } = useURLSearchStateV4();

  const handleRadioChange = (value) => {
    update({
      type: URLSearchStateUpdateType.SORT_BY,
      payload: value || null,
    });
    if (onSelectClose) onSelectClose();
  };

  return (
    <div className="flex flex-col w-full space-y-2 text-sm">
      {sortOptions.map((option) => (
        <div
          key={option.value}
          className={`p-2 rounded w-full ${
            currentSearchState.sortBy === option.value ? "bg-gray-200" : ""
          }`}
        >
          <Radio
            colorScheme="pink"
            isChecked={currentSearchState.sortBy === option.value}
            onChange={() => handleRadioChange(option.value)}
          >
            {option.label}
          </Radio>
        </div>
      ))}
    </div>
  );
}
