import useURLSearchStateV4, {
  URLSearchStateUpdateType,
} from "@/hooks/useURLSearchStateV4";
import { securityClearanceTypes } from "@/utils/constants";
import { Checkbox } from "@chakra-ui/react";
import { useCurrentSearchFilters } from "contexts/CurrentSearchFiltersContext";
import { useState, useEffect } from "react";

export default function SecurityClearanceSelectionV5() {
  const { state: currentSearchState } = useCurrentSearchFilters();
  const [selectedSecurityClearances, setSelectedSecurityClearances] = useState(
    []
  );
  const { update } = useURLSearchStateV4();

  useEffect(() => {
    setSelectedSecurityClearances(currentSearchState.securityClearances || []);
  }, [currentSearchState.securityClearances]);

  const handleCheckboxChange = (type) => {
    const newselectedSecurityClearances = selectedSecurityClearances.includes(
      type
    )
      ? selectedSecurityClearances.filter((item) => item !== type)
      : [...selectedSecurityClearances, type];
    update({
      type: URLSearchStateUpdateType.SECURITY_CLEARANCES,
      payload: newselectedSecurityClearances,
    });
  };

  return (
    <div className="flex flex-col space-y-2 w-fit p-4">
      {securityClearanceTypes.map((option) => (
        <Checkbox
          key={option}
          size={"lg"}
          colorScheme="pink"
          isChecked={selectedSecurityClearances.includes(option)}
          onChange={() => handleCheckboxChange(option)}
          className={`${option === "None" ? "text-green-600" : ""}`}
        >
          <span className="text-base font-light">
            {option === "None" ? "No explicit reference to clearance" : option}
          </span>
        </Checkbox>
      ))}
    </div>
  );
}
