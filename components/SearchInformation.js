import { ChevronDownIcon, XMarkIcon } from "@heroicons/react/24/outline";
import {
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  Popover,
  PopoverBody,
  useBreakpointValue,
  PopoverContent,
  PopoverTrigger,
  useDisclosure,
  useOutsideClick,
  Box,
} from "@chakra-ui/react";
import { useRef, useState, useEffect } from "react";
import DateSelectionV4, {
  dateSelectionOptions,
} from "./V5Filters/DateSelectionV4";
import { useCurrentSearchFilters } from "contexts/CurrentSearchFiltersContext";
import ApplicationFormEaseV4 from "./V5Filters/ApplicationFormEaseV4";
import HideJobsOptionsV4 from "./V5Filters/HideJobsOptionsV4";
import { applicationFormEaseOptions } from "@/utils/constants";
import SortOptionsV4 from "./V5Filters/SortOptionsV4";
import { sortOptions } from "contexts/CurrentSearchFiltersContext";
import useBrowseJobsSelectedCompany from "@/hooks/useBrowseJobsSelectedCompany";
import Link from "next/link";
import { FaReddit } from "react-icons/fa";
import React from "react";

export default function SearchInformation() {
  const isLargerScreen = useBreakpointValue({ base: false, lg: true });
  const { state: currentSearchState } = useCurrentSearchFilters();
  const { company: selectedCompany } = useBrowseJobsSelectedCompany();
  const [showFightButton, setShowFightButton] = useState(false);

  useEffect(() => {
    // Check if user has dismissed the fight button
    const dismissed = localStorage.getItem("fightButtonDismissed");
    if (!dismissed) {
      setShowFightButton(true);
    }
  }, []);

  const handleDismissFightButton = (e) => {
    e.preventDefault(); // Prevent navigation when clicking X
    e.stopPropagation();
    localStorage.setItem("fightButtonDismissed", "true");
    setShowFightButton(false);
  };

  const filters = [
    {
      label: (
        <span>
          {sortOptions.find(
            (option) => option.value === currentSearchState.sortBy
          )?.label || "Relevance"}
        </span>
      ),
      componentTitle: "Sort by",
      component: <SortOptionsV4 />,
    },
    {
      label: (
        <span>
          {dateSelectionOptions.find(
            (option) => option.value === currentSearchState.dateFetchedPastNDays
          )?.label || "All time"}
        </span>
      ),
      componentTitle: "Days on HiringCafe",
      component: <DateSelectionV4 />,
    },
    ...(!selectedCompany
      ? [
          {
            label: (
              <span>
                {`${(() => {
                  const value = currentSearchState.applicationFormEase || [];
                  if (value.includes("Time Consuming"))
                    return "Lengthy apply only";
                  if (value.includes("Simple")) return "Easy apply only";
                  if (value.length === 0) return "Easy or lengthy apply";
                  return "Easy or lengthy apply";
                })()}`}
              </span>
            ),
            componentTitle: "Application form ease",
            component: <ApplicationFormEaseV4 />,
          },
        ]
      : []),
    {
      label: (
        <span>
          {currentSearchState.hideJobTypes?.length
            ? `Hide ${currentSearchState.hideJobTypes.join(", ").toLowerCase()}`
            : "Show all jobs"}
        </span>
      ),
      componentTitle: "Exclude marked jobs",
      component: <HideJobsOptionsV4 />,
    },
  ];

  return (
    <div className="flex items-center space-x-0 md:space-x-4 overflow-auto w-full scrollbar-hide">
      {filters.map((filter, index) => (
        <FilterButton
          key={index}
          label={filter.label}
          componentTitle={filter.componentTitle}
          isLargerScreen={isLargerScreen}
        >
          {filter.component}
        </FilterButton>
      ))}
      <div className="h-[1px] bg-gray-300 w-full hidden md:block" />
      <Link
        href="https://www.reddit.com/r/hiringcafe"
        className="flex-none text-sm font-semibold text-gray-600 hidden lg:flex items-center lg:space-x-2 lg:border border-gray-600 rounded px-2 py-1"
        target="_blank"
        rel="noopener noreferrer"
      >
        <span className="text-xs">Join our community</span>
        <FaReddit className="w-4 h-4 flex-none text-red-500" />
      </Link>
      <Link
        href="/talent-network"
        className="flex-none text-sm font-semibold text-gray-600 hidden md:flex items-center md:space-x-1 md:border border-gray-600 rounded px-2 py-1"
      >
        <span className="text-xs">Talent Network</span>
      </Link>
    </div>
  );
}

