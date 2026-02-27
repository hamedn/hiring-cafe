import { companyURLLink } from "@/utils/helpers";
import {
  ArrowTopRightOnSquareIcon,
  CheckIcon,
  GlobeAltIcon,
  MapPinIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Tooltip,
  useDisclosure,
} from "@chakra-ui/react";
import useBrowseJobStatusV4 from "@/hooks/useBrowseJobStatusV4";
import { useState, useRef, useEffect } from "react";
import { QUICK_SUMMARY_CARD_VIEW_FORMAT } from "@/utils/constants";
import SavedJobActions from "./SavedJobActions";
import { useRouter } from "next/router";
import useJobLabelMapping from "@/hooks/useJobLabelMapping";
import { useAuth } from "@/hooks/useAuth";
import { usePostHog } from "posthog-js/react";
import AuthenticationModal from "./AuthenticationModal";
import { prepareJobInfoForTracking } from "@/utils/jobTracking";
import { Picture } from "@/utils/picture";
import JobDescriptionApplyButton from "./JobDescriptionApplyButton";
import { APPLICATION_CLICK_FRONT_END_SOURCE } from "@/utils/onJobApply";

// ===============================
// MAIN COMPONENT
// ===============================
const BriefJDSummaryV3 = ({
  job,
  viewFormat,
  onJobMarked = null,
  onDelete = () => {},
  onUpdateStage = () => {},
  isFromAISearch = false,
}) => {
  const { user } = useAuth();
  const router = useRouter();
  const fullDescriptionRef = useRef(null);

  const {
    location,
    postingTimeAgo,
    jobMarkingTimeAgo,
    workplaceType,
    commitment,
    compensation,
    shouldShowUndisclosedSalaryLabel,
    requirementsSummary,
    techStack,
    companyName,
    companyTagline,
    website,
    responsibilities,
    isPromoted,
    companyImageURL,
    companyDescription,
    resolvedCompanyData,
  } = useJobLabelMapping({ job, viewFormat });

  const { isSaved, isHidden, isApplied, reportAndHideJob, markJob } =
    useBrowseJobStatusV4({ job });

  const {
    isOpen: isReportJobModalOpen,
    onOpen: onReportJobModalOpen,
    onClose: onReportJobModalClose,
  } = useDisclosure();

  const [reason, setReason] = useState("");
  const [activeTab, setActiveTab] = useState("JOB_INFO");

  const scrollToFullDescription = () => {
    fullDescriptionRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const posthog = usePostHog();

  useEffect(() => {
    if (posthog && job) {
      const frontend_source = isFromAISearch
        ? "ai_search_quick_summary_cards"
        : viewFormat === QUICK_SUMMARY_CARD_VIEW_FORMAT.SEARCH_RESULTS
          ? "search_quick_summary_cards"
          : "saved_jobs_quick_summary_cards";
      const jobInfo = prepareJobInfoForTracking(job, frontend_source);
      posthog.capture("job_view_v5", jobInfo);
    }
  }, [job, posthog, viewFormat, isFromAISearch]);

  return (
    <div className="flex flex-col items-start justify-start text-start w-full bg-white p-6">
      {/* TAB HEADERS */}
      <div className="flex border-b border-gray-200 mb-6 w-full">
        <button
          onClick={() => setActiveTab("JOB_INFO")}
          className={`whitespace-nowrap py-2 px-3 border-b-2 font-bold text-xs md:text-base transition-all ${
            activeTab === "JOB_INFO"
              ? "border-pink-600 text-pink-600"
              : "border-transparent black"
          }`}
        >
          Job Info
        </button>
        <button
          onClick={() => {
            setActiveTab("COMPANY_INFO");
            if (posthog && job) {
              const frontend_source = isFromAISearch
                ? "ai_search_quick_summary_cards"
                : viewFormat === QUICK_SUMMARY_CARD_VIEW_FORMAT.SEARCH_RESULTS
                  ? "search_quick_summary_cards"
                  : "saved_jobs_quick_summary_cards";
              const jobInfo = prepareJobInfoForTracking(job, frontend_source);
              posthog.capture("job_company_info_tab_v5", jobInfo);
            }
          }}
          className={`ml-4 whitespace-nowrap py-2 px-3 border-b-2 font-bold text-xs md:text-base transition-all ${
            activeTab === "COMPANY_INFO"
              ? "border-pink-600 text-pink-600"
              : "border-transparent text-black"
          }`}
        >
          Company Info
        </button>
        <button
          onClick={scrollToFullDescription}
          className="ml-4 text-xs md:text-base font-bold text-black flex-none flex items-center space-x-1"
        >
          <span>Job Description</span>
        </button>
      </div>

      <div className="flex flex-col space-y-6 text-gray-700 w-full">
        {/* COMPANY TAB */}
        {activeTab === "COMPANY_INFO" && (
          <>
            {/* Keep name + tagline at top */}
            <div className="flex items-start space-x-8 my-8">
              {companyImageURL && (
                <div className="w-20 h-20 rounded-lg flex-none overflow-hidden">
                  <Picture
                    src={companyImageURL}
                    properties={
                      "w-full h-full rounded-lg flex-none object-contain"
                    }
                  />
                </div>
              )}
              <div className="flex flex-col">
                <span className="font-bold text-gray-700 text-xl block mb-1">
                  {companyName}
                </span>
                {/* View all jobs button */}
                <div className="flex items-center space-x-2">
                  <Link
                    href={{
                      pathname: "/",
                      query: companyURLLink(
                        job,
                        router.query?.searchState || null
                      ),
                    }}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-1 text-xs font-bold mb-2 text-pink-600 border border-pink-600 rounded px-2 w-fit flex-none"
                  >
                    <span>View All Jobs</span>
                    <ArrowTopRightOnSquareIcon className="h-3 w-3 flex-none" />
                  </Link>
                  {website && (
                    <button
                      onClick={() => {
                        window.open(`//${website}`, "_blank");
                      }}
                      className="flex items-center space-x-1 text-xs font-bold mb-2 text-pink-600 border border-pink-600 rounded px-2 w-fit"
                    >
                      <GlobeAltIcon className="h-3 w-3 flex-none" />
                      <span>Website</span>
                    </button>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  {resolvedCompanyData?.is_public_company ? (
                    <span className="border border-black px-2 text-xs rounded my-1 font-bold">
                      Public Company
                    </span>
                  ) : null}
                  {resolvedCompanyData?.stock_symbol ? (
                    <Link
                      href={`https://www.google.com/search?q=${resolvedCompanyData?.stock_symbol}+stock`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="border border-pink-600 text-pink-600 px-2  text-xs rounded my-1 font-bold"
                    >
                      Stock Symbol:{" "}
                      {resolvedCompanyData?.stock_symbol}
                    </Link>
                  ) : (
                    ""
                  )}
                  {resolvedCompanyData?.is_non_profit ? (
                    <span className="border border-black px-2 py-0.5 text-xs rounded my-1 font-bold">
                      Non-Profit
                    </span>
                  ) : null}
                  {(["seed", "pre seed"]?.includes(
                    resolvedCompanyData?.latest_investment_series?.toLowerCase?.() ||
                      ""
                  ) ||
                    resolvedCompanyData?.latest_investment_series
                      ?.toLowerCase?.()
                      ?.includes("series")) &&
                  !resolvedCompanyData?.is_public_company ? (
                    <span className="border border-black px-2 py-0.5 text-xs rounded my-1 font-bold">
                      {resolvedCompanyData?.latest_investment_amount
                        ? `Raised ${abbreviateDollarValue(
                            resolvedCompanyData
                              .latest_investment_amount
                          )} in`
                        : ""}{" "}
                      {resolvedCompanyData.latest_investment_series}{" "}
                      {resolvedCompanyData.latest_investment_year
                        ? `(${resolvedCompanyData.latest_investment_year})`
                        : ""}
                    </span>
                  ) : null}
                </div>
                <span className="text-gray-600">
                  {companyTagline || companyDescription}
                </span>
              </div>
            </div>

            {/* Company data table (enriched data preferred over v5) */}
            {resolvedCompanyData && (
              <CompanyDataTable companyData={resolvedCompanyData} />
            )}
          </>
        )}

        {/* JOB TAB */}
        {activeTab === "JOB_INFO" && (
          <>
            {/* MARKING / POSTING TIME + JD BUTTON */}
            <div className="flex items-center justify-between space-x-4 w-full">
              <div className="flex flex-col space-y-2">
                {jobMarkingTimeAgo ? (
                  <Tooltip label="The time when you last marked this job">
                    <span className="text-xs text-gray-500 flex-none">
                      Marked {jobMarkingTimeAgo} ago
                    </span>
                  </Tooltip>
                ) : null}
                {postingTimeAgo ? (
                  <Tooltip label="Date added on HiringCafe">
                    <span className="text-xs text-cyan-700 font-bold flex-none">
                      Posted {postingTimeAgo} ago
                    </span>
                  </Tooltip>
                ) : null}
              </div>
            </div>

            {/* JOB TITLE */}
            <h2 className="font-extrabold text-3xl text-gray-800 mb-4">
              {job.job_title || job.job_information?.title || ""}
            </h2>

            {/* COMPANY NAME + VIEW ALL / WEBSITE BUTTONS */}
            <div className="flex flex-col space-y-2 mb-4">
              <span className="text-xl font-semibold text-gray-700 flex-none">
                @ {companyName}
              </span>
              <div className="flex items-center space-x-2">
                <Link
                  href={{
                    pathname: "/",
                    query: companyURLLink(
                      job,
                      router.query?.searchState || null
                    ),
                  }}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 rounded border border-violet-300 text-violet-500 px-2 text-xs font-bold w-fit"
                >
                  <span>View All Jobs</span>
                  <ArrowTopRightOnSquareIcon className="h-3 w-3 flex-none" />
                </Link>
                {website && (
                  <button
                    onClick={() => {
                      window.open(`//${website}`, "_blank");
                    }}
                    className="flex items-center space-x-1 rounded border border-violet-300 text-violet-500 px-2 text-xs font-bold w-fit"
                  >
                    <GlobeAltIcon className="h-3 w-3 flex-none" />
                    <span>Website</span>
                  </button>
                )}
              </div>
            </div>
            <div className="flex space-x-2">
              <MapPinIcon className="h-5 w-5 text-gray-500 flex-none" />
              <span>{location}</span>
            </div>
            <div className="flex flex-wrap gap-3">
              {compensation && (
                <Tooltip label="As per job description">
                  <span className="rounded text-xs px-3 py-1 border border-gray-400 font-bold">
                    {compensation}
                  </span>
                </Tooltip>
              )}
              {shouldShowUndisclosedSalaryLabel && (
                <Tooltip label="Pro tip: you can filter out jobs with undisclosed salaries under the salary filters.">
                  <span className="rounded text-xs px-3 py-1 border font-light bg-red-50 text-red-800 border-red-300">
                    Undisclosed Salary
                  </span>
                </Tooltip>
              )}
              <span className="rounded text-xs px-3 py-1 border border-gray-400 font-bold">
                {workplaceType}
              </span>
              <span className="rounded text-xs px-3 py-1 border border-gray-400 font-bold">
                {commitment}
              </span>
            </div>
            {responsibilities && (
              <div className="flex flex-col space-y-3">
                <span className="font-bold text-gray-700">
                  Responsibilities:
                </span>
                <span>{responsibilities}</span>
              </div>
            )}
            <div className="flex flex-col space-y-3">
              <span className="font-bold text-gray-700">
                Requirements Summary:
              </span>
              <span>{requirementsSummary}</span>
            </div>
            {techStack && (
              <div className="flex flex-col space-y-3">
                <span className="font-bold text-gray-700">
                  Technical Tools Mentioned:
                </span>
                <span>{techStack}</span>
              </div>
            )}
          </>
        )}
      </div>

      {/* ACTIONS SECTION */}
      <div className="mt-8 mb-4 flex justify-center w-full">
        <JobDescriptionApplyButton
          job={job}
          frontend_source={
            isFromAISearch
              ? APPLICATION_CLICK_FRONT_END_SOURCE.FULL_JOB_DESCRIPTION_FROM_AI_SEARCH
              : APPLICATION_CLICK_FRONT_END_SOURCE.FULL_JOB_DESCRIPTION_FROM_VIEW_JOB
          }
        />
      </div>
      <div className="flex justify-center w-full mt-6">
        {viewFormat === QUICK_SUMMARY_CARD_VIEW_FORMAT.SEARCH_RESULTS ? (
          <div className="flex flex-col items-center border p-3 md:p-5 w-full rounded-xl bg-gray-50">
            {isHidden || isApplied || isSaved ? (
              <div className="flex items-center space-x-1 text-gray-600">
                <span className="text-sm">
                  {isHidden
                    ? "Hidden"
                    : isApplied
                      ? "Applied"
                      : isSaved
                        ? "Saved"
                        : ""}
                </span>
                <CheckIcon className="h-5 w-5" />
              </div>
            ) : (
              <div className="flex flex-col items-center space-y-4 text-xs md:text-base">
                <div className="flex items-center space-x-4">
                  {user ? (
                    <button
                      onClick={() => {
                        markJob("Saved");
                        onJobMarked?.();
                      }}
                      className="bg-green-500 hover:bg-green-600 transition text-white rounded-full py-2 px-6 font-bold"
                    >
                      Save
                    </button>
                  ) : (
                    <AuthenticationModal>
                      <div className="bg-green-500 hover:bg-green-600 transition text-white rounded-full py-2 px-6 font-bold">
                        Save
                      </div>
                    </AuthenticationModal>
                  )}
                  {user ? (
                    <button
                      onClick={() => {
                        markJob("Applied");
                        onJobMarked?.();
                      }}
                      className="border px-3 py-1.5 rounded-full border-gray-300 font-medium bg-gray-100 hover:bg-gray-200 transition"
                    >
                      Mark Applied
                    </button>
                  ) : (
                    <AuthenticationModal>
                      <div className="border px-3 py-1.5 rounded-full border-gray-300 font-medium bg-gray-100 hover:bg-gray-200 transition">
                        Mark Applied
                      </div>
                    </AuthenticationModal>
                  )}
                </div>
                <div className="flex items-center space-x-2 md:space-x-4">
                  {user ? (
                    <button
                      className="text-red-600 border-red-600 bg-red-100 hover:bg-red-200 transition border px-2 md:px-3 py-1.5 rounded-full font-medium"
                      onClick={() => {
                        markJob("Hidden");
                        onJobMarked?.();
                      }}
                    >
                      Hide Job
                    </button>
                  ) : (
                    <AuthenticationModal>
                      <div className="text-red-600 border-red-600 bg-red-100 hover:bg-red-200 transition border px-2 md:px-3 py-1.5 rounded-full font-medium">
                        Hide Job
                      </div>
                    </AuthenticationModal>
                  )}
                  {user ? (
                    <button
                      className="text-red-600 border-red-600 bg-red-100 hover:bg-red-200 transition border px-2 md:px-3 py-1.5 rounded-full font-medium"
                      onClick={() => {
                        onReportJobModalOpen();
                      }}
                    >
                      Report & Hide
                    </button>
                  ) : (
                    <AuthenticationModal>
                      <div className="text-red-600 border-red-600 bg-red-100 hover:bg-red-200 transition border px-2 md:px-3 py-1.5 rounded-full font-medium">
                        Report & Hide
                      </div>
                    </AuthenticationModal>
                  )}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col p-5 items-center text-base border rounded-xl bg-gray-50 w-full space-y-4">
            <span className="font-bold text-gray-500">Job Actions</span>
            <SavedJobActions
              style={"standard"}
              job={job}
              onDelete={onDelete}
              onUpdateStage={onUpdateStage}
            />
          </div>
        )}
      </div>

      {/* FULL DESCRIPTION ANCHOR */}
      <div ref={fullDescriptionRef} className="mt-12"></div>

      {/* REPORT & HIDE MODAL */}
      <Modal isOpen={isReportJobModalOpen} onClose={onReportJobModalClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Report & Hide Job</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <div className="text-gray-700">Why are you reporting this job?</div>
            <div className="flex items-center space-x-3 my-4">
              <select
                className="border border-1 p-3 outline-none focus:ring-2 focus:ring-gray-500 rounded-md"
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
                } font-medium p-3 rounded-md`}
                disabled={reason === ""}
                onClick={async () => {
                  if (await reportAndHideJob(reason)) {
                    onReportJobModalClose();
                    onJobMarked?.();
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

// ===============================
// COMPANY DATA TABLE COMPONENT
// ===============================

const EXCLUDED_FIELDS = [
  "name",
  "tagline",
  "image_url",
  "is_dissolved",
  "is_acquired",
  "latest_investment_currency",
  "total_funding_currency",
  "is_public_company",
  "is_non_profit",
  "website",
  "stock_exchange",
  "stock_symbol",
  "latest_revenue_year",
  "latest_revenue_currency",
  "latest_revenue",
];

/**
 * Fields that we want to render as clickable pill buttons,
 * with special URLs based on the value.
 */
const PILL_FIELDS = [
  "industries",
  "activities",
  "investors",
  "latest_investment_series",
  "subsidiaries",
  "parent_company",
];

/**
 * Predefined link templates. For instance, if "activities" = "web3",
 * final link is /?searchState={"companyKeywords":["web3"]}.
 * We encode the value so that spaces or + signs won't break the URL.
 */
const linkTemplates = {
  industries: (val) =>
    `/?searchState={"industries":["${encodeURIComponent(val)}"]}`,
  activities: (val) =>
    `/?searchState={"companyKeywords":["${encodeURIComponent(val)}"]}`,
  investors: (val) =>
    `/?searchState={"investors":["${encodeURIComponent(val)}"]}`,
  latest_investment_series: (val) =>
    `/?searchState={"latestInvestmentSeries":["${encodeURIComponent(val)}"]}`,
  subsidiaries: (val) =>
    `/?searchState={"companyNames":["${encodeURIComponent(val)}"]}`,
  parent_company: (val) =>
    `/?searchState={"companyNames":["${encodeURIComponent(val)}"]}`,
};

/**
 * The main table for resolved company data (enriched preferred over v5),
 * excluding certain fields and applying custom formatting logic.
 */
const CompanyDataTable = ({ companyData }) => {
  // Turn the object into [key, value] pairs while filtering excluded/empty
  let relevantData = Object.entries(companyData).filter(([key, value]) => {
    return (
      !EXCLUDED_FIELDS.includes(key) && value !== null && value !== undefined
    );
  });

  // Sorting: dynamic based on is_public_company, is_non_profit, etc.
  relevantData.sort((a, b) => {
    const [keyA] = a;
    const [keyB] = b;
    const priorityA = fieldPriority(keyA, companyData);
    const priorityB = fieldPriority(keyB, companyData);
    return priorityA - priorityB;
  });

  // If no fields remain, show nothing
  if (!relevantData.length) return null;

  return (
    <div className="overflow-x-auto border border-neutral-200 rounded-lg">
      <table className="table-auto min-w-full text-sm text-left">
        <thead className="bg-neutral-100 text-neutral-800 uppercase text-xs">
          <tr>
            <th scope="col" className="px-4 py-2 font-semibold w-1/3">
              Field
            </th>
            <th scope="col" className="px-4 py-2 font-semibold">
              Value
            </th>
          </tr>
        </thead>
        <tbody>
          {relevantData.map(([key, value], idx) => (
            <tr
              key={key}
              className={idx % 2 === 0 ? "bg-white" : "bg-gray-100"}
            >
              <td className="px-4 py-3 font-medium text-gray-700">
                {formatCompanyFieldLabel(key)}
              </td>
              <td className="px-4 py-3 text-gray-700">
                {renderFieldValue(key, value)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

/**
 * fieldPriority checks is_public_company, is_non_profit, etc.
 * to tweak the ordering of stock vs. series data, etc.
 */
function fieldPriority(key, companyData) {
  // A base "ranking" for all fields:
  const basePriority = {
    year_founded: 10,
    num_employees: 15,
    industries: 20,
    activities: 25,
    organization_type: 30,
    headquarters_country: 145,
    is_public_company: 35,
    is_non_profit: 40,
    is_acquired: 45,
    is_dissolved: 50,
    subsidiaries: 140,
    parent_company: 130,
    website: 1,
    linkedin_url: 150,
    total_funding_amount: 75,
    total_funding_currency: 80,
    latest_investment_amount: 85,
    latest_investment_currency: 90,
    latest_investment_year: 95,
    latest_investment_series: 100,
    investors: 105,
    stock_exchange: 110,
    stock_symbol: 115,
    latest_revenue: 120,
    latest_revenue_currency: 125,
  };

  let priority = basePriority[key] || 999;

  const isPublic = companyData.is_public_company === true;
  const isNonProfit = companyData.is_non_profit === true;
  // We'll consider "private" if not public and not non-profit
  const isPrivate = !isPublic && !isNonProfit;

  // 1) If public, prioritize stock fields
  if (
    isPublic &&
    [
      "stock_exchange",
      "stock_symbol",
      "latest_revenue",
      "latest_revenue_currency",
    ].includes(key)
  ) {
    priority -= 20; // show them earlier
  }
  // 2) If private, prioritize investment series
  if (
    isPrivate &&
    [
      "latest_investment_series",
      "latest_investment_amount",
      "latest_investment_currency",
      "investors",
    ].includes(key)
  ) {
    priority -= 20;
  }
  // 3) If non-profit, deprioritize both
  if (
    isNonProfit &&
    [
      "stock_exchange",
      "stock_symbol",
      "latest_investment_series",
      "investors",
    ].includes(key)
  ) {
    priority += 20;
  }

  return priority;
}

/**
 * Convert "year_founded" => "Year Founded"
 */
function formatCompanyFieldLabel(key) {
  return key.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
}

/**
 * Master function to render each field's value with special logic:
 * - Money fields => $ + abbreviate large #s
 * - "Pill" fields => horizontally scrollable pills that link
 * - year fields => just show the year
 * - boolean => "Yes" / "No"
 * - url => hyperlink
 * - etc.
 */
function renderFieldValue(key, value) {
  // If this is one of our "pill fields," we'll try to parse and render as pills
  if (PILL_FIELDS.includes(key.toLowerCase())) {
    // If it's a string, try splitting on commas or semicolons
    const valuesArray = Array.isArray(value)
      ? value
      : typeof value === "string"
        ? value.split(/[;,]/)
        : [value];

    // Display horizontally with pill styles and scroll if many
    return (
      <div className="flex overflow-x-auto gap-2">
        {valuesArray.map((val) => {
          const trimmed = (val || "")?.trim?.();
          if (!trimmed) return null;

          const linkUrl = linkTemplates[key](trimmed);
          return (
            <Link
              key={trimmed}
              href={linkUrl}
              target="_blank"
              className="whitespace-nowrap bg-pink-100 text-pink-800 px-3 py-1 rounded-full text-xs font-semibold hover:bg-pink-200 transition"
            >
              {trimmed}
            </Link>
          );
        })}
      </div>
    );
  }

  // 1. boolean => 'Yes' / 'No'
  if (typeof value === "boolean") {
    return value ? "Yes" : "No";
  }

  // 2. numeric year fields => just show the year (avoid money logic)
  //    We'll guess "year" is in the key name (e.g. "latest_investment_year").
  if (key.toLowerCase().includes("year") && !isNaN(Number(value))) {
    return value;
  }

  // 3. money fields => add "$" and abbreviate large numbers
  if (isMoneyField(key) && !isNaN(Number(value))) {
    return abbreviateDollarValue(Number(value));
  }

  // 4. url or website => clickable link
  if (key.toLowerCase().includes("website")) {
    return (
      <button
        onClick={(e) => {
          window.open(`//${value}`, "_blank");
        }}
        className="text-pink-700 underline"
      >
        {value}
      </button>
    );
  } else if (key.toLowerCase().includes("url")) {
    return (
      <Link
        href={value.startsWith("http") ? value : `https://${value}`}
        target="_blank"
        rel="noopener noreferrer"
        className="text-pink-700 underline"
      >
        {value}
      </Link>
    );
  }

  // 5. Large arrays/strings that are not pill fields => horizontally scroll
  if (Array.isArray(value)) {
    return (
      <div className="flex overflow-x-auto gap-2">
        {value.map((v) => (
          <span
            key={v}
            className="border rounded px-2 py-1 text-xs whitespace-nowrap"
          >
            {v}
          </span>
        ))}
      </div>
    );
  }

  // if it's a long string, we can ensure horizontal scroll if it’s super wide
  if (typeof value === "string" && value.length > 80) {
    return <div className="overflow-x-auto whitespace-nowrap">{value}</div>;
  }

  // Otherwise, just show raw value
  return value;
}

// Detect if a field is definitely "money" (and not a "year").
function isMoneyField(key) {
  // exclude anything with "year" so we don't break `latest_investment_year`
  if (key.toLowerCase().includes("year")) return false;

  const moneyKeywords = ["amount", "revenue", "funding", "investment"];
  return moneyKeywords.some((kw) => key.toLowerCase().includes(kw));
}

/**
 * Abbreviates the number (1234 -> $1.23k, 1000000 -> $1.00M, etc.)
 */
function abbreviateDollarValue(num) {
  let abbreviation = "";
  let abbreviatedNum = num;

  if (num >= 1_000_000_000) {
    abbreviatedNum = (num / 1_000_000_000).toFixed(2);
    abbreviation = "B";
  } else if (num >= 1_000_000) {
    abbreviatedNum = (num / 1_000_000).toFixed(2);
    abbreviation = "M";
  } else if (num >= 1_000) {
    abbreviatedNum = (num / 1_000).toFixed(2);
    abbreviation = "k";
  } else {
    abbreviatedNum = num.toString();
  }

  return `$${abbreviatedNum}${abbreviation}`;
}

export default BriefJDSummaryV3;
