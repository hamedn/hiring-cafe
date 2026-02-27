import { useCallback, useEffect, useRef, useState } from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/20/solid";
import { useDisclosure, useOutsideClick } from "@chakra-ui/react";
import useURLSearchStateV4, {
  URLSearchStateUpdateType,
} from "@/hooks/useURLSearchStateV4";
import { useCurrentSearchFilters } from "@/contexts/CurrentSearchFiltersContext";
import { trackedFetch } from "@/utils/trackedFetch";

const QuerySuggestions = ({ query, onClose }) => {
  const { update } = useURLSearchStateV4();
  const { state: searchState } = useCurrentSearchFilters();
  const [jobTitleSuggestions, setJobTitleSuggestions] = useState([]);
  const discloser = useDisclosure();
  const ref = useRef();

  useOutsideClick({
    ref: ref,
    handler: () => {
      ref?.current && discloser.onClose();
    },
  });

  const fetchSuggestions = useCallback(
    async (query) => {
      try {
        // Build GET URL with query params
        const params = new URLSearchParams({
          facetType: "job_title",
          query: query?.trim() || "",
          size: "100",
          applyFilters: "true",
        });
        // Add searchState (base64 encoded)
        const encodedSearchState = btoa(encodeURIComponent(JSON.stringify(searchState)));
        params.set("s", encodedSearchState);
        
        const response = await trackedFetch(`/api/search-facets?${params.toString()}`);
        const data = await response.json();
        setJobTitleSuggestions(data.suggestions || []);
      } catch (error) {
        console.error("Error fetching suggestions", error);
        setJobTitleSuggestions([]);
      }
    },
    [searchState]
  );

  useEffect(() => {
    const handler = setTimeout(() => {
      fetchSuggestions(query);
    }, 100);

    return () => {
      clearTimeout(handler);
    };
  }, [fetchSuggestions, query, searchState]);

  if (!jobTitleSuggestions.length && !query) {
    return <div className="p-4 mb-32 text-neutral-500">Type something...</div>;
  }

  return (
    <div className="flex flex-col">
      <ul className="flex flex-col space-y-8 md:space-y-0 p-2 md:p-0 w-full">
        {Array.from(
          new Set([query || "", ...jobTitleSuggestions].filter((q) => q.trim()))
        ).map((suggestion) => (
          <li
            key={suggestion}
            className="md:px-4 md:py-4 cursor-pointer md:hover:bg-gray-200"
            onClick={() => {
              update({
                type: URLSearchStateUpdateType.SEARCH_QUERY,
                payload: suggestion,
              });
              onClose();
            }}
          >
            <div className="flex items-center space-x-4">
              <MagnifyingGlassIcon className="w-4 h-4 flex-none" />
              <span className="line-clamp-1 w-full">{suggestion}</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default QuerySuggestions;
