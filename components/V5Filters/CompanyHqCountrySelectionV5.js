import useURLSearchStateV4, {
  URLSearchStateUpdateType,
} from "@/hooks/useURLSearchStateV4";
import ElasticSearchComponent from "./ElasticSearchComponent";
import { useCurrentSearchFilters } from "contexts/CurrentSearchFiltersContext";

const regionNames = new Intl.DisplayNames(["en"], { type: "region" });

function countryCodeToLabel(code) {
  try {
    const upper = code.toUpperCase();
    const name = regionNames.of(upper);
    return name || code;
  } catch {
    return code;
  }
}

const CompanyHqCountrySelectionV5 = () => {
  const { state: currentSearchState } = useCurrentSearchFilters();
  const { update } = useURLSearchStateV4();
  return (
    <div className="flex flex-col space-y-4">
      <div className="flex flex-col space-y-2">
        <div className="flex flex-col space-y-1">
          <span className="text-sm font-bold">Company HQ Country</span>
        </div>
        <ElasticSearchComponent
          facetType="company_hq_country"
          isMulti
          isCreatable
          formatLabel={countryCodeToLabel}
          selected={(currentSearchState.companyHqCountries || []).map((c) => ({
            label: countryCodeToLabel(c),
            value: c,
          }))}
          onSelected={(countries) => {
            update({
              type: URLSearchStateUpdateType.COMPANY_HQ_COUNTRIES,
              payload: countries,
            });
          }}
        />
      </div>
      <div className="flex flex-col space-y-1">
        <span className="font-bold text-sm">Exclude HQ Countries</span>
        <ElasticSearchComponent
          facetType="company_hq_country"
          isMulti
          isCreatable
          formatLabel={countryCodeToLabel}
          selected={(currentSearchState.excludedCompanyHqCountries || []).map(
            (c) => ({
              label: countryCodeToLabel(c),
              value: c,
            })
          )}
          onSelected={(countries) => {
            update({
              type: URLSearchStateUpdateType.EXCLUDED_COMPANY_HQ_COUNTRIES,
              payload: countries,
            });
          }}
        />
      </div>
    </div>
  );
};

export default CompanyHqCountrySelectionV5;
