import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/react";

export default function EmailApplyModal({ email, isOpen, onClose }) {
  if (!email) return null;
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>How to Apply</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <div className="space-y-4 py-4">
            <p className="text-sm">
              To apply for this role, please send your resume and a brief
              introduction to:
            </p>
            <p className="text-black font-bold break-all">
              {email.replace("mailto:", "")}
            </p>
          </div>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
