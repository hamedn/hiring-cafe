import { useEffect, useState } from "react";
import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";

export default function WithdrawApplicationModal({
  onModalClose,
  applicantInfo,
  mutate,
}) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [response, setResponse] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const toast = useToast();

  useEffect(() => {
    onOpen();
  }, [onOpen]);

  const submitChange = async () => {
    if (response !== "I Accept") return;
    setSubmitting(true);
    const submitData = {
      applicant_id: applicantInfo.applicantId,
      access_token: applicantInfo.candidate_token.token,
    };
    try {
      await axios.post(`/api/applicant/withdrawApplication`, submitData);
      mutate();
      toast({
        title: "Successfully Withdrawn.",
        status: "success",
        isClosable: true,
        duration: 9000,
      });
    } catch (error) {
      toast({
        title: "Unable to withdraw.",
        description: error.message,
        status: "error",
        isClosable: true,
        duration: 9000,
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        onModalClose();
        onClose();
      }}
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          <div className="flex flex-col mt-4">
            <span className="text-4xl bold">Withdraw Application</span>
          </div>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <div className="m-2">
            <div>You will withdraw your application upon completing this submission and take yourself out of consideration for this position. You cannot take this back.</div>
            <div>If you change your mind after withdrawing your application, you can re-apply but will need to start from the beginning.</div>
            <div>If you understand this, type "I Accept" and submit.</div>
            <div>
              <input
                type="text"
                className="p-1 m-2 border border-1 rounded"
                value={response}
                onChange={(e) => setResponse(e.target.value)}
              />
            </div>
            <button
              className={`${(submitting || (response !== "I Accept")) ? "bg-gray-200" : "bg-blue-500 text-white"
                } p-3 m-2 font-bold rounded`}
              disabled={submitting || (response !== "I Accept")}
              onClick={() => submitChange()}
            >
              Submit
            </button>
          </div>
        </ModalBody>
        <ModalFooter></ModalFooter>
      </ModalContent>
    </Modal>
  );
}
