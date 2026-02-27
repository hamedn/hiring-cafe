import { Modal, Drawer, Grid } from "antd";
import JobFiltersV4 from "./V5Filters/JobFiltersV4";
import QualificationsFiltersV4 from "./V5Filters/QualificationsFiltersV4";
import CompanyFiltersV4 from "./V5Filters/CompanyFiltersV4";
import { useMemo, useState } from "react";
import _ from "lodash";
import {
  initialState,
  useCurrentSearchFilters,
} from "contexts/CurrentSearchFiltersContext";
import { useRouter } from "next/router";
import useURLSearchStateV4 from "@/hooks/useURLSearchStateV4";
import useMobileDeviceDetection from "@/hooks/useMobileDeviceDetection";
import CommitmentSelectionV4 from "./V5Filters/CommitmentSelectionV4";
import SalarySelectionV4 from "./V5Filters/SalarySelectionV4";
import EducationFiltersV5 from "./V5Filters/EducationFiltersV5";
import LicensesAndCertificationsV5 from "./V5Filters/LicensesAndCertificationsV5";
import SecurityClearanceSelectionV5 from "./V5Filters/SecurityClearanceSelectionV5";
import LanguagesSelectionV5 from "./V5Filters/LanguagesSelectionV5";
import TravelRequirementSelectionV5 from "./V5Filters/TravelRequirementSelectionV5";
import { ArrowPathIcon } from "@heroicons/react/24/outline";
import ShiftAndScheduleFilterV5 from "./V5Filters/ShiftAndScheduleFilterV5";
import BenefitsAndPerksFilterV5 from "./V5Filters/BenefitsAndPerksFilterV5";
import EncouragedToApplyV5 from "./V5Filters/EncouragedToApplyV5";
import JobCategorySelectionV5 from "./V5Filters/JobCategorySelectionV5";
import SaveSearchButton from "./SaveSearchButton";
import StageAndFundingSelectionV5 from "./V5Filters/StageAndFundingSelectionV5";
import IndustryAndActivitiesV5 from "./V5Filters/IndustryAndActivitiesV5";
import CompanySizeV5 from "./V5Filters/CompanySizeV5";
import FoundingYearFilterV5 from "./V5Filters/FoundingYearFilterV5";

const companyFilterNames = [
  "Company",
  "Industry",
  "Stage & Funding",
  "Size",
  "Founding Year",
];

const stateToFilterNames = {
  currency: ["Salary"],
  frequency: ["Salary"],
  minCompensationLowEnd: ["Salary"],
  minCompensationHighEnd: ["Salary"],
  maxCompensationLowEnd: ["Salary"],
  maxCompensationHighEnd: ["Salary"],
  restrictJobsToTransparentSalaries: ["Salary"],
  calcFrequency: ["Salary"],
  organizationTypes: ["Industry"],
  excludedOrganizationTypes: ["Industry"],
  industries: ["Industry"],
  excludedIndustries: ["Industry"],
  companyKeywords: ["Industry"],
  companyKeywordsBooleanOperator: ["Industry"],
  excludedCompanyKeywords: ["Industry"],
  companyNames: ["Company"],
  excludedCompanyNames: ["Company"],
  companyHqCountries: ["Company"],
  excludedCompanyHqCountries: ["Company"],
  usaGovPref: ["Industry"],
  commitmentTypes: ["Commitment"],
  jobTitleQuery: ["Job Titles & Keywords"],
  technologyKeywordsQuery: ["Job Titles & Keywords"],
  roleYoeRange: ["Experience"],
  managementYoeRange: ["Experience"],
  excludeIfManagementYoeIsNotSpecified: ["Experience"],
  excludeIfRoleYoeIsNotSpecified: ["Experience"],
  seniorityLevel: ["Experience"],
  jobDescriptionQuery: ["Job Titles & Keywords"],
  requirementsKeywordsQuery: ["Job Titles & Keywords"],
  associatesDegreeFieldsOfStudy: ["Education"],
  excludedAssociatesDegreeFieldsOfStudy: ["Education"],
  bachelorsDegreeFieldsOfStudy: ["Education"],
  excludedBachelorsDegreeFieldsOfStudy: ["Education"],
  mastersDegreeFieldsOfStudy: ["Education"],
  excludedMastersDegreeFieldsOfStudy: ["Education"],
  doctorateDegreeFieldsOfStudy: ["Education"],
  excludedDoctorateDegreeFieldsOfStudy: ["Education"],
  associatesDegreeRequirements: ["Education"],
  bachelorsDegreeRequirements: ["Education"],
  mastersDegreeRequirements: ["Education"],
  doctorateDegreeRequirements: ["Education"],
  licensesAndCertifications: ["Licenses & Certifications"],
  excludedLicensesAndCertifications: ["Licenses & Certifications"],
  excludeAllLicensesAndCertifications: ["Licenses & Certifications"],
  roleTypes: ["Experience"],
  securityClearances: ["Security Clearance"],
  languageRequirements: ["Languages"],
  excludedLanguageRequirements: ["Languages"],
  excludedLanguageRequirements: ["Languages"],
  languageRequirementsOperator: ["Languages"],
  excludeJobsWithAdditionalLanguageRequirements: ["Languages"],
  airTravelRequirement: ["Travel Requirement"],
  landTravelRequirement: ["Travel Requirement"],
  morningShiftWork: ["Shifts & Schedules"],
  eveningShiftWork: ["Shifts & Schedules"],
  overnightShiftWork: ["Shifts & Schedules"],
  weekendAvailabilityRequired: ["Shifts & Schedules"],
  holidayAvailabilityRequired: ["Shifts & Schedules"],
  overtimeRequired: ["Shifts & Schedules"],
  onCallRequirements: ["Shifts & Schedules"],
  benefitsAndPerks: ["Benefits & Perks"],
  encouragedToApply: ["Encouraged to Apply"],
  departments: ["Departments"],
  latestInvestmentSeries: ["Stage & Funding"],
  latestInvestmentYearRange: ["Stage & Funding"],
  latestInvestmentAmount: ["Stage & Funding"],
  investors: ["Stage & Funding"],
  companySizeRanges: ["Size"],
  minYearFounded: ["Founding Year"],
  maxYearFounded: ["Founding Year"],
  excludedLatestInvestmentSeries: ["Stage & Funding"],
  excludedInvestors: ["Stage & Funding"],
};

