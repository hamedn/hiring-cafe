import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  useBreakpointValue,
  useDisclosure,
} from "@chakra-ui/react";
import SaveSearchV4 from "./SaveSearchV4";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";

export default function SaveSearchButton() {
  const {
    isOpen: isSaveSearchModalOpen,
    onOpen: onSaveSearchModalOpen,
    onClose: onSaveSearchModalClose,
  } = useDisclosure();
  const [saveSearchMode, setSaveSearchMode] = useState("save");
  const modalSize = useBreakpointValue({ base: "full", md: "lg" });
  const btnSize = useBreakpointValue({ base: "md" });
  const { user } = useAuth();

  return (
    <>
      <Button
        onClick={onSaveSearchModalOpen}
        colorScheme="teal"
        size={btnSize}
        boxShadow="md"
        transition="all 0.2s ease-in-out"
        _hover={{ boxShadow: "lg", transform: "scale(1.05)" }}
        _focus={{ boxShadow: "outline" }}
      >
        Save Search
      </Button>

      <Modal
        isOpen={isSaveSearchModalOpen}
        onClose={onSaveSearchModalClose}
        size={modalSize}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton />
          <ModalHeader>
            {saveSearchMode === "save" ? "Save a new search" : "Update search"}
          </ModalHeader>
          <ModalBody>
            <div className="flex flex-col">
              {!user && (
                <span className="mb-6 text-sm font-medium text-teal-800">
                  <span className="block mb-2">🚀 Be the first to apply!</span>
                  Get email alerts when new jobs match your search.{" "}
                  <span className="font-semibold">
                    No spam, unsubscribe anytime.
                  </span>
                </span>
              )}
              <SaveSearchV4
                mode={saveSearchMode}
                onModeChange={setSaveSearchMode}
                onSaveComplete={onSaveSearchModalClose}
              />
            </div>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}
