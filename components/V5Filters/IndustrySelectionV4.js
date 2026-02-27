import useURLSearchStateV4, {
  URLSearchStateUpdateType,
} from "@/hooks/useURLSearchStateV4";
import ElasticSearchComponent from "./ElasticSearchComponent";
import { useCurrentSearchFilters } from "contexts/CurrentSearchFiltersContext";

const IndustrySelectionV4 = () => {
  const { state: currentSearchState } = useCurrentSearchFilters();
  const { update } = useURLSearchStateV4();
  return (
    <div className="flex flex-col space-y-4">
      <div className="flex flex-col space-y-2">
        <div className="flex flex-col space-y-1">
          <span className="text-sm font-bold">Company Industry</span>
          {currentSearchState.industries?.length > 0 &&
          !currentSearchState.companyKeywords?.length ? (
            <span className="text-xs bg-gray-100 font-light rounded w-fit p-1.5">
              💡 <span className="font-bold text-green-600">Pro tip:</span> You
              can further refine your search by adding keywords to{" "}
              <span className="font-bold">Company Industries & Keywords</span>{" "}
              above.
            </span>
          ) : null}
        </div>
        <ElasticSearchComponent
          facetType="company_sector_and_industry"
          isMulti
          isCreatable
          selected={currentSearchState.industries.map((industry) => ({
            label: industry,
            value: industry,
          }))}
          onSelected={(industries) => {
            update({
              type: URLSearchStateUpdateType.INDUSTRIES,
              payload: industries,
            });
          }}
        />
      </div>
      <div className="flex flex-col space-y-1">
        <span className="font-bold text-sm">Exclude Industries</span>
        <ElasticSearchComponent
          facetType="company_sector_and_industry"
          isMulti
          selected={currentSearchState.excludedIndustries.map((industry) => ({
            label: industry,
            value: industry,
          }))}
          onSelected={(industries) => {
            update({
              type: URLSearchStateUpdateType.EXCLUDED_INDUSTRIES,
              payload: industries,
            });
          }}
        />
      </div>
    </div>
  );
};

export default IndustrySelectionV4;
