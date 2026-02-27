import useURLSearchStateV4, {
  URLSearchStateUpdateType,
} from "@/hooks/useURLSearchStateV4";
import { Radio } from "@chakra-ui/react";
import { useCurrentSearchFilters } from "contexts/CurrentSearchFiltersContext";

export const dateSelectionOptions = [
  { label: "All time", value: -1 },
  { label: "Past 24 hours", value: 2 },
  { label: "3 days", value: 4 },
  { label: "1 week", value: 14 },
  { label: "2 weeks", value: 21 },
  { label: "3 weeks", value: 29 },
  { label: "1 month", value: 61 },
  { label: "2 months", value: 91 },
  { label: "3 months", value: 121 },
  { label: "4 months", value: 151 },
  { label: "5 months", value: 181 },
  { label: "6 months", value: 211 },
  { label: "1 year", value: 750 },
  { label: "2 years", value: 1080 },
  { label: "3 years", value: 1440 },
];

export default function DateSelectionV4({ onSelectClose }) {
  const { state: currentSearchState } = useCurrentSearchFilters();
  const { update } = useURLSearchStateV4();

  const handleRadioChange = (value) => {
    update({
      type: URLSearchStateUpdateType.DATE_FETCHED_PAST_N_DAYS,
      payload: value || null,
    });
    if (onSelectClose) onSelectClose();
  };

  return (
    <div className="flex flex-col w-full space-y-2 text-sm">
      {dateSelectionOptions.map((option) => (
        <div
          key={option.label}
          className={`p-2 rounded w-full ${
            currentSearchState.dateFetchedPastNDays === option.value
              ? "bg-gray-200"
              : ""
          }`}
        >
          <Radio
            colorScheme="pink"
            isChecked={currentSearchState.dateFetchedPastNDays === option.value}
            onChange={() => handleRadioChange(option.value)}
          >
            {option.label}
          </Radio>
        </div>
      ))}
    </div>
  );
}
