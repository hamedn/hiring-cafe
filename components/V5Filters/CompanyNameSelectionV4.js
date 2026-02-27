import useURLSearchStateV4, {
  URLSearchStateUpdateType,
} from "@/hooks/useURLSearchStateV4";
import ElasticSearchComponent from "./ElasticSearchComponent";
import { useCurrentSearchFilters } from "contexts/CurrentSearchFiltersContext";

const CompanyNameSelectionV4 = () => {
  const { state: currentSearchState } = useCurrentSearchFilters();
  const { update } = useURLSearchStateV4();
  return (
    <div className="flex flex-col space-y-4">
      <div className="flex flex-col space-y-2">
        <div className="flex flex-col space-y-1">
          <span className="text-sm font-bold">Company Name </span>
        </div>
        <ElasticSearchComponent
          isCreatable
          facetType="company_name"
          isMulti
          selected={currentSearchState.companyNames.map((companyName) => ({
            label: companyName,
            value: companyName,
          }))}
          onSelected={(companyNames) => {
            update({
              type: URLSearchStateUpdateType.COMPANY_NAMES,
              payload: companyNames,
            });
          }}
        />
      </div>
      <div className="flex flex-col space-y-1">
        <span className="text-sm font-bold">Exclude Company Names</span>
        <ElasticSearchComponent
          isCreatable
          facetType="company_name"
          isMulti
          selected={currentSearchState.excludedCompanyNames.map(
            (companyName) => ({
              label: companyName,
              value: companyName,
            })
          )}
          onSelected={(companyNames) => {
            update({
              type: URLSearchStateUpdateType.EXCLUDED_COMPANY_NAMES,
              payload: companyNames,
            });
          }}
        />
      </div>
    </div>
  );
};

export default CompanyNameSelectionV4;
