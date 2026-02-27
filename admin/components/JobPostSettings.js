import {
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  ModalFooter,
  useDisclosure,
  useToast,
  Switch,
  Tooltip,
} from "@chakra-ui/react";
import React, { useState } from "react";
import Head from "next/head";
import useJob from "@/admin/hooks/useJob";
import axios from "axios";
import { useRouter } from "next/router";
import { doc, setDoc } from "firebase/firestore";
import { clientFirestore } from "../lib/firebaseClient";

const JobPostSettings = ({ jobId }) => {
  const toast = useToast();
  const router = useRouter();
  const { job, loading, error } = useJob({ job_id: jobId });
  const {
    isOpen: isDeleteModalOpen,
    onOpen: onDeleteModalOpen,
    onClose: onDeleteModalClose,
  } = useDisclosure();
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [safetyPrompt, setSafetyPrompt] = useState("");
  const [pending, setPending] = useState(false);

  const updateFilters = async (key, newValue) => {
    setPending(true);
    try {
      const currentFilters = job.filters || {};
      currentFilters[key] = newValue;
      await setDoc(
        doc(clientFirestore, "jobs", job.id),
        { filters: currentFilters },
        { merge: true }
      );
    } catch (error) {}
    setPending(false);
  };

  const customFilters = () => {
    const customFilters = [
      {
        key: "reject_country_mismatch",
        display: "Reject by Country",
        description:
          "If you require applicants to be in a specific country or near a specific address, applicants from other countries will be automatically rejected.",
      },
    ];

    return null;

    return (
      <div className="my-4">
        <div className="m-2 font-semibold text-lg">
          Inbound Applicant Filters
        </div>
        <div className="text-xs m-2">
          Applicants will be automatically rejected based on matching criteria
          if these are enabled. More will be added over time.
        </div>
        {customFilters.map((filter) => (
          <div key={filter.key}>
            <Switch
              colorScheme="blue"
              isChecked={job.filters?.[filter.key]}
              onChange={(e) => {
                updateFilters(filter.key, e.target.checked);
              }}
              disabled={pending}
              className="mx-2"
            />
            <Tooltip label={filter.description} className="mx-2 px-2">
              <span>{filter.display}</span>
            </Tooltip>
          </div>
        ))}
      </div>
    );
  };

  const handleDeleteJob = async () => {
    if (safetyPrompt !== "I Agree") return;
    if (
      confirm(
        "Are you 100% sure you want to proceed with deleting this job?"
      ) == true
    ) {
    } else {
      onDeleteModalClose();
      return;
    }
    onDeleteModalClose();
    setIsUpdatingStatus(true);
    try {
      await axios.patch(`/api/admin/specialCases/deleteJob`, { job_id: jobId });
      router.push(`/admin/jobs`);
    } catch (error) {
      toast({
        title: "Error deleting job",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
    setIsUpdatingStatus(false);
  };

  if (loading)
    return <div className="flex justify-center font-medium">Loading...</div>;

  if (error)
    return (
      <div className="flex justify-center text-red-600">{error.message}</div>
    );

  return (
    <>
      <Head>
        <title>Job Post Settings | HiringCafe</title>
      </Head>
      <div className="flex justify-center">
        <div className="flex flex-col items-center text-lg max-w-2xl">
          <div className="flex flex-col items-center text-center">
            <span className="text-4xl font-medium">{`Settings`}</span>
          </div>
          {isUpdatingStatus ? (
            <span className="mt-8">Updating...</span>
          ) : (
            <div className="flex flex-col items-center mt-8">
              <button
                onClick={onDeleteModalOpen}
                className="mt-8 text-red-600 hover:text-red-50 border border-red-600 rounded py-1 px-4 font-medium hover:bg-red-600 hover:shadow-xl hover:scale-105 transition-all ease-in-out duration-300"
              >
                Delete this Job
              </button>
              {customFilters()}
            </div>
          )}
        </div>
      </div>
      <Modal isOpen={isDeleteModalOpen} onClose={onDeleteModalClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Delete Job</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <div className="my-2">
              {`Are you sure you want to delete ${
                job?.job_info?.title || "this job"
              }?\n
              This can't be undone and you will lose all applicants currently in the your pipeline on this job.\n
              You will not be refunded for any applicants that are lost when deleting this job.`}
            </div>
            <hr />
            <div className="my-2">
              <div>{`If you are ok with this, type "I Agree" (case sensitive).`}</div>
              <input
                placeholder="I Agree"
                className="border border-1 px-2 rounded"
                value={safetyPrompt}
                onChange={(e) => setSafetyPrompt(e.target.value)}
              />
            </div>
          </ModalBody>
          <ModalFooter>
            <Button
              disabled={safetyPrompt !== "I Agree"}
              colorScheme="red"
              mr={3}
              onClick={handleDeleteJob}
            >
              Yes, Delete this job
            </Button>
            <Button variant="ghost" onClick={onDeleteModalClose}>
              No, Keep this job
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default JobPostSettings;
