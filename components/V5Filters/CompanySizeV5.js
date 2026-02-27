import { useState, useEffect } from "react";
import useURLSearchStateV4, {
  URLSearchStateUpdateType,
} from "@/hooks/useURLSearchStateV4";
import { useCurrentSearchFilters } from "@/contexts/CurrentSearchFiltersContext";

const companySizeOptions = [
  { label: "All", value: null },
  { label: "1 - 10 employees", value: [1, 10] },
  { label: "11 - 50 employees", value: [11, 50] },
  { label: "51 - 200 employees", value: [51, 200] },
  { label: "201 - 500 employees", value: [201, 500] },
  { label: "501 - 1000 employees", value: [501, 1000] },
  { label: "1001 - 2000 employees", value: [1001, 2000] },
  { label: "2001 - 5000 employees", value: [2001, 5000] },
  { label: "5001 - 10000 employees", value: [5001, 10000] },
  { label: "10001+ employees", value: [10001, null] },
];

export default function CompanySizeV5() {
  const { state: currentState } = useCurrentSearchFilters();
  const { update } = useURLSearchStateV4();

  const [selectedRanges, setSelectedRanges] = useState(
    currentState.companySizeRanges || []
  );

  useEffect(() => {
    setSelectedRanges(currentState.companySizeRanges || []);
  }, [currentState.companySizeRanges]);

  const handleCheckboxChange = (value) => {
    let newRanges;
    if (value === null) {
      newRanges = [];
    } else {
      const isAlreadySelected = selectedRanges.some(
        (r) => JSON.stringify(r) === JSON.stringify(value)
      );
      if (isAlreadySelected) {
        newRanges = selectedRanges.filter(
          (r) => JSON.stringify(r) !== JSON.stringify(value)
        );
      } else {
        newRanges = selectedRanges.filter((r) => r !== null);
        newRanges.push(value);
      }
    }
    setSelectedRanges(newRanges);
    update({
      type: URLSearchStateUpdateType.COMPANY_SIZE_RANGES,
      payload: newRanges,
    });
  };

  return (
    <div className="flex flex-col w-full space-y-2 text-sm p-4">
      {companySizeOptions.map((option) => {
        const isChecked =
          option.value === null
            ? selectedRanges.length === 0
            : selectedRanges.some(
                (r) => JSON.stringify(r) === JSON.stringify(option.value)
              );
        return (
          <div
            key={option.label}
            className={`p-2 rounded w-full ${
              isChecked && option.value ? "bg-pink-50" : ""
            }`}
          >
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={isChecked}
                onChange={() => handleCheckboxChange(option.value)}
                className="accent-pink-600"
              />
              <span className="ml-2">{option.label}</span>
            </label>
          </div>
        );
      })}
    </div>
  );
}