function FilterButton({ label, componentTitle, isLargerScreen, children }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = useRef();
  const popoverRef = useRef();
  const { state: currentSearchState } = useCurrentSearchFilters();

  // Check if the filter has non-default value
  const isNonDefault = () => {
    if (componentTitle === "Sort by") {
      return (
        currentSearchState.sortBy !== "relevance" &&
        currentSearchState.sortBy !== "default"
      );
    }
    if (componentTitle === "Days on HiringCafe") {
      return true;
    }
    if (componentTitle === "Application form ease") {
      return (
        currentSearchState.applicationFormEase?.length > 0 &&
        currentSearchState.applicationFormEase.length !==
          applicationFormEaseOptions.length
      );
    }
    if (componentTitle === "Exclude marked jobs") {
      return currentSearchState.hideJobTypes?.length > 0;
    }
    return false;
  };

  const buttonClassName = `flex items-center justify-between md:hover:bg-gray-200 md:rounded-full pr-3.5 md:px-3 py-2 text-start flex-none space-x-1 md:space-x-2 text-xs font-bold outline-none ${
    isNonDefault() ? "text-pink-600" : ""
  }`;

  useOutsideClick({
    ref: popoverRef,
    handler: () => {
      if (popoverRef.current) {
        onClose();
      }
    },
  });

  if (isLargerScreen) {
    // Determine if this is a single-select filter
    const isSingleSelect =
      componentTitle === "Sort by" ||
      componentTitle === "Days on HiringCafe" ||
      componentTitle === "Application form ease";
    // If so, inject onSelectClose prop
    const childWithClose =
      isSingleSelect && children && children.type
        ? React.cloneElement(children, { onSelectClose: onClose })
        : children;
    return (
      <Box
        className="flex items-center space-x-6 flex-none z-30"
        ref={popoverRef}
      >
        <Popover
          placement="bottom-start"
          isOpen={isOpen}
          onClose={onClose}
          isLazy
        >
          <PopoverTrigger>
            <button ref={btnRef} onClick={onOpen} className={buttonClassName}>
              {label}
              <ChevronDownIcon className="w-3.5 h-3.5" />
            </button>
          </PopoverTrigger>
          <PopoverContent maxHeight="300px" overflowY="auto" py={2}>
            <PopoverBody>{childWithClose}</PopoverBody>
          </PopoverContent>
        </Popover>
      </Box>
    );
  } else {
    // Determine if this is a single-select filter
    const isSingleSelect =
      componentTitle === "Sort by" ||
      componentTitle === "Days on HiringCafe" ||
      componentTitle === "Application form ease";
    // If so, inject onSelectClose prop
    const childWithClose =
      isSingleSelect && children && children.type
        ? React.cloneElement(children, { onSelectClose: onClose })
        : children;
    return (
      <>
        <button
          ref={btnRef}
          onClick={onOpen}
          className={buttonClassName.replace(
            "rounded-full",
            "hover:rounded-full"
          )}
        >
          {label}
          <ChevronDownIcon className="w-3 h-3" />
        </button>
        <Drawer
          isOpen={isOpen}
          placement="bottom"
          onClose={onClose}
          finalFocusRef={btnRef}
        >
          <DrawerOverlay />
          <DrawerContent borderTopRadius="3xl" height={"md"}>
            <DrawerHeader
              display="flex"
              alignItems="center"
              justifyContent="space-between"
            >
              {componentTitle}
              <button
                className="bg-gray-200 rounded-full p-2 outline-none"
                onClick={onClose}
              >
                <XMarkIcon className="flex-none h-4 w-4" />
              </button>
            </DrawerHeader>
            <DrawerBody>
              <div className="pb-8">{childWithClose}</div>
            </DrawerBody>
          </DrawerContent>
        </Drawer>
      </>
    );
  }
}
