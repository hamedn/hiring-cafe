import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  useBreakpointValue,
  ModalHeader,
} from "@chakra-ui/react";
import AuthForm from "./AuthForm";

const AuthenticationModal = ({ children }) => {
  const disclosure = useDisclosure();
  const modalSize = useBreakpointValue({ base: "full", md: "lg", lg: "xl" });

  return (
    <>
      <div
        onClick={(e) => {
          e.stopPropagation();
          disclosure.onOpen();
        }}
        className="flex-none cursor-pointer"
      >
        {children}
      </div>
      <Modal
        isOpen={disclosure.isOpen}
        onClose={disclosure.onClose}
        scrollBehavior="inside"
        size={modalSize}
      >
        <ModalOverlay />
        <ModalContent borderRadius="3xl">
          <ModalHeader className="border-b border-gray-300">
            <span className="text-base font-bold">Log in or sign up</span>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <div className="py-4 px-1">
              <AuthForm />
            </div>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default AuthenticationModal;
