import { useMemo } from "react";
import { useRouter } from "next/router";
import { usePostHog } from "posthog-js/react";
import {
  defaultDateFetchedPastNDays,
  maxYearsOfExperience,
  saveSearchKeys,
  useCurrentSearchFilters,
} from "contexts/CurrentSearchFiltersContext";
import _ from "lodash";
import {
  cognitiveDemandLevelTypes,
  commitmentTypeOptions,
  computerUsageLevelTypes,
  educationRequirementTypes,
  EncouragedToApplyGroupTypes,
  ListOfBenefits,
  OncallRequirementTypes,
  oralCommunicationLevelTypes,
  physicalLaborIntensityTypes,
  physicalPositionTypes,
  roleTypeOptions,
  securityClearanceTypes,
  seniorityLevelTypes,
  ShiftWorkRequirementTypes,
  TravelRequirementTypes,
  workplacePhysicalEnvironmentTypes,
  workplaceTypeOptions,
} from "@/utils/constants";
import { replaceSmartQuotes } from "@/utils/helpers";
import { filterDefaultValues } from "@/utils/filterDefaults";

export const URLSearchStateUpdateType = {
  WORKPLACE_TYPES: "WORKPLACE_TYPES",
  SEARCH_QUERY: "SEARCH_QUERY",
  APPLICATION_FORM_EASE: "APPLICATION_FORM_EASE",
  COMMITMENT_TYPES: "COMMITMENT_TYPES",
  DATE_FETCHED_PAST_N_DAYS: "DATE_FETCHED_PAST_N_DAYS",
  HIDE_JOB_TYPES: "HIDE_JOB_TYPES",
  COMP_CURRENCY: "COMP_CURRENCY",
  COMP_FREQUENCY: "COMP_FREQUENCY",
  MIN_COMPENSATION_LOW_END: "MIN_COMPENSATION_LOW_END",
  MIN_COMPENSATION_HIGH_END: "MIN_COMPENSATION_HIGH_END",
  MAX_COMPENSATION_LOW_END: "MAX_COMPENSATION_LOW_END",
  MAX_COMPENSATION_HIGH_END: "MAX_COMPENSATION_HIGH_END",
  RESTRICT_JOBS_TO_TRANSPARENT_SALARIES:
    "RESTRICT_JOBS_TO_TRANSPARENT_SALARIES",
  INDUSTRIES: "INDUSTRIES",
  EXCLUDED_INDUSTRIES: "EXCLUDED_INDUSTRIES",
  COMPANY_KEYWORDS: "COMPANY_KEYWORDS",
  EXCLUDED_COMPANY_KEYWORDS: "EXCLUDED_COMPANY_KEYWORDS",
  DEPARTMENTS: "DEPARTMENTS",
  EXCLUDED_DEPARTMENTS: "EXCLUDED_DEPARTMENTS",
  JOB_DESCRIPTION_QUERY: "JOB_DESCRIPTION_QUERY",
  ROLE_YOE_RANGE: "ROLE_YOE_RANGE",
  EXCLUDE_IF_ROLE_YOE_IS_NOT_SPECIFIED: "EXCLUDE_IF_ROLE_YOE_IS_NOT_SPECIFIED",
  MANAGEMENT_YOE_RANGE: "MANAGEMENT_YOE_RANGE",
  EXCLUDE_IF_MANAGEMENT_YOE_IS_NOT_SPECIFIED:
    "EXCLUDE_IF_MANAGEMENT_YOE_IS_NOT_SPECIFIED",
  ASSOCIATES_DEGREE_FIELDS_OF_STUDY: "ASSOCIATES_DEGREE_FIELDS_OF_STUDY",
  EXCLUDED_ASSOCIATES_DEGREE_FIELDS_OF_STUDY:
    "EXCLUDED_ASSOCIATES_DEGREE_FIELDS_OF_STUDY",
  BACHELORS_DEGREE_FIELDS_OF_STUDY: "BACHELORS_DEGREE_FIELDS_OF_STUDY",
  EXCLUDED_BACHELORS_DEGREE_FIELDS_OF_STUDY:
    "EXCLUDED_BACHELORS_DEGREE_FIELDS_OF_STUDY",
  MASTERS_DEGREE_FIELDS_OF_STUDY: "MASTERS_DEGREE_FIELDS_OF_STUDY",
  EXCLUDED_MASTERS_DEGREE_FIELDS_OF_STUDY:
    "EXCLUDED_MASTERS_DEGREE_FIELDS_OF_STUDY",
  DOCTORATE_DEGREE_FIELDS_OF_STUDY: "DOCTORATE_DEGREE_FIELDS_OF_STUDY",
  EXCLUDED_DOCTORATE_DEGREE_FIELDS_OF_STUDY:
    "EXCLUDED_DOCTORATE_DEGREE_FIELDS_OF_STUDY",
  COMPANY_NAMES: "COMPANY_NAMES",
  EXCLUDED_COMPANY_NAMES: "EXCLUDED_COMPANY_NAMES",
  COMPANY_HQ_COUNTRIES: "COMPANY_HQ_COUNTRIES",
  EXCLUDED_COMPANY_HQ_COUNTRIES: "EXCLUDED_COMPANY_HQ_COUNTRIES",
  REMOVE_DEFAULT_TO_USER_LOCATION: "REMOVE_DEFAULT_TO_USER_LOCATION",
  ROLE_TYPES: "ROLE_TYPES",
  SENIORITY_LEVELS: "SENIORITY_LEVELS",
  RESTRICTED_SEARCH_ATTRIBUTES: "RESTRICTED_SEARCH_ATTRIBUTES",
  USAGOV_PREF: "USAGOV_PREF",
  CALC_FREQUENCY: "CALC_FREQUENCY",
  PHYSICAL_ENVIRONMENTS: "PHYSICAL_ENVIRONMENTS",
  PHYSICAL_LABOR_INTENSITY: "PHYSICAL_LABOR_INTENSITY",
  PHYSICAL_POSITIONS: "PHYSICAL_POSITIONS",
  ORAL_COMMUNICATION_LEVELS: "ORAL_COMMUNICATION_LEVELS",
  COMPUTER_USAGE_LEVELS: "COMPUTER_USAGE_LEVELS",
  COGNITIVE_DEMAND_LEVELS: "COGNITIVE_DEMAND_LEVELS",
  ASSOCIATES_DEGREE_REQUIREMENTS: "ASSOCIATES_DEGREE_REQUIREMENTS",
  BACHELORS_DEGREE_REQUIREMENTS: "BACHELORS_DEGREE_REQUIREMENTS",
  MASTERS_DEGREE_REQUIREMENTS: "MASTERS_DEGREE_REQUIREMENTS",
  DOCTORATE_DEGREE_REQUIREMENTS: "DOCTORATE_DEGREE_REQUIREMENTS",
  LICENSES_AND_CERTIFICATIONS: "LICENSES_AND_CERTIFICATIONS",
  EXCLUDED_LICENSES_AND_CERTIFICATIONS: "EXCLUDED_LICENSES_AND_CERTIFICATIONS",
  EXCLUDE_ALL_LICENSES_AND_CERTIFICATIONS:
    "EXCLUDE_ALL_LICENSES_AND_CERTIFICATIONS",
  SECURITY_CLEARANCES: "SECURITY_CLEARANCES",
  LANGUAGE_REQUIREMENTS: "LANGUAGE_REQUIREMENTS",
  EXCLUDED_LANGUAGE_REQUIREMENTS: "EXCLUDED_LANGUAGE_REQUIREMENTS",
  LANGUAGE_REQUIREMENTS_LOGICAL_OPERATOR:
    "LANGUAGE_REQUIREMENTS_LOGICAL_OPERATOR",
  EXCLUDE_JOBS_WITH_ADDITIONAL_LANGUAGE_REQUIREMENTS:
    "EXCLUDE_JOBS_WITH_ADDITIONAL_LANGUAGE_REQUIREMENTS",
  AIR_TRAVEL_REQUIREMENTS: "AIR_TRAVEL_REQUIREMENTS",
  LAND_TRAVEL_REQUIREMENTS: "LAND_TRAVEL_REQUIREMENTS",
  MORNING_SHIFT_WORK: "MORNING_SHIFT_WORK",
  EVENING_SHIFT_WORK: "EVENING_SHIFT_WORK",
  OVERNIGHT_SHIFT_WORK: "OVERNIGHT_SHIFT_WORK",
  WEEKEND_AVAILABILITY_REQUIRED: "WEEKEND_AVAILABILITY_REQUIRED",
  HOLIDAY_AVAILABILITY_REQUIRED: "HOLIDAY_AVAILABILITY_REQUIRED",
  OVERTIME_REQUIRED: "OVERTIME_REQUIRED",
  ON_CALL_REQUIREMENTS: "ON_CALL_REQUIREMENTS",
  BENEFITS_AND_PERKS: "BENEFITS_AND_PERKS",
  COMPANY_KEYWORDS_BOOLEAN_OPERATOR: "COMPANY_KEYWORDS_BOOLEAN_OPERATOR",
  ENCOURAGED_TO_APPLY: "ENCOURAGED_TO_APPLY",
  SORT_BY: "SORT_BY",
  RESET_COMPENSATION_TO_SIMPLE_MODE: "RESET_COMPENSATION_TO_SIMPLE_MODE",
  JOB_TITLE_QUERY: "JOB_TITLE_QUERY",
  TECHNOLOGY_KEYWORDS_QUERY: "TECHNOLOGY_KEYWORDS_QUERY",
  REQUIREMENTS_KEYWORDS_QUERY: "REQUIREMENTS_KEYWORDS_QUERY",
  COMPANY_PUBLIC_OR_PRIVATE: "COMPANY_PUBLIC_OR_PRIVATE",
  LATEST_INVESTMENT_YEAR_RANGE: "LATEST_INVESTMENT_YEAR_RANGE",
  LATEST_INVESTMENT_SERIES: "LATEST_INVESTMENT_SERIES",
  LATEST_INVESTMENT_AMOUNT: "LATEST_INVESTMENT_AMOUNT",
  LATEST_INVESTMENT_CURRENCY: "LATEST_INVESTMENT_CURRENCY",
  INVESTORS: "INVESTORS",
  EXCLUDED_INVESTORS: "EXCLUDED_INVESTORS",
  IS_NON_PROFIT: "IS_NON_PROFIT",
  ORGANIZATION_TYPES: "ORGANIZATION_TYPES",
  EXCLUDED_ORGANIZATION_TYPES: "EXCLUDED_ORGANIZATION_TYPES",
  COMPANY_SIZE_RANGES: "COMPANY_SIZE_RANGES",
  MIN_YEAR_FOUNDED: "MIN_YEAR_FOUNDED",
  MAX_YEAR_FOUNDED: "MAX_YEAR_FOUNDED",
  EXCLUDED_LATEST_INVESTMENT_SERIES: "EXCLUDED_LATEST_INVESTMENT_SERIES",
  ADD_LOCATION: "ADD_LOCATION",
  MODIFY_LOCATION: "MODIFY_LOCATION",
  REMOVE_LOCATION: "REMOVE_LOCATION",
  REMOVE_ALL_LOCATIONS: "REMOVE_ALL_LOCATIONS",
};

