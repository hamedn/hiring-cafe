import {
  CircularProgress,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Switch,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { capitalizeFirstLetter } from "@/utils/helpers";
import { MapPinIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import axios from "axios";
import { useState } from "react";
import useJobBoost from "../hooks/useJobBoost";

export default function MarketplaceJobPostConfig({ job }) {
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [isBoosting, setIsBoosting] = useState(false);

  const { jobBoost, loading: loadingJobBoost } = useJobBoost({
    job_id: job.id,
  });

  const toast = useToast();

  const {
    isOpen: isBoostJobModalOpen,
    onOpen: onBoostJobModalOpen,
    onClose: onBoostJobModalClose,
  } = useDisclosure();

  const handleUnlistConfirm = async (job) => {
    if (confirm("Are you sure you want to unlist this job post?")) {
      setIsUpdatingStatus(true);
      try {
        await axios.patch("/api/admin/job", {
          job_id: job.id,
          patch_data: { status: "unlisted" },
        });
        toast({
          title: "Job post unlisted",
          description: "Your job post has been unlisted.",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
      } catch (error) {
        console.trace(error);
        toast({
          title: "Error unlisting job post",
          description: error.message,
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      } finally {
        setIsUpdatingStatus(false);
      }
    }
  };

  const handleListing = async (job) => {
    setIsUpdatingStatus(true);
    try {
      await axios.patch("/api/admin/job", {
        job_id: job.id,
        patch_data: { status: "listed" },
      });
      toast({
        title: "Job post listed",
        description: "Your job post has been listed.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      console.trace(error);
      toast({
        title: "Error listing job post",
        description:
          error.response?.data?.error?.message ||
          error.response?.data?.error ||
          error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  return (
    <>
      <div
        className="flex space-x-4 justify-between items-center border p-4 rounded"
        key={job.id}
      >
        <div className="flex flex-col space-y-2 text-sm">
          <div className="flex items-center space-x-2 text-sm">
            <div
              className={`h-2 w-2 rounded-full flex-none ${
                job.status === "pending"
                  ? "bg-yellow-600"
                  : job.status === "listed"
                  ? "bg-green-600"
                  : job.status === "draft"
                  ? "bg-gray-600"
                  : job.status === "unlisted"
                  ? "bg-red-600"
                  : "bg-red-600"
              }`}
            />
            <span className="text-gray-400">
              Status: {capitalizeFirstLetter(job.status)}
            </span>
          </div>
          <Link
            href={"/admin/edit-job/" + job.id}
            className="flex items-center space-x-2"
          >
            <span className="font-medium text-yellow-600">
              {job.job_info.title}
            </span>
          </Link>
          <div className="flex items-center space-x-1">
            <MapPinIcon className="h-4 w-4 flex-none" />
            <span>{job.job_info.workplace_address}</span>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Switch
            colorScheme="yellow"
            disabled={isUpdatingStatus}
            isChecked={job.status === "listed"}
            onChange={() => {
              if (job.status === "listed") {
                handleUnlistConfirm(job);
              } else {
                handleListing(job);
              }
            }}
          />
          {job.status === "listed" && !loadingJobBoost && !jobBoost && (
            <button
              onClick={() => {
                onBoostJobModalOpen();
              }}
              className="text-pink-600 border rounded-full border-pink-600 px-4 py-1 text-sm hover:bg-pink-600 hover:text-white font-bold"
            >
              Boost Job
            </button>
          )}
          {jobBoost && (
            <span className="text-sm text-gray-400">
              Boosted on{" "}
              {new Date(jobBoost.date).toLocaleDateString("en-US", {
                month: "numeric",
                day: "numeric",
              })}
            </span>
          )}
          {isUpdatingStatus && (
            <CircularProgress
              size={"24px"}
              isIndeterminate={true}
              color="yellow.600"
            />
          )}
        </div>
      </div>
      <Modal
        isOpen={isBoostJobModalOpen}
        onClose={() => {
          onBoostJobModalClose();
        }}
        size={"xl"}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Boost This Job</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <div className="flex flex-col items-center text-center p-4">
              <span className="text-2xl font-bold mt-8">
                Get 10x More Visibility for This Job Posting
              </span>
              <span className="mt-2">
                Boost this job to the top of the list for 7 days.
              </span>
              <Link
                className="mt-8 text-yellow-600"
                href={"/employers/job-boosts"}
                target="_blank"
                rel="noopener noreferrer"
              >
                Learn more
              </Link>
            </div>
            <div className="flex justify-center mt-8 mb-16">
              <button
                disabled={isBoosting}
                className={`rounded-full bg-pink-600 text-white px-4 py-1 text-2xl font-extrabold ${
                  isBoosting ? "opacity-50 cursor-not-allowed" : ""
                }`}
                onClick={async () => {
                  setIsBoosting(true);
                  try {
                    await axios.post("/api/admin/payment/boostJob", {
                      job_id: job.id,
                    });
                    toast({
                      title: "Job Boosted",
                      description: "Your job has been boosted.",
                      status: "success",
                      duration: 5000,
                      isClosable: true,
                    });
                    onBoostJobModalClose();
                  } catch (error) {
                    console.trace(error);
                    toast({
                      title: "Error boosting job",
                      description:
                        error.response?.data?.error?.message ||
                        error.response?.data?.error ||
                        error.message,
                      status: "error",
                      duration: 5000,
                      isClosable: true,
                    });
                  } finally {
                    setIsBoosting(false);
                  }
                }}
              >
                {isBoosting ? (
                  <CircularProgress
                    size={"24px"}
                    isIndeterminate={true}
                    color="white"
                  />
                ) : (
                  "Boost Job"
                )}
              </button>
            </div>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}
