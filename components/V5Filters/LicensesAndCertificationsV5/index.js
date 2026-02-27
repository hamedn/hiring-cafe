import useURLSearchStateV4, {
  URLSearchStateUpdateType,
} from "@/hooks/useURLSearchStateV4";
import { useCurrentSearchFilters } from "contexts/CurrentSearchFiltersContext";
import ElasticSearchComponent from "../ElasticSearchComponent";

const LicensesAndCertificationsV5 = () => {
  const { state: currentSearchState } = useCurrentSearchFilters();
  const { update } = useURLSearchStateV4();

  return (
    <div
      className={`shadow-md rounded-lg m-4 text-sm ${
        currentSearchState.licensesAndCertifications?.length > 0 ||
        currentSearchState.excludedLicensesAndCertifications?.length > 0 ||
        currentSearchState.excludeAllLicensesAndCertifications
          ? "border border-pink-600 bg-pink-50/30"
          : "border-2"
      }`}
    >
      <div className="flex flex-col space-y-8 p-4">
        <div className="flex flex-col space-y-2">
          <span className="font-bold">
            Hide jobs that require licenses or certifications?
          </span>
          <div className="flex space-x-4">
            <button
              onClick={() => {
                update({
                  type: URLSearchStateUpdateType.EXCLUDE_ALL_LICENSES_AND_CERTIFICATIONS,
                  payload: true,
                });
              }}
              className={`${
                currentSearchState.excludeAllLicensesAndCertifications
                  ? "bg-pink-600 text-white"
                  : "bg-white border border-black"
              } rounded py-1 px-2`}
            >
              Yes
            </button>
            <button
              onClick={() => {
                update({
                  type: URLSearchStateUpdateType.EXCLUDE_ALL_LICENSES_AND_CERTIFICATIONS,
                  payload: false,
                });
              }}
              className={`${
                currentSearchState.excludeAllLicensesAndCertifications
                  ? "bg-white border border-black"
                  : "bg-pink-600 text-white"
              } rounded py-1 px-2`}
            >
              No
            </button>
          </div>
        </div>
        {!currentSearchState.excludeAllLicensesAndCertifications && (
          <div className="flex flex-col space-y-4">
            <div className="flex flex-col space-y-2">
              <div className="flex flex-col space-y-0">
                <div className="flex items-center space-x-1">
                  <span className="font-bold">
                    Licenses & Certifications Keywords
                  </span>
                </div>
              </div>
              <ElasticSearchComponent
                facetType={"licenses_or_certifications"}
                isMulti
                isCreatable
                selected={(
                  currentSearchState.licensesAndCertifications || []
                ).map((option) => ({
                  label: option,
                  value: option,
                }))}
                onSelected={(options) => {
                  update({
                    type: URLSearchStateUpdateType.LICENSES_AND_CERTIFICATIONS,
                    payload: options,
                  });
                }}
              />
            </div>
            <div className="flex flex-col space-y-2 text-gray-500">
              <div className="flex flex-col space-y-1">
                <div className="flex items-center space-x-1">
                  <span className="font-bold">
                    Exclude Licenses & Certifications Keywords
                  </span>
                </div>
              </div>
              <ElasticSearchComponent
                facetType={"licenses_or_certifications"}
                isMulti
                isCreatable
                selected={(
                  currentSearchState.excludedLicensesAndCertifications || []
                ).map((option) => ({
                  label: option,
                  value: option,
                }))}
                onSelected={(options) => {
                  update({
                    type: URLSearchStateUpdateType.EXCLUDED_LICENSES_AND_CERTIFICATIONS,
                    payload: options,
                  });
                }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LicensesAndCertificationsV5;
