import useURLSearchStateV4, {
  URLSearchStateUpdateType,
} from "@/hooks/useURLSearchStateV4";
import { EncouragedToApplyGroupTypes } from "@/utils/constants";
import { Checkbox } from "@chakra-ui/react";
import { useCurrentSearchFilters } from "contexts/CurrentSearchFiltersContext";
import { useState, useEffect } from "react";

export default function EncouragedToApplyV5() {
  const { state: currentSearchState } = useCurrentSearchFilters();
  const [encouragedToApplyChoices, setEncouragedToApplyChoices] = useState([]);
  const { update } = useURLSearchStateV4();

  useEffect(() => {
    setEncouragedToApplyChoices(currentSearchState.encouragedToApply || []);
  }, [currentSearchState.encouragedToApply]);

  const handleCheckboxChange = (type) => {
    const newChoices = encouragedToApplyChoices.includes(type)
      ? encouragedToApplyChoices.filter((item) => item !== type)
      : [...encouragedToApplyChoices, type];
    update({
      type: URLSearchStateUpdateType.ENCOURAGED_TO_APPLY,
      payload: newChoices,
    });
  };

  return (
    <div className="flex flex-col space-y-2 pb-8 p-4 w-fit">
      {Object.keys(EncouragedToApplyGroupTypes).map((option) => {
        const value = EncouragedToApplyGroupTypes[option];
        return (
          <Checkbox
            key={option}
            size={"lg"}
            colorScheme="pink"
            isChecked={encouragedToApplyChoices.includes(value)}
            onChange={() => handleCheckboxChange(value)}
          >
            <span className="text-base font-light">{option}</span>
          </Checkbox>
        );
      })}
    </div>
  );
}