// List of update types considered company-related filters
const companyFilterTypes = [
  URLSearchStateUpdateType.COMPANY_NAMES,
  URLSearchStateUpdateType.EXCLUDED_COMPANY_NAMES,
  URLSearchStateUpdateType.COMPANY_HQ_COUNTRIES,
  URLSearchStateUpdateType.EXCLUDED_COMPANY_HQ_COUNTRIES,
  URLSearchStateUpdateType.INDUSTRIES,
  URLSearchStateUpdateType.EXCLUDED_INDUSTRIES,
  URLSearchStateUpdateType.COMPANY_KEYWORDS,
  URLSearchStateUpdateType.EXCLUDED_COMPANY_KEYWORDS,
  URLSearchStateUpdateType.COMPANY_SIZE_RANGES,
  URLSearchStateUpdateType.COMPANY_PUBLIC_OR_PRIVATE,
  URLSearchStateUpdateType.LATEST_INVESTMENT_YEAR_RANGE,
  URLSearchStateUpdateType.LATEST_INVESTMENT_SERIES,
  URLSearchStateUpdateType.LATEST_INVESTMENT_AMOUNT,
  URLSearchStateUpdateType.LATEST_INVESTMENT_CURRENCY,
  URLSearchStateUpdateType.INVESTORS,
  URLSearchStateUpdateType.EXCLUDED_INVESTORS,
  URLSearchStateUpdateType.IS_NON_PROFIT,
  URLSearchStateUpdateType.ORGANIZATION_TYPES,
  URLSearchStateUpdateType.EXCLUDED_ORGANIZATION_TYPES,
  URLSearchStateUpdateType.MIN_YEAR_FOUNDED,
  URLSearchStateUpdateType.MAX_YEAR_FOUNDED,
  URLSearchStateUpdateType.EXCLUDED_LATEST_INVESTMENT_SERIES,
];

