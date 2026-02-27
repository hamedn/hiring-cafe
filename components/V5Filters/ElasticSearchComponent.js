import React, { useCallback, useEffect, useMemo, useState } from "react";
import CreatableSelect from "react-select/creatable";
import RegularSelect from "react-select";
import debounce from "lodash/debounce";
import { useCurrentSearchFilters } from "@/contexts/CurrentSearchFiltersContext";
import { trackedFetch } from "@/utils/trackedFetch";

const ElasticSearchComponent = ({
  facetType,
  isMulti = true,
  selected,
  onSelected,
  isCreatable = false,
  formatLabel,
}) => {
  const [options, setOptions] = useState([]);
  const [isQuerying, setIsQuerying] = useState(false);
  const { state: searchState } = useCurrentSearchFilters();

  const Select = isCreatable ? CreatableSelect : RegularSelect;

  const fetchOptions = useCallback(
    async (inputValue) => {
      setIsQuerying(true);
      try {
        // Build GET URL with query params
        const params = new URLSearchParams({
          facetType,
          query: inputValue || "",
        });
        // Add searchState if needed (base64 encoded)
        const searchStateToSend = {
          ...searchState,
          searchQuery: searchState.searchQuery || "",
        };
        const encodedSearchState = btoa(encodeURIComponent(JSON.stringify(searchStateToSend)));
        params.set("s", encodedSearchState);

        const response = await trackedFetch(`/api/search-facets?${params.toString()}`);
        const data = await response.json();
        const options = (data?.suggestions || []).map((suggestion) => ({
          label: formatLabel ? formatLabel(suggestion) : suggestion,
          value: suggestion,
        }));
        setOptions(options);
      } catch (error) {
        console.error("Error fetching facets from Elasticsearch", error);
        setOptions([]);
      } finally {
        setIsQuerying(false);
      }
    },
    [facetType, searchState]
  );

  // Debounced version of fetchOptions (300ms delay)
  const debouncedFetchOptions = useMemo(
    () => debounce(fetchOptions, 300),
    [fetchOptions]
  );

  // Cleanup debounce on unmount or when debounced fn changes
  useEffect(() => {
    return () => {
      debouncedFetchOptions.cancel();
    };
  }, [debouncedFetchOptions]);

  // Initial fetch on mount
  useEffect(() => {
    fetchOptions("");
  }, [fetchOptions]);

  const handleInputChange = (newValue) => {
    debouncedFetchOptions(newValue);
  };

  const handleChange = (selected) => {
    onSelected?.(isMulti ? selected.map((s) => s.value) : selected);
  };

  return (
    <Select
      styles={{
        menuPortal: (base) => ({ ...base, zIndex: 9999 }),
        singleValue: (styles) => ({
          ...styles,
          color: `${selected ? "hotpink" : "black"}`,
        }),
        multiValue: (styles) => ({
          ...styles,
          backgroundColor: "hotpink",
        }),
        multiValueLabel: (styles) => ({
          ...styles,
          color: "white",
        }),
        multiValueRemove: (styles) => ({
          ...styles,
          color: "white",
          ":hover": {
            backgroundColor: "red",
            color: "white",
          },
        }),
      }}
      isClearable
      isMulti={isMulti}
      value={selected}
      onChange={handleChange}
      onInputChange={handleInputChange}
      options={options}
      isLoading={isQuerying}
      placeholder="Type to search..."
      formatCreateLabel={(inputValue) => `Add "${inputValue}"`}
      menuPortalTarget={document.body}
    />
  );
};

export default ElasticSearchComponent;
