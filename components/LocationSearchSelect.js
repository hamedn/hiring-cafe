import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import axios from "axios";
import { debounce } from "lodash";
import AsyncSelect from "react-select/async";
import { components } from "react-select";
import { trackedAxiosGet } from "@/utils/trackedFetch";

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
    return { success: true, data };
  } catch (e) {
    if (e.response?.data?.details?.status === "ZERO_RESULTS") {
      return { success: true, data: null };
    }
    console.error("Location search error:", e);
    return { 
      success: false, 
      error: {
        message: "Failed to search locations",
        details: e.response?.data?.message || e.message || "An error occurred while searching for locations.",
        technical: `Status: ${e.response?.status || "N/A"}, URL: /api/searchLocation?query=${query}, Error: ${e.message}`,
      }
    };
  }
};

/**
 * Detects the type of location based on available data
 * @param {Object} placeDetail - The place detail object from search
 * @returns {string} - One of: 'city', 'state', 'country', 'continent', 'unknown'
 */
const detectLocationType = (placeDetail) => {
  if (!placeDetail) return "unknown";
  
  // Check address_components for types
  const addressComponents = placeDetail.address_components || [];
  const types = addressComponents.flatMap(comp => comp.types || []);
  
  // Also check top-level types array if available
  const topLevelTypes = placeDetail.types || [];
  const allTypes = [...types, ...topLevelTypes];
  
  // Priority order: more specific first
  if (allTypes.includes("locality") || allTypes.includes("sublocality")) {
    return "city";
  }
  if (allTypes.includes("administrative_area_level_1") || allTypes.includes("administrative_area_level_2")) {
    return "state";
  }
  if (allTypes.includes("country")) {
    return "country";
  }
  if (allTypes.includes("continent")) {
    return "continent";
  }
  
  // Fallback: try to detect from formatted_address structure
  const formattedAddress = placeDetail.formatted_address || "";
  const commaCount = (formattedAddress.match(/,/g) || []).length;
  
  if (commaCount === 0) {
    // Single name could be country or continent
    return "country";
  } else if (commaCount === 1) {
    // "State, Country" format
    return "state";
  } else {
    // "City, State, Country" format
    return "city";
  }
};

/**
 * Gets a human-readable label for the location type
 * @param {string} type - The location type
 * @returns {string} - Human readable label
 */
export const getLocationTypeLabel = (type) => {
  const labels = {
    city: "City",
    state: "State/Province",
    country: "Country",
    continent: "Continent/Region",
    unknown: "Location",
  };
  return labels[type] || "Location";
};

/**
 * Extracts location data from placeDetail with robust fallbacks
 * @param {Object} placeDetail - The place detail object from search
 * @returns {Object} - Normalized location object
 */
const extractLocationData = (placeDetail) => {
  // Extract country code from address_components
  let countryCode = "";
  
  if (placeDetail.address_components?.length > 0) {
    const countryComponent = placeDetail.address_components.find(
      (comp) => comp.types?.includes("country")
    );
    if (countryComponent) {
      countryCode = countryComponent.short_name;
    }
  }
  
  // Fallback to direct country field if address_components not available
  if (!countryCode) {
    countryCode = placeDetail.country || placeDetail.country_code || placeDetail.iso_country || "";
  }
  
  // Get lat/lng with multiple fallback options
  let lat = null;
  let lng = null;
  
  // Try geometry.location first (Google Places format)
  if (placeDetail.geometry?.location) {
    lat = placeDetail.geometry.location.lat;
    lng = placeDetail.geometry.location.lon || placeDetail.geometry.location.lng;
  }
  
  // Fallback to direct fields
  if (lat === null || lat === undefined) {
    lat = placeDetail.lat || placeDetail.latitude || placeDetail.center_lat;
  }
  if (lng === null || lng === undefined) {
    lng = placeDetail.lng || placeDetail.lon || placeDetail.longitude || placeDetail.center_lng;
  }
  
  // Get formatted address
  const formattedAddress = placeDetail.formatted_address || 
    placeDetail.display_name || 
    placeDetail.name || 
    "";
  
  // Detect location type
  const locationType = detectLocationType(placeDetail);
  
  return {
    lat,
    lng,
    country: countryCode,
    formatted_address: formattedAddress,
    location_type: locationType,
  };
};

/**
 * Validates that the extracted location data is usable
 * @param {Object} locationData - The extracted location data
 * @returns {{ valid: boolean, errors: string[] }}
 */
