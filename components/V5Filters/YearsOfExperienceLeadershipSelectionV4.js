import React, { useEffect, useState } from "react";
import {
  ChakraProvider,
  Box,
  RangeSlider,
  RangeSliderTrack,
  RangeSliderFilledTrack,
  RangeSliderThumb,
  Text,
  Checkbox,
  Flex,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverArrow,
  PopoverBody,
} from "@chakra-ui/react";
import "tailwindcss/tailwind.css";
import {
  ArrowPathIcon,
  QuestionMarkCircleIcon,
} from "@heroicons/react/24/outline";
import {
  maxYearsOfExperience,
  useCurrentSearchFilters,
} from "contexts/CurrentSearchFiltersContext";
import useURLSearchStateV4, {
  URLSearchStateUpdateType,
} from "@/hooks/useURLSearchStateV4";

const YearsOfExperienceLeadershipSelectionV4 = () => {
  const { state: currentSearchState } = useCurrentSearchFilters();
  const { update } = useURLSearchStateV4();
  const [range, setRange] = useState([0, maxYearsOfExperience]);
  const [excludeNoYoe, setExcludeNoYoe] = useState(false);

  const handleRangeChange = (val) => {
    setRange(val);
  };

  const handleCheckboxChange = (e) => {
    setExcludeNoYoe(e.target.checked);
    update({
      type: URLSearchStateUpdateType.EXCLUDE_IF_MANAGEMENT_YOE_IS_NOT_SPECIFIED,
      payload: e.target.checked,
    });
  };

  useEffect(() => {
    setRange(currentSearchState.managementYoeRange);
    setExcludeNoYoe(currentSearchState.excludeIfManagementYoeIsNotSpecified);
  }, [
    currentSearchState.managementYoeRange,
    currentSearchState.excludeIfManagementYoeIsNotSpecified,
  ]);

  if (
    currentSearchState.roleTypes?.length === 1 &&
    currentSearchState.roleTypes[0] === "Individual Contributor"
  ) {
    return null;
  }

  return (
    <ChakraProvider>
      <Box
        className={`p-4 ${
          range[0] > 0 || range[1] < maxYearsOfExperience
            ? "bg-pink-50/30 border border-pink-300 shadow-pink-600/30"
            : "border-2"
        } rounded-lg shadow-md`}
      >
        <div className="flex items-center space-x-2 mb-4">
          <span className="text-sm font-semibold">
            Years of Experience: Management & Leadership
          </span>
          {(range[0] > 0 || range[1] < maxYearsOfExperience) && (
            <button
              onClick={() => {
                update({
                  type: URLSearchStateUpdateType.MANAGEMENT_YOE_RANGE,
                  payload: [0, maxYearsOfExperience],
                });
              }}
            >
              <ArrowPathIcon className="h-4 w-4 flex-none text-red-600" />
            </button>
          )}
        </div>
        {(range[0] > 0 || range[1] < maxYearsOfExperience) && (
          <Flex align="center">
            <Checkbox
              colorScheme="pink"
              id="yoe_management_checkbox"
              isChecked={excludeNoYoe}
              onChange={handleCheckboxChange}
            />
            <div className="flex items-center space-x-2">
              <label htmlFor="yoe_management_checkbox" className="ml-2 text-sm">
                {`Exclude jobs that haven't mentioned this`}
              </label>
              <Popover>
                <PopoverTrigger>
                  <button>
                    <QuestionMarkCircleIcon className="h-5 w-5 flex-none text-gray-500" />
                  </button>
                </PopoverTrigger>
                <PopoverContent>
                  <PopoverArrow />
                  <PopoverBody p={4}>
                    <span className="text-sm">{`By default, jobs without specified years of leadership / management experience are included in the search results. Selecting this checkbox will exclude those jobs, ensuring only positions that meet your specified criteria are shown.`}</span>
                  </PopoverBody>
                </PopoverContent>
              </Popover>
            </div>
          </Flex>
        )}
        <Box>
          {(range[0] > 0 || range[1] < maxYearsOfExperience) && (
            <Text className="text-xs font-bold text-pink-500 my-4">
              {range[0] === 0 ? "0" : `${range[0]}`} -{" "}
              {range[1] >= maxYearsOfExperience
                ? maxYearsOfExperience + "+ years"
                : `${range[1]} years`}
            </Text>
          )}
          <RangeSlider
            defaultValue={[0, maxYearsOfExperience]}
            min={0}
            max={maxYearsOfExperience}
            step={1}
            value={range}
            onChange={handleRangeChange}
            onChangeEnd={(val) => {
              update({
                type: URLSearchStateUpdateType.MANAGEMENT_YOE_RANGE,
                payload: val,
              });
            }}
          >
            <RangeSliderTrack bg="pink.200">
              <RangeSliderFilledTrack bg="pink.600" />
            </RangeSliderTrack>
            <RangeSliderThumb boxSize={6} index={0} bgColor={"pink.200"} />
            <RangeSliderThumb boxSize={6} index={1} bgColor={"pink.200"} />
          </RangeSlider>
        </Box>
      </Box>
    </ChakraProvider>
  );
};

export default YearsOfExperienceLeadershipSelectionV4;
