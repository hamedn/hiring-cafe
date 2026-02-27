import { hideJobsOptions } from "@/utils/constants";
import { SavedJobsContext } from "contexts/savedJobsContext";
import { useContext, useEffect, useState } from "react";
import { useAuth } from "./useAuth";
import { saveJob } from "@/utils/dbHelpers";
import { useRouter } from "next/router";
import { usePostHog } from "posthog-js/react";
import useFetchPreferences from "./useFetchPreferences";
import { Timestamp } from "firebase/firestore";
import { useToast } from "@chakra-ui/react";
import axios from "axios";

export default function useBrowseJobStatusV4({ job }) {
  const router = useRouter();
  const { user, getIDToken, loading: loadingUser } = useAuth();
  const {
    jobs: savedJobsLocalContext,
    addJob: addJobToLocalContext,
    removeJob: removeJobFromLocalContext,
    viewedJobs,
    addViewedJob,
  } = useContext(SavedJobsContext);
  const [isSaved, setIsSaved] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const [isApplied, setIsApplied] = useState(false);
  const [isViewed, setIsViewed] = useState(false);
  const [isCompanyHidden, setIsCompanyHidden] = useState(false);
  const posthog = usePostHog();
  const {
    userPreferences,
    setUserPreferences,
    loading: loadingPrefs,
  } = useFetchPreferences();
  const toast = useToast();

  useEffect(() => {
    if (!job) return;

    const localContextJob =
      savedJobsLocalContext?.find(
        (j) => j.objectID === (job?.objectID || job?.id)
      ) || null;

    const isLocallyUnhidden = localContextJob?.type === "Unhidden";
    const isSaved =
      localContextJob?.type === hideJobsOptions[1] ||
      (user && (job.job_information?.savedFromUsers || []).includes(user.uid));
    const isHidden =
      !isLocallyUnhidden &&
      (localContextJob?.type === hideJobsOptions[0] ||
        (user &&
          (job.job_information?.hiddenFromUsers || []).includes(user.uid)));
    const isApplied =
      localContextJob?.type === hideJobsOptions[2] ||
      (user &&
        (job.job_information?.appliedFromUsers || []).includes(user.uid));
    const isViewed =
      viewedJobs.some((j) => j.objectID === job.objectID) ||
      (user && (job.job_information?.viewedByUsers || []).includes(user.uid));

    const isCompanyHidden = userPreferences?.hiddenCompaniesV4?.find(
      (company) =>
        company.token === job.additional_algolia_filters?.ats_board_token
    );

    setIsSaved(isSaved);
    setIsHidden(isHidden);
    setIsApplied(isApplied);
    setIsViewed(isViewed);
    setIsCompanyHidden(!!isCompanyHidden);
  }, [job, savedJobsLocalContext, user, userPreferences, viewedJobs]);

  const markJob = async (type, showToast = true) => {
    if (!job) return;

    if (user) {
      saveJob(type.toLowerCase(), true, job, user, router, await getIDToken());
    }
    addJobToLocalContext({
      objectID: job.objectID,
      type: type,
    });
    posthog.capture("job_marked", {
      job_id: job.objectID,
      type: type,
      board: job.board_token,
      source: job.source,
    });
    if (showToast) {
      if (type === "Hidden" && user) {
        toast({
          duration: 5000,
          isClosable: true,
          render: ({ onClose }) => (
            <div className="flex items-center justify-between bg-gray-800 text-white px-4 py-3 rounded-lg shadow-lg">
              <span className="text-sm font-medium">Job hidden</span>
              <button
                onClick={() => {
                  unhideJob();
                  onClose();
                }}
                className="ml-4 text-sm font-bold text-pink-300 hover:text-pink-200 transition-colors"
              >
                Undo
              </button>
            </div>
          ),
        });
      } else {
        toast({
          title: (!user ? "[DEMO] " : "") + "Job marked successfully",
          description: user
            ? ""
            : `This is just a demo. Please sign in to actually mark jobs.`,
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      }
    }
  };

  function hideCompany(showToast = true) {
    throw new Error("Function not implemented.");
    if (!job?.additional_algolia_filters?.ats_board_token) return;

    if (!user) {
      toast({
        title: "Error",
        description: "Please sign in to hide a company.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    const companyToHide = {
      company_profile: job.gpt_data?.company_profile || {},
      token: job.additional_algolia_filters.ats_board_token,
      timestamp: Timestamp.now(),
    };

    const existingHiddenCompaniesV4 = userPreferences?.hiddenCompaniesV4 || [];

    if (existingHiddenCompaniesV4.length <= 200) {
      const companyIndex = existingHiddenCompaniesV4.findIndex(
        (company) => company.token === companyToHide.token
      );
      if (companyIndex !== -1) {
        existingHiddenCompaniesV4[companyIndex].company_profile =
          companyToHide.company_profile;
      } else {
        existingHiddenCompaniesV4.unshift(companyToHide);
      }
      setUserPreferences({ hiddenCompaniesV4: existingHiddenCompaniesV4 });
      if (showToast) {
        toast({
          title: "Success",
          description: "Company has been hidden.",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
      }
    } else if (showToast) {
      toast({
        title: "Error",
        description:
          "You've hidden the maximum number of companies. Please unhide some companies to hide more.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  }

  const unhideJob = async () => {
    if (!job) return;

    addJobToLocalContext({
      objectID: job.objectID,
      type: "Unhidden",
    });
    posthog.capture("job_unmarked", {
      job_id: job.objectID,
      type: "Hidden",
      board: job.board_token,
      source: job.source,
    });

    if (user) {
      try {
        await axios.post("/api/removeJobFromList", {
          job_id: job.objectID,
          user_token: await getIDToken(),
          stage: "hidden",
          should_delete: true,
        });
      } catch (error) {
        console.error("Failed to unhide job:", error);
      }
    }
  };

  const reportAndHideJob = async (reason) => {
    if (!job) return;
    let success = false;

    if (user) {
      markJob("Hidden");
      try {
        await axios.post(`/api/marketplaceFunctions/reportJob`, {
          job_id: job.objectID,
          reason: reason,
        });
        success = true;
      } catch (error) {
        console.trace(error);
        toast({
          title: "Error",
          description: "Could not report job. Please try again later.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    } else {
      toast({
        title: "Error",
        description: "Please sign in to report a job.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }

    return success;
  };

  const markJobAsViewed = async () => {
    if (user && job) {
      addViewedJob(job.objectID);
      if (!job.job_information?.viewedByUsers?.includes(user.uid)) {
        try {
          await axios.post("/api/markJobViewed", {
            job_id: job.objectID,
            user_token: await getIDToken(),
          });
        } catch {}
      }
    }
  };

  return {
    isViewed,
    isSaved,
    isHidden,
    isApplied,
    isCompanyHidden,
    markJob,
    unhideJob,
    hideCompany,
    reportAndHideJob,
    markJobAsViewed,
    loading: loadingUser || loadingPrefs,
  };
}
