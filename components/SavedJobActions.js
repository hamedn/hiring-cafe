import { memo, useState, useContext } from "react";
import { clientFirestore } from "@/lib/firebaseClient";
import { Timestamp, doc, updateDoc } from "firebase/firestore";
import { TrashIcon, FlagIcon } from "@heroicons/react/24/outline";
import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Tooltip,
  useBreakpointValue,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { useAuth } from "@/hooks/useAuth";
import { upperFirst } from "lodash";
import useBrowseJobStatusV4 from "@/hooks/useBrowseJobStatusV4";
import { SavedJobsContext } from "contexts/savedJobsContext";

const SavedJobActions = ({ job, onDelete, onUpdateStage, style, reportModalState }) => {
  const [userNote, setUserNote] = useState(job.userNote || "");
  const [reason, setReason] = useState("");
  const { getIDToken } = useAuth();
  const { removeJob: removeJobFromLocalContext } = useContext(SavedJobsContext);
  const {
    isOpen: isNotesModalOpen,
    onOpen: onNotesModalOpen,
    onClose: onNotesModalClose,
  } = useDisclosure();
  
  // Use internal disclosure as fallback if external state not provided
  const internalReportDisclosure = useDisclosure();
  
  // Use external modal state if provided, otherwise use internal
  const isReportJobModalOpen = reportModalState?.isOpen ?? internalReportDisclosure.isOpen;
  const onReportJobModalOpen = reportModalState?.onOpen ?? internalReportDisclosure.onOpen;
  const onReportJobModalClose = reportModalState?.onClose ?? internalReportDisclosure.onClose;
  
  const toast = useToast();
  const modalSize = useBreakpointValue({ base: "full", md: "lg" });

  const { reportAndHideJob } = useBrowseJobStatusV4({ job });

  const updateStage = async (newStatus) => {
    const oldStage = job.stage;
    const jobId = job.objectID || job.docID;

    const savedDoc = doc(clientFirestore, "savedJobs", job.docID);
    await updateDoc(savedDoc, { stage: newStatus, dateSaved: Timestamp.now() });

    try {
      const userToken = await getIDToken();

      await Promise.all([
        fetch("/api/removeJobFromList", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            job_id: jobId,
            user_token: userToken,
            stage: oldStage,
            should_delete: false,
          }),
        }),
        fetch("/api/updateMarketplaceJobStageForUser", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            job_id: jobId,
            user_token: userToken,
          }),
        }),
      ]);
    } catch (error) {
      console.error(error);
    }

    onUpdateStage(newStatus);
  };

  const saveNote = (note) => {
    const savedDoc = doc(clientFirestore, "savedJobs", job.docID);
    updateDoc(savedDoc, { userNote: note });
    setUserNote(note);
  };

  const handleDelete = async () => {
    try {
      const userToken = await getIDToken();
      const res = await fetch("/api/removeJobFromList", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          job_id: job.objectID || job.docID,
          user_token: userToken,
          stage: job.stage,
          should_delete: true,
        }),
      });

      if (!res.ok) {
        throw new Error(`Delete failed: ${res.status}`);
      }

      removeJobFromLocalContext(job.objectID || job.docID);
      onDelete(job.docID);
    } catch (error) {
      console.error("Error deleting job:", error);
    }
  };

  return (
    <div className="flex flex-col items-end space-y-2 justify-between h-full">
      <div className="flex flex-col items-end space-y-2">
        <select
          onClick={(e) => {
            e.stopPropagation();
          }}
          value={"current"}
          className="border border-gray-300 rounded p-2 text-sm font-bold"
          onChange={(e) => {
            e.stopPropagation();
            updateStage(e.target.value);
            toast({
              title: "Job Stage Updated",
              description:
                'The job stage has been moved to the "' +
                upperFirst(e.target.value) +
                '" stage.',
              status: "success",
              duration: 3000,
              isClosable: true,
            });
          }}
        >
          <option value="current" disabled>
            {upperFirst(job.stage || "")}
          </option>
          {["saved", "applied", "interviewing", "rejected", "hidden"]
            .filter((s) => s.toLowerCase() !== job.stage?.toLowerCase())
            .map((stage) => (
              <option key={stage} value={stage}>
                {upperFirst(stage)}
              </option>
            ))}
        </select>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onNotesModalOpen();
          }}
        >
          <div
            className={
              style === "hovering"
                ? "p-2 rounded-full bg-white font-semibold"
                : "text-green-600"
            }
          >
            📝 My Notes
          </div>
        </button>
      </div>
      <div className="flex items-center space-x-4">
        <Tooltip label="Report & Hide" aria-label="Report & Hide">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onReportJobModalOpen();
            }}
          >
            <div
              className={`
               text-red-600 ${
                 style === "hovering" ? "p-3 bg-white rounded-full" : ""
               }`}
            >
              <FlagIcon className="h-4 w-4 flex-none" />
            </div>
          </button>
        </Tooltip>
        <Tooltip label="Delete" aria-label="Delete">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleDelete();
            }}
          >
            <div
              className={`
               text-red-600 ${
                 style === "hovering" ? "p-3 bg-white rounded-full" : ""
               }`}
            >
              <TrashIcon className="h-4 w-4 flex-none" />
            </div>
          </button>
        </Tooltip>
      </div>
      <Modal
        isOpen={isNotesModalOpen}
        onClose={onNotesModalClose}
        size={modalSize}
        closeOnOverlayClick={false}
        closeOnEsc={false}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <div className="flex flex-col">
              <span>Your Private Notes</span>
              <span className="text-sm font-light">
                Only you can view your notes; employers can never see them.
              </span>
            </div>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <div className="flex flex-col mb-4">
              <textarea
                onChange={(e) => setUserNote(e.target.value)}
                className="h-72 border border-1 rounded w-full p-2 resize-none focus:border-none focus:ring-0 focus:outline-gray-200"
                value={userNote}
              />
              <div className="flex flex-items space-x-2 justify-end mt-4">
                {job.userNote !== userNote && userNote ? (
                  <button
                    className="py-2 w-28 rounded bg-pink-600 text-white font-medium text-sm"
                    onClick={() => {
                      saveNote(userNote);
                      onNotesModalClose();
                      toast({
                        title: "Note Saved",
                        description: "Your note has been saved.",
                        status: "success",
                        duration: 3000,
                        isClosable: true,
                      });
                    }}
                  >
                    Save
                  </button>
                ) : null}
                <button
                  className="py-2 w-28 rounded border font-medium text-sm"
                  onClick={() => {
                    if (!job.userNote) {
                      saveNote("");
                      onNotesModalClose();
                    } else if (
                      confirm("Are you sure you want to clear your note?")
                    ) {
                      userNote && saveNote("");
                      toast({
                        title: "Note Cleared",
                        description: "Your note has been cleared.",
                        status: "success",
                        duration: 3000,
                        isClosable: true,
                      });
                      onNotesModalClose();
                    }
                  }}
                >
                  Clear
                </button>
              </div>
            </div>
          </ModalBody>
        </ModalContent>
      </Modal>
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
                onClick={(e) => e.stopPropagation()}
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
                    toast({
                      title: "Job Reported",
                      description: "The job has been reported and hidden.",
                      status: "success",
                      duration: 3000,
                      isClosable: true,
                    });
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
};

export default memo(SavedJobActions);
