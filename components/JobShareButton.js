import { ArrowUpOnSquareIcon } from "@heroicons/react/24/outline";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Tooltip,
} from "@chakra-ui/react";
import ShareJob from "./ShareJob";

export default function JobShareButton({ job }) {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const onShareClick = () => {
    // Always open our modal for a consistent UI across devices.
    onOpen();
  };

  return (
    <>
      <Tooltip label="Share Job" aria-label="Share Job">
        <button
          onClick={onShareClick}
          className="rounded-lg p-2 text-black hover:bg-gray-200 flex-none outline-none"
        >
          <ArrowUpOnSquareIcon className="h-5 w-5 flex-none" />
        </button>
      </Tooltip>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton />
          <ModalBody>
            <div className="p-4 mt-8">
              <ShareJob job={job} />
            </div>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}
