import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useBreakpointValue,
  useDisclosure,
} from "@chakra-ui/react";
import { BriefcaseIcon, ChevronDownIcon } from "@heroicons/react/24/outline";
import JobCategorySelectionV5 from "../V5Filters/JobCategorySelectionV5";
import useURLSearchStateV4, {
  URLSearchStateUpdateType,
} from "@/hooks/useURLSearchStateV4";
import useMobileDeviceDetection from "@/hooks/useMobileDeviceDetection";
import { useCurrentSearchFilters } from "contexts/CurrentSearchFiltersContext";
import {
  BriefcaseIcon as BriefcaseIconSolid,
  ChevronDownIcon as ChevronDownIconSolid,
} from "@heroicons/react/20/solid";

export default function CareerAreasV5() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { state: currentSearchState } = useCurrentSearchFilters();
  const size = useBreakpointValue({ base: "full", md: "lg", lg: "3xl" });
  const { update } = useURLSearchStateV4();
  const { isIOS, isInStandaloneMode } = useMobileDeviceDetection();

  return (
    <>
      <div className="hidden lg:block lg:h-full">
        <button
          onClick={onOpen}
          className={`flex items-center space-x-2 w-full outline-none text-sm h-full ${
            currentSearchState.departments.length > 0
              ? "text-pink-600"
              : "text-black"
          }`}
        >
          <BriefcaseIconSolid className="h-4 w-4 text-black flex-none" />
          <span className="font-bold">
            {currentSearchState.departments.length > 0
              ? `${currentSearchState.departments.length} Categor${
                  currentSearchState.departments.length > 1 ? "ies" : "y"
                }`
              : "All Categories"}
          </span>
          <ChevronDownIconSolid className="h-5 w-5 flex-none" />
        </button>
      </div>
      <div className="lg:hidden">
        <button
          onClick={onOpen}
          className="flex items-center space-x-2 justify-between w-full outline-none py-3 lg:py-0 px-4 lg:px-0 truncate"
        >
          <div className="flex items-center space-x-3 font-medium text-sm lg:text-base truncate">
            <BriefcaseIcon className="h-6 w-6 text-pink-600 flex-none" />
            <span className="truncate">
              {!currentSearchState.departments?.length
                ? `All Career Areas`
                : currentSearchState.departments.length === 1
                ? currentSearchState.departments[0]
                : `${currentSearchState.departments.map((d) => d).join(", ")}`}
            </span>
          </div>
          <ChevronDownIcon className="h-5 w-5 flex-none" />
        </button>
      </div>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        scrollBehavior="inside"
        size={size}
      >
        <ModalOverlay />
        <ModalContent className="">
          <ModalHeader className="">
            <span className="text-sm">Job Functions & Departments</span>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody className="" p={0}>
            <JobCategorySelectionV5 />
          </ModalBody>
          <ModalFooter>
            <div
              className={`flex items-center justify-end space-x-2 w-full font-bold ${
                isIOS && isInStandaloneMode ? "pb-8" : ""
              }`}
            >
              {currentSearchState.departments?.length > 0 ? (
                <div className="w-1/2 text-center">
                  <button
                    onClick={() => {
                      update({
                        type: URLSearchStateUpdateType.DEPARTMENTS,
                        payload: [],
                      });
                    }}
                    className="text-pink-600"
                  >
                    Clear all
                  </button>
                </div>
              ) : null}
              <button
                onClick={() => {
                  onClose();
                }}
                className="w-1/2 bg-pink-500 text-white rounded py-2"
              >
                Apply
              </button>
            </div>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
