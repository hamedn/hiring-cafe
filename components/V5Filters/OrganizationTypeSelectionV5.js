import useURLSearchStateV4, {
  URLSearchStateUpdateType,
} from "@/hooks/useURLSearchStateV4";
import ElasticSearchComponent from "./ElasticSearchComponent";
import { useCurrentSearchFilters } from "contexts/CurrentSearchFiltersContext";

const OrganizationTypeSelectionV5 = () => {
  const { state: currentSearchState } = useCurrentSearchFilters();
  const { update } = useURLSearchStateV4();
  return (
    <div className="flex flex-col space-y-4">
      <div className="flex flex-col space-y-2">
        <div className="flex flex-col space-y-1">
          <span className="text-sm font-bold">Organization Type</span>
        </div>
        <ElasticSearchComponent
          facetType="organization_type"
          isMulti
          selected={(currentSearchState.organizationTypes || []).map((t) => ({
            label: t,
            value: t,
          }))}
          onSelected={(types) => {
            update({
              type: URLSearchStateUpdateType.ORGANIZATION_TYPES,
              payload: types,
            });
          }}
        />
      </div>
      <div className="flex flex-col space-y-1">
        <span className="font-bold text-sm">Exclude Organization Types</span>
        <ElasticSearchComponent
          facetType="organization_type"
          isMulti
          selected={(currentSearchState.excludedOrganizationTypes || []).map(
            (t) => ({
              label: t,
              value: t,
            })
          )}
          onSelected={(types) => {
            update({
              type: URLSearchStateUpdateType.EXCLUDED_ORGANIZATION_TYPES,
              payload: types,
            });
          }}
        />
      </div>
    </div>
  );
};

export default OrganizationTypeSelectionV5;
