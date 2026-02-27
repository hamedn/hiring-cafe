import { MagnifyingGlassIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";
import debounce from "lodash/debounce";
import { CircularProgress } from "@chakra-ui/react";
import { useAuth } from "@/admin/hooks/useAuth";

export default function FilterSelection({
  facetSearchTerm,
  setFacetSearchTerm,
  filterType,
  items,
  selectedItems,
  toggleItem,
}) {
  const { user } = useAuth();
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  // Fetch search results from the API
  useEffect(() => {
    const fetchSearchResults = debounce(async () => {
      if (!facetSearchTerm?.[filterType]) {
        setSearchResults([]);
        return;
      }
      setIsSearching(true);
      try {
        const response = await fetch(
          `/api/admin/search/searchFacet?filter=${filterType}&query=${facetSearchTerm[filterType]}`
        );
        const data = await response.json();
        setSearchResults(data || []);
      } catch (error) {
        console.error("Error fetching search results:", error);
      } finally {
        setIsSearching(false);
      }
    }, 500);

    fetchSearchResults();
  }, [facetSearchTerm, filterType]);

  return (
    <>
      {!user &&
      (filterType === "company" || filterType === "education_institute") ? (
        <span className="flex justify-center text-center text-gray-600 font-medium p-4 text-sm">
          Get Recruiter Pro to access this filter
        </span>
      ) : !items?.length ? (
        <span className="flex justify-center text-center text-gray-600 font-medium p-4 text-sm">
          Change your existing filters to see more options
        </span>
      ) : (
        <div className="flex flex-col space-y-4">
          {!["is_salary_expectation_available", "verified"].includes(
            filterType
          ) && (
            <div className="flex items-center space-x-2 border px-2">
              {isSearching ? (
                <CircularProgress size="20px" isIndeterminate color="black" />
              ) : (
                <MagnifyingGlassIcon className="h-5 w-5 flex-none text-gray-500" />
              )}
              <input
                type="text"
                placeholder={`Search...`}
                className="flex-1 py-2 text-sm focus:outline-none"
                value={facetSearchTerm?.[filterType] || ""}
                onChange={(e) => {
                  setFacetSearchTerm({
                    ...facetSearchTerm,
                    [filterType]: e.target.value,
                  });
                }}
              />
              {facetSearchTerm?.[filterType] ? (
                <button
                  className=""
                  onClick={() => {
                    setFacetSearchTerm({
                      ...facetSearchTerm,
                      [filterType]: "",
                    });
                  }}
                >
                  <XMarkIcon className="h-5 w-5 flex-none text-gray-500 cursor-pointer" />
                </button>
              ) : null}
            </div>
          )}
          <div className="flex flex-col space-y-4 max-h-40 overflow-y-auto">
            {(searchResults || []).map((result, index) => (
              <div
                key={`search-result-${index}-${result}`}
                className="flex items-center"
              >
                <input
                  type="checkbox"
                  id={`${result}-${filterType}-${index}`}
                  checked={selectedItems?.includes(result)}
                  onChange={() => {
                    toggleItem(result);
                  }}
                />
                <label
                  htmlFor={`${result}-${filterType}-${index}`}
                  className="ml-2 text-sm"
                >
                  {result}
                </label>
              </div>
            ))}
            {items
              .filter((item) => !searchResults.includes(item))
              .map((item, index) => (
                <div
                  key={`filter-item-${index}-${item}-${filterType}`}
                  className="flex items-center"
                >
                  <input
                    type="checkbox"
                    id={`${item}-${filterType}-${index}`}
                    checked={selectedItems?.includes(item)}
                    onChange={() => {
                      toggleItem(item);
                    }}
                  />
                  <label
                    htmlFor={`${item}-${filterType}-${index}`}
                    className="ml-2 text-sm"
                  >
                    {item}
                  </label>
                </div>
              ))}
          </div>
        </div>
      )}
    </>
  );
}
