import { useAuth } from "@/hooks/useAuth";
import useURLSearchStateV4, {
  URLSearchStateUpdateType,
} from "@/hooks/useURLSearchStateV4";
import { hideJobsOptions } from "@/utils/constants";
import {
  Checkbox,
  Popover,
  PopoverArrow,
  PopoverContent,
  PopoverTrigger,
  Stack,
} from "@chakra-ui/react";
import { QuestionMarkCircleIcon } from "@heroicons/react/24/outline";
import { useCurrentSearchFilters } from "contexts/CurrentSearchFiltersContext";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function HideJobsOptionsV4() {
  const { state: currentSearchState } = useCurrentSearchFilters();
  const { update } = useURLSearchStateV4();
  const [selectedHiddenOptions, setSelectedHiddenOptions] = useState([]);
  const { user, loading: loadingUser } = useAuth();

  useEffect(() => {
    setSelectedHiddenOptions(currentSearchState.hideJobTypes || []);
  }, [currentSearchState.hideJobTypes]);

  const handleCheckboxChange = (type) => {
    const newselectedHiddenOptions = selectedHiddenOptions.includes(type)
      ? selectedHiddenOptions.filter((item) => item !== type)
      : [...selectedHiddenOptions, type];

    setSelectedHiddenOptions(newselectedHiddenOptions);
    update({
      type: URLSearchStateUpdateType.HIDE_JOB_TYPES,
      payload: newselectedHiddenOptions,
    });
  };

  return (
    <div className="flex flex-col space-y-2 w-fit">
      <div className="flex flex-col space-y-1">
        {!user && !loadingUser && (
          <Link
            href={"/auth"}
            className="text-xs border px-2 py-0.5 w-fit rounded-full text-yellow-600 border-yellow-600"
          >
            Log in to use this filter
          </Link>
        )}
      </div>
      {hideJobsOptions
        .filter((o) => !o.toLocaleLowerCase().includes("hid"))
        .map((option) => (
          <Checkbox
            key={option}
            size={"lg"}
            colorScheme="pink"
            isChecked={selectedHiddenOptions.includes(option)}
            onChange={() => handleCheckboxChange(option)}
            disabled={!user || loadingUser}
          >
            <span className="text-base">Exclude {option} Jobs</span>
          </Checkbox>
        ))}
    </div>
  );
}
