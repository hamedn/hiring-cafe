import Megaphone from "@/animations/Megaphone";
import { companyURLLink, jobApplicationLinkInfo } from "@/utils/helpers";
import { useEffect, useState } from "react";
import {
  ArrowUpOnSquareIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CheckIcon,
  ClockIcon,
  GlobeAltIcon,
  MapPinIcon,
  BuildingOfficeIcon,
  XMarkIcon,
  ArrowUpRightIcon,
  QuestionMarkCircleIcon,
  ArrowTopRightOnSquareIcon,
} from "@heroicons/react/24/outline";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Tooltip,
  useBreakpointValue,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  useToast,
} from "@chakra-ui/react";
import useSeekerProfile from "@/hooks/useSeekerProfile";
import { QUICK_SUMMARY_CARD_VIEW_FORMAT } from "@/utils/constants";
import FullJobDescription from "../FullJobDescription";
import JobDescriptionActionItems from "../JobDescriptionActionItems";
import ShareJob from "../ShareJob";
import PaginationDots from "../PaginationDots";
import StackOfCards from "../StackOfCards";
import useBrowseJobsSelectedCompany from "@/hooks/useBrowseJobsSelectedCompany";
import useBrowseJobStatusV4 from "@/hooks/useBrowseJobStatusV4";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/router";
import JobDescriptionApplyButton from "../JobDescriptionApplyButton";
import EmailApplyModal from "../EmailApplyModal";
import AuthenticationModal from "../AuthenticationModal";
import useJobLabelMapping from "@/hooks/useJobLabelMapping";
import useJobLabelMappingV7 from "@/hooks/useJobLabelMappingV7";
import LottieAnimation from "@/components/lottieAnimation";
import UserJobEngagementStats from "./UserJobEngagementStats";
import AISearchScoreDebug from "./AISearchScoreDebug";
import { usePostHog } from "posthog-js/react";
import onJobApply, {
  APPLICATION_CLICK_FRONT_END_SOURCE,
} from "@/utils/onJobApply";
import {
  DocumentTextIcon,
  WrenchScrewdriverIcon,
} from "@heroicons/react/20/solid";
import { Picture } from "@/utils/picture";

