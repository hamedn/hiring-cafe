import {
  cognitiveDemandLevelTypes,
  commitmentTypeOptions,
  computerUsageLevelTypes,
  OncallRequirementTypes,
  oralCommunicationLevelTypes,
  physicalLaborIntensityTypes,
  physicalPositionTypes,
  roleTypeOptions,
  securityClearanceTypes,
  seniorityLevelTypes,
  TravelRequirementTypes,
  workplacePhysicalEnvironmentTypes,
  workplaceTypeOptions,
} from "@/utils/constants";
import _ from "lodash";
import { createContext, useContext } from "react";

export const defaultRadius = 50;

export const maxYearsOfExperience = 20;

export const defaultDateFetchedPastNDays = 121;

// v5_processed_job_data
export const defaultAlgoliaFilter = "gpt_processing_status.processed_count > 0";

// Initial state
export const initialState = {
  // Locations
  /*
  LOCALITY:
  {
    id: "1",
    workplace_types: ["Remote", "Hybrid", "Onsite"],
    options: {
      radius: 50,
      radius_unit: "miles",
      ignore_radius: false,
    }
  }
  // ADMINISTRATIVE_AREA_LEVEL_1:
  {
    id: "2",
    workplace_types: ["Remote", "Hybrid", "Onsite"],
    options: {}
  }
  // COUNTRY:
  {
    id: "3",
    workplace_types: ["Remote", "Hybrid", "Onsite"],
    options: {}
  }
  // CONTINENT:
  {
    id: "4",
    workplace_types: ["Remote", "Hybrid", "Onsite"],
    options: {}
  }
  // CUSTOM: (allows us to add custom locations that are not necessarily in the API)
  {
    id: "5",
    workplace_types: ["Remote", "Hybrid", "Onsite"],
    options: {},
  }
  */
  locations: [],
  workplaceTypes: workplaceTypeOptions,
  defaultToUserLocation: true,
  userLocation: null,
  physicalEnvironments: workplacePhysicalEnvironmentTypes,
  physicalLaborIntensity: physicalLaborIntensityTypes,
  physicalPositions: physicalPositionTypes,
  oralCommunicationLevels: oralCommunicationLevelTypes,
  computerUsageLevels: computerUsageLevelTypes,
  cognitiveDemandLevels: cognitiveDemandLevelTypes,

  // Compensation
  currency: { label: "Any", value: null },
  frequency: { label: "Any", value: null },
  minCompensationLowEnd: null,
  minCompensationHighEnd: null,
  maxCompensationLowEnd: null,
  maxCompensationHighEnd: null,
  restrictJobsToTransparentSalaries: false,
  calcFrequency: "Yearly",

  // Commitment
  commitmentTypes: commitmentTypeOptions,

  // Keywords
  jobTitleQuery: "",
  jobDescriptionQuery: "",

  // Education
  associatesDegreeFieldsOfStudy: [],
  excludedAssociatesDegreeFieldsOfStudy: [],
  bachelorsDegreeFieldsOfStudy: [],
  excludedBachelorsDegreeFieldsOfStudy: [],
  mastersDegreeFieldsOfStudy: [],
  excludedMastersDegreeFieldsOfStudy: [],
  doctorateDegreeFieldsOfStudy: [],
  excludedDoctorateDegreeFieldsOfStudy: [],
  associatesDegreeRequirements: [],
  bachelorsDegreeRequirements: [],
  mastersDegreeRequirements: [],
  doctorateDegreeRequirements: [],

  // Licenses and Certifications
  licensesAndCertifications: [],
  excludedLicensesAndCertifications: [],
  excludeAllLicensesAndCertifications: false,

  // Experience
  seniorityLevel: seniorityLevelTypes,
  roleTypes: roleTypeOptions,
  roleYoeRange: [0, maxYearsOfExperience],
  excludeIfRoleYoeIsNotSpecified: false,
  managementYoeRange: [0, maxYearsOfExperience],
  excludeIfManagementYoeIsNotSpecified: false,

  // Security Clearance
  securityClearances: securityClearanceTypes,

  // Language Requirements
  languageRequirements: [],
  excludedLanguageRequirements: [],
  languageRequirementsOperator: "OR",
  excludeJobsWithAdditionalLanguageRequirements: false,

  // Travel Requirements
  airTravelRequirement: TravelRequirementTypes,
  landTravelRequirement: TravelRequirementTypes,

  // Shifts & Schedules
  morningShiftWork: [],
  eveningShiftWork: [],
  overnightShiftWork: [],
  weekendAvailabilityRequired: "Doesn't Matter",
  holidayAvailabilityRequired: "Doesn't Matter",
  overtimeRequired: "Doesn't Matter",
  onCallRequirements: OncallRequirementTypes,

  // Benefits & Perks
  benefitsAndPerks: [],

  // Easy Application
  applicationFormEase: [],

  // Company Filters
  companyNames: [],
  excludedCompanyNames: [],
  companyHqCountries: [],
  excludedCompanyHqCountries: [],
  usaGovPref: null,
  industries: [],
  excludedIndustries: [],
  companyKeywords: [],
  companyKeywordsBooleanOperator: "OR",
  excludedCompanyKeywords: [],

  // Exclude Marked Jobs
  hideJobTypes: [],

  // Encouraged to apply
  encouragedToApply: [],

  searchQuery: "",
  dateFetchedPastNDays: defaultDateFetchedPastNDays,
  // Unhandled - hidden companies
  hiddenCompanies: [],
  user: null,
  searchModeSelectedCompany: null,

  departments: [],
  // excludedDepartments: [],

  restrictedSearchAttributes: [],
  sortBy: "default",

  technologyKeywordsQuery: "",
  requirementsKeywordsQuery: "",

  // Company Filters
  companyPublicOrPrivate: "all",

  // Latest Investment
  latestInvestmentYearRange: [null, null],
  latestInvestmentSeries: [],
  latestInvestmentAmount: null,
  latestInvestmentCurrency: [],
  investors: [],
  excludedInvestors: [],
  isNonProfit: "all",
  organizationTypes: [],
  excludedOrganizationTypes: [],

  companySizeRanges: [],

  minYearFounded: null,
  maxYearFounded: null,

  excludedLatestInvestmentSeries: [],
};

