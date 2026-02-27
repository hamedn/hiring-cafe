import {
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react";
import { useRef } from "react";
import QuerySuggestions from "./QuerySuggestions";
import { ArrowLeftIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { useCurrentSearchFilters } from "contexts/CurrentSearchFiltersContext";

const SearchInputModal = ({
  isOpen,
  onClose,
  searchTerm,
  setSearchTerm,
  onSearch,
  onSelectSuggestion,
}) => {
  const searchInputRef = useRef(null);

  const { state: currentSearchState } = useCurrentSearchFilters();

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="full"
      motionPreset="none" // Disable animation
      initialFocusRef={searchInputRef}
      scrollBehavior="inside"
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          <div className="flex items-center space-x-6 text-base">
            <button
              className="font-medium outline-none"
              onClick={() => {
                setSearchTerm(currentSearchState.searchQuery);
                onSearch(currentSearchState.searchQuery);
                onClose();
              }}
            >
              <ArrowLeftIcon className="h-6 w-6" />
            </button>
            <div
              className={`flex items-center border w-full rounded focus-within:border-gray-600 overflow-hidden ${
                searchTerm ? "border-gray-600 shadow" : "border-gray-400"
              }`}
            >
              <input
                ref={searchInputRef}
                autoComplete="off"
                className={`py-1.5 w-full outline-none rounded-r font-medium ml-4`}
                type="text"
                placeholder="Search"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    onClose();
                    setSearchTerm(searchTerm);
                    onSearch(searchTerm);
                  }
                }}
              />
              {searchTerm && (
                <button
                  onClick={() => {
                    if (searchTerm === currentSearchState.searchQuery) {
                      onSearch("");
                    } else {
                      setSearchTerm(currentSearchState.searchQuery);
                    }
                  }}
                  className="hover:bg-gray-300 rounded-full p-2 mr-0.5"
                >
                  <XMarkIcon className="h-4 w-4 flex-none p-0.5 bg-gray-600 text-white rounded-full" />
                </button>
              )}
            </div>
          </div>
        </ModalHeader>
        <ModalBody px={4} pb={64}>
          <div className="min-h-screen overflow-y-auto">
            <QuerySuggestions
              query={searchTerm}
              onClose={onClose}
              setSearchTerm={setSearchTerm}
              onSelect={(suggestion) => {
                onSelectSuggestion(suggestion);
                onClose();
              }}
            />
          </div>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default SearchInputModal;
