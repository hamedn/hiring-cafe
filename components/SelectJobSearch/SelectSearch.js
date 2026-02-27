import { Tooltip, useDisclosure } from "@chakra-ui/react";
import {
  AdjustmentsHorizontalIcon,
  ChevronDownIcon,
  PencilSquareIcon,
  PlusIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { useJobFiltersCount } from "@/hooks/useJobFiltersCount";
import { useContext, useState } from "react";
import { JobSearchFiltersContext } from "contexts/JobSearchFiltersContext";
import _ from "lodash";
import { useRouter } from "next/router";
import { PlayIcon } from "@heroicons/react/20/solid";
import LottieAnimation from "../lottieAnimation";
import Loading from "@/animations/loading.json";
import SearchFilterModal from "./SearchFilterModal";
import Link from "next/link";

export default function SelectSearch() {
  const {
    isOpen: isCreateSearchModalOpen,
    onOpen: onCreateSearchModalOpen,
    onClose: onCreateSearchModalClose,
  } = useDisclosure();
  const { numFilters, numLocFilters, numQueryFilters } = useJobFiltersCount();
  const {
    searchFilters,
    currentFilter,
    updateCurrentFilter,
    updateSavedFilter,
    deleteFilter,
    loading: searchFiltersLoading,
  } = useContext(JobSearchFiltersContext);

  const [updateType, setUpdateType] = useState("create");
  const router = useRouter();

  if (searchFiltersLoading) {
    return (
      <div className="flex justify-center m-16">
        <LottieAnimation width="50px" height="50px" animationData={Loading} />
      </div>
    );
  }

  return (
    <>
      <div
        className={`flex ${
          currentFilter?.value?.filterID ? "items-start" : "items-center"
        } space-x-2 md:space-x-3 overflow-x-auto scrollbar-hide py-0.5`}
      >
        <div className="flex flex-col">
          <div className="flex items-center space-x-0 border rounded">
            <select
              className={`w-32 md:w-44 xl:w-52 rounded appearance-none p-2 truncate outline-none hover:outline-none bg-white text-xs md:text-sm ${
                Object.keys(currentFilter || {}).length
                  ? "text-black"
                  : "text-gray-500"
              }`}
              value={
                Object.keys(currentFilter || {}).length
                  ? currentFilter.value.filterID
                  : ""
              }
              onChange={(e) => {
                if (e.target.value) {
                  const newFilter = searchFilters.find(
                    (filter) => filter.value.filterID === e.target.value
                  );
                  updateCurrentFilter(newFilter);
                } else {
                  updateCurrentFilter({});
                }
              }}
            >
              <option value="">Saved searches...</option>
              {searchFilters.map((filter, i) => (
                <option
                  key={filter.value.filterID || i}
                  value={filter.value.filterID}
                >
                  {filter.label}
                </option>
              ))}
            </select>
            <div className="pr-2">
              <ChevronDownIcon className="h-4 w-4 flex-none" />
            </div>
          </div>
          {currentFilter?.value?.filterID ? (
            <button
              className="text-xs w-fit flex items-center space-x-0.5 px-1 mt-0.5 text-gray-400 hover:text-black"
              onClick={() => {
                const newLabel = prompt(
                  "Enter new name for this search filter",
                  currentFilter.label || ""
                );
                if (newLabel) {
                  updateSavedFilter({
                    filterID: currentFilter.value.filterID,
                    label: newLabel,
                  });
                }
              }}
            >
              <span>Filter name</span>
              <PencilSquareIcon className="h-3 w-3 flex-none" />
            </button>
          ) : null}
        </div>
        <div
          className={`flex items-center space-x-2 ${
            currentFilter?.value?.filterID ? "mt-1 md:mt-2" : ""
          }`}
        >
          {Object.keys(currentFilter || {}).length &&
          !_.isEqual(currentFilter?.value, router.query) ? (
            <button
              onClick={() => {
                router.replace({ query: currentFilter?.value || {} });
              }}
              className="flex w-fit items-center space-x-1 flex-none text-xs border border-gray-300 px-2 py-1 rounded-full hover:border-yellow-600 text-yellow-600 font-medium"
            >
              <PlayIcon className="h-4 w-4 flex-none" />
              <span className="font-bold">Resume</span>
            </button>
          ) : null}
          {Object.keys(currentFilter || {}).length ? (
            <button
              onClick={() => {
                setUpdateType("edit");
                onCreateSearchModalOpen();
              }}
              className="relative flex w-fit items-center space-x-1 flex-none text-xs border border-gray-300 px-2 py-1 rounded-full hover:border-black text-gray-600 hover:text-black font-medium"
            >
              <AdjustmentsHorizontalIcon className="h-4 w-4 flex-none" />
              <span className="">Filters</span>
              {numFilters + numLocFilters + numQueryFilters > 0 ? (
                <div className="absolute -top-1.5 -right-1.5 rounded-full bg-black text-white text-xs h-4 w-4 flex-none">
                  {numFilters + numLocFilters + numQueryFilters}
                </div>
              ) : null}
            </button>
          ) : null}
          {currentFilter?.value?.filterID ? (
            <button
              onClick={() => {
                router.replace({ query: {} });
                updateCurrentFilter({});
                if (currentFilter?.value?.filterID) {
                  deleteFilter({
                    filterID: currentFilter.value.filterID,
                  });
                }
              }}
              className="flex w-fit items-center space-x-1 flex-none text-xs border px-2 py-1 rounded-full hover:border-red-600 hover:text-red-600 font-medium"
            >
              <TrashIcon className="h-4 w-4 flex-none" />
              <span className="">Delete</span>
            </button>
          ) : null}
          <button
            onClick={() => {
              if (currentFilter?.value?.filterID) {
                router.replace({ query: {} });
              }
              setUpdateType("create");
              onCreateSearchModalOpen();
            }}
            className="flex w-fit items-center space-x-1 flex-none text-xs border-dashed border border-gray-300 px-2 py-1 rounded-full hover:border-black hover:text-black text-gray-600 font-medium"
          >
            <PlusIcon className="h-4 w-4 flex-none" />
            <span>
              {searchFilters?.length > 0 ? "New Search Filter" : "Filters"}
            </span>
          </button>
        </div>
      </div>
      <SearchFilterModal
        isCreateSearchModalOpen={isCreateSearchModalOpen}
        updateType={updateType}
        onCreateSearchModalClose={() => {
          onCreateSearchModalClose();
        }}
      />
    </>
  );
}
