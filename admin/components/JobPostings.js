import HiringCafeLogo from "@/components/HiringCafeLogo";
import Head from "next/head";
import Megaphone from "@/animations/Megaphone";
import Megaphone2 from "@/animations/megaphone2";
import LottieAnimation from "@/components/lottieAnimation";
import { withBoard } from "./withUserCheck";
import useJobs from "../hooks/useJobs";
import {
  Button,
  CircularProgress,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
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
import MarketplaceJobPostConfig from "./MarketplaceJobPostConfig";

function JobPostings() {
  const { jobs, loading } = useJobs();
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [selectedJobForBoost, setSelectedJobForBoost] = useState(null);
  const [isBoosting, setIsBoosting] = useState(false);

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
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta charSet="utf-8" />
        <title>Job Postings - HiringCafe</title>
        <meta
          property="og:title"
          content={`Job Postings - HiringCafe`}
          key="ogtitle"
        />
      </Head>
      <div className="flex items-center space-x-8 p-4">
        <div className="md:hidden">
          <HiringCafeLogo href={"/"} />
        </div>
      </div>
      <div className="flex justify-center">
        <div className="flex flex-col p-4 pb-16 max-w-xl w-full">
          <LottieAnimation
            width="200px"
            height="200px"
            animationData={Megaphone}
            customOptions={{ loop: false }}
          />
          <div className="flex flex-col text-sm md:text-base mt-8">
            <span className="font-bold text-2xl text-gray-500">{`Manage Job Postings`}</span>
          </div>
          {loading ? (
            <div className="mt-8 flex justify-center">
              <CircularProgress size={"24px"} color="black" isIndeterminate />
            </div>
          ) : jobs?.length ? (
            <div className="flex flex-col space-y-2 mt-8">
              {jobs.map((job) => (
                <MarketplaceJobPostConfig key={job.id} job={job} />
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </>
  );
}

export default withBoard(JobPostings);