const QuickJobSummaryCard = ({
  jobs,
  viewFormat = QUICK_SUMMARY_CARD_VIEW_FORMAT.SEARCH_RESULTS,
  onDelete = () => {},
  onUpdateStage = () => {},
  useV7Mapping = false,
  isFromAISearch = false,
}) => {
  const posthog = usePostHog();
  const router = useRouter();
  const [fade, setFade] = useState(false);
  const { user } = useAuth();
  const { setLastActive } = useSeekerProfile();
  const [isHovering, setIsHovering] = useState(false);
  const isSmallScreen = useBreakpointValue({ base: true, md: false });
  const modalSize = useBreakpointValue({ base: "full", md: "lg" });
  const [currentIndex, setCurrentIndex] = useState(0);
  const {
    isOpen: isFullJDOpen,
    onOpen: onFullJDOpen,
    onClose: onFullJDClose,
  } = useDisclosure();
  const {
    isOpen: isShareModalOpen,
    onOpen: onShareModalOpen,
    onClose: onShareModalClose,
  } = useDisclosure();
  const {
    isOpen: isPromotedJobInfoModalOpen,
    onOpen: onPromotedJobInfoModalOpen,
    onClose: onPromotedJobInfoModalClose,
  } = useDisclosure();
  const {
    isOpen: isEmailApplyModalOpen,
    onOpen: onEmailApplyModalOpen,
    onClose: onEmailApplyModalClose,
  } = useDisclosure();
  const {
    isOpen: isReportJobModalOpen,
    onOpen: onReportJobModalOpen,
    onClose: onReportJobModalClose,
  } = useDisclosure();
  const toast = useToast();
  const drawerSize = useBreakpointValue({ md: "md", lg: "lg", "2xl": "xl" });
  const placement = useBreakpointValue({ base: "bottom", md: "right" });
  const { company } = useBrowseJobsSelectedCompany();
  const job = jobs?.[currentIndex] || null;
  const applyInfo = jobApplicationLinkInfo(job, user);

  // Call both hooks unconditionally (React rules of hooks)
  const labelMappingV7 = useJobLabelMappingV7({ job, viewFormat });
  const labelMappingV5 = useJobLabelMapping({ job, viewFormat });

  // Use v7 mapping for AI search, v5 for regular search
  const labelMapping = useV7Mapping ? labelMappingV7 : labelMappingV5;

  const {
    location,
    postingTimeAgo,
    jobMarkingTimeAgo,
    workplaceType,
    commitment,
    compensation,
    shouldShowUndisclosedSalaryLabel,
    requirementsSummary,
    minRoleYOE,
    shouldDisplayNoMinRoleYOELabel,
    minManagementYOE,
    shouldDisplayNoMinManagementYOELabel,
    techStack,
    companyTagline,
    companyImageURL,
    companyName,
    website,
    isPromoted,
  } = labelMapping;
  const {
    isSaved,
    isHidden,
    isApplied,
    isViewed,
    markJob,
    unhideJob,
    markJobAsViewed,
    loading: isLoadingJobStatus,
  } = useBrowseJobStatusV4({
    job,
  });

  useEffect(() => {
    setCurrentIndex((prev) =>
      prev >= jobs.length ? (prev + 1) % jobs.length : prev || 0
    );
  }, [jobs]);

  const markViewedJob =
    viewFormat === QUICK_SUMMARY_CARD_VIEW_FORMAT.SEARCH_RESULTS &&
    user &&
    !isLoadingJobStatus &&
    (isViewed || isSaved || isHidden || isApplied);

  if (!jobs.length)
    return (
      <div
        className={`h-96 w-full bg-gray-200 flex justify-center flex-col items-center rounded-lg`}
      >
        <CheckIcon className="h-8 w-8 text-gray-400" />
        {companyName ? (
          <span className="text-xs mt-2 font-light">{companyName}</span>
        ) : null}
        <span className="text-xs mt-4 font-light text-gray-500">{`You won't see this job again.`}</span>
      </div>
    );

  if (!job) {
    return <div className="bg-gray-200 animate-pulse h-96" />;
  }

  const topRightBannerMsg =
    isHidden || isApplied || isSaved ? (
      <div
        className={`flex items-center space-x-2 absolute font-bold top-2 right-2 text-white`}
      >
        <span className="text-sm flex items-center space-x-1">
          <span>
            {isHidden
              ? "Hidden"
              : isApplied
                ? "Applied"
                : isSaved
                  ? "Saved"
                  : null}
          </span>
          <CheckIcon className="h-4 w-4 flex-none" />
        </span>
        {isHidden && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              unhideJob();
            }}
            className="text-xs font-medium bg-white/20 hover:bg-white/40 backdrop-blur-sm rounded px-2 py-0.5 transition-colors"
          >
            Undo
          </button>
        )}
      </div>
    ) : null;

  const handlePrev = (e) => {
    e.stopPropagation();
    setFade(true);
    setTimeout(() => {
      setFade(false);
      setCurrentIndex((prev) => (prev - 1 + jobs.length) % jobs.length);
    }, 300);
  };

  const handleNext = (e) => {
    e.stopPropagation();
    setFade(true);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % jobs.length);
      setFade(false);
    }, 300);
  };

  return (
    <>
      <StackOfCards numBackgroundCards={jobs.length - 1}>
        <div
          className={`${
            viewFormat === QUICK_SUMMARY_CARD_VIEW_FORMAT.SEARCH_RESULTS &&
            !company
              ? "md:h-[340px]"
              : ""
          } relative flex flex-col items-start w-full ${
            jobs.length > 1 ||
            viewFormat === QUICK_SUMMARY_CARD_VIEW_FORMAT.SEARCH_RESULTS
              ? "rounded-x-lg rounded-t-lg"
              : "rounded-lg"
          } py-1.5 px-3 overflow-hidden ${
            isSmallScreen && "cursor-pointer"
          } transition-opacity duration-300 ${
            fade ? "opacity-0" : "opacity-100"
          } ${markViewedJob ? "text-gray-400" : ""}`}
          onMouseEnter={() => {
            setIsHovering(true);
          }}
          onMouseLeave={() => {
            // Don't hide hover state if report modal is open
            if (!isReportJobModalOpen) {
              setIsHovering(false);
            }
          }}
          onClick={async () => {
            if (isSmallScreen) {
              onFullJDOpen();
              setLastActive();
              await markJobAsViewed();
            }
          }}
        >
          {isHovering && !isSmallScreen ? (
            <div
              className="absolute inset-y-0 left-0 w-full cursor-zoom-in"
              onClick={async () => {
                onFullJDOpen();
                setLastActive();
                await markJobAsViewed();
              }}
            >
              <div className="absolute inset-y-0 left-0 bg-black w-full opacity-50" />
              {viewFormat === QUICK_SUMMARY_CARD_VIEW_FORMAT.SEARCH_RESULTS &&
                topRightBannerMsg}
              <div className="absolute top-0 z-10 m-2 flex flex-col items-start space-y-2">
                <Tooltip label="Share Job" aria-label="Share Job">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onShareModalOpen();
                    }}
                    className=" bg-white p-3 rounded-full flex-none text-black"
                  >
                    <ArrowUpOnSquareIcon className="h-5 w-5 flex-none" />
                  </button>
                </Tooltip>
                {website ? (
                  <Tooltip label="Company Website" aria-label="Company Website">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        window.open(`//${website}`, "_blank");
                      }}
                      className="bg-white p-3 rounded-full flex-none text-black"
                    >
                      <GlobeAltIcon className="h-5 w-5 flex-none" />
                    </button>
                  </Tooltip>
                ) : null}
              </div>
              {viewFormat === QUICK_SUMMARY_CARD_VIEW_FORMAT.SEARCH_RESULTS && (
                <div className="absolute top-0 right-0 z-10 m-2 flex flex-col items-start text-xs font-bold">
                  <div className="flex items-center space-x-2">
                    {isApplied || isHidden || isSaved ? null : user ? (
                      <button
                        className="px-4 py-3 bg-pink-600 hover:bg-pink-800 text-white rounded-full flex-none text-base"
                        onClick={async (e) => {
                          e.stopPropagation();
                          markJob("Saved");
                        }}
                      >
                        Save
                      </button>
                    ) : (
                      <AuthenticationModal>
                        <div className="px-4 py-3 bg-pink-600 hover:bg-pink-800 text-white rounded-full flex-none text-base">
                          Save
                        </div>
                      </AuthenticationModal>
                    )}
                    {isHidden || isSaved || isApplied ? null : user ? (
                      <button
                        className="p-2 bg-white hover:bg-gray-100 rounded flex-none text-black"
                        onClick={async (e) => {
                          e.stopPropagation();
                          markJob("Applied");
                        }}
                      >
                        Mark Applied
                      </button>
                    ) : (
                      <AuthenticationModal>
                        <div className="p-2 bg-white hover:bg-gray-100 rounded flex-none text-black">
                          Mark Applied
                        </div>
                      </AuthenticationModal>
                    )}
                  </div>
                </div>
              )}
              <div className={`absolute bottom-0 w-full p-2 h-full`}>
                <div className="flex justify-between items-end text-sm w-full space-x-2 h-full">
                  <button
                    onClick={async (e) => {
                      e.stopPropagation();

                      onJobApply({
                        job,
                        posthog,
                        markJobAsViewed,
                        setLastActive,
                        frontend_source: isFromAISearch
                          ? APPLICATION_CLICK_FRONT_END_SOURCE.AI_SEARCH_QUICK_SUMMARY_CARDS
                          : viewFormat ===
                              QUICK_SUMMARY_CARD_VIEW_FORMAT.SEARCH_RESULTS
                            ? APPLICATION_CLICK_FRONT_END_SOURCE.SEARCH_QUICK_SUMMARY_CARDS
                            : APPLICATION_CLICK_FRONT_END_SOURCE.SAVED_JOBS_QUICK_SUMMARY_CARDS,
                        toast,
                        markJob,
                        isLoggedIn: !!user,
                      });

                      if (applyInfo.type === "email") {
                        onEmailApplyModalOpen();
                      } else {
                        window.open(applyInfo.url, "_blank");
                      }
                    }}
                    className="bg-white py-2 px-4 text-xs rounded-full font-medium z-10 text-black"
                  >
                    Apply Directly
                  </button>
                  <JobDescriptionActionItems
                    style="hovering"
                    job={job}
                    viewFormat={viewFormat}
                    onDelete={onDelete}
                    onUpdateStage={onUpdateStage}
                    reportModalState={{
                      isOpen: isReportJobModalOpen,
                      onOpen: onReportJobModalOpen,
                      onClose: onReportJobModalClose,
                    }}
                  />
                </div>
              </div>
            </div>
          ) : null}
          {isSmallScreen && (
            <div
              className="flex items-center justify-between absolute space-x-1 top-3 px-3 inset-x-0 md:hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {isPromoted &&
              viewFormat === QUICK_SUMMARY_CARD_VIEW_FORMAT.SEARCH_RESULTS ? (
                <span className="text-xs text-purple-500 font-medium ring-1 ring-purple-500 rounded px-3">
                  Ad
                </span>
              ) : (
                <div className="font-medium text-xs flex items-center space-x-0.5 text-gray-400">
                  {viewFormat === QUICK_SUMMARY_CARD_VIEW_FORMAT.SAVED_LIST ? (
                    <span>Marked </span>
                  ) : (
                    <ClockIcon className="h-3 w-3 flex-none" />
                  )}
                  <span>
                    {viewFormat === QUICK_SUMMARY_CARD_VIEW_FORMAT.SAVED_LIST
                      ? jobMarkingTimeAgo
                      : postingTimeAgo}{" "}
                    {viewFormat === QUICK_SUMMARY_CARD_VIEW_FORMAT.SAVED_LIST &&
                      " ago"}
                  </span>
                </div>
              )}
              {viewFormat === QUICK_SUMMARY_CARD_VIEW_FORMAT.SEARCH_RESULTS && (
                <div className="flex items-center space-x-2 flex-none">
                  {isHidden || isApplied || isSaved ? (
                    <div className="flex md:hidden items-center space-x-2 text-gray-600 font-medium">
                      <span className="text-xs flex items-center space-x-1">
                        <span>
                          {isHidden
                            ? "Hidden"
                            : isApplied
                              ? "Applied"
                              : isSaved
                                ? "Saved"
                                : "HUH??"}
                        </span>
                        <CheckIcon className="h-3 w-3 flex-none" />
                      </span>
                      {isHidden && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            unhideJob();
                          }}
                          className="text-xs font-medium bg-gray-200 hover:bg-gray-300 rounded px-2 py-0.5 transition-colors"
                        >
                          Undo
                        </button>
                      )}
                    </div>
                  ) : (
                    <div className="flex items-center flex-none space-x-2">
                      {user ? (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            markJob("Saved");
                          }}
                          className="font-bold text-xs px-3 py-2 bg-pink-500 text-white rounded-full"
                        >
                          Save
                        </button>
                      ) : (
                        <AuthenticationModal>
                          <div className="font-bold text-xs px-3 py-2 bg-pink-500 text-white rounded-full">
                            Save
                          </div>
                        </AuthenticationModal>
                      )}
                      {user ? (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            markJob("Applied");
                          }}
                          className="font-medium text-xs p-1.5 bg-gray-100 rounded text-black"
                        >
                          Mark Applied
                        </button>
                      ) : (
                        <AuthenticationModal>
                          <div className="font-medium text-xs p-1.5 bg-gray-100 rounded text-black">
                            Mark Applied
                          </div>
                        </AuthenticationModal>
                      )}
                      {user ? (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            markJob("Hidden");
                          }}
                          className="font-medium text-xs p-1.5 bg-gray-100 rounded text-black"
                        >
                          Hide
                        </button>
                      ) : (
                        <AuthenticationModal>
                          <div className="font-medium text-xs p-1.5 bg-gray-100 rounded text-black">
                            Hide
                          </div>
                        </AuthenticationModal>
                      )}
                    </div>
                  )}
                  <button
                    className="font-medium text-xs p-2 bg-gray-200 text-black rounded-full flex-none"
                    onClick={(e) => {
                      e.stopPropagation();
                      onShareModalOpen();
                    }}
                  >
                    <ArrowUpOnSquareIcon className="h-4 w-4 flex-none" />
                  </button>
                </div>
              )}
            </div>
          )}
          <div className="flex flex-col w-full">
            {!isHovering && (
              <div
                className={`absolute ${
                  viewFormat === QUICK_SUMMARY_CARD_VIEW_FORMAT.SAVED_LIST
                    ? "top-0"
                    : "top-2"
                } right-2 text-xs hidden md:flex items-center space-x-0.5 text-gray-400 font-medium`}
              >
                {isPromoted ? null : viewFormat ===
                  QUICK_SUMMARY_CARD_VIEW_FORMAT.SAVED_LIST ? (
                  <span>Marked </span>
                ) : (
                  <ClockIcon className="h-3 w-3 flex-none" />
                )}
                {isPromoted &&
                viewFormat === QUICK_SUMMARY_CARD_VIEW_FORMAT.SEARCH_RESULTS ? (
                  <span className="text-purple-500 border border-purple-500 px-3 font-medium rounded">
                    Ad
                  </span>
                ) : (
                  <span>
                    {viewFormat === QUICK_SUMMARY_CARD_VIEW_FORMAT.SAVED_LIST
                      ? jobMarkingTimeAgo
                      : postingTimeAgo}
                    {viewFormat === QUICK_SUMMARY_CARD_VIEW_FORMAT.SAVED_LIST &&
                      " ago"}
                  </span>
                )}
              </div>
            )}
            <div
              className={`mt-1 ${
                isSmallScreen
                  ? viewFormat === QUICK_SUMMARY_CARD_VIEW_FORMAT.SEARCH_RESULTS
                    ? "mt-14"
                    : "mt-8"
                  : viewFormat === QUICK_SUMMARY_CARD_VIEW_FORMAT.SEARCH_RESULTS
                    ? "mr-10"
                    : "mt-4"
              }`}
            >
              <span
                className={`w-full font-bold text-start ${
                  techStack ? "line-clamp-2" : "line-clamp-3"
                }`}
              >
                {job.job_title || job.job_information?.title || ""}
              </span>
            </div>
            <div
              className={`mt-1 flex items-center space-x-1 rounded text-xs px-1 font-medium border bg-gray-50 w-fit ${
                markViewedJob ? "" : "text-gray-700"
              }`}
            >
              <MapPinIcon className="h-3 w-3 flex-none" />
              <span className="line-clamp-2">{location}</span>
            </div>
            <div className="flex flex-wrap gap-1.5 mt-2 w-full">
              {compensation && (
                <span
                  className={`border rounded text-xs px-1 flex-none border-green-600 ${
                    markViewedJob ? "text-green-800/50" : "text-green-800"
                  }`}
                >
                  {compensation}
                </span>
              )}{" "}
              {shouldShowUndisclosedSalaryLabel && (
                <span
                  className={`border rounded text-xs px-1 flex-none border-red-800/10 ${
                    markViewedJob ? "text-red-800/40" : "text-red-800/50"
                  }`}
                >
                  Undisclosed Salary
                </span>
              )}
              <span
                className={`border rounded text-xs px-1 flex-none ${
                  !markViewedJob
                    ? workplaceType === "Remote"
                      ? "border-cyan-700 text-cyan-700"
                      : "text-black border-gray-400"
                    : "text-black/50 border-gray-400/50"
                }`}
              >
                {workplaceType}
              </span>
              <span
                className={`border rounded text-xs px-1 flex-none ${
                  !markViewedJob
                    ? "text-black border-gray-400"
                    : "text-black/50 border-gray-400/50"
                }`}
              >
                {commitment}
              </span>
            </div>
          </div>
          <div className="flex flex-col mt-4 mb-2 space-y-2.5 text-sm w-full">
            {(!company || isPromoted) && (
              <div
                className={`flex mb-4 mt-2 md:my-0 w-full ${
                  companyImageURL
                    ? "items-center space-x-4 md:space-x-3 lg:space-x-2"
                    : "space-x-1"
                }`}
              >
                {companyImageURL ? (
                  <div className="flex flex-none h-14 w-14 rounded border border-gray-500 ring-2 ring-gray-300 overflow-hidden bg-white">
                    <Picture
                      src={companyImageURL}
                      alt={companyName}
                      properties="h-full w-full object-contain"
                    />
                  </div>
                ) : (
                  <BuildingOfficeIcon className="h-4 w-4 flex-none" />
                )}
                <span className={`line-clamp-3 font-light`}>
                  <span className="font-bold">{companyName}</span>
                  {job.enriched_company_data?.stock_symbol && (
                    <span className="inline-flex items-center ml-1 px-1 rounded text-[10px] font-medium text-gray-400 border border-gray-200 align-middle leading-tight">
                      {job.enriched_company_data.stock_exchange ? `${job.enriched_company_data.stock_exchange}: ` : ""}{job.enriched_company_data.stock_symbol}
                    </span>
                  )}
                  {": "}
                  {companyTagline.length > 350
                    ? companyTagline.slice(0, 350) + "..."
                    : companyTagline}
                </span>
              </div>
            )}
            <div className={`flex space-x-1 w-full`}>
              <DocumentTextIcon className="h-4 w-4 flex-none text-gray-600" />
              <span
                className={`${
                  techStack ? "line-clamp-5" : "line-clamp-6"
                } font-light`}
              >
                <span
                  className={`font-bold ${
                    markViewedJob ? "" : "text-gray-500"
                  }`}
                >
                  {minRoleYOE || shouldDisplayNoMinRoleYOELabel ? (
                    <span
                      className={`bg-sky-50/30 border border-violet-600/30 rounded text-xs px-1 mr-1 w-fit font-medium ${
                        markViewedJob ? "text-violet-900/50" : "text-violet-900"
                      }`}
                    >
                      {minRoleYOE || (
                        <span className="text-red-600/60">? YOE</span>
                      )}
                    </span>
                  ) : null}
                  {job.v5_processed_job_data?.role_type === "People Manager" &&
                  (minManagementYOE || shouldDisplayNoMinManagementYOELabel) ? (
                    <span
                      className={`bg-sky-50/30 border border-violet-600/30 rounded text-xs px-1 mr-1 w-fit font-medium ${
                        markViewedJob ? "text-violet-900/50" : "text-violet-900"
                      }`}
                    >
                      {minManagementYOE || (
                        <span className="text-red-600/60">? Mgmt YOE</span>
                      )}
                    </span>
                  ) : null}
                </span>
                {requirementsSummary.length > 350
                  ? requirementsSummary.slice(0, 350) + "..."
                  : requirementsSummary}
              </span>
            </div>
            {techStack && (
              <div className="flex flex-col space-y-1">
                <div className="flex space-x-1">
                  <WrenchScrewdriverIcon className="h-4 w-4 flex-none text-gray-600" />
                  <span
                    className={`${useV7Mapping ? "line-clamp-4" : "line-clamp-2"} font-light`}
                  >
                    {techStack}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
        {job.job_information &&
          viewFormat === QUICK_SUMMARY_CARD_VIEW_FORMAT.SEARCH_RESULTS && (
            <div
              className={`flex flex-col items-center divide-y w-full py-2 border-t rounded-b-lg ${
                isSmallScreen ? "mb-1" : ""
              } ${
                isHovering && !isSmallScreen
                  ? "bg-black opacity-50"
                  : "bg-white"
              }`}
            >
              {!isPromoted && (
                <div className="flex justify-between items-center space-x-2 pb-2 px-2 w-full">
                  <Link
                    className={`flex items-center hover:underline space-x-1 text-xs font-medium hover:scale-105 transition-all duration-100 ${
                      isHovering
                        ? "text-gray-300"
                        : "text-gray-500 hover:text-gray-600"
                    }`}
                    href={
                      job.requisition_id
                        ? `/viewjob/${encodeURIComponent(job.requisition_id)}`
                        : `/job/${btoa(unescape(encodeURIComponent(job.objectID)))}`
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <span>Job Posting</span>
                    <ArrowTopRightOnSquareIcon className="h-2.5 w-2.5 flex-none" />
                  </Link>
                  {jobs.length > 1 && (
                    <div className="flex items-center space-x-2">
                      <button
                        disabled={currentIndex <= 0}
                        onClick={handlePrev}
                        className="bg-gray-200 md:bg-white/0 border md:border-none border-gray-300 p-2.5 md:p-0 text-black md:text-gray-400 rounded-full md:rounded-none opacity-80 md:opacity-100"
                      >
                        <ChevronLeftIcon className="h-3 w-3 md:h-4 md:w-4 flex-none" />
                      </button>
                      <PaginationDots
                        count={jobs.length}
                        current={currentIndex}
                        hovering={isHovering && !isSmallScreen}
                        onDotClick={(index) => {
                          setFade(true);
                          setTimeout(() => {
                            setFade(false);
                            setCurrentIndex(index);
                          }, 300);
                        }}
                      />
                      <button
                        disabled={currentIndex >= jobs.length - 1}
                        onClick={handleNext}
                        className="bg-gray-200 md:bg-white/0 border md:border-none border-gray-300 p-2.5 md:p-0 text-black md:text-gray-400 rounded-full md:rounded-none opacity-80 md:opacity-100"
                      >
                        <ChevronRightIcon className="h-3 w-3 md:h-4 md:w-4 flex-none" />
                      </button>
                    </div>
                  )}
                  {!isPromoted && !company && (
                    <Link
                      target="_blank"
                      rel="noopener noreferrer"
                      href={{
                        pathname: "/",
                        query: companyURLLink(
                          job,
                          router.query?.searchState || null
                        ),
                      }}
                      className={`text-xs hover:underline font-medium hover:scale-105 transition-all duration-100 ${
                        isHovering
                          ? "text-gray-300"
                          : "text-gray-500 hover:text-gray-600"
                      }`}
                    >
                      View all
                    </Link>
                  )}
                </div>
              )}
              <div className="w-full pt-2 px-2 flex justify-center">
                <UserJobEngagementStats job={job} viewFormat={viewFormat} />
              </div>
              {/* AI Search Score Debug Display (only for debug users) */}
              <AISearchScoreDebug job={job} user={user} />
            </div>
          )}
        {isPromoted &&
          viewFormat === QUICK_SUMMARY_CARD_VIEW_FORMAT.SEARCH_RESULTS && (
            <div className="flex justify-center bg-violet-50 rounded-b-lg w-full text-xs text-violet-600">
              <button
                onClick={() => {
                  onPromotedJobInfoModalOpen();
                }}
              >
                <div className="flex items-center space-x-0.5 py-2 font-medium">
                  <span>Promoted</span>
                  <QuestionMarkCircleIcon className="h-3 w-3 flex-none" />
                </div>
              </button>
            </div>
          )}
      </StackOfCards>
      <Drawer
        onClose={onFullJDClose}
        isOpen={isFullJDOpen}
        placement={placement}
        size={drawerSize}
      >
        <DrawerOverlay />
        <DrawerContent className="h-[90%] md:h-full rounded-t-3xl md:rounded-t-none">
          <DrawerHeader
            px={2}
            className="flex justify-between space-x-4 md:mx-4"
          >
            <div className="flex items-center space-x-4">
              <button
                onClick={() => {
                  onShareModalOpen();
                }}
                className="rounded-lg p-2 text-black hover:bg-gray-200 flex-none outline-none"
              >
                <ArrowUpOnSquareIcon className="h-5 w-5 flex-none" />
              </button>
              <JobDescriptionApplyButton
                job={job}
                frontend_source={
                  isFromAISearch
                    ? APPLICATION_CLICK_FRONT_END_SOURCE.FULL_JOB_DESCRIPTION_FROM_AI_SEARCH
                    : viewFormat ===
                        QUICK_SUMMARY_CARD_VIEW_FORMAT.SEARCH_RESULTS
                      ? APPLICATION_CLICK_FRONT_END_SOURCE.FULL_JOB_DESCRIPTION_FROM_SEARCH
                      : APPLICATION_CLICK_FRONT_END_SOURCE.FULL_JOB_DESCRIPTION_FROM_SAVED_JOBS
                }
              />
              <Link
                className="text-xs flex items-center space-x-2 p-1.5 hover:bg-gray-200 hover:rounded"
                href={
                  job.requisition_id
                    ? `/viewjob/${encodeURIComponent(job.requisition_id)}`
                    : `/job/${btoa(unescape(encodeURIComponent(job.objectID)))}`
                }
                target="_blank"
                rel="noopener noreferrer"
              >
                <span>Full View</span>
                <ArrowUpRightIcon className="h-2.5 w-2.5 flex-none" />
              </Link>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={onFullJDClose}
                className="rounded-lg p-2 text-black hover:bg-gray-200 flex-none outline-none"
              >
                <XMarkIcon className="h-5 w-5 flex-none" />
              </button>
            </div>
          </DrawerHeader>
          <DrawerBody m={0} p={0} mt={0}>
            <div className="w-full flex flex-col sticky top-0">
              {router.pathname !== "/ai-search" && (
                <div className="w-full flex justify-center items-center text-center border-b">
                  <Link
                    href="/ai-search"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded bg-purple-50 text-purple-600 px-3 py-1 md:py-2 font-semibold text-sm w-full"
                  >
                    AI Job Search (Beta)
                  </Link>
                </div>
              )}
              <div className="w-full flex justify-center items-center text-center border-b">
                <Link
                  href="/talent-network"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded bg-blue-50 text-blue-600 px-3 py-1 md:py-2 font-semibold text-sm w-full"
                >
                  Contact Recruiter 
                </Link>
              </div>
            </div>
            <FullJobDescription
              job={job}
              viewFormat={viewFormat}
              onDelete={onDelete}
              onUpdateStage={onUpdateStage}
              onFullJDClose={onFullJDClose}
              isFromAISearch={isFromAISearch}
            />
          </DrawerBody>
        </DrawerContent>
      </Drawer>
      <Modal isOpen={isShareModalOpen} onClose={onShareModalClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton />
          <ModalBody>
            <div className="p-4 mt-8">
              <ShareJob job={job} />
            </div>
          </ModalBody>
        </ModalContent>
      </Modal>
      <Modal
        isOpen={isPromotedJobInfoModalOpen}
        onClose={onPromotedJobInfoModalClose}
        size={modalSize}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton />
          <ModalBody>
            <div className="flex flex-col items-center space-y-4 pb-16 p-8">
              <LottieAnimation
                width="200px"
                height="200px"
                animationData={Megaphone}
                customOptions={{ loop: true }}
              />
              <span className="text-xl font-bold">Promoted Jobs</span>
              <div className="flex flex-col space-y-4">
                <span className="">
                  To cover the costs of running HiringCafe, we are currently
                  testing promoted jobs. All promoted jobs are clearly marked,
                  and will never affect the organic search results.
                </span>
                <span>{`Don't worry, we aren't selling out ❤️`}</span>
              </div>
            </div>
          </ModalBody>
        </ModalContent>
      </Modal>
      {applyInfo.type === "email" && (
        <EmailApplyModal
          email={applyInfo.email}
          isOpen={isEmailApplyModalOpen}
          onClose={onEmailApplyModalClose}
        />
      )}
    </>
  );
};

export default QuickJobSummaryCard;