// Create Context
export const CurrentSearchFiltersContext = createContext();

// Use Context
export const useCurrentSearchFilters = () =>
  useContext(CurrentSearchFiltersContext);

export const saveSearchKeys = [
  "locations",
  "searchQuery",
  "workplaceTypes",
  "commitmentTypes",
  "applicationFormEase",
  "dateFetchedPastNDays",
  "currency",
  "frequency",
  "minCompensationHighEnd",
  "restrictJobsToTransparentSalaries",
  "hideJobTypes",
  "industries",
  "excludedIndustries",
  "companyKeywords",
  "excludedCompanyKeywords",
  "departments",
  "roleYoeRange",
  "excludeIfRoleYoeIsNotSpecified",
  "managementYoeRange",
  "excludeIfManagementYoeIsNotSpecified",
  "associatesDegreeFieldsOfStudy",
  "excludedAssociatesDegreeFieldsOfStudy",
  "bachelorsDegreeFieldsOfStudy",
  "excludedBachelorsDegreeFieldsOfStudy",
  "mastersDegreeFieldsOfStudy",
  "excludedMastersDegreeFieldsOfStudy",
  "doctorateDegreeFieldsOfStudy",
  "excludedDoctorateDegreeFieldsOfStudy",
  "companyNames",
  "excludedCompanyNames",
  "companyHqCountries",
  "excludedCompanyHqCountries",
  "defaultToUserLocation",
  "roleTypes",
  "restrictedSearchAttributes",
  "usaGovPref",
  "calcFrequency",
  "minCompensationLowEnd",
  "minCompensationHighEnd",
  "maxCompensationLowEnd",
  "maxCompensationHighEnd",
  "physicalEnvironments",
  "physicalLaborIntensity",
  "physicalPositions",
  "oralCommunicationLevels",
  "computerUsageLevels",
  "cognitiveDemandLevels",
  "associatesDegreeRequirements",
  "bachelorsDegreeRequirements",
  "mastersDegreeRequirements",
  "doctorateDegreeRequirements",
  "licensesAndCertifications",
  "excludedLicensesAndCertifications",
  "excludeAllLicensesAndCertifications",
  "seniorityLevel",
  "securityClearances",
  "languageRequirements",
  "excludedLanguageRequirements",
  "languageRequirementsOperator",
  "excludeJobsWithAdditionalLanguageRequirements",
  "airTravelRequirement",
  "landTravelRequirement",
  "morningShiftWork",
  "eveningShiftWork",
  "overnightShiftWork",
  "weekendAvailabilityRequired",
  "holidayAvailabilityRequired",
  "overtimeRequired",
  "onCallRequirements",
  "benefitsAndPerks",
  "companyKeywordsBooleanOperator",
  "encouragedToApply",
  "sortBy",
  "jobTitleQuery",
  "technologyKeywordsQuery",
  "jobDescriptionQuery",
  "requirementsKeywordsQuery",
  "companyPublicOrPrivate",
  "latestInvestmentYearRange",
  "latestInvestmentSeries",
  "latestInvestmentAmount",
  "latestInvestmentCurrency",
  "investors",
  "excludedInvestors",
  "isNonProfit",
  "organizationTypes",
  "excludedOrganizationTypes",
  "companySizeRanges",
  "minYearFounded",
  "maxYearFounded",
  "excludedLatestInvestmentSeries",
];

export const sortOptions = [
  { label: "Relevance", value: "default" },
  { label: "Most recent", value: "date" },
  { label: "Oldest", value: "date_asc" },
  { label: "Highest salary", value: "compensation_desc" },
  { label: "Lowest salary", value: "compensation_asc" },
  { label: "Least experience", value: "experience_asc" },
  { label: "Most experience", value: "experience_desc" },
];
