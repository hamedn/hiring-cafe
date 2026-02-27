import { useAuth } from "@/hooks/useAuth";
import {
  ArrowUturnLeftIcon,
  EyeSlashIcon,
  FlagIcon,
} from "@heroicons/react/24/outline";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Tooltip,
  ModalHeader,
} from "@chakra-ui/react";
import { QUICK_SUMMARY_CARD_VIEW_FORMAT } from "@/utils/constants";
import SavedJobActions from "./SavedJobActions";
import { useState } from "react";
import useBrowseJobStatusV4 from "@/hooks/useBrowseJobStatusV4";
import Link from "next/link";
import AuthenticationModal from "./AuthenticationModal";

export default function JobDescriptionActionItems({
  job,
  viewFormat,
  onDelete,
  onUpdateStage,
  style = "standard",
  reportModalState, // Optional external modal state to prevent unmounting issues
}) {
  const { loading: loadingUser, user } = useAuth();

  const {
    isSaved,
    isHidden,
    isApplied,
    isCompanyHidden,
    reportAndHideJob,
    markJob,
    unhideJob,
    hideCompany,
  } = useBrowseJobStatusV4({
    job,
  });

  // Use internal disclosure as fallback if external state not provided
  const internalDisclosure = useDisclosure();
  
  // Use external modal state if provided, otherwise use internal
  const isReportJobModalOpen = reportModalState?.isOpen ?? internalDisclosure.isOpen;
  const onReportJobModalOpen = reportModalState?.onOpen ?? internalDisclosure.onOpen;
  const onReportJobModalClose = reportModalState?.onClose ?? internalDisclosure.onClose;

  const [reason, setReason] = useState("");

  if (viewFormat === QUICK_SUMMARY_CARD_VIEW_FORMAT.SAVED_LIST) {
    return (
      <div className="h-full">
        <SavedJobActions
          style={style}
          job={job}
          onDelete={onDelete}
          onUpdateStage={onUpdateStage}
          reportModalState={reportModalState}
        />
      </div>
    );
  }

  if (viewFormat !== QUICK_SUMMARY_CARD_VIEW_FORMAT.SEARCH_RESULTS) {
    return null;
  }

  if (loadingUser) {
    return null;
  }

  if (isHidden || isApplied || isSaved) {
    return (
      <div className="flex items-center space-x-2 z-10">
        {isHidden && (
          <Tooltip label="Undo Hide" aria-label="Undo Hide">
            <button
              onClick={(e) => {
                e.stopPropagation();
                unhideJob();
              }}
              className={`flex items-center space-x-1 text-gray-600 hover:text-gray-800 rounded-full p-2 ${
                style === "hovering" ? "bg-white" : "hover:bg-gray-200"
              } transition-colors`}
            >
              <ArrowUturnLeftIcon className="h-4 w-4 flex-none" />
              <span className="text-xs font-medium">Undo</span>
            </button>
          </Tooltip>
        )}
        <Link
          href={"/myhiringcafe/tracker"}
          onClick={(e) => {
            e.stopPropagation();
          }}
          className="bg-pink-50 text-pink-600 font-bold rounded px-4 py-2 text-xs"
        >
          App Tracker
        </Link>
      </div>
    );
  }

  return (
    <div className={`flex items-center space-x-2 z-10`}>
      <Tooltip label="Hide Job" aria-label="Hide Job">
        {user ? (
          <button
            className={`
            text-red-600 rounded-full p-3 ${
              style === "hovering" ? "bg-white" : "hover:bg-gray-200"
            }`}
            onClick={(e) => {
              e.stopPropagation();
              markJob("Hidden");
            }}
          >
            <EyeSlashIcon className="h-4 w-4 flex-none" />
          </button>
        ) : (
          <AuthenticationModal>
            <Tooltip label="Hide Job" aria-label="Hide Job">
              <div
                className={`flex-none
            text-red-600 rounded-full p-3 ${
              style === "hovering" ? "bg-white" : "hover:bg-gray-200"
            }`}
              >
                <EyeSlashIcon className="h-4 w-4 flex-none" />
              </div>
            </Tooltip>
          </AuthenticationModal>
        )}
      </Tooltip>
      {/* {!isCompanyHidden ? (
        <Tooltip label="Hide Company" aria-label="Hide Company">
          <button
            className={`
            text-red-600 rounded-full p-3 ${
              style === "hovering" ? "bg-white" : "hover:bg-gray-200"
            }`}
            onClick={(e) => {
              e.stopPropagation();
              hideCompany(true);
            }}
          >
            <BuildingOfficeIcon className="h-4 w-4 flex-none" />
          </button>
        </Tooltip>
      ) : null} */}
      <Tooltip label="Report & Hide" aria-label="Report & Hide">
        <button
          onClick={async (e) => {
            e.stopPropagation();
            onReportJobModalOpen();
          }}
        >
          <div
            className={`
                  text-red-600 rounded-full p-3 ${
                    style === "hovering" ? "bg-white" : "hover:bg-gray-200"
                  }`}
          >
            <FlagIcon className="h-4 w-4 flex-none" />
          </div>
        </button>
      </Tooltip>
      <Modal
        isOpen={isReportJobModalOpen}
        onClose={onReportJobModalClose}
        closeOnOverlayClick={false}
        closeOnEsc={false}
      >
        <ModalOverlay onClick={(e) => e.stopPropagation()} />
        <ModalContent onClick={(e) => e.stopPropagation()}>
          <ModalHeader>Report & Hide Job</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <div>Why are you reporting this job?</div>
            <div className="flex items-center space-x-2 my-4">
              <select
                className="border border-1 p-2 outline-none focus:outline-none"
                onChange={(e) => setReason(e.target.value)}
              >
                <option value={""}>Select...</option>
                <option value={"thirdparty"}>
                  Third Party Recruiter/Agency
                </option>
                <option value={"fake"}>Fake Job, Scam, Spam</option>
                <option value={"incorrect"}>Incorrect Job Info</option>
                <option value={"outdated"}>Expired Application</option>
                <option value={"reposted"}>Reposted Job</option>
              </select>
              <button
                className={`${
                  reason === "" ? "bg-gray-200" : "bg-black text-white"
                } font-medium p-2 rounded`}
                disabled={reason === ""}
                onClick={async () => {
                  if (await reportAndHideJob(reason)) {
                    onReportJobModalClose();
                  }
                }}
              >
                Submit
              </button>
            </div>
          </ModalBody>
        </ModalContent>
      </Modal>
    </div>
  );
}
