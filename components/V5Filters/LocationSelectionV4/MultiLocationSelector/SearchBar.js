import {
  MagnifyingGlassIcon,
  InformationCircleIcon,
} from "@heroicons/react/24/outline";
import axios from "axios";
import { debounce } from "lodash";
import AsyncSelect from "react-select/async";
import { components } from "react-select";
import useURLSearchStateV4, {
  URLSearchStateUpdateType,
} from "@/hooks/useURLSearchStateV4";
import { trackedAxiosGet } from "@/utils/trackedFetch";
import { useState } from "react";
import {
  defaultRadius,
  useCurrentSearchFilters,
} from "@/contexts/CurrentSearchFiltersContext";
import { getLocationKey } from "@/utils/helpers";
import { CheckIcon } from "@heroicons/react/20/solid";

const ControlWithMagnifier = ({ children, ...props }) => (
  <components.Control {...props}>
    <div className="ml-2 mr-1">
      <MagnifyingGlassIcon className="h-6 w-6 flex-none text-gray-500" />
    </div>
    {children}
  </components.Control>
);

const searchLocation = async (query) => {
  try {
    const { data } = await trackedAxiosGet(axios, `/api/searchLocation`, {
      params: { query },
    });
    return data;
  } catch (e) {
    if (e.response?.data?.details?.status === "ZERO_RESULTS") return null;
    toast({
      title: "Error",
      description: "Too much traffic on the server. Please try again later.",
      status: "error",
      duration: 5000,
      isClosable: true,
    });
    console.trace(e);
    return null;
  }
};

export default function SearchBar() {
  const { update, searchState: queryState } = useURLSearchStateV4();
  const [inputValue, setInputValue] = useState("");
  const { state: currentSearchState } = useCurrentSearchFilters();
  const { locations = [] } = currentSearchState;
  const [showTip, setShowTip] = useState(true);

  const handleSelectChange = (selection) => {
    if (!selection?.placeDetail) {
      if (!selection) return;
      alert("ERROR! Please contact support: ali@hiring.cafe");
      return;
    }
    const { placeDetail } = selection;
    const already = locations.some(
      (p) => getLocationKey(p) === getLocationKey(placeDetail)
    );
    const usingDefault =
      !queryState.locations?.length &&
      queryState.defaultToUserLocation !== false;
    if (already && !usingDefault) return;

    const type = placeDetail.types[0];
    let options = {};
    switch (type) {
      case "locality":
        options = {
          radius: defaultRadius,
          radius_unit: "miles",
          ignore_radius: false,
        };
        break;
      case "administrative_area_level_1":
        options = {
          flexible_regions: [
            "anywhere_in_country",
            "anywhere_in_continent",
            "anywhere_in_world",
          ],
        };
        break;
      case "country":
        options = {
          flexible_regions: ["anywhere_in_continent", "anywhere_in_world"],
        };
        break;
      case "continent":
        options = { flexible_regions: ["anywhere_in_world"] };
        break;
    }

    update({
      type: URLSearchStateUpdateType.ADD_LOCATION,
      payload: {
        ...placeDetail,
        workplace_types:
          currentSearchState.workplaceTypes?.length > 0 &&
          currentSearchState.workplaceTypes?.length < 3
            ? currentSearchState.workplaceTypes
            : [],
        options,
      },
    });
    setInputValue("");
  };

  return (
    <div className="flex flex-col">
      {queryState.locations?.length === 1 && showTip && (
        <div className="relative flex items-center space-x-2 my-2 px-2 py-1 bg-white border-l-4 border-green-500 rounded">
          <InformationCircleIcon className="h-5 w-5 text-green-500" />
          <span className="text-sm text-gray-700 truncate">
            <span className="font-bold">Pro Tip:</span> Add more locations below
            to expand your search.
          </span>
          <button
            className="ml-auto text-gray-400 hover:text-gray-600 p-1"
            onClick={() => setShowTip(false)}
            aria-label="Dismiss tip"
          >
            <CheckIcon className="h-4 w-4" />
          </button>
        </div>
      )}

      <AsyncSelect
        maxMenuHeight={200}
        menuPortalTarget={document.body}
        components={{ Control: ControlWithMagnifier }}
        styles={{
          menuPortal: (base) => ({ ...base, zIndex: 9999 }),
          control: (base, state) => ({
            ...base,
            borderWidth: "1.5px",
            minHeight: "40px",
            borderColor: state.isFocused ? "gray" : "gray",
            boxShadow: state.isFocused ? "0 0 0 1.5px gray" : "none",
            "&:hover": {
              borderColor: "gray",
            },
            paddingLeft: "0.375rem",
            paddingTop: "0.375rem",
            paddingBottom: "0.375rem",
          }),
        }}
        instanceId="multi_location_selector"
        placeholder={
          queryState?.locations?.length > 0
            ? `Additional cities, states, countries, or continents`
            : `Search cities, states, countries, or continents`
        }
        noOptionsMessage={(obj) => (!obj.inputValue ? null : "No results")}
        isClearable
        loadOptions={debounce((inputValue, callback) => {
          searchLocation(inputValue).then((data) => {
            callback(data || null);
          });
        }, 100)}
        onChange={handleSelectChange}
        value={inputValue}
      />
    </div>
  );
}