const { useBreakpoint } = Grid;

export default function JobFiltersNavBar() {
  const router = useRouter();
  const { state: currentSearchState } = useCurrentSearchFilters();
  const { searchState, company: selectedCompany } = useURLSearchStateV4();

  const [isOpen, setIsOpen] = useState(false);
  const onOpen = () => setIsOpen(true);
  const onClose = () => setIsOpen(false);
  const [activeFilter, setActiveFilter] = useState(null);

  const selectedFilters = useMemo(() => {
    let filterNamesToHighlight = [];

    Object.keys(stateToFilterNames).forEach((key) => {
      if (!_.isEqual(currentSearchState[key], initialState[key])) {
        if (stateToFilterNames[key]) {
          filterNamesToHighlight.push(...stateToFilterNames[key]);
        }
      }
    });

    return filterNamesToHighlight;
  }, [currentSearchState]);

  const resetFilter = (filter) => {
    const query = {};
    const updatedState = { ...searchState };

    Object.keys(stateToFilterNames).forEach((key) => {
      if (stateToFilterNames[key].includes(filter)) {
        delete updatedState[key];
      }
    });

    if (Object.keys(updatedState).length > 0) {
      query.searchState = JSON.stringify(updatedState);
    }

    if (selectedCompany) {
      query.company = selectedCompany;
    }

    router.push({ pathname: "/", query }, undefined, {
      shallow: true,
    });
  };

  const { isIOS, isInStandaloneMode } = useMobileDeviceDetection();

  const screens = useBreakpoint();

  const filters = [
    {
      name: "Departments",
      component: JobCategorySelectionV5,
    },
    {
      name: "Salary",
      component: SalarySelectionV4,
    },
    {
      name: "Commitment",
      component: CommitmentSelectionV4,
    },
    {
      name: "Experience",
      component: QualificationsFiltersV4,
    },
    {
      name: "Job Titles & Keywords",
      component: JobFiltersV4,
    },
    {
      name: "Education",
      component: EducationFiltersV5,
    },
    {
      name: "Licenses & Certifications",
      component: LicensesAndCertificationsV5,
    },
    {
      name: "Security Clearance",
      component: SecurityClearanceSelectionV5,
    },
    {
      name: "Languages",
      component: LanguagesSelectionV5,
    },
    {
      name: "Shifts & Schedules",
      component: ShiftAndScheduleFilterV5,
    },
    {
      name: "Travel Requirement",
      component: TravelRequirementSelectionV5,
    },
    {
      name: "Benefits & Perks",
      component: BenefitsAndPerksFilterV5,
    },
    {
      name: "Encouraged to Apply",
      component: EncouragedToApplyV5,
    },
    {
      name: "Company",
      component: CompanyFiltersV4,
    },
    {
      name: "Industry",
      component: IndustryAndActivitiesV5,
    },
    {
      name: "Stage & Funding",
      component: StageAndFundingSelectionV5,
    },
    {
      name: "Size",
      component: CompanySizeV5,
    },
    {
      name: "Founding Year",
      component: FoundingYearFilterV5,
    },
  ];

  const jobFilters = filters.filter(
    (f) => !companyFilterNames.includes(f.name)
  );

  const companyFilters = filters.filter((f) =>
    companyFilterNames.includes(f.name)
  );

  const resetSearchState = () => {
    const { searchState, ...rest } = router.query;
    router.push({
      pathname: router.pathname,
      query: rest,
    });
  };

  return (
    <div className="relative flex items-center w-full">
      <div className="flex flex-wrap w-full">
        {jobFilters.map((item) => (
          <button
            onClick={() => {
              setActiveFilter(item);
              onOpen();
            }}
            className={`flex-none border px-2 py-1 m-1.5 lg:m-2 rounded font-bold ${
              selectedFilters.includes(item.name)
                ? `text-pink-600 border-pink-600 bg-pink-50`
                : `text-zinc-600 border-zinc-600`
            } text-xs`}
            key={item.name}
          >
            {item.name}
          </button>
        ))}

        {/* Divider between job filters and company-related filters */}
        {!selectedCompany && companyFilters.length > 0 && (
          <span className="mx-2 text-gray-400 self-center">|</span>
        )}

        {!selectedCompany
          ? companyFilters.map((item) => (
              <button
                onClick={() => {
                  setActiveFilter(item);
                  onOpen();
                }}
                className={`flex-none border px-2 py-1 m-1.5 lg:m-2 rounded font-bold ${
                  selectedFilters.includes(item.name)
                    ? `text-pink-600 border-pink-600 bg-pink-50`
                    : `text-yellow-700 border-yellow-700`
                } text-xs`}
                key={item.name}
              >
                {item.name}
              </button>
            ))
          : null}

        {Object.keys(searchState || {}).length > 0 && (
          <div
            className={`hidden lg:flex items-center space-x-4 mx-2 my-1 flex-none`}
          >
            {!selectedCompany && (
              <div className="flex-none">
                <SaveSearchButton />
              </div>
            )}
            <button
              onClick={() => {
                if (selectedCompany) {
                  resetSearchState();
                } else {
                  router.push("/");
                }
              }}
              className="flex items-center space-x-2 text-sm text-gray-500 hover:text-gray-600 underline"
            >
              <ArrowPathIcon className="w-3 h-3 flex-none" />
              <span className="flex-none font-bold">Clear filters</span>
            </button>
          </div>
        )}
      </div>

      {/* Conditionally render Modal (md+) or Drawer (below md) */}
      {activeFilter && screens.md ? (
        <Modal
          styles={{
            content: {
              padding: 0,
            },
            body: {
              maxHeight: "50vh",
              overflowY: "auto",
            },
          }}
          title={
            <div className="text-sm px-4 py-4 border-b">
              {activeFilter.name}
            </div>
          }
          open={isOpen}
          onCancel={() => {
            onClose();
            setActiveFilter(null);
          }}
          footer={
            <div
              className={`pb-4 px-4 flex items-center justify-end space-x-2 w-full font-bold ${
                isIOS && isInStandaloneMode ? "pb-8" : ""
              }`}
            >
              {selectedFilters.includes(activeFilter.name) && (
                <div className="w-1/2 text-center">
                  <button
                    onClick={() => resetFilter(activeFilter.name)}
                    className="text-pink-600"
                  >
                    Clear all
                  </button>
                </div>
              )}
              <button
                onClick={() => {
                  onClose();
                  setActiveFilter(null);
                }}
                className="w-1/2 bg-pink-500 text-white rounded py-2"
              >
                Apply
              </button>
            </div>
          }
        >
          <activeFilter.component {...activeFilter.props} />
        </Modal>
      ) : activeFilter ? (
        <Drawer
          placement="bottom"
          height={"100vh"}
          open={isOpen}
          onClose={() => {
            onClose();
            setActiveFilter(null);
          }}
          styles={{
            body: {
              padding: 0,
            },
          }}
          title={<div className="text-sm mx-4">{activeFilter.name}</div>}
          footer={
            <div
              className={`pb-4 px-4 flex items-center justify-end space-x-2 w-full font-bold ${
                isIOS && isInStandaloneMode ? "pb-8" : ""
              }`}
            >
              {selectedFilters.includes(activeFilter.name) && (
                <div className="w-1/2 text-center">
                  <button
                    onClick={() => resetFilter(activeFilter.name)}
                    className="text-pink-600"
                  >
                    Clear all
                  </button>
                </div>
              )}
              <button
                onClick={() => {
                  onClose();
                  setActiveFilter(null);
                }}
                className="w-1/2 bg-pink-500 text-white rounded py-2"
              >
                Apply
              </button>
            </div>
          }
        >
          <activeFilter.component {...activeFilter.props} />
        </Drawer>
      ) : null}
    </div>
  );
}
