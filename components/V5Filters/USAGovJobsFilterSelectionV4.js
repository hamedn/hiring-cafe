import useURLSearchStateV4, {
  URLSearchStateUpdateType,
} from "@/hooks/useURLSearchStateV4";
import {
  Popover,
  PopoverArrow,
  PopoverContent,
  PopoverTrigger,
  Radio,
  Stack,
} from "@chakra-ui/react";
import { QuestionMarkCircleIcon } from "@heroicons/react/24/outline";
import { useCurrentSearchFilters } from "contexts/CurrentSearchFiltersContext";
import Link from "next/link";

export default function USAGovJobsFilterSelectionV4() {
  const { state: currentSearchState } = useCurrentSearchFilters();
  const { update } = useURLSearchStateV4();

  const options = [
    { label: "Ok to include jobs from USAJobs.gov", value: null },
    { label: "Only show jobs from USAJobs.gov", value: "exclusive" },
    { label: "Do not show any jobs from USAJobs.gov", value: "exclude" },
  ];

  return (
    <div className="flex flex-col space-y-2">
      <div className="flex items-center space-x-2">
        <span className="text-sm font-bold">🇺🇸 USAJobs.gov</span>
        <Popover>
          <PopoverTrigger>
            <button>
              <QuestionMarkCircleIcon className="h-5 w-5 flex-none text-gray-500" />
            </button>
          </PopoverTrigger>
          <PopoverContent>
            <PopoverArrow />
            <div className="p-4 flex-wrap text-sm">
              <span className="font-medium">{`The wonderful folks at USAJobs.gov granted HiringCafe access to their job postings data! `}</span>
              <Link
                href="https://www.reddit.com/r/hiringcafe/comments/1ewi4wv/us_government_jobs_on_hiringcafe/"
                className="text-blue-600 font-bold"
                target="_blank"
                rel="noopener noreferrer"
              >
                Learn more
              </Link>
            </div>
          </PopoverContent>
        </Popover>
      </div>
      {/* {currentSearchState.applicationFormEase?.length === 1 &&
      currentSearchState.applicationFormEase[0] === "Simple" ? (
        <span className="text-xs bg-gray-100 font-light rounded w-fit p-1.5">
          💡 <span className="font-bold text-green-600">Pro tip:</span> To avoid
          missing out on great opportunities because of a tedious application
          process, consider selecting one filter at a time. For example, you can
          fill out simple applications first and then come back to the
          time-consuming ones.
        </span>
      ) : null} */}
      <Stack spacing={1} direction="column">
        {options.map((option, i) => (
          <Radio
            key={option.value || "0"}
            size={"lg"}
            colorScheme="pink"
            isChecked={
              (!currentSearchState.usaGovPref && !option.value) ||
              currentSearchState.usaGovPref === option.value
            }
            onChange={() =>
              update({
                type: URLSearchStateUpdateType.USAGOV_PREF,
                payload: option.value,
              })
            }
          >
            <span className="text-base font-light">{options[i].label}</span>
          </Radio>
        ))}
      </Stack>
    </div>
  );
}
