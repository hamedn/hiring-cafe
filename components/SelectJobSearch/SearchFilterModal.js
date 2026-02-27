import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Tooltip,
} from "@chakra-ui/react";
import { PencilSquareIcon } from "@heroicons/react/24/outline";
import CreateSearchFilter from "./CreateSearchFilter";
import _ from "lodash";
import { XMarkIcon } from "@heroicons/react/20/solid";
import { useRouter } from "next/router";
import { useContext, useState } from "react";
import { JobSearchFiltersContext } from "contexts/JobSearchFiltersContext";
import {
  defaultNewFilterName,
  jobFilterFields,
  searchJobFilterFields,
} from "@/utils/constants";
import { useJobFiltersCount } from "@/hooks/useJobFiltersCount";
import LottieAnimation from "../lottieAnimation";
import Loading from "@/animations/loading.json";

export default function SearchFilterModal({
  isCreateSearchModalOpen,
  updateType,
  onCreateSearchModalClose,
}) {
  const router = useRouter();

  const [newFilterName, setNewFilterName] = useState("");
  const [currentOption, setCurrentOption] = useState(0);
  const { numFilters, numLocFilters, numQueryFilters } = useJobFiltersCount();

  const clearFilters = () => {
    const newQuery = {
      ...router.query,
    };
    jobFilterFields.forEach((field) => {
      delete newQuery[field];
    });
    delete newQuery.salaryValue;
    router.replace({ query: newQuery });
  };

  const clearLocFilters = () => {
    const newQuery = {
      ...router.query,
    };
    [
      "workplaceType",
      "location_type",
      "location_value",
      "location_formatted_address",
    ].forEach((field) => {
      delete newQuery[field];
    });
    router.replace({ query: newQuery });
  };

  const clearQueryFilters = () => {
    const newQuery = {
      ...router.query,
    };
    searchJobFilterFields.forEach((field) => {
      delete newQuery[field];
    });
    router.replace({ query: newQuery });
  };

  const options = [
    { type: "Search", clearFn: clearQueryFilters, count: numQueryFilters },
    { type: "Settings", clearFn: clearLocFilters, count: numLocFilters },
    { type: "Details", clearFn: clearFilters, count: numFilters },
  ];

  const {
    currentFilter,
    updateSavedFilter,
    saveFilter,
    loading: searchFiltersLoading,
  } = useContext(JobSearchFiltersContext);

  const createOrModifyFilter = () => {
    if (!Object.keys(router.query || {}).length) {
      return;
    }
    if (updateType === "edit") {
      updateSavedFilter({
        filterID: currentFilter.value.filterID,
        label: newFilterName || currentFilter.label || defaultNewFilterName,
      });
    } else {
      saveFilter(
        newFilterName || router.query.searchQuery || defaultNewFilterName
      );
    }
    onCreateSearchModalClose();
    setCurrentOption(0);
    setNewFilterName("");
  };

  if (searchFiltersLoading) {
    return (
      <div className="flex justify-center m-16">
        <LottieAnimation width="50px" height="50px" animationData={Loading} />
      </div>
    );
  }

  return (
    <Modal
      isOpen={isCreateSearchModalOpen}
      onClose={() => {
        createOrModifyFilter();
        onCreateSearchModalClose();
      }}
      isCentered
      motionPreset="slideInBottom"
      scrollBehavior="inside"
      size={"full"}
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          <div className="flex justify-center">
            <div className="flex flex-col">
              <div className="flex justify-center space-x-4 md:space-x-8 lg:space-x-16 text-sm">
                {options.map((option, i) => {
                  return (
                    <div
                      key={option.type}
                      className={`flex items-center space-x-1 ${
                        i === currentOption
                          ? "text-black font-extrabold underline underline-offset-4"
                          : "text-gray-500"
                      }`}
                    >
                      <button
                        className="flex items-center space-x-0.5 lg:space-x-1 md:text-base focus:outline-none"
                        onClick={() => setCurrentOption(i)}
                      >
                        <span>{option.type}</span>
                        {option.count ? (
                          <div className="flex items-center space-x-1">
                            <span
                              className={`text-xs flex justify-center items-center h-4 w-4 lg:h-5 lg:w-5 flex-none rounded-full ${
                                i === currentOption
                                  ? "text-white bg-black"
                                  : "bg-gray-300 text-gray-800"
                              }`}
                            >
                              {option.count}
                            </span>
                          </div>
                        ) : null}
                      </button>
                      {option.count ? (
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            option.clearFn();
                          }}
                          className="text-xs text-red-900"
                        >
                          <XMarkIcon className="h-4 w-4 flex-none" />
                        </button>
                      ) : null}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody className="md:bg-gray-200 border-t">
          <CreateSearchFilter currentOption={currentOption} />
        </ModalBody>
        <ModalFooter className="border-t">
          <button
            onClick={() => {
              createOrModifyFilter();
              onCreateSearchModalClose();
            }}
            className={`text-white bg-gray-800 px-4 py-2 rounded-md flex-none`}
          >
            {`${updateType === "create" ? `Create` : `Update`}`}
          </button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
