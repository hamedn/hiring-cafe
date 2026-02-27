import {
  defaultRadius,
  useCurrentSearchFilters,
} from "@/contexts/CurrentSearchFiltersContext";
import useURLSearchStateV4, {
  URLSearchStateUpdateType,
} from "@/hooks/useURLSearchStateV4";
import { getContinentByCountry } from "@/utils/backend/countries";
import { useState } from "react";

function computeLocationExpansions(location) {
  if (!location) return [];

  const addressComponents = location.address_components || [];
  const expansions = [];

  const findByType = (type) =>
    addressComponents.find((comp) => comp.types?.includes(type));

  // Grab the relevant components
  const locality = findByType("locality")?.long_name || "";
  const adminArea = findByType("administrative_area_level_1")?.long_name || "";
  const country = findByType("country")?.long_name || "";
  const continent =
    findByType("continent")?.long_name ||
    "" ||
    getContinentByCountry[findByType("country")?.short_name] ||
    "";

  if (locality) {
    if (adminArea) {
      expansions.push({
        label: `${adminArea}`,
        value: `anywhere_in_administrative_area_level_1`,
      });
    }
    if (country) {
      expansions.push({
        label: `${country}`,
        value: `anywhere_in_country`,
      });
    }
    if (continent) {
      expansions.push({
        label: `${continent}`,
        value: `anywhere_in_continent`,
      });
    }
    expansions.push({
      label: "Worldwide",
      value: "anywhere_in_world",
    });
    return expansions;
  }

  // If it's an admin area, add expansions for: country → continent → world
  if (adminArea) {
    if (country) {
      expansions.push({
        label: `${country}`,
        value: `anywhere_in_country`,
      });
    }
    if (continent) {
      expansions.push({
        label: `${continent}`,
        value: `anywhere_in_continent`,
      });
    }
    expansions.push({
      label: "Worldwide",
      value: "anywhere_in_world",
    });
    return expansions;
  }

  // If it's a country, add expansions for: continent → world
  if (country) {
    if (continent) {
      expansions.push({
        label: `${continent}`,
        value: `anywhere_in_continent`,
      });
    }
    expansions.push({
      label: "Worldwide",
      value: "anywhere_in_world",
    });
    return expansions;
  }

  // If it's a continent, add expansion for: world
  if (continent) {
    expansions.push({
      label: "Worldwide",
      value: "anywhere_in_world",
    });
    return expansions;
  }

  // If none of the above matches, default to "Anywhere in the world"
  expansions.push({
    label: "Worldwide",
    value: "anywhere_in_world",
  });
  return expansions;
}

