import React, { useEffect, useState } from "react";
import Link from "next/link";
import { codeToCountry, codeToEmoji } from "@/utils/countryCodes";
import { readableDateJobs } from "@/utils/helpers";
import {
  PencilSquareIcon,
  BarsArrowDownIcon,
  BarsArrowUpIcon,
} from "@heroicons/react/24/outline";
import axios from "axios";
import { useToast } from "@chakra-ui/react";
import { Picture } from "@/utils/picture";

export default function JobSummaryCard({ job }) {
  const toast = useToast();
  const [showControls, setShowControls] = useState(false);
  const [showActionItemStyle, setShowActionItemStyle] =
    useState("opacity-0 h-0 mt-0");
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

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

  const handleJobStatus = async (newStatus) => {
    setIsUpdatingStatus(true);
    try {
      await axios.patch("/api/admin/job", {
        job_id: job.id,
        patch_data: { status: newStatus },
      });
      toast({
        title: `Job post ${newStatus}`,
        description: `Your job post has been ${newStatus}.`,
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      console.trace(error);
      toast({
        title: "Error updating job post",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const getShortString = (input) => {
    if (input.length < 25) return input;
    else return `${input.slice(0, 22)}...`;
  };

  return (
    <div
      className="flex flex-col w-72 rounded-2xl"
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(false)}
    >
      <div className={`flex flex-col`}>
        <span className={`text-base mt-2 font-medium`}>
          {getShortString(job.job_info.title)}
        </span>
        <Link
          className="flex flex-col text-sm"
          href={`/admin/edit-job/${job.id}`}
          rel="noopener noreferrer"
        >
          {job.job_info.salary && (
            <span className="font-medium mt-1 text-gray-500">
              {job.job_info.salary}
            </span>
          )}
          <span className="text-gray-500 mt-1">
            {job.job_info.workplace_address
              ? job.job_info.workplace_address
              : null}
          </span>
        </Link>
      </div>
    </div>
  );
}
