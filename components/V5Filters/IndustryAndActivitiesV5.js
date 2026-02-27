import useBrowseJobsSelectedCompany from "@/hooks/useBrowseJobsSelectedCompany";
import USAGovJobsFilterSelectionV4 from "./USAGovJobsFilterSelectionV4";
import { useCurrentSearchFilters } from "contexts/CurrentSearchFiltersContext";
import IndustrySelectionV4 from "./IndustrySelectionV4";
import CompanyKeywordsSelectionV4 from "./CompanyKeywordsSelectionV4";
import OrganizationTypeSelectionV5 from "./OrganizationTypeSelectionV5";

export default function IndustryAndActivitiesV5() {
  const { company } = useBrowseJobsSelectedCompany();
  const { state: currentSearchState } = useCurrentSearchFilters();

  if (company) {
    return null;
  }

  return (
    <div className="flex flex-col space-y-8 p-4">
      <div
        className={`shadow-md rounded-lg p-4 ${
          currentSearchState.organizationTypes?.length > 0 ||
          currentSearchState.excludedOrganizationTypes?.length > 0
            ? "border border-pink-600 bg-pink-50/30"
            : "border-2"
        }`}
      >
        <OrganizationTypeSelectionV5 />
      </div>
      <div
        className={`shadow-md rounded-lg p-4 ${
          currentSearchState.industries?.length > 0 ||
          currentSearchState.excludedIndustries?.length > 0
            ? "border border-pink-600 bg-pink-50/30"
            : "border-2"
        }`}
      >
        <IndustrySelectionV4 />
      </div>
      <div
        className={`shadow-md rounded-lg p-4 ${
          currentSearchState.companyKeywords?.length > 0 ||
          currentSearchState.excludedCompanyKeywords?.length > 0
            ? "border border-pink-600 bg-pink-50/30"
            : "border-2"
        }`}
      >
        <CompanyKeywordsSelectionV4 />
      </div>
      <div
        className={`shadow-md rounded-lg p-4 ${
          currentSearchState.usaGovPref
            ? "border border-pink-600 bg-pink-50/30"
            : "border-2"
        }`}
      >
        <USAGovJobsFilterSelectionV4 />
      </div>
    </div>
  );
}
