import { useState, useEffect } from "react";
import useJob from "@/admin/hooks/useJob";
import { doc, updateDoc } from "firebase/firestore";
import { clientFirestore } from "@/admin/lib/firebaseClient";
import {
  CircularProgress,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  useDisclosure,
} from "@chakra-ui/react";
import JobApplication from "@/components/jobApplication";

export default function ReviewQuickSummaryCard({ jobID }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { job, error, loading } = useJob({ job_id: jobID });

  const [responsibilities, setResponsibilities] = useState(
    job?.job_info?.quick_responsibilities || ""
  );
  const [requirements, setRequirements] = useState(
    job?.job_info?.quick_requirements || ""
  );

  useEffect(() => {
    if (!job) return;
    setResponsibilities(job.job_info.quick_responsibilities);
    setRequirements(job.job_info.quick_requirements);
  }, [job]);

  const updateField = async (field, value) => {
    const trimmedValue = value.trim().substr(0, 160);
    if (trimmedValue?.length === 0) return;
    const jobRef = doc(clientFirestore, "jobs", jobID);
    await updateDoc(jobRef, { [`job_info.${field}`]: trimmedValue });
  };

  if (loading)
    return (
      <div className="flex justify-center mt-2">
        <CircularProgress isIndeterminate color="black" size="24px" />
      </div>
    );

  if (error) {
    return <div className="text-red-500 text-sm mt-2">{error.message}</div>;
  }

  return (
    <div className="relative">
      <button
        className="absolute top-0 right-0 rounded-lg text-sm bg-black font-medium text-white px-4 py-0.5"
        onClick={onOpen}
      >
        View Application Page
      </button>
      <span className="absolute bottom-0 inset-x-0 text-center text-sm bg-orange-200 text-orange-900 mb-2 rounded">
        Quick Summary Card
      </span>
      <Modal isOpen={isOpen} size={"3xl"} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Job Application Preview</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <div className="flex flex-col mt-4 mb-8">
              <div className="w-full h-8 bg-gray-300 rounded-t flex items-center justify-between px-2">
                <div className="flex space-x-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                </div>
              </div>
              <div className="w-full p-8 border-x border-b rounded-b-2xl">
                <JobApplication isPreview={true} jobID={job.requisition_id} />
              </div>
            </div>
          </ModalBody>
        </ModalContent>
      </Modal>
      <div className="flex flex-col p-6 py-10">
        {job.job_info?.title && (
          <span className="font-bold text-base">{job.job_info.title}</span>
        )}

        {job.job_info?.salary && (
          <span className="font-light text-sm mt-2">
            💰
            <span className="ml-2">Salary: {job.job_info.salary}</span>
          </span>
        )}

        {job.board?.title && job.board?.description && (
          <div className="flex flex-col">
            <span className="text-sm mt-4 font-bold">
              🏢<span className="ml-2">{job.board.title}</span>
            </span>
            <span className="font-light text-sm mt-2">
              {job.board.description}
            </span>
          </div>
        )}

        <span className="text-sm mt-4 font-bold">
          🤹‍♂️<span className="ml-2">Responsibilities</span>
        </span>
        <div className="relative flex flex-col items-end">
          <textarea
            className="text-sm mt-2 bg-gray-200 rounded p-2 w-full resize-none h-24 outline-none"
            onBlur={(e) => {
              const updatedResponsibilities = e.target.value;
              updateField("quick_responsibilities", updatedResponsibilities);
              if (updatedResponsibilities?.trim()?.length === 0) {
                setResponsibilities(job.job_info?.quick_responsibilities || "");
                return;
              }
            }}
            onChange={(e) => setResponsibilities(e.target.value)}
            value={responsibilities}
          />
          <span
            className={`absolute bottom-0 right-0 text-xs mt-2 mr-1 mb-1 font-bold text-gray-500 ${responsibilities.length > 160 ? "text-red-500" : ""
              } z-10 pointer-events-none`}
          >
            {responsibilities.length}/160
          </span>
        </div>
        <span className="text-sm mt-4 font-bold">
          🎯<span className="ml-2">Requirements</span>
        </span>
        <div className="relative flex flex-col items-end">
          <textarea
            className="text-sm mt-2 bg-gray-200 rounded p-2 w-full resize-none h-24 outline-none"
            onBlur={(e) => {
              const updatedRequirements = e.target.value;
              updateField("quick_requirements", updatedRequirements);
              if (updatedRequirements?.trim()?.length === 0) {
                setRequirements(job.job_info?.quick_requirements || "");
                return;
              }
            }}
            onChange={(e) => setRequirements(e.target.value)}
            value={requirements}
          />
          <span
            className={`absolute bottom-0 right-0 text-xs mt-2 mr-1 mb-1 font-bold text-gray-500 ${requirements.length > 160 ? "text-red-500" : ""
              } z-10 pointer-events-none`}
          >
            {requirements.length}/160
          </span>
        </div>
        <div className="flex flex-col mt-4">
          <span className="text-sm font-bold">
            💼<span className="ml-2">Interview Process</span>
          </span>
          <span className="text-sm font-light mt-2">
            Initial Screen {" -> "}
            {(job.interview_process && job.interview_process.length > 0
              ? job.interview_process
              : ["Next Steps"]
            ).join(" -> ")}
          </span>
        </div>
      </div>
    </div>
  );
}
