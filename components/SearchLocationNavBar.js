import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useBreakpointValue,
  useDisclosure,
  useOutsideClick,
} from "@chakra-ui/react";
import { useMemo, useRef } from "react";
import {
  defaultRadius,
  useCurrentSearchFilters,
} from "contexts/CurrentSearchFiltersContext";
import {
  cognitiveDemandLevelTypes,
  computerUsageLevelTypes,
  oralCommunicationLevelTypes,
  physicalLaborIntensityTypes,
  physicalPositionTypes,
  workplacePhysicalEnvironmentTypes,
  workplaceTypeOptions,
} from "@/utils/constants";
import _ from "lodash";
import useMobileDeviceDetection from "@/hooks/useMobileDeviceDetection";
import LocationSelectionV4 from "./V5Filters/LocationSelectionV4";
import { ISO_COUNTRIES } from "@/utils/backend/countries";
import { ChevronDownIcon, MapPinIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/router";
import useURLSearchStateV4 from "@/hooks/useURLSearchStateV4";
import { MapPinIcon as MapPinIconSolid } from "@heroicons/react/20/solid";

export const locationRelatedKeys = [
  "locations",
  "workplaceTypes",
  "defaultToUserLocation",
  "physicalEnvironments",
  "physicalLaborIntensity",
  "physicalPositions",
  "oralCommunicationLevels",
  "computerUsageLevels",
  "cognitiveDemandLevels",
];

const locLabel = (location) => {
  if (!location) {
    return "";
  }

  let label = "";

  const {
    formatted_address,
    address_components: addressComponents,
    types,
  } = location;

  label = formatted_address;

  const city = addressComponents?.find((comp) =>
    comp.types.includes("locality")
  )?.long_name;

  const state = addressComponents?.find((comp) =>
    comp.types.includes("administrative_area_level_1")
  )?.long_name;

  const country = addressComponents?.find((comp) =>
    comp.types.includes("country")
  )?.long_name;

  const continent = addressComponents?.find((comp) =>
    comp.types.includes("continent")
  )?.long_name;

  switch (types?.[0] || "") {
    case "locality":
      if (city) {
        label = city;
      }
      break;
    case "administrative_area_level_1":
      if (state) {
        label = state;
      }
      break;
    case "country":
      if (country) {
        label = ISO_COUNTRIES[country] || country;
      }
      break;
    case "continent":
      if (continent) {
        label = continent;
      }
      break;
  }

  return label;
};

export const locationLabel = (locations) => {
  if (locations?.length === 1 && locations[0].types?.includes("locality")) {
    const {
      formatted_address,
      address_components: addressComponents,
      options = {},
    } = locations[0];

    let label = formatted_address;

    const city = addressComponents?.find((comp) =>
      comp.types.includes("locality")
    )?.long_name;

    if (city) {
      label = city;
    }

    if (options.ignore_radius) {
      label = "Exactly in " + label;
    } else {
      label +=
        " • " +
        (options.radius || defaultRadius) +
        ` ${options.radius_unit || "miles"}`;
    }

    return label;
  }

  return (
    (locations || []).map((location) => locLabel(location)).join(" | ") ||
    "Anywhere in the world"
  );
};

const workplacesLabel = ({ state, searchState }) => {
  if (searchState.locations?.length) {
    // If there are multiple locations, return "Multiple workplaces"
    if (state.locations?.length > 1) {
      return "Multiple places";
    }

    // If there is only one location, return the workplace types
    if (state.locations?.length === 1) {
      return state.locations[0].workplace_types?.length === 1
        ? `${state.locations[0].workplace_types[0]} only`
        : (state.locations[0].workplace_types?.length >= 3 ||
          state.locations[0].workplace_types?.length === 0
            ? workplaceTypeOptions
            : state.locations[0].workplace_types || workplaceTypeOptions
          ).join(" · ");
    }
  } else {
    return state.workplaceTypes?.length === 1
      ? `${state.workplaceTypes[0]} only`
      : (state.workplaceTypes?.length >= 3
          ? workplaceTypeOptions
          : state.workplaceTypes || workplaceTypeOptions
        ).join(" · ");
  }
};

const physicalEnvironmentsLabel = ({ state }) => {
  return state.physicalEnvironments?.length === 0
    ? ""
    : state.physicalEnvironments.length === 1
    ? `${state.physicalEnvironments[0]} only`
    : workplacePhysicalEnvironmentTypes.every((option) =>
        state.physicalEnvironments.includes(option)
      )
    ? "All Environments"
    : state.physicalEnvironments.join(" · ");
};

function LocationNavBarDisplay() {
  const { state: currentSearchState, isLoading: isLoadingSearchState } =
    useCurrentSearchFilters();
  const { searchState } = useURLSearchStateV4();

  const { locations = [] } = currentSearchState;

  const location = useMemo(() => {
    if (isLoadingSearchState) {
      return "Loading...";
    }

    return locationLabel(locations);
  }, [locations, isLoadingSearchState]);

  const workplaces = useMemo(
    () => workplacesLabel({ state: currentSearchState, searchState }),
    [currentSearchState]
  );

  const physicalEnvironmnets = useMemo(
    () => physicalEnvironmentsLabel({ state: currentSearchState }),
    [currentSearchState]
  );

  const countMore = useMemo(() => {
    const intensityCount =
      !currentSearchState.physicalLaborIntensity?.length ||
      physicalLaborIntensityTypes.every((option) =>
        currentSearchState.physicalLaborIntensity.includes(option)
      )
        ? 0
        : currentSearchState.physicalLaborIntensity.length;

    const physicalPositionsCount =
      !currentSearchState.physicalPositions?.length ||
      physicalPositionTypes.every((option) =>
        currentSearchState.physicalPositions.includes(option)
      )
        ? 0
        : currentSearchState.physicalPositions.length;

    const oralCommunicationLevelsCount =
      !currentSearchState.oralCommunicationLevels?.length ||
      oralCommunicationLevelTypes.every((option) =>
        currentSearchState.oralCommunicationLevels.includes(option)
      )
        ? 0
        : currentSearchState.oralCommunicationLevels.length;

    const computerUsageLevelsCount =
      !currentSearchState.computerUsageLevels?.length ||
      computerUsageLevelTypes.every((option) =>
        currentSearchState.computerUsageLevels.includes(option)
      )
        ? 0
        : currentSearchState.computerUsageLevels.length;

    const cognitiveDemandLevelsCount =
      !currentSearchState.cognitiveDemandLevels?.length ||
      cognitiveDemandLevelTypes.every((option) =>
        currentSearchState.cognitiveDemandLevels.includes(option)
      )
        ? 0
        : currentSearchState.cognitiveDemandLevels.length;

    const aggregateCount =
      intensityCount +
      physicalPositionsCount +
      oralCommunicationLevelsCount +
      computerUsageLevelsCount +
      cognitiveDemandLevelsCount;
    return aggregateCount ? `+ ${aggregateCount} more` : "";
  }, [currentSearchState]);

  const highlightPhysicalEnvLabel = useMemo(
    () =>
      currentSearchState.physicalEnvironments?.length <
      workplacePhysicalEnvironmentTypes.length,
    [currentSearchState]
  );

  return (
    <>
      <div className="hidden md:flex items-center space-x-2 justify-between h-full">
        <div className="flex items-center space-x-2 truncate">
          <MapPinIconSolid className="hidden md:block w-5 h-5 flex-none text-black" />
          <div className="flex flex-col text-xs truncate">
            <span
              className={`font-bold truncate ${
                searchState?.locations?.length > 0 ||
                searchState?.defaultToUserLocation === false
                  ? "text-pink-600"
                  : ""
              }`}
            >
              {location}
            </span>
            <span className="truncate font-medium">
              <span
                className={
                  (
                    searchState.locations?.length > 0 && locations?.length > 0
                      ? (locations?.length === 1 &&
                          locations[0].workplace_types?.length > 0 &&
                          locations[0].workplace_types?.length < 3) ||
                        locations?.length > 1
                      : currentSearchState.workplaceTypes?.length < 3
                  )
                    ? "text-pink-600"
                    : ""
                }
              >
                {workplaces}
              </span>{" "}
              ·{" "}
              <span
                className={highlightPhysicalEnvLabel ? "text-pink-600" : ""}
              >
                {physicalEnvironmnets}
              </span>
              {countMore && <span className="text-pink-600"> {countMore}</span>}
            </span>
          </div>
        </div>
        <ChevronDownIcon className="w-5 h-5 flex-none" />
      </div>
      <div className="md:hidden flex items-center space-x-2 justify-between">
        <div className="flex items-center space-x-4 truncate">
          <MapPinIcon className="md:hidden w-6 h-6 flex-none text-pink-600" />
          <div className="flex flex-col text-xs space-y-0.5 truncate">
            <span
              className={`font-bold truncate ${
                searchState?.locations?.length > 0 ||
                searchState?.defaultToUserLocation === false
                  ? "text-pink-600"
                  : ""
              }`}
            >
              {location}
            </span>
            <span className="truncate font-medium">
              <span
                className={
                  currentSearchState.workplaceTypes?.length < 3
                    ? "text-pink-600"
                    : ""
                }
              >
                {workplaces}
              </span>{" "}
              ·{" "}
              <span
                className={highlightPhysicalEnvLabel ? "text-pink-600" : ""}
              >
                {physicalEnvironmnets}
              </span>
              {countMore && <span className="text-pink-600"> {countMore}</span>}
            </span>
          </div>
        </div>
        <ChevronDownIcon className="w-5 h-5 flex-none" />
      </div>
    </>
  );
}

export default function SearchLocationNavBar() {
  const { searchState, company: selectedCompany } = useURLSearchStateV4();
  const router = useRouter();
  const isSmallScreen = useBreakpointValue({ base: true, md: false });
  const locationRef = useRef();
  const locationDisclosure = useDisclosure();
  const { isIOS, isInStandaloneMode } = useMobileDeviceDetection();
  const modalSize = useBreakpointValue({
    base: "full",
    md: "xl",
    lg: "2xl",
    xl: "3xl",
  });

  const outsideAlgoliaClick = (e) => {
    return (
      !e.target?.id?.includes("react-select") &&
      !(
        e.target.className &&
        typeof e.target.className === "string" &&
        (e.target.className.includes("NoOptionsMessage") ||
          e.target.className.includes("MenuList"))
      )
    );
  };

  useOutsideClick({
    ref: locationRef,
    handler: (e) => {
      if (!isSmallScreen && locationRef.current && outsideAlgoliaClick(e)) {
        locationDisclosure.onClose();
      }
    },
  });

  const shouldDisplayResetButton = useMemo(() => {
    const hasMatchingKey = (obj, arr) =>
      Object.keys(obj).some((key) => arr.includes(key));
    return hasMatchingKey(searchState, locationRelatedKeys);
  }, [searchState]);

  const resetFilter = () => {
    const query = {};
    const updatedState = { ...searchState };

    locationRelatedKeys.forEach((key) => delete updatedState[key]);

    if (Object.keys(updatedState).length > 0) {
      query.searchState = JSON.stringify(updatedState);
    }

    if (selectedCompany) {
      query.company = selectedCompany;
    }

    router.push({ pathname: "/", query }, undefined, {
      shallow: true,
    });
  };

  return (
    <>
      <div
        onClick={locationDisclosure.onOpen}
        className="hidden md:block md:h-full md:cursor-pointer"
      >
        <LocationNavBarDisplay />
      </div>
      <div className="md:hidden">
        <button
          onClick={locationDisclosure.onOpen}
          className="text-start w-full outline-none"
        >
          <LocationNavBarDisplay />
        </button>
      </div>
      <Modal
        isOpen={locationDisclosure.isOpen}
        onClose={locationDisclosure.onClose}
        scrollBehavior="inside"
        size={modalSize}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader className="border-b border-gray-300">
            <div className="text-base">Locations & Environments</div>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <LocationSelectionV4 />
          </ModalBody>
          <ModalFooter>
            <div
              className={`flex items-center justify-end space-x-2 font-bold w-full ${
                isIOS && isInStandaloneMode ? "pb-8" : ""
              }`}
            >
              {shouldDisplayResetButton && (
                <div className="w-1/2 text-center">
                  <button
                    onClick={() => {
                      resetFilter();
                    }}
                    className="text-pink-600"
                  >
                    Clear all
                  </button>
                </div>
              )}
              <button
                onClick={() => {
                  locationDisclosure.onClose();
                }}
                className="w-1/2 bg-pink-500 text-white rounded py-2"
              >
                Apply
              </button>
            </div>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
