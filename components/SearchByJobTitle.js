import useURLSearchStateV4, {
  URLSearchStateUpdateType,
} from "@/hooks/useURLSearchStateV4";
import {
  Box,
  Checkbox,
  Popover,
  PopoverArrow,
  PopoverContent,
  PopoverTrigger,
  useDisclosure,
  useOutsideClick,
} from "@chakra-ui/react";
import { QuestionMarkCircleIcon } from "@heroicons/react/24/outline";
import { useCurrentSearchFilters } from "contexts/CurrentSearchFiltersContext";
import { useMemo, useRef } from "react";

export default function SearchByJobTitle({ query }) {
  const { update } = useURLSearchStateV4();
  const { state: currentSearchState } = useCurrentSearchFilters();
  const discloser = useDisclosure();
  const ref = useRef();

  const isRestrictedByJobTitle = useMemo(
    () =>
      currentSearchState.restrictedSearchAttributes?.includes(
        "v5_processed_job_data.core_job_title"
      ) ||
      currentSearchState.restrictedSearchAttributes?.includes(
        "job_information.title"
      ),
    [currentSearchState.restrictedSearchAttributes]
  );

  useOutsideClick({
    ref: ref,
    handler: () => {
      ref?.current && discloser.onClose();
    },
  });

  return (
    <div
      className={`flex items-center space-x-1 text-sm ${
        isRestrictedByJobTitle ? "text-pink-500 font-bold" : "text-gray-800"
      }`}
    >
      <Checkbox
        size="sm"
        colorScheme="pink"
        isChecked={isRestrictedByJobTitle}
        onChange={(e) => {
          if (e.target.checked) {
            update({
              type: URLSearchStateUpdateType.RESTRICTED_SEARCH_ATTRIBUTES,
              payload: [
                "v5_processed_job_data.core_job_title",
                "job_information.title",
              ],
            });
          } else {
            update({
              type: URLSearchStateUpdateType.RESTRICTED_SEARCH_ATTRIBUTES,
              payload: [],
            });
          }
        }}
      >
        <span className="font-bold">Search by job title</span>
      </Checkbox>
      <Box ref={ref} className="">
        <Popover {...discloser}>
          <PopoverTrigger>
            <QuestionMarkCircleIcon className="w-4 h-4 cursor-pointer" />
          </PopoverTrigger>
          <PopoverContent>
            <PopoverArrow />
            <div className="p-2 text-sm text-black">
              {`Jobs must have '${query || ""}' in the job title.`}
            </div>
          </PopoverContent>
        </Popover>
      </Box>
    </div>
  );
}
