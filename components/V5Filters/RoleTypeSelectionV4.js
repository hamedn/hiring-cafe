import useURLSearchStateV4, {
  URLSearchStateUpdateType,
} from "@/hooks/useURLSearchStateV4";
import { roleTypeOptions } from "@/utils/constants";
import { Picture } from "@/utils/picture";
import {
  Checkbox,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Stack,
} from "@chakra-ui/react";
import { QuestionMarkCircleIcon } from "@heroicons/react/24/outline";
import { useCurrentSearchFilters } from "contexts/CurrentSearchFiltersContext";
import { useState, useEffect } from "react";

export default function RoleTypeSelectionV4() {
  const { state: currentSearchState } = useCurrentSearchFilters();
  const { update } = useURLSearchStateV4();
  const [selectedRoleTypes, setSelectedRoleTypes] = useState([]);

  useEffect(() => {
    setSelectedRoleTypes(currentSearchState.roleTypes || []);
  }, [currentSearchState.roleTypes]);

  const handleCheckboxChange = (roleTypeOption) => {
    let newSelectedRoleTypes;
    if (selectedRoleTypes.includes(roleTypeOption)) {
      // Remove the option if it's already selected
      newSelectedRoleTypes = selectedRoleTypes.filter(
        (item) => item !== roleTypeOption
      );
    } else {
      // Add the option if it's not selected
      newSelectedRoleTypes = [...selectedRoleTypes, roleTypeOption];
    }

    setSelectedRoleTypes(newSelectedRoleTypes);
    update({
      type: URLSearchStateUpdateType.ROLE_TYPES,
      payload: newSelectedRoleTypes,
    });
  };

  return (
    <div className="flex flex-col space-y-2">
      <div className="flex items-center space-x-2">
        <span className="text-sm font-bold">Role Type</span>
        <Popover>
          <PopoverTrigger>
            <button>
              <QuestionMarkCircleIcon className="h-5 w-5 flex-none text-gray-500" />
            </button>
          </PopoverTrigger>
          <PopoverContent>
            <PopoverArrow />
            <PopoverBody>
              <div className="flex flex-col space-y-2">
                <div className="flex flex-col">
                  <span className="text-sm font-bold">{`Individual Contributor`}</span>
                  <Picture
                    src={"https://i.giphy.com/nPwCOFWfXfBwZBVcV3.webp"}
                    properties={"h-28 w-28 object-contain flex-none"}
                  />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-bold">{`People Manager`}</span>
                  <Picture
                    src={"https://i.giphy.com/cXblnKXr2BQOaYnTni.webp"}
                    properties={"h-28 w-28 object-contain flex-none"}
                  />
                </div>
              </div>
            </PopoverBody>
          </PopoverContent>
        </Popover>
      </div>
      <Stack spacing={1} direction="column">
        {roleTypeOptions.map((roleTypeOption) => (
          <Checkbox
            key={roleTypeOption}
            size={"lg"}
            colorScheme="pink"
            isChecked={selectedRoleTypes.includes(roleTypeOption)}
            onChange={() => handleCheckboxChange(roleTypeOption)}
          >
            <span className="text-base font-light">{roleTypeOption}</span>
          </Checkbox>
        ))}
      </Stack>
    </div>
  );
}
