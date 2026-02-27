import React, { useEffect, useState } from "react";
import Link from "next/link";
import useApplicant from "@/admin/hooks/useApplicant";
import { codeToCountry, codeToEmoji } from "@/utils/countryCodes";
import { getFirstName, readableDate } from "@/utils/helpers";
import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
} from "@chakra-ui/react";
import RejectApplicant from "../../CompleteCandidateProfile/RejectApplicant";
import MoveStage from "../../CompleteCandidateProfile/MoveStage";

export default function QuickCandidateSummaryCard({ applicantId }) {
  const [showControls, setShowControls] = useState(false);
  const { applicant, loading, error } = useApplicant({ applicantId });
  const [showActionItemStyle, setShowActionItemStyle] =
    useState("opacity-0 h-0 mt-0");
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

  useEffect(() => {
    let timeout;
    if (showControls) {
      timeout = setTimeout(() => {
        setShowActionItemStyle("opacity-100 h-auto mt-4");
      }, 1000); // waits for 1 second before executing
    } else {
      setShowActionItemStyle("opacity-0 h-0 mt-0");
    }

    // Cleanup function to clear the timeout
    return () => {
      clearTimeout(timeout);
    };
  }, [showControls]);

  if (!applicant) return null;

  if (loading) {
    return <div className="w-72 rounded-2xl h-52 bg-gray-300 animate-pulse" />;
  }

  if (error) {
    return (
      <span className="text-red-600 font-medium">
        {error?.message || "Error loading applicant"}
      </span>
    );
  }

  return (
    <Link
      href={
        applicant.stage === "Rejected" ? "/admin" : `/admin/c/${applicantId}`
      }
      className="flex flex-col text-sm rounded-2xl w-full border px-4 py-2"
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(false)}
    >
      <span
        className={`text-base font-medium ${
          applicant.stage === "Rejected" && "text-red-600"
        }`}
      >
        {applicant.profile.name}
      </span>
      {applicant.stage === "Rejected" && (
        <span className="text-base font-medium text-red-600">Rejected</span>
      )}
      {applicant.stage !== "Rejected" && (
        <span className="font-medium mt-1 text-gray-500">
          {applicant.profile.email}{" "}
        </span>
      )}
      <span className="text-gray-500 mt-1">
        {codeToEmoji[applicant.country_code] || "📍"}{" "}
        {codeToCountry[applicant.country_code]}
      </span>
      <span className="text-gray-800 mt-1.5">
        {readableDate(applicant.date_applied.toDate())}
      </span>
      {/* <div className={`flex flex-col items-center w-full`}>
        {applicant.stage !== "Rejected" && applicant.stage !== "Withdrawn" && (
          <div
            className={`transition-all ease-in-out duration-500 overflow-hidden ${showActionItemStyle}`}
          >
            <div
              className={`flex items-center justify-between space-x-2 font-medium`}
            >
              <button
                onClick={onRejectionModalOpen}
                className="flex justify-center items-center text-center space-x-2 border w-1/2 py-1 rounded-lg text-red-600 border-red-200 hover:text-white hover:bg-red-600 transition-all ease-in-out duration-300"
              >
                <XMarkIcon className="h-4 w-4" />
                <span>Reject</span>
              </button>
              <button
                onClick={onMoveStageModalOpen}
                className="flex justify-center items-center text-center space-x-2 border w-1/2 py-1 rounded-lg hover:text-white hover:bg-gray-600 transition-all ease-in-out duration-300"
              >
                <ArrowsUpDownIcon className="h-4 w-4" />
                <span className="">Stage</span>
              </button>
            </div>
          </div>
        )}
      </div> */}
      <Modal
        isOpen={isRejectionModalOpen}
        onClose={onRejectionModalClose}
        size={"lg"}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            Reject {getFirstName(applicant.profile.name)}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <div className="mb-8">
              <RejectApplicant
                applicantId={applicantId}
                reloadOnCompletion={false}
              />
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
    </Link>
  );
}
