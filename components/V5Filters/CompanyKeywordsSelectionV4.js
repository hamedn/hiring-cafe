import { useCurrentSearchFilters } from "contexts/CurrentSearchFiltersContext";
import ElasticSearchComponent from "./ElasticSearchComponent";
import useURLSearchStateV4, {
  URLSearchStateUpdateType,
} from "@/hooks/useURLSearchStateV4";

const CompanyKeywordsSelectionV4 = () => {
  const { state: currentSearchState } = useCurrentSearchFilters();
  const { update } = useURLSearchStateV4();

  return (
    <div className="flex flex-col space-y-4">
      <div className="flex flex-col space-y-2">
        <div className="flex flex-col space-y-0">
          <div className="flex items-center space-x-1">
            <span className="text-sm font-bold">
              Company Activities & Keywords
            </span>
          </div>
        </div>
        {currentSearchState.companyKeywords?.length > 1 ? (
          <div className="flex items-center space-x-2 text-sm">
            <span className="font-medium text-xs">Operation:</span>
            <div className="flex items-center border rounded">
              {["OR", "AND"].map((op) => (
                <button
                  className={`px-3 rounded font-medium ${
                    op === currentSearchState.companyKeywordsBooleanOperator
                      ? "bg-green-600 text-white"
                      : "bg-white"
                  }`}
                  onClick={() => {
                    if (
                      op !== currentSearchState.companyKeywordsBooleanOperator
                    ) {
                      update({
                        type: URLSearchStateUpdateType.COMPANY_KEYWORDS_BOOLEAN_OPERATOR,
                        payload: op,
                      });
                    }
                  }}
                  key={op}
                >
                  {op}
                </button>
              ))}
            </div>
          </div>
        ) : null}
        <ElasticSearchComponent
          facetType={"company_activities"}
          isMulti
          isCreatable
          selected={currentSearchState.companyKeywords.map((keyword) => ({
            label: keyword,
            value: keyword,
          }))}
          onSelected={(keywords) => {
            update({
              type: URLSearchStateUpdateType.COMPANY_KEYWORDS,
              payload: keywords,
            });
          }}
        />
      </div>
      <div className="flex flex-col space-y-2 text-gray-500">
        <span className="text-sm font-bold">
          Exclude Company Industries & Keywords
        </span>
        <ElasticSearchComponent
          facetType={"company_activities"}
          isMulti
          isCreatable
          selected={currentSearchState.excludedCompanyKeywords.map(
            (keyword) => ({
              label: keyword,
              value: keyword,
            })
          )}
          onSelected={(keywords) => {
            update({
              type: URLSearchStateUpdateType.EXCLUDED_COMPANY_KEYWORDS,
              payload: keywords,
            });
          }}
        />
      </div>
    </div>
  );
};

export default CompanyKeywordsSelectionV4;
