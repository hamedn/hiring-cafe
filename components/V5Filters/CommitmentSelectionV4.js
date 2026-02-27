import { useCurrentSearchFilters } from "contexts/CurrentSearchFiltersContext";
import { commitmentTypeOptions } from "@/utils/constants";
import { Checkbox, Stack } from "@chakra-ui/react";
import useURLSearchStateV4, {
  URLSearchStateUpdateType,
} from "@/hooks/useURLSearchStateV4";

export default function CommitmentSelectionV4() {
  const { state: currentSearchState } = useCurrentSearchFilters();
  const { update } = useURLSearchStateV4();

  const handleCommitmentChange = (event) => {
    const { value, checked } = event.target;
    const updatedCommitmentTypes = checked
      ? [...currentSearchState.commitmentTypes, value]
      : currentSearchState.commitmentTypes.filter((type) => type !== value);

    update({
      type: URLSearchStateUpdateType.COMMITMENT_TYPES,
      payload: updatedCommitmentTypes,
    });
  };

  return (
    <div className="p-4">
      <Stack spacing={1} direction="column">
        {commitmentTypeOptions.map((type) => (
          <Checkbox
            key={`commitment-${type}`}
            colorScheme="pink"
            size={"lg"}
            value={type}
            isChecked={currentSearchState.commitmentTypes.includes(type)}
            onChange={handleCommitmentChange}
          >
            <span className="text-base font-light">{type}</span>
          </Checkbox>
        ))}
      </Stack>
    </div>
  );
}