const validateLocationData = (locationData) => {
  const errors = [];
  
  if (!locationData.formatted_address) {
    errors.push("Missing location name/address");
  }
  
  // Lat/lng are nice to have but not strictly required
  // For very broad locations (continents), they might not be meaningful anyway
  if ((locationData.lat === null || locationData.lat === undefined) && 
      locationData.location_type === "city") {
    errors.push("Missing latitude for city location");
  }
  if ((locationData.lng === null || locationData.lng === undefined) && 
      locationData.location_type === "city") {
    errors.push("Missing longitude for city location");
  }
  
  return {
    valid: errors.length === 0,
    errors,
  };
};

export default function LocationSearchSelect({
  onChange,
  onError,
  placeholder = "Search cities, states, countries, or regions",
  value = "",
  className = "",
  instanceId = "location_search_select",
  cityOnly = false, // When true, only show city results
}) {
  const handleSelectChange = (selection) => {
    // Handle clear/deselect
    if (!selection) {
      onChange(null);
      return;
    }
    
    // Check for placeDetail
    if (!selection.placeDetail) {
      const error = {
        message: "Invalid location data received",
        details: "The selected location is missing required place details.",
        technical: `Selection object keys: ${Object.keys(selection).join(", ")}`,
      };
      console.error("Location selection error:", error);
      if (onError) {
        onError(error);
      }
      return;
    }
    
    const { placeDetail } = selection;
    
    // Extract and validate location data
    const locationData = extractLocationData(placeDetail);
    const validation = validateLocationData(locationData);
    
    if (!validation.valid) {
      // For non-city locations, we can be more lenient
      if (locationData.location_type !== "city") {
        // Still allow it but log the warning
        console.warn("Location validation warnings:", validation.errors);
      } else {
        const error = {
          message: "Could not extract complete location data",
          details: validation.errors.join(". "),
          technical: `PlaceDetail keys: ${Object.keys(placeDetail).join(", ")}. Location type: ${locationData.location_type}`,
        };
        console.error("Location validation error:", error);
        if (onError) {
          onError(error);
        }
        // Still proceed with partial data - better UX than blocking
      }
    }
    
    onChange(locationData);
  };

  return (
    <div className={`flex flex-col ${className}`}>
      <AsyncSelect
        maxMenuHeight={200}
        menuPortalTarget={typeof document !== "undefined" ? document.body : null}
        components={{ Control: ControlWithMagnifier }}
        styles={{
          menuPortal: (base) => ({ ...base, zIndex: 9999 }),
          control: (base, state) => ({
            ...base,
            borderWidth: "1px",
            minHeight: "40px",
            borderColor: state.isFocused ? "#d1d5db" : "#d1d5db",
            boxShadow: state.isFocused ? "0 0 0 1px #d1d5db" : "none",
            "&:hover": {
              borderColor: "#9ca3af",
            },
            paddingLeft: "0.375rem",
            paddingTop: "0.375rem",
            paddingBottom: "0.375rem",
          }),
        }}
        instanceId={instanceId}
        placeholder={placeholder}
        noOptionsMessage={(obj) => (!obj.inputValue ? null : "No results")}
        isClearable
        loadOptions={debounce((inputValue, callback) => {
          searchLocation(inputValue)
            .then((result) => {
              // Handle errors from searchLocation
              if (!result.success) {
                if (onError) {
                  onError(result.error);
                }
                callback(null);
                return;
              }
              
              const data = result.data;
              if (!data) {
                callback(null);
                return;
              }
              
              // Filter to cities only if cityOnly prop is true
              if (cityOnly) {
                const cityResults = data.filter((item) => {
                  if (!item.placeDetail) return false;
                  const locType = detectLocationType(item.placeDetail);
                  return locType === "city" || locType === "unknown";
                });
                callback(cityResults.length > 0 ? cityResults : null);
                return;
              }
              
              callback(data);
            })
            .catch((err) => {
              // Handle unexpected errors
              console.error("Unexpected location search error:", err);
              if (onError) {
                onError({
                  message: "Failed to search locations",
                  details: err.message || "An unexpected error occurred.",
                  technical: `Unexpected error: ${err.name || "Error"} - ${err.message}`,
                });
              }
              callback(null);
            });
        }, 100)}
        onChange={handleSelectChange}
        value={value}
      />
    </div>
  );
}

// Export utility functions for use elsewhere
export { detectLocationType, extractLocationData, validateLocationData };

