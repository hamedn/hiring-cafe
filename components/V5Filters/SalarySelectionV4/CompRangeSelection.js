import getSymbolFromCurrency from "currency-symbol-map";
import CompensationInput from "./CompInput";
import { useMemo, useState, useEffect } from "react";
import { useCurrentSearchFilters } from "contexts/CurrentSearchFiltersContext";
import useURLSearchStateV4, {
  URLSearchStateUpdateType,
} from "hooks/useURLSearchStateV4";
import { AdjustmentsHorizontalIcon } from "@heroicons/react/24/outline";

export default function CompRangeSelection() {
  const { state: currentSearchState } = useCurrentSearchFilters();
  const { update } = useURLSearchStateV4();

  const [isAdvancedMode, setIsAdvancedMode] = useState(false);

  useEffect(() => {
    const hasAdvancedFields =
      currentSearchState.minCompensationLowEnd ||
      currentSearchState.minCompensationHighEnd ||
      currentSearchState.maxCompensationHighEnd;
    setIsAdvancedMode(hasAdvancedFields);
  }, [
    currentSearchState.minCompensationLowEnd,
    currentSearchState.minCompensationHighEnd,
    currentSearchState.maxCompensationHighEnd,
  ]);

  const handleModeToggle = () => {
    if (isAdvancedMode) {
      update({
        type: URLSearchStateUpdateType.RESET_COMPENSATION_TO_SIMPLE_MODE,
      });
    }
    setIsAdvancedMode(!isAdvancedMode);
  };

  const currencySymbol = useMemo(
    () =>
      (currentSearchState.currency?.value &&
        getSymbolFromCurrency(currentSearchState.currency.value)) ||
      "$",
    [currentSearchState.currency]
  );
  return (
    <div className="space-y-4">
      {/* Mode Toggle Button */}
      <div className="flex justify-end">
        <button
          onClick={handleModeToggle}
          className="flex items-center space-x-1 text-sm font-medium text-pink-600 hover:text-pink-700 transition duration-150"
        >
          <AdjustmentsHorizontalIcon className="h-5 w-5" />
          <span>{isAdvancedMode ? "Simple Mode" : "Advanced Mode"}</span>
        </button>
      </div>

      {/* Compensation Inputs */}
      {isAdvancedMode ? (
        <div className="space-y-8">
          {/* Minimum Compensation Section */}
          <div className="p-4 bg-white border border-gray-200 rounded-xl space-y-6">
            <h3 className="text-md font-semibold text-gray-900">
              Minimum Compensation
            </h3>
            <p className="text-sm text-gray-600">
              If a job offers {currencySymbol}X - {currencySymbol}Y, this
              controls the {currencySymbol}X part.
            </p>
            <CompensationInput type="min" />
            {(currentSearchState.minCompensationLowEnd ||
              currentSearchState.minCompensationHighEnd) && (
              <div className="text-sm bg-green-50 border border-green-200 text-green-700 p-3 rounded-md">
                The lower range of the compensation must be
                {currentSearchState.minCompensationLowEnd
                  ? ` at least ${Number(
                      currentSearchState.minCompensationLowEnd
                    ).toLocaleString()} `
                  : ""}
                {currentSearchState.minCompensationLowEnd > 0 &&
                  currentSearchState.minCompensationHighEnd > 0 &&
                  "and"}{" "}
                {currentSearchState.minCompensationHighEnd
                  ? `no more than ${Number(
                      currentSearchState.minCompensationHighEnd
                    ).toLocaleString()}`
                  : ""}{" "}
                ({currentSearchState.calcFrequency || "Yearly"})
              </div>
            )}
          </div>

          {/* Maximum Compensation Section */}
          <div className="p-4 bg-white border border-gray-200 rounded-xl space-y-6">
            <h3 className="text-md font-semibold text-gray-900">
              Maximum Compensation
            </h3>
            <p className="text-sm text-gray-600">
              If a job offers {currencySymbol}X - {currencySymbol}Y, this
              controls the {currencySymbol}Y part.
            </p>
            <CompensationInput type="max" />
            {(currentSearchState.maxCompensationLowEnd ||
              currentSearchState.maxCompensationHighEnd) && (
              <div className="text-sm bg-green-50 border border-green-200 text-green-700 p-3 rounded-md">
                The upper range of the compensation must be
                {currentSearchState.maxCompensationLowEnd
                  ? ` at least ${Number(
                      currentSearchState.maxCompensationLowEnd
                    ).toLocaleString()} `
                  : ""}
                {currentSearchState.maxCompensationLowEnd > 0 &&
                  currentSearchState.maxCompensationHighEnd > 0 &&
                  "and"}{" "}
                {currentSearchState.maxCompensationHighEnd
                  ? `no more than ${Number(
                      currentSearchState.maxCompensationHighEnd
                    ).toLocaleString()} `
                  : ""}
                ({currentSearchState.calcFrequency || "Yearly"})
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="p-4 bg-white border border-gray-200 rounded-xl space-y-2">
          <h3 className="text-md font-semibold text-gray-900">
            Desired Compensation
          </h3>
          <CompensationInput type="simple" />
        </div>
      )}
    </div>
  );
}
