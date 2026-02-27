import useBrowseJobsSelectedCompany from "@/hooks/useBrowseJobsSelectedCompany";
import CompanyNameSelectionV4 from "./CompanyNameSelectionV4";
import CompanyHqCountrySelectionV5 from "./CompanyHqCountrySelectionV5";
import { useCurrentSearchFilters } from "contexts/CurrentSearchFiltersContext";

export default function CompanyFiltersV4() {
  const { company } = useBrowseJobsSelectedCompany();
  const { state: currentSearchState } = useCurrentSearchFilters();

  if (company) {
    return null;
  }

  return (
    <div className="flex flex-col space-y-8 p-4">
      <div
        className={`shadow-md rounded-lg p-4 ${
          currentSearchState.companyNames?.length > 0 ||
          currentSearchState.excludedCompanyNames?.length > 0
            ? "border border-pink-600 bg-pink-50/30"
            : "border-2"
        }`}
      >
        <CompanyNameSelectionV4 />
      </div>
      <div
        className={`shadow-md rounded-lg p-4 ${
          currentSearchState.companyHqCountries?.length > 0 ||
          currentSearchState.excludedCompanyHqCountries?.length > 0
            ? "border border-pink-600 bg-pink-50/30"
            : "border-2"
        }`}
      >
        <CompanyHqCountrySelectionV5 />
      </div>
    </div>
  );
}
