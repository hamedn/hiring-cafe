import useURLSearchStateV4, {
  URLSearchStateUpdateType,
} from "@/hooks/useURLSearchStateV4";
import {
  Checkbox,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
} from "@chakra-ui/react";
import {
  QuestionMarkCircleIcon,
  EyeSlashIcon,
} from "@heroicons/react/24/outline";
import { useCurrentSearchFilters } from "contexts/CurrentSearchFiltersContext";

export default function RestrictToTransparent() {
  const { state: currentSearchState } = useCurrentSearchFilters();
  const { update } = useURLSearchStateV4();

  return (
    <div className="bg-gray-50 border border-gray-200 rounded-md p-4">
      <div className="flex items-center space-x-2">
        <EyeSlashIcon className="h-5 w-5 text-gray-500" />
        <h3 className="text-md font-medium text-pink-600">
          Undisclosed Salary Preference
        </h3>
        <Popover>
          <PopoverTrigger>
            <button className="hover:bg-gray-200 p-1 rounded-full transition-colors">
              <QuestionMarkCircleIcon className="h-4 w-4 text-gray-400" />
            </button>
          </PopoverTrigger>
          <PopoverContent>
            <PopoverArrow />
            <PopoverBody className="p-4">
              <span className="text-sm text-gray-600">
                How would you like to handle jobs that do not disclose their
                salary?
              </span>
            </PopoverBody>
          </PopoverContent>
        </Popover>
      </div>
      <Checkbox
        isChecked={currentSearchState.restrictJobsToTransparentSalaries}
        onChange={(e) => {
          update({
            type: URLSearchStateUpdateType.RESTRICT_JOBS_TO_TRANSPARENT_SALARIES,
            payload: e.target.checked,
          });
        }}
        colorScheme="pink"
        className="mt-2 text-sm text-gray-600"
      >
        Hide jobs with undisclosed salaries
      </Checkbox>
    </div>
  );
}