export default function useURLSearchStateV4() {
  const router = useRouter();
  const { searchState: searchStateQuery, company } = router.query;
  const { state: currentSearchState } = useCurrentSearchFilters();
  const posthog = usePostHog();

  const searchState = useMemo(() => {
    try {
      return JSON.parse(searchStateQuery || "{}");
    } catch (e) {
      return {};
    }
  }, [searchStateQuery]);

  const updateSearchState = (updatedState) => {
    // Check if we're in SEO URL mode
    if (typeof window !== 'undefined' && window.__SEO_URL_MODE) {
      const fullSearchState = {
        ..._.pick(currentSearchState, saveSearchKeys),
        ...updatedState,
      };
      
      // Filter out default values to keep URLs clean
      const cleanedSearchState = filterDefaultValues(fullSearchState);
      
      window.__SEO_URL_MODE.onFilterChange(cleanedSearchState);
      return;
    }

    const query = {};

    if (company) {
      const {
        industries,
        excludedIndustries,
        companyKeywords,
        excludedCompanyKeywords,
        ...rest
      } = updatedState;
      updatedState = rest;
      query.company = company;
    }

    if (router.pathname !== "/") {
      query.searchState = JSON.stringify({
        ..._.pick(currentSearchState, saveSearchKeys),
        ...updatedState,
      });
    } else {
      if (Object.keys(updatedState).length > 0) {
        query.searchState = JSON.stringify(updatedState);
      }
    }

    if (company) {
      router.replace({ pathname: "/", query }, undefined, { shallow: true });
    } else {
      router.push({ pathname: "/", query }, undefined, { shallow: true });
    }
  };

  const update = ({ type, payload }) => {
    const newSearchState = { ...searchState };
    switch (type) {
      case URLSearchStateUpdateType.WORKPLACE_TYPES:
        if (
          payload?.length > 0 &&
          !workplaceTypeOptions.every((option) => payload.includes(option))
        ) {
          newSearchState.workplaceTypes = payload;
        } else {
          delete newSearchState.workplaceTypes;
        }
        break;
      case URLSearchStateUpdateType.PHYSICAL_ENVIRONMENTS:
        if (
          payload?.length > 0 &&
          !workplacePhysicalEnvironmentTypes.every((option) =>
            payload.includes(option)
          )
        ) {
          newSearchState.physicalEnvironments = payload;
        } else {
          delete newSearchState.physicalEnvironments;
        }
        break;
      case URLSearchStateUpdateType.PHYSICAL_LABOR_INTENSITY:
        if (
          payload?.length > 0 &&
          !physicalLaborIntensityTypes.every((option) =>
            payload.includes(option)
          )
        ) {
          newSearchState.physicalLaborIntensity = payload;
        } else {
          delete newSearchState.physicalLaborIntensity;
        }
        break;
      case URLSearchStateUpdateType.PHYSICAL_POSITIONS:
        if (
          payload?.length > 0 &&
          !physicalPositionTypes.every((option) => payload.includes(option))
        ) {
          newSearchState.physicalPositions = payload;
        } else {
          delete newSearchState.physicalPositions;
        }
        break;
      case URLSearchStateUpdateType.ORAL_COMMUNICATION_LEVELS:
        if (
          payload?.length > 0 &&
          !oralCommunicationLevelTypes.every((option) =>
            payload.includes(option)
          )
        ) {
          newSearchState.oralCommunicationLevels = payload;
        } else {
          delete newSearchState.oralCommunicationLevels;
        }
        break;
      case URLSearchStateUpdateType.COMPUTER_USAGE_LEVELS:
        if (
          payload?.length > 0 &&
          !computerUsageLevelTypes.every((option) => payload.includes(option))
        ) {
          newSearchState.computerUsageLevels = payload;
        } else {
          delete newSearchState.computerUsageLevels;
        }
        break;
      case URLSearchStateUpdateType.COGNITIVE_DEMAND_LEVELS:
        if (
          payload?.length > 0 &&
          !cognitiveDemandLevelTypes.every((option) => payload.includes(option))
        ) {
          newSearchState.cognitiveDemandLevels = payload;
        } else {
          delete newSearchState.cognitiveDemandLevels;
        }
        break;
      case URLSearchStateUpdateType.SEARCH_QUERY:
        if (payload) {
          newSearchState.searchQuery = payload;
        } else {
          delete newSearchState.searchQuery;
          delete newSearchState.restrictedSearchAttributes;
        }
        break;
      case URLSearchStateUpdateType.APPLICATION_FORM_EASE:
        if (payload.length > 0) {
          newSearchState.applicationFormEase = payload;
        } else {
          delete newSearchState.applicationFormEase;
        }
        break;
      case URLSearchStateUpdateType.COMMITMENT_TYPES:
        if (
          payload.length > 0 &&
          payload.length < commitmentTypeOptions.length
        ) {
          newSearchState.commitmentTypes = payload;
        } else {
          delete newSearchState.commitmentTypes;
        }
        break;
      case URLSearchStateUpdateType.DATE_FETCHED_PAST_N_DAYS:
        if (payload !== defaultDateFetchedPastNDays) {
          newSearchState.dateFetchedPastNDays = payload;
        } else {
          delete newSearchState.dateFetchedPastNDays;
        }
        break;
      case URLSearchStateUpdateType.HIDE_JOB_TYPES:
        if (payload.length > 0) {
          newSearchState.hideJobTypes = payload;
        } else {
          delete newSearchState.hideJobTypes;
        }
        break;
      case URLSearchStateUpdateType.COMP_CURRENCY:
        if (payload) {
          newSearchState.currency = payload;
        } else {
          delete newSearchState.currency;
        }
        break;
      case URLSearchStateUpdateType.COMP_FREQUENCY:
        if (payload.value) {
          newSearchState.frequency = payload;
        } else {
          delete newSearchState.frequency;
        }
        break;
      case URLSearchStateUpdateType.RESTRICT_JOBS_TO_TRANSPARENT_SALARIES:
        if (payload) {
          newSearchState.restrictJobsToTransparentSalaries = payload;
        } else {
          delete newSearchState.restrictJobsToTransparentSalaries;
        }
        break;
      case URLSearchStateUpdateType.INDUSTRIES:
        if (payload.length > 0) {
          newSearchState.industries = payload;
        } else {
          delete newSearchState.industries;
        }
        break;
      case URLSearchStateUpdateType.EXCLUDED_INDUSTRIES:
        if (payload.length > 0) {
          newSearchState.excludedIndustries = payload;
        } else {
          delete newSearchState.excludedIndustries;
        }
        break;
      case URLSearchStateUpdateType.COMPANY_KEYWORDS:
        if (payload.length > 0) {
          newSearchState.companyKeywords = payload;
        } else {
          delete newSearchState.companyKeywords;
          delete newSearchState.companyKeywordsBooleanOperator;
        }
        break;
      case URLSearchStateUpdateType.COMPANY_KEYWORDS_BOOLEAN_OPERATOR:
        if (payload === "AND" || payload === "OR") {
          newSearchState.companyKeywordsBooleanOperator = payload;
        } else {
          delete newSearchState.companyKeywordsBooleanOperator;
        }
        break;
      case URLSearchStateUpdateType.EXCLUDED_COMPANY_KEYWORDS:
        if (payload.length > 0) {
          newSearchState.excludedCompanyKeywords = payload;
        } else {
          delete newSearchState.excludedCompanyKeywords;
        }
        break;
      case URLSearchStateUpdateType.DEPARTMENTS:
        if (payload.length > 0) {
          newSearchState.departments = payload;
        } else {
          delete newSearchState.departments;
        }
        break;
      case URLSearchStateUpdateType.EXCLUDED_DEPARTMENTS:
        if (payload.length > 0) {
          newSearchState.excludedDepartments = payload;
        } else {
          delete newSearchState.excludedDepartments;
        }
        break;
      case URLSearchStateUpdateType.ROLE_YOE_RANGE:
        if (
          payload.length === 2 &&
          (payload[0] > 0 || payload[1] < maxYearsOfExperience)
        ) {
          newSearchState.roleYoeRange = payload;
        } else {
          delete newSearchState.roleYoeRange;
          delete newSearchState.excludeIfRoleYoeIsNotSpecified;
        }
        break;
      case URLSearchStateUpdateType.EXCLUDE_IF_ROLE_YOE_IS_NOT_SPECIFIED:
        if (payload) {
          newSearchState.excludeIfRoleYoeIsNotSpecified = payload;
        } else {
          delete newSearchState.excludeIfRoleYoeIsNotSpecified;
        }
        break;
      case URLSearchStateUpdateType.MANAGEMENT_YOE_RANGE:
        if (
          payload.length === 2 &&
          (payload[0] > 0 || payload[1] < maxYearsOfExperience)
        ) {
          newSearchState.managementYoeRange = payload;
        } else {
          delete newSearchState.managementYoeRange;
          delete newSearchState.excludeIfManagementYoeIsNotSpecified;
        }
        break;
      case URLSearchStateUpdateType.EXCLUDE_IF_MANAGEMENT_YOE_IS_NOT_SPECIFIED:
        if (payload) {
          newSearchState.excludeIfManagementYoeIsNotSpecified = payload;
        } else {
          delete newSearchState.excludeIfManagementYoeIsNotSpecified;
        }
        break;
      case URLSearchStateUpdateType.ASSOCIATES_DEGREE_FIELDS_OF_STUDY:
        if (payload.length > 0) {
          newSearchState.associatesDegreeFieldsOfStudy = payload;
        } else {
          delete newSearchState.associatesDegreeFieldsOfStudy;
        }
        break;
      case URLSearchStateUpdateType.EXCLUDED_ASSOCIATES_DEGREE_FIELDS_OF_STUDY:
        if (payload.length > 0) {
          newSearchState.excludedAssociatesDegreeFieldsOfStudy = payload;
        } else {
          delete newSearchState.excludedAssociatesDegreeFieldsOfStudy;
        }
        break;
      case URLSearchStateUpdateType.BACHELORS_DEGREE_FIELDS_OF_STUDY:
        if (payload.length > 0) {
          newSearchState.bachelorsDegreeFieldsOfStudy = payload;
        } else {
          delete newSearchState.bachelorsDegreeFieldsOfStudy;
        }
        break;
      case URLSearchStateUpdateType.EXCLUDED_BACHELORS_DEGREE_FIELDS_OF_STUDY:
        if (payload.length > 0) {
          newSearchState.excludedBachelorsDegreeFieldsOfStudy = payload;
        } else {
          delete newSearchState.excludedBachelorsDegreeFieldsOfStudy;
        }
        break;
      case URLSearchStateUpdateType.MASTERS_DEGREE_FIELDS_OF_STUDY:
        if (payload.length > 0) {
          newSearchState.mastersDegreeFieldsOfStudy = payload;
        } else {
          delete newSearchState.mastersDegreeFieldsOfStudy;
        }
        break;
      case URLSearchStateUpdateType.EXCLUDED_MASTERS_DEGREE_FIELDS_OF_STUDY:
        if (payload.length > 0) {
          newSearchState.excludedMastersDegreeFieldsOfStudy = payload;
        } else {
          delete newSearchState.excludedMastersDegreeFieldsOfStudy;
        }
        break;
      case URLSearchStateUpdateType.DOCTORATE_DEGREE_FIELDS_OF_STUDY:
        if (payload.length > 0) {
          newSearchState.doctorateDegreeFieldsOfStudy = payload;
        } else {
          delete newSearchState.doctorateDegreeFieldsOfStudy;
        }
        break;
      case URLSearchStateUpdateType.EXCLUDED_DOCTORATE_DEGREE_FIELDS_OF_STUDY:
        if (payload.length > 0) {
          newSearchState.excludedDoctorateDegreeFieldsOfStudy = payload;
        } else {
          delete newSearchState.excludedDoctorateDegreeFieldsOfStudy;
        }
        break;
      case URLSearchStateUpdateType.COMPANY_NAMES:
        if (payload.length > 0) {
          newSearchState.companyNames = payload;
        } else {
          delete newSearchState.companyNames;
        }
        break;
      case URLSearchStateUpdateType.EXCLUDED_COMPANY_NAMES:
        if (payload.length > 0) {
          newSearchState.excludedCompanyNames = payload;
        } else {
          delete newSearchState.excludedCompanyNames;
        }
        break;
      case URLSearchStateUpdateType.COMPANY_HQ_COUNTRIES:
        if (payload?.length > 0) {
          newSearchState.companyHqCountries = payload;
        } else {
          delete newSearchState.companyHqCountries;
        }
        break;
      case URLSearchStateUpdateType.EXCLUDED_COMPANY_HQ_COUNTRIES:
        if (payload?.length > 0) {
          newSearchState.excludedCompanyHqCountries = payload;
        } else {
          delete newSearchState.excludedCompanyHqCountries;
        }
        break;
      case URLSearchStateUpdateType.MIN_COMPENSATION_LOW_END:
        if (payload) {
          if (
            !newSearchState.minCompensationLowEnd &&
            !newSearchState.restrictJobsToTransparentSalaries
          ) {
            newSearchState.restrictJobsToTransparentSalaries = true;
          }
          newSearchState.minCompensationLowEnd = payload;
          if (
            !newSearchState.maxCompensationLowEnd ||
            newSearchState.maxCompensationLowEnd < payload
          ) {
            newSearchState.maxCompensationLowEnd = payload;
          }
          if (newSearchState.minCompensationHighEnd < payload) {
            delete newSearchState.minCompensationHighEnd;
          }
        } else {
          delete newSearchState.minCompensationLowEnd;
        }
        break;
      case URLSearchStateUpdateType.MIN_COMPENSATION_HIGH_END:
        if (payload) {
          if (
            !newSearchState.minCompensationHighEnd &&
            !newSearchState.restrictJobsToTransparentSalaries
          ) {
            newSearchState.restrictJobsToTransparentSalaries = true;
          }
          newSearchState.minCompensationHighEnd = Math.max(
            payload,
            newSearchState.minCompensationLowEnd
          );
        } else {
          delete newSearchState.minCompensationHighEnd;
        }
        break;
      case URLSearchStateUpdateType.MAX_COMPENSATION_LOW_END:
        if (payload) {
          if (
            !newSearchState.maxCompensationLowEnd &&
            !newSearchState.restrictJobsToTransparentSalaries
          ) {
            newSearchState.restrictJobsToTransparentSalaries = true;
          }
          newSearchState.maxCompensationLowEnd = payload;
        } else {
          delete newSearchState.maxCompensationLowEnd;
        }
        if (newSearchState.maxCompensationHighEnd < payload) {
          delete newSearchState.maxCompensationHighEnd;
        }
        if (newSearchState.minCompensationLowEnd > payload) {
          newSearchState.minCompensationLowEnd = payload;
        }
        break;
      case URLSearchStateUpdateType.MAX_COMPENSATION_HIGH_END:
        if (payload) {
          if (
            !newSearchState.maxCompensationHighEnd &&
            !newSearchState.restrictJobsToTransparentSalaries
          ) {
            newSearchState.restrictJobsToTransparentSalaries = true;
          }
          newSearchState.maxCompensationHighEnd = payload;
        } else {
          delete newSearchState.maxCompensationHighEnd;
        }
        break;
      case URLSearchStateUpdateType.REMOVE_DEFAULT_TO_USER_LOCATION:
        if (payload) {
          newSearchState.defaultToUserLocation = false;
        } else {
          delete newSearchState.defaultToUserLocation;
        }
        break;
      case URLSearchStateUpdateType.ROLE_TYPES:
        if (payload.length > 0 && payload.length < roleTypeOptions.length) {
          newSearchState.roleTypes = payload;
        } else {
          delete newSearchState.roleTypes;
        }
        if (payload.length === 1 && payload[0] === "Individual Contributor") {
          delete newSearchState.managementYoeRange;
          delete newSearchState.excludeIfManagementYoeIsNotSpecified;
        }
        break;
      case URLSearchStateUpdateType.RESTRICTED_SEARCH_ATTRIBUTES:
        if (payload.length > 0) {
          newSearchState.restrictedSearchAttributes = payload;
        } else {
          delete newSearchState.restrictedSearchAttributes;
        }
        break;
      case URLSearchStateUpdateType.USAGOV_PREF:
        if (payload) {
          newSearchState.usaGovPref = payload;
        } else {
          delete newSearchState.usaGovPref;
        }
        break;
      case URLSearchStateUpdateType.CALC_FREQUENCY:
        if (payload) {
          newSearchState.calcFrequency = payload;
        } else {
          delete newSearchState.calcFrequency;
        }
        break;
        break;
      case URLSearchStateUpdateType.ASSOCIATES_DEGREE_REQUIREMENTS:
        if (
          payload?.length > 0 &&
          payload.every((option) => educationRequirementTypes.includes(option))
        ) {
          newSearchState.associatesDegreeRequirements = payload;
        } else {
          delete newSearchState.associatesDegreeRequirements;
        }
        break;
      case URLSearchStateUpdateType.BACHELORS_DEGREE_REQUIREMENTS:
        if (
          payload?.length > 0 &&
          payload.every((option) => educationRequirementTypes.includes(option))
        ) {
          newSearchState.bachelorsDegreeRequirements = payload;
        } else {
          delete newSearchState.bachelorsDegreeRequirements;
        }
        break;
      case URLSearchStateUpdateType.MASTERS_DEGREE_REQUIREMENTS:
        if (
          payload?.length > 0 &&
          payload.every((option) => educationRequirementTypes.includes(option))
        ) {
          newSearchState.mastersDegreeRequirements = payload;
        } else {
          delete newSearchState.mastersDegreeRequirements;
        }
        break;
      case URLSearchStateUpdateType.DOCTORATE_DEGREE_REQUIREMENTS:
        if (
          payload?.length > 0 &&
          payload.every((option) => educationRequirementTypes.includes(option))
        ) {
          newSearchState.doctorateDegreeRequirements = payload;
        } else {
          delete newSearchState.doctorateDegreeRequirements;
        }
        break;
      case URLSearchStateUpdateType.LICENSES_AND_CERTIFICATIONS:
        if (payload.length > 0) {
          newSearchState.licensesAndCertifications = payload;
        } else {
          delete newSearchState.licensesAndCertifications;
        }
        break;
      case URLSearchStateUpdateType.EXCLUDED_LICENSES_AND_CERTIFICATIONS:
        if (payload.length > 0) {
          newSearchState.excludedLicensesAndCertifications = payload;
        } else {
          delete newSearchState.excludedLicensesAndCertifications;
        }
        break;
      case URLSearchStateUpdateType.EXCLUDE_ALL_LICENSES_AND_CERTIFICATIONS:
        if (payload) {
          newSearchState.excludeAllLicensesAndCertifications = payload;
          delete newSearchState.licensesAndCertifications;
          delete newSearchState.excludedLicensesAndCertifications;
        } else {
          delete newSearchState.excludeAllLicensesAndCertifications;
        }
        break;
      case URLSearchStateUpdateType.SENIORITY_LEVELS:
        if (
          payload.length > 0 &&
          !seniorityLevelTypes.every((option) => payload.includes(option))
        ) {
          newSearchState.seniorityLevel = payload;
        } else {
          delete newSearchState.seniorityLevel;
        }
        break;
      case URLSearchStateUpdateType.SECURITY_CLEARANCES:
        if (
          payload.length > 0 &&
          !securityClearanceTypes.every((option) => payload.includes(option))
        ) {
          newSearchState.securityClearances = payload;
        } else {
          delete newSearchState.securityClearances;
        }
        break;
      case URLSearchStateUpdateType.LANGUAGE_REQUIREMENTS:
        if (payload.length > 0) {
          newSearchState.languageRequirements = payload;
        } else {
          delete newSearchState.languageRequirements;
          delete newSearchState.languageRequirementsOperator;
          delete newSearchState.excludeJobsWithAdditionalLanguageRequirements;
        }
        break;
      case URLSearchStateUpdateType.EXCLUDED_LANGUAGE_REQUIREMENTS:
        if (payload.length > 0) {
          newSearchState.excludedLanguageRequirements = payload;
        } else {
          delete newSearchState.excludedLanguageRequirements;
        }
        break;
      case URLSearchStateUpdateType.LANGUAGE_REQUIREMENTS_LOGICAL_OPERATOR:
        if (payload) {
          newSearchState.languageRequirementsOperator = payload;
        } else {
          delete newSearchState.languageRequirementsOperator;
        }
        break;
      case URLSearchStateUpdateType.EXCLUDE_JOBS_WITH_ADDITIONAL_LANGUAGE_REQUIREMENTS:
        if (payload) {
          newSearchState.excludeJobsWithAdditionalLanguageRequirements =
            payload;
          delete newSearchState.excludedLanguageRequirements;
        } else {
          delete newSearchState.excludeJobsWithAdditionalLanguageRequirements;
        }
        break;
      case URLSearchStateUpdateType.AIR_TRAVEL_REQUIREMENTS:
        if (
          payload.length > 0 &&
          !TravelRequirementTypes.every((option) => payload.includes(option))
        ) {
          newSearchState.airTravelRequirement = payload;
        } else {
          delete newSearchState.airTravelRequirement;
        }
        break;
      case URLSearchStateUpdateType.LAND_TRAVEL_REQUIREMENTS:
        if (
          payload.length > 0 &&
          !TravelRequirementTypes.every((option) => payload.includes(option))
        ) {
          newSearchState.landTravelRequirement = payload;
        } else {
          delete newSearchState.landTravelRequirement;
        }
        break;
      case URLSearchStateUpdateType.MORNING_SHIFT_WORK:
        if (
          payload.length > 0 &&
          payload.every((option) => ShiftWorkRequirementTypes.includes(option))
        ) {
          newSearchState.morningShiftWork = payload;
        } else {
          delete newSearchState.morningShiftWork;
        }
        break;
      case URLSearchStateUpdateType.EVENING_SHIFT_WORK:
        if (
          payload.length > 0 &&
          payload.every((option) => ShiftWorkRequirementTypes.includes(option))
        ) {
          newSearchState.eveningShiftWork = payload;
        } else {
          delete newSearchState.eveningShiftWork;
        }
        break;
      case URLSearchStateUpdateType.OVERNIGHT_SHIFT_WORK:
        if (
          payload.length > 0 &&
          payload.every((option) => ShiftWorkRequirementTypes.includes(option))
        ) {
          newSearchState.overnightShiftWork = payload;
        } else {
          delete newSearchState.overnightShiftWork;
        }
        break;
      case URLSearchStateUpdateType.WEEKEND_AVAILABILITY_REQUIRED:
        if (payload !== "Doesn't Matter") {
          newSearchState.weekendAvailabilityRequired = payload;
        } else {
          delete newSearchState.weekendAvailabilityRequired;
        }
        break;
      case URLSearchStateUpdateType.HOLIDAY_AVAILABILITY_REQUIRED:
        if (payload !== "Doesn't Matter") {
          newSearchState.holidayAvailabilityRequired = payload;
        } else {
          delete newSearchState.holidayAvailabilityRequired;
        }
        break;
      case URLSearchStateUpdateType.OVERTIME_REQUIRED:
        if (payload !== "Doesn't Matter") {
          newSearchState.overtimeRequired = payload;
        } else {
          delete newSearchState.overtimeRequired;
        }
        break;
      case URLSearchStateUpdateType.ON_CALL_REQUIREMENTS:
        if (
          payload.length > 0 &&
          !OncallRequirementTypes.every((option) => payload.includes(option))
        ) {
          newSearchState.onCallRequirements = payload;
        } else {
          delete newSearchState.onCallRequirements;
        }
        break;
      case URLSearchStateUpdateType.BENEFITS_AND_PERKS:
        const validBenefits = Object.keys(ListOfBenefits).map(
          (b) => ListOfBenefits[b]
        );
        if (
          payload.length > 0 &&
          payload.every((b) => validBenefits.includes(b))
        ) {
          newSearchState.benefitsAndPerks = payload;
        } else {
          delete newSearchState.benefitsAndPerks;
        }
        break;
      case URLSearchStateUpdateType.ENCOURAGED_TO_APPLY:
        const validKeys = Object.keys(EncouragedToApplyGroupTypes).map(
          (b) => EncouragedToApplyGroupTypes[b]
        );
        if (payload.length > 0 && payload.every((b) => validKeys.includes(b))) {
          newSearchState.encouragedToApply = payload;
        } else {
          delete newSearchState.encouragedToApply;
        }
        break;
      case URLSearchStateUpdateType.SORT_BY:
        if (payload && payload?.toLowerCase() !== "default") {
          newSearchState.sortBy = payload;
        } else {
          delete newSearchState.sortBy;
        }
        break;
      case URLSearchStateUpdateType.RESET_COMPENSATION_TO_SIMPLE_MODE:
        const maxCompLowEnd = newSearchState.maxCompensationLowEnd;
        delete newSearchState.minCompensationLowEnd;
        delete newSearchState.minCompensationHighEnd;
        delete newSearchState.maxCompensationHighEnd;
        if (!maxCompLowEnd) {
          delete newSearchState.maxCompensationLowEnd;
          delete newSearchState.restrictJobsToTransparentSalaries;
        } else {
          newSearchState.maxCompensationLowEnd = maxCompLowEnd;
          newSearchState.restrictJobsToTransparentSalaries = true;
        }
        break;
      case URLSearchStateUpdateType.JOB_TITLE_QUERY:
        if (payload?.length > 0) {
          const normalizedPayload = replaceSmartQuotes(payload);
          newSearchState.jobTitleQuery = normalizedPayload;
        } else {
          delete newSearchState.jobTitleQuery;
        }
        break;
      case URLSearchStateUpdateType.TECHNOLOGY_KEYWORDS_QUERY:
        if (payload && payload.length > 0) {
          newSearchState.technologyKeywordsQuery = replaceSmartQuotes(payload);
        } else {
          delete newSearchState.technologyKeywordsQuery;
        }
        break;
      case URLSearchStateUpdateType.JOB_DESCRIPTION_QUERY:
        if (payload && payload.length > 0) {
          newSearchState.jobDescriptionQuery = replaceSmartQuotes(payload);
        } else {
          delete newSearchState.jobDescriptionQuery;
        }
        break;
      case URLSearchStateUpdateType.REQUIREMENTS_KEYWORDS_QUERY:
        if (payload && payload.length > 0) {
          newSearchState.requirementsKeywordsQuery =
            replaceSmartQuotes(payload);
        } else {
          delete newSearchState.requirementsKeywordsQuery;
        }
        break;
      case URLSearchStateUpdateType.COMPANY_PUBLIC_OR_PRIVATE:
        delete newSearchState.companyPublicOrPrivate;
        if (payload === "public") {
          newSearchState.organizationTypes = ["public"];
        } else if (payload === "private") {
          newSearchState.organizationTypes = ["private"];
        }
        break;
      case URLSearchStateUpdateType.LATEST_INVESTMENT_YEAR_RANGE:
        if (payload?.[0] == null && payload?.[1] == null) {
          delete newSearchState.latestInvestmentYearRange;
        } else {
          newSearchState.latestInvestmentYearRange = payload;
        }
        break;
      case URLSearchStateUpdateType.LATEST_INVESTMENT_SERIES:
        if (!payload) {
          delete newSearchState.latestInvestmentSeries;
        } else {
          newSearchState.latestInvestmentSeries = payload;
        }
        break;
      case URLSearchStateUpdateType.LATEST_INVESTMENT_AMOUNT:
        if (payload != null && payload !== "") {
          newSearchState.latestInvestmentAmount = Number(payload);
        } else {
          delete newSearchState.latestInvestmentAmount;
        }
        break;
      case URLSearchStateUpdateType.LATEST_INVESTMENT_CURRENCY:
        if (payload?.length > 0) {
          newSearchState.latestInvestmentCurrency = payload;
        } else {
          delete newSearchState.latestInvestmentCurrency;
        }
        break;
      case URLSearchStateUpdateType.INVESTORS:
        if (payload?.length > 0) {
          newSearchState.investors = payload;
        } else {
          delete newSearchState.investors;
        }
        break;
      case URLSearchStateUpdateType.EXCLUDED_INVESTORS:
        if (payload?.length > 0) {
          newSearchState.excludedInvestors = payload;
        } else {
          delete newSearchState.excludedInvestors;
        }
        break;
      case URLSearchStateUpdateType.IS_NON_PROFIT:
        delete newSearchState.isNonProfit;
        if (payload === "nonprofit") {
          newSearchState.organizationTypes = ["non-profit"];
        } else if (payload === "forprofit") {
          newSearchState.excludedOrganizationTypes = ["non-profit"];
        }
        break;
      case URLSearchStateUpdateType.ORGANIZATION_TYPES:
        if (payload?.length > 0) {
          newSearchState.organizationTypes = payload;
        } else {
          delete newSearchState.organizationTypes;
        }
        delete newSearchState.isNonProfit;
        delete newSearchState.companyPublicOrPrivate;
        break;
      case URLSearchStateUpdateType.EXCLUDED_ORGANIZATION_TYPES:
        if (payload?.length > 0) {
          newSearchState.excludedOrganizationTypes = payload;
        } else {
          delete newSearchState.excludedOrganizationTypes;
        }
        delete newSearchState.isNonProfit;
        delete newSearchState.companyPublicOrPrivate;
        break;
      case URLSearchStateUpdateType.COMPANY_SIZE_RANGES:
        if (payload && payload.length > 0) {
          newSearchState.companySizeRanges = payload;
        } else {
          delete newSearchState.companySizeRanges;
        }
        break;
      case URLSearchStateUpdateType.MIN_YEAR_FOUNDED:
        if (payload != null && payload !== "") {
          newSearchState.minYearFounded = parseInt(payload, 10);
        } else {
          delete newSearchState.minYearFounded;
        }
        break;
      case URLSearchStateUpdateType.MAX_YEAR_FOUNDED:
        if (payload != null && payload !== "") {
          newSearchState.maxYearFounded = parseInt(payload, 10);
        } else {
          delete newSearchState.maxYearFounded;
        }
        break;
      case URLSearchStateUpdateType.EXCLUDED_LATEST_INVESTMENT_SERIES:
        if (payload?.length > 0) {
          newSearchState.excludedLatestInvestmentSeries = payload;
        } else {
          delete newSearchState.excludedLatestInvestmentSeries;
        }
        break;
      case URLSearchStateUpdateType.ADD_LOCATION:
        if (payload) {
          newSearchState.locations = [
            ...(newSearchState.locations || []),
            payload,
          ];
          delete newSearchState.defaultToUserLocation;
        }
        delete newSearchState.workplaceTypes;
        break;
      case URLSearchStateUpdateType.MODIFY_LOCATION:
        if (payload) {
          newSearchState.locations = (
            newSearchState.locations ||
            currentSearchState.locations ||
            []
          ).map((location) =>
            location.id === payload.id ? payload : location
          );
        }
        delete newSearchState.workplaceTypes;
        break;
      case URLSearchStateUpdateType.REMOVE_LOCATION:
        if (payload) {
          newSearchState.locations = (newSearchState.locations || []).filter(
            (location) => location.id !== payload
          );
        }
        if (newSearchState.locations?.length === 0) {
          delete newSearchState.locations;
        }
        delete newSearchState.workplaceTypes;
        break;
      case URLSearchStateUpdateType.REMOVE_ALL_LOCATIONS:
        delete newSearchState.locations;
        newSearchState.defaultToUserLocation = false;
        delete newSearchState.workplaceTypes;
        break;
      default:
        break;
    }
    if (
      posthog &&
      companyFilterTypes.includes(type) &&
      payload != null &&
      (!Array.isArray(payload) || payload.length > 0)
    ) {
      posthog.capture("company_filter_used_v5", {
        filter_type: type,
        filter_value: payload,
      });
    }
    updateSearchState(newSearchState);
  };

  return {
    searchState,
    company,
    update,
  };
}
