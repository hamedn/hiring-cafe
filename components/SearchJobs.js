import useURLSearchStateV4, {
  URLSearchStateUpdateType,
} from "@/hooks/useURLSearchStateV4";
import {
  useBreakpointValue,
  useDisclosure,
  useOutsideClick,
} from "@chakra-ui/react";
import {
  MagnifyingGlassIcon,
  XMarkIcon,
  SparklesIcon,
} from "@heroicons/react/20/solid";
import { useCurrentSearchFilters } from "contexts/CurrentSearchFiltersContext";
import { useContext, useEffect, useRef, useState } from "react";
import QuerySuggestions from "./QuerySuggestions";
import SearchInputModal from "./SearchInputModal";
import SearchLocationNavBar from "./SearchLocationNavBar";
import { useRouter } from "next/router";
import { UserLocationContext } from "@/contexts/UserLocationContext";

export default function SearchJobs() {
  const querySuggestionsRef = useRef(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const { state: currentSearchState } = useCurrentSearchFilters();
  const { update } = useURLSearchStateV4();
  const [isHovering, setIsHovering] = useState(false);
  const router = useRouter();
  const { userCountry } = useContext(UserLocationContext);

  const {
    isOpen: isSearchModalOpen,
    onOpen: onSearchModalOpen,
    onClose: onSearchModalClose,
  } = useDisclosure();

  useEffect(() => {
    setSearchTerm(currentSearchState.searchQuery || "");
  }, [currentSearchState.searchQuery]);

  const modalSize = useBreakpointValue({ base: "full", md: "md", lg: "lg" });

  useOutsideClick({
    ref: querySuggestionsRef,
    handler: (e) =>
      modalSize !== "full" &&
      e.target.id !== "query-search-v4" &&
      setShowSuggestions(false),
  });

  const handleSelectSuggestion = (suggestion) => {
    setSearchTerm(suggestion);
    update({
      type: URLSearchStateUpdateType.SEARCH_QUERY,
      payload: suggestion,
    });
    setShowSuggestions(false);
  };

  const handleSearchInputClick = () => {
    if (modalSize === "full") {
      onSearchModalOpen();
    }
  };

  return (
    <>
      <div className="hidden md:flex space-x-2 w-full">
        <div
          className={`flex items-center relative bg-white border border-gray-300 rounded-full w-full`}
          onClick={handleSearchInputClick}
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
        >
          <div className="text-gray-600 pl-4 pr-2">
            <MagnifyingGlassIcon className={`w-4 h-4 flex-none`} />
          </div>
          <input
            autoComplete="off"
            className={`py-2 w-full outline-none font-medium truncate`}
            id={"query-search-v4"}
            type="text"
            placeholder="Search"
            value={searchTerm || ""}
            onClick={() => setShowSuggestions(true)}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setShowSuggestions(true);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                update({
                  type: URLSearchStateUpdateType.SEARCH_QUERY,
                  payload: e.target.value || "",
                });
                setShowSuggestions(false);
              }
            }}
            onBlur={() => {
              if (!searchTerm) {
                setSearchTerm(currentSearchState.searchQuery || "");
              }
            }}
          />
          {/* AI Search CTA - Only on lg screens when input is empty */}
          {!searchTerm && userCountry === "US" && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                window.open("/ai-search", "_blank");
              }}
              className="hidden lg:flex items-center gap-1.5 px-3 py-1 mr-2 bg-gradient-to-r from-violet-50 to-purple-50 hover:from-violet-100 hover:to-purple-100 border border-violet-200 rounded-full text-xs font-medium text-violet-700 hover:text-violet-800 transition-all whitespace-nowrap"
            >
              <SparklesIcon className="h-3.5 w-3.5" />
              Switch to AI Mode
            </button>
          )}
          <button
            onClick={() => {
              update({
                type: URLSearchStateUpdateType.SEARCH_QUERY,
                payload: "",
              });
              setSearchTerm("");
              setShowSuggestions(false);
            }}
            className="text-gray-500 p-2 mr-2"
          >
            {searchTerm && isHovering && (
              <XMarkIcon className="h-5 w-5 flex-none" />
            )}
          </button>
          {showSuggestions && (
            <>
              <div className="fixed left-0 right-0 bottom-0 bg-black opacity-50 z-30 top-[55px]" />
              <div className="absolute z-50 w-full top-[43px]">
                <div
                  className="bg-white rounded-xl shadow-2xl w-full max-h-96 md:max-h-[500px] overflow-y-auto scrollbar-hide"
                  ref={querySuggestionsRef}
                >
                  <QuerySuggestions
                    onClose={() => setShowSuggestions(false)}
                    query={searchTerm}
                    onSelect={handleSelectSuggestion}
                    setSearchTerm={setSearchTerm}
                  />
                </div>
              </div>
            </>
          )}
        </div>
        {(router.pathname === "/" || router.pathname.startsWith("/jobs/")) && (
          <div className="w-full max-w-xs lg:max-w-sm xl:max-w-md bg-white rounded-full border border-gray-300 px-3">
            <SearchLocationNavBar />
          </div>
        )}
      </div>
      <div className="md:hidden flex flex-col w-full border border-gray-300 rounded-xl shadow-lg">
        <button
          className={`text-start w-full font-medium flex items-center space-x-4 rounded ${
            searchTerm ? "" : "text-gray-400"
          } outline-none p-4`}
          onClick={handleSearchInputClick}
        >
          <MagnifyingGlassIcon className={`text-pink-600 w-6 h-6 flex-none`} />
          <span className="line-clamp-1 w-full">{searchTerm || "Search"}</span>
        </button>
        <div className="border-t px-4 py-2">
          <SearchLocationNavBar />
        </div>
      </div>
      <SearchInputModal
        isOpen={isSearchModalOpen}
        onClose={onSearchModalClose}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        onSearch={(query) => {
          update({
            type: URLSearchStateUpdateType.SEARCH_QUERY,
            payload: query,
          });
        }}
        onSelectSuggestion={handleSelectSuggestion}
      />
    </>
  );
}
