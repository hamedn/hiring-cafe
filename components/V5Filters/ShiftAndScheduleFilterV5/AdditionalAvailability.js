import useURLSearchStateV4, {
  URLSearchStateUpdateType,
} from "@/hooks/useURLSearchStateV4";
import { Radio } from "@chakra-ui/react";
import { useCurrentSearchFilters } from "contexts/CurrentSearchFiltersContext";
import { useState } from "react";

const AvailabilityMapping = {
  WEEKEND: {
    title: "Weekend Availability",
    field: "weekendAvailabilityRequired",
    url: URLSearchStateUpdateType.WEEKEND_AVAILABILITY_REQUIRED,
  },
  HOLIDAYS: {
    title: "Holiday Availability",
    field: "holidayAvailabilityRequired",
    url: URLSearchStateUpdateType.HOLIDAY_AVAILABILITY_REQUIRED,
  },
  OVERTIME: {
    title: "Overtime Availability",
    field: "overtimeRequired",
    url: URLSearchStateUpdateType.OVERTIME_REQUIRED,
  },
};

export default function AdditionalAvailability() {
  const { state: currentSearchState } = useCurrentSearchFilters();
  const { update } = useURLSearchStateV4();

  return (
    <div className="flex flex-col space-y-8 w-fit">
      {Object.keys(AvailabilityMapping).map((type) => (
        <div className="flex flex-col space-y-2" key={type}>
          <span className="font-bold text-sm">
            {AvailabilityMapping[type].title}
          </span>
          {["Required", "Not Indicated", "Doesn't Matter"].map((option) => (
            <Radio
              key={option}
              value={option}
              colorScheme="pink"
              isChecked={
                currentSearchState[AvailabilityMapping[type].field] === option
              }
              onChange={(e) => {
                update({
                  type: AvailabilityMapping[type].url,
                  payload: e.target.value,
                });
              }}
            >
              {option}
            </Radio>
          ))}
        </div>
      ))}
    </div>
  );
}