export default function EditLocationOption({ locationID }) {
  const { update } = useURLSearchStateV4();
  const { state: currentSearchState } = useCurrentSearchFilters();
  const { locations = [] } = currentSearchState;

  const location = locations.find((l) => l.id === locationID);

  const [localRadius, setLocalRadius] = useState(
    location?.options?.radius || defaultRadius
  );

  const handleRadiusSelection = () => {
    update({
      type: URLSearchStateUpdateType.MODIFY_LOCATION,
      payload: {
        ...location,
        options: {
          ...location.options,
          radius: localRadius,
        },
      },
    });
  };

  const handleWorkplaceTypeChange = (e) => {
    const { value, checked } = e.target;
    const storedTypes = (location.workplace_types || []).map((t) =>
      t.toLowerCase()
    );

    let newWorkplaceTypes;
    if (checked) {
      if (!storedTypes.includes(value.toLowerCase())) {
        newWorkplaceTypes = [...(location.workplace_types || []), value];
      } else {
        newWorkplaceTypes = location.workplace_types || [];
      }
    } else {
      newWorkplaceTypes = (location.workplace_types || []).filter(
        (t) => t.toLowerCase() !== value.toLowerCase()
      );
    }

    const locationIndex = currentSearchState.locations.findIndex(
      (l) => l.id === locationID
    );

    if (locationIndex !== -1) {
      update({
        type: URLSearchStateUpdateType.MODIFY_LOCATION,
        payload: {
          ...currentSearchState.locations[locationIndex],
          workplace_types: newWorkplaceTypes,
        },
      });
    }
  };

  if (!location) {
    return null;
  }

  // First, compute expansions and flexibleRegions before the return
  const expansions = computeLocationExpansions(location);
  const flexibleRegions = location?.options?.flexible_regions || [];

  return (
    <div className="flex flex-col space-y-4 text-sm divide-y">
      {location.types?.includes("locality") ? (
        <div className="flex flex-col space-y-2">
          <span className="font-bold">Location Precision</span>
          <div className="flex flex-col space-y-2 font-semibold">
            <label className="flex items-center">
              <input
                type="radio"
                name="locationPrecision"
                value="exact"
                className="mr-2 accent-pink-500"
                checked={location?.options?.ignore_radius === true}
                onChange={() =>
                  update({
                    type: URLSearchStateUpdateType.MODIFY_LOCATION,
                    payload: {
                      ...location,
                      options: {
                        ...location.options,
                        ignore_radius: true,
                      },
                    },
                  })
                }
              />
              <span className="text-sm">
                Exactly in {location.formatted_address}
              </span>
            </label>
            <div className="flex flex-col space-y-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="locationPrecision"
                  value="radius"
                  className="mr-2 accent-pink-500"
                  checked={location?.options?.ignore_radius === false}
                  onChange={() =>
                    update({
                      type: URLSearchStateUpdateType.MODIFY_LOCATION,
                      payload: {
                        ...location,
                        options: {
                          ...location.options,
                          ignore_radius: false,
                        },
                      },
                    })
                  }
                />
                <span className="text-sm">
                  {location.formatted_address} · {localRadius} miles
                </span>
              </label>
              {location?.options?.ignore_radius === false && (
                <div className="w-full px-2">
                  <input
                    type="range"
                    min="5"
                    max="100"
                    step="5"
                    value={localRadius}
                    className="w-full accent-pink-500"
                    onChange={(e) =>
                      setLocalRadius(parseInt(e.target.value, 10))
                    }
                    onMouseUp={handleRadiusSelection}
                    onTouchEnd={handleRadiusSelection}
                    onBlur={handleRadiusSelection}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      ) : null}
      <div
        className={`flex flex-col space-y-2 ${
          location.types?.includes("locality") ? "pt-4" : ""
        }`}
      >
        <span className="font-bold">Workplace Types</span>
        <div className="flex flex-col space-y-2 font-semibold">
          {["Remote", "Hybrid", "Onsite"].map((type) => {
            const isChecked = (location?.workplace_types || [])
              .map((t) => t.toLowerCase())
              .includes(type.toLowerCase());
            return (
              <label key={type} className="flex items-center">
                <input
                  type="checkbox"
                  name="workplaceType"
                  value={type}
                  className="mr-2 accent-pink-500"
                  checked={isChecked}
                  onChange={handleWorkplaceTypeChange}
                />
                <span className="text-sm">{type}</span>
              </label>
            );
          })}
        </div>
      </div>
      <div className="pt-4 flex flex-col space-y-2">
        <span className="font-bold">
          Also include unrestricted remote jobs from:
        </span>
        <div className="flex flex-col space-y-2">
          {expansions.map((exp) => {
            const isChecked = flexibleRegions.includes(exp.value);
            return (
              <label key={exp.value} className="flex items-center">
                <input
                  type="checkbox"
                  name="anywhereOption"
                  value={exp.value}
                  className="mr-2 accent-pink-500"
                  checked={isChecked}
                  onChange={(e) => {
                    let updatedFlexibleRegions;
                    if (e.target.checked) {
                      updatedFlexibleRegions = [...flexibleRegions, exp.value];
                    } else {
                      updatedFlexibleRegions = flexibleRegions.filter(
                        (val) => val !== exp.value
                      );
                    }
                    update({
                      type: URLSearchStateUpdateType.MODIFY_LOCATION,
                      payload: {
                        ...location,
                        options: {
                          ...location.options,
                          flexible_regions: updatedFlexibleRegions,
                        },
                      },
                    });
                  }}
                />
                <div className="flex flex-col">
                  <span className="text-sm">{exp.label}</span>
                  <span className="text-xs text-gray-500">
                    Remote, no specific location mentioned
                  </span>
                </div>
              </label>
            );
          })}
        </div>
      </div>
    </div>
  );
}
