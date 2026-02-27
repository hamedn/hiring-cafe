import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  useDisclosure,
} from "@chakra-ui/react";
import SelectIndustriesV3 from "../JobFilters/SelectIndustriesV3";
import SelectQuery from "./SelectQuery";
import SearchTips from "../SearchTips";
import SelectRestrictByTitle from "../JobFilters/SelectRestrictByTitle";
import { useRouter } from "next/router";
import SelectRoles from "./SelectRoles";

export default function SearchFilter() {
  const router = useRouter();
  const {
    isOpen: isSearchTipsModalOpen,
    onOpen: onSearchTipsModalOpen,
    onClose: onSearchTipsModalClose,
  } = useDisclosure();

  return (
    <div className="flex flex-col items-start">
      <span className="text-lg md:text-xl font-medium mb-4">Search query</span>
      <SelectQuery />
      <button
        onClick={() => onSearchTipsModalOpen()}
        className="text-xs text-gray-500 underline px-2 mt-1"
      >
        How Search Works
      </button>
      {router.query.searchQuery && (
        <div className="mt-8 w-full">
          <SelectRestrictByTitle />
        </div>
      )}
      <div className="border-b border-gray-300 w-full my-8" />
      <div className="flex flex-col space-y-4 w-full">
        <span className="text-lg md:text-xl font-medium">Job Categories</span>
        <SelectRoles />
      </div>
      <div className="border-b border-gray-300 w-full my-8" />
      <div className="flex flex-col space-y-4 pb-8">
        <span className="text-lg md:text-xl font-medium">
          Company Industries
        </span>
        <SelectIndustriesV3 />
      </div>
      <Modal
        isCentered
        scrollBehavior="inside"
        isOpen={isSearchTipsModalOpen}
        onClose={onSearchTipsModalClose}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton />
          <ModalBody>
            <div className="my-4">
              <SearchTips />
            </div>
          </ModalBody>
        </ModalContent>
      </Modal>
    </div>
  );
}
