import {
  CheckIcon,
  PlusCircleIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import useURLSearchStateV4, {
  URLSearchStateUpdateType,
} from "@/hooks/useURLSearchStateV4";
import { useEffect, useRef, useState } from "react";
import { getContinentByCountry } from "@/utils/backend/countries";
import { getLocationKey } from "@/utils/helpers";
import { useCurrentSearchFilters } from "@/contexts/CurrentSearchFiltersContext";

function generateLocationSuggestions(location) {
  if (!location || !location.types?.length > 0) {
    return [];
  }

  const addressComponents = location.address_components || [];

  // Helper to find a specific component by type
  const findComponentByType = (compType) =>
    addressComponents.find((c) => c.types?.includes(compType));

  // Extract relevant components
  const adminArea = findComponentByType("administrative_area_level_1");
  const country = findComponentByType("country");

  // Determine continent/region, if we have a valid country short_name
  let continentName = null;
  if (country && country.short_name) {
    const code = country.short_name;
    continentName = getContinentByCountry[code] || null;
  }

  // Helper to push an "administrative_area_level_1" suggestion
  const pushAdminSuggestion = (targetArray, admin, ctry) => {
    if (admin) {
      targetArray.push({
        types: ["administrative_area_level_1"],
        formatted_address: ctry
          ? `${admin.long_name}, ${ctry.long_name}`
          : admin.long_name,
        address_components: [admin, ctry].filter(Boolean),
        workplace_types: ["Remote"],
        options: {},
      });
    }
  };

  // Helper to push a "country" suggestion
  const pushCountrySuggestion = (targetArray, ctry) => {
    if (ctry) {
      targetArray.push({
        types: ["country"],
        formatted_address: ctry.long_name,
        address_components: [ctry],
        workplace_types: ["Remote"],
        options: {},
      });
    }
  };

  // Helper to push a "continent" suggestion
  const pushContinentSuggestion = (targetArray, cName) => {
    if (cName) {
      targetArray.push({
        types: ["continent"],
        formatted_address: cName,
        address_components: [],
        workplace_types: ["Remote"],
        options: {},
      });
    }
  };

  switch (location.types?.[0] || "") {
    case "locality": {
      const suggestions = [];
      pushAdminSuggestion(suggestions, adminArea, country);
      pushCountrySuggestion(suggestions, country);
      pushContinentSuggestion(suggestions, continentName);
      return suggestions;
    }

    case "administrative_area_level_1": {
      const suggestions = [];
      pushCountrySuggestion(suggestions, country);
      pushContinentSuggestion(suggestions, continentName);
      return suggestions;
    }

    case "country": {
      const suggestions = [];
      pushContinentSuggestion(suggestions, continentName);
      return suggestions;
    }

    case "continent":
      return [];

    default:
      return [];
  }
}

export default function SuggestedLocations() {
  const { update } = useURLSearchStateV4();
  const { state: currentSearchState } = useCurrentSearchFilters();
  const [rejectedSuggestedLocations, setRejectedSuggestedLocations] = useState(
    []
  );
  const [suggestedLocations, setSuggestedLocations] = useState([]);
  const [shouldShowSuggestions, setShouldShowSuggestions] = useState(false);
  const initialRender = useRef(true);

  const { locations = [] } = currentSearchState;

  useEffect(() => {
    let aggregatedSuggestions = [];
    locations.forEach((loc) => {
      const locSuggestions = generateLocationSuggestions(loc);
      aggregatedSuggestions = [...aggregatedSuggestions, ...locSuggestions];
    });

    // filter out duplicates
    const uniqueSuggestions = [];
    aggregatedSuggestions.forEach((suggestion) => {
      if (
        !uniqueSuggestions.some(
          (u) => getLocationKey(u) === getLocationKey(suggestion)
        )
      ) {
        uniqueSuggestions.push(suggestion);
      }
    });

    // filter out rejected suggestions
    const filteredSuggestions = uniqueSuggestions
      .filter(
        (suggestion) =>
          !rejectedSuggestedLocations.some(
            (rejected) =>
              getLocationKey(rejected) === getLocationKey(suggestion)
          )
      )
      // filter out suggestions that are in the locations array
      .filter(
        (suggestion) =>
          !locations.some(
            (location) =>
              getLocationKey(location) === getLocationKey(suggestion)
          )
      );

    setSuggestedLocations(filteredSuggestions);
  }, [locations, rejectedSuggestedLocations]);

  useEffect(() => {
    if (!suggestedLocations?.length) {
      return;
    }

    if (initialRender.current) {
      setShouldShowSuggestions(suggestedLocations?.length < 4);
      initialRender.current = false;
    }
  }, [suggestedLocations]);

  if (!suggestedLocations?.length) {
    return null;
  }

  return (
    <>
      {shouldShowSuggestions ? (
        <div className="flex flex-wrap gap-4">
          {suggestedLocations.map((location) => (
            <div
              key={getLocationKey(location)}
              className="border border-dashed border-gray-400 opacity-70 hover:opacity-100 animate-in fade-in-0 duration-300 rounded p-2 flex items-center space-x-4"
            >
              <div className="flex flex-col">
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-bold">
                    {location.formatted_address}
                  </span>
                </div>
                <span className="text-xs">
                  All{" "}
                  {location.workplace_types?.length > 0
                    ? location.workplace_types.join(" · ")
                    : "Remote · Hybrid · Onsite"}{" "}
                  Jobs in {location.formatted_address}
                </span>
              </div>
              <div className="flex items-center space-x-1">
                {/* <button
                  className="flex items-center space-x-2 hover:bg-gray-200 rounded-full p-1"
                  onClick={() => {
                    setRejectedSuggestedLocations((prev) => [
                      ...prev,
                      location,
                    ]);
                  }}
                >
                  <XMarkIcon className="w-4 h-4 flex-none text-red-600" />
                </button> */}
                <button
                  className="flex items-center space-x-0.5 rounded p-1 border border-gray-400 bg-neutral-100"
                  onClick={() => {
                    const locationKey = getLocationKey(location);
                    update({
                      type: URLSearchStateUpdateType.ADD_LOCATION,
                      payload: {
                        ...location,
                        id: locationKey,
                      },
                    });
                  }}
                >
                  <PlusCircleIcon className="w-4 h-4 flex-none" />
                  <span className="text-xs font-bold">Add</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <button
          className="text-xs font-bold text-pink-600 underline h-fit"
          onClick={() => setShouldShowSuggestions(true)}
        >
          Show {suggestedLocations?.length || 0} suggested regions
        </button>
      )}
    </>
  );
}
