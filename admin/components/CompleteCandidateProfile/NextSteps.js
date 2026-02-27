import useApplicant from "@/admin/hooks/useApplicant";
import {
  CircularProgress,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import {
  ArrowsUpDownIcon,
  CalendarIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import MoveStage from "./MoveStage";
import { useState } from "react";
import axios from "axios";
import { getFirstName } from "@/utils/helpers";
import useJob from "@/admin/hooks/useJob";
import RejectApplicant from "./RejectApplicant";
import ReportApplicant from "./ReportApplicant";

export default function NextSteps({ applicantId }) {
  const toast = useToast();
  const { applicant, loading, error } = useApplicant({ applicantId });
  const [newMessage, setNewMessage] = useState("");
  const [isSendingMessage, setIsSendingMessage] = useState(false);
  const { job } = useJob({ job_id: applicant?.job_applied });

  const {
    isOpen: isRejectionModalOpen,
    onOpen: onRejectionModalOpen,
    onClose: onRejectionModalClose,
  } = useDisclosure();

  const {
    isOpen: isMoveStageModalOpen,
    onOpen: onMoveStageModalOpen,
    onClose: onMoveStageModalClose,
  } = useDisclosure();

  const {
    isOpen: isReportModalOpen,
    onOpen: onReportModalOpen,
    onClose: onReportModalClose,
  } = useDisclosure();

  const handleSendMessage = async () => {
    if (newMessage) {
      setIsSendingMessage(true);
      try {
        await axios.post("/api/admin/inbox/sendMessageToApplicant", {
          applicant: applicantId,
          messagebody: newMessage,
        });
        toast({
          title: "Message sent",
          description: `Your message has been sent to ${getFirstName(
            applicant.profile.name
          )}`,
          status: "success",
          colorScheme: "green",
          duration: 5000,
          isClosable: true,
        });
      } catch (error) {
        console.trace(error);
        toast({
          title: "Error sending message",
          description: error.message,
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      } finally {
        setIsSendingMessage(false);
        setNewMessage("");
      }
    }
  };

  if (!applicantId) return null;

  if (loading) {
    return <div className="py-8 animate-pulse bg-gray-300 h-96 rounded-lg" />;
  }

  if (error) {
    return null;
  }

  return (
    <div className="flex flex-col border rounded-xl p-8 shadow-xl">
      <div className="flex flex-col">
        <span className="text-2xl font-medium">
          Next steps with {getFirstName(applicant.profile.name)}
        </span>
        {applicant.availability && (
          <div className="flex flex-col mt-4 items-start max-w-xs bg-gray-200 text-gray-800 text-sm rounded p-4">
            <span className="font-medium">{`${getFirstName(
              applicant.profile.name
            )}'s Availability`}</span>
            <span className="mt-2 italic">{`"${applicant.availability}"`}</span>
          </div>
        )}
        <textarea
          className="mt-8 border rounded-lg p-4 h-32 resize-none outline-none w-full focus:border-black"
          placeholder={`Write a message to ${getFirstName(
            applicant.profile.name
          )}...`}
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        />
        <div className="flex justify-end mt-4 items-center space-x-8">
          <Link
            className="underline font-medium"
            href="/admin/inbox"
            target="_blank"
            rel="noopener noreferrer"
          >
            See all messages
          </Link>
          <button
            className={`border rounded py-2 w-40 font-medium transition-all ease-in-out duration-300
             ${newMessage || isSendingMessage
                ? "hover:bg-gray-100 text-black border-black"
                : "text-gray-500"
              }`}
            onClick={handleSendMessage}
            disabled={!newMessage || isSendingMessage}
          >
            {isSendingMessage ? (
              <CircularProgress isIndeterminate size="24px" color="gray" />
            ) : (
              "Send Message"
            )}
          </button>
        </div>
      </div>
      <div className="flex items-center space-x-4 mt-8">
        <button
          className="w-1/3 text-red-600 hover:text-red-50 border border-red-600 rounded py-2 font-medium hover:bg-red-600 hover:shadow-xl hover:scale-105 transition-all ease-in-out duration-300"
          onClick={onRejectionModalOpen}
        >
          <div className="flex items-center justify-center space-x-2">
            <XMarkIcon className="w-5 h-5" />
            <span>Reject</span>
          </div>
        </button>
        <button
          className="w-2/3 hover:text-white border border-black rounded py-2 font-medium hover:bg-gray-900 hover:border-gray-900 hover:shadow-xl hover:scale-105 transition-all ease-in-out duration-300"
          onClick={onMoveStageModalOpen}
        >
          <div className="flex items-center justify-center space-x-2">
            <ArrowsUpDownIcon className="w-5 h-5" />
            <span>Move Stage</span>
          </div>
        </button>
      </div>
      {/* <div className="flex justify-center mt-2 border rounded py-2 px-6 font-medium cursor-not-allowed text-gray-500">
        <div className="flex flex-col text-center items-center">
          <div className="flex items-center space-x-2">
            <CalendarIcon className="w-5 h-5" />
            <span>Schedule Interview</span>
          </div>
          <span className="text-xs">(Coming soon)</span>
        </div>
      </div> */}
      <div className="flex justify-center mt-2 rounded py-2 px-6 font-medium text-gray-500">
        <button
          className="w-2/3 text-red-600 hover:text-red-50 border border-red-600 rounded py-2 font-medium hover:bg-red-600 hover:shadow-xl hover:scale-105 transition-all ease-in-out duration-300"
          onClick={onReportModalOpen}
        >
          <div className="flex items-center justify-center space-x-2">
            <XMarkIcon className="w-5 h-5" />
            <span>Report Malicious Candidate</span>
          </div>
        </button>
      </div>
      <Modal
        isOpen={isRejectionModalOpen}
        onClose={onRejectionModalClose}
        size={"lg"}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Reject {applicant.profile.name}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <div className="mb-8">
              <RejectApplicant applicantId={applicantId} />
            </div>
          </ModalBody>
        </ModalContent>
      </Modal>
      <Modal
        isOpen={isMoveStageModalOpen}
        onClose={onMoveStageModalClose}
        size={"lg"}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader />
          <ModalCloseButton />
          <ModalBody>
            <div className="mb-4">
              <MoveStage applicantId={applicantId} />
            </div>
          </ModalBody>
        </ModalContent>
      </Modal>
      <Modal
        isOpen={isReportModalOpen}
        onClose={onReportModalClose}
        size={"lg"}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader />
          <ModalCloseButton />
          <ModalBody>
            <div className="mb-4">
              <ReportApplicant applicantId={applicantId} />
            </div>
          </ModalBody>
        </ModalContent>
      </Modal>
    </div>
  );
}
