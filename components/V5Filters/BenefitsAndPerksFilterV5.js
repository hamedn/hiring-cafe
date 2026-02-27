import useURLSearchStateV4, {
  URLSearchStateUpdateType,
} from "@/hooks/useURLSearchStateV4";
import { ListOfBenefits } from "@/utils/constants";
import { Checkbox, Stack } from "@chakra-ui/react";
import { useCurrentSearchFilters } from "contexts/CurrentSearchFiltersContext";
import { useState, useEffect } from "react";

export default function BenefitsAndPerksFilterV5() {
  const { state: currentSearchState } = useCurrentSearchFilters();
  const [selectedBenefitsAndPerks, setSelectedBenefitsAndPerks] = useState([]);
  const { update } = useURLSearchStateV4();

  useEffect(() => {
    setSelectedBenefitsAndPerks(currentSearchState.benefitsAndPerks || []);
  }, [currentSearchState.benefitsAndPerks]);

  const handleCheckboxChange = (type) => {
    const newlySelectedBenefitsAndPerks = selectedBenefitsAndPerks.includes(
      type
    )
      ? selectedBenefitsAndPerks.filter((item) => item !== type)
      : [...selectedBenefitsAndPerks, type];
    update({
      type: URLSearchStateUpdateType.BENEFITS_AND_PERKS,
      payload: newlySelectedBenefitsAndPerks,
    });
  };

  return (
    <div className="flex flex-col p-4 space-y-8">
      {currentSearchState.benefitsAndPerks?.length > 0 ? (
        <span className="text-xs bg-neutral-100 p-2 rounded">
          <span className="text-green-600 font-bold">📝 Note:</span>{" "}
          {`Keep in
          mind that the benefits and perks you see here are based on the
          information from the job descriptions. Not every employer lists all
          benefits and perks in their job descriptions.`}
        </span>
      ) : null}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 pb-16">
        {Object.keys(ListOfBenefits).map((option) => {
          const value = ListOfBenefits[option];
          return (
            <Checkbox
              key={option}
              size={"lg"}
              colorScheme="pink"
              isChecked={selectedBenefitsAndPerks.includes(value)}
              onChange={() => handleCheckboxChange(value)}
            >
              <span className="text-base font-light">{option}</span>
            </Checkbox>
          );
        })}
      </div>
    </div>
  );
}
