import useURLSearchStateV4, {
  URLSearchStateUpdateType,
} from "@/hooks/useURLSearchStateV4";
import { frequencyOptions } from "@/utils/constants";
import { useCurrentSearchFilters } from "contexts/CurrentSearchFiltersContext";
import getSymbolFromCurrency from "currency-symbol-map";
import { useEffect, useState } from "react";

export default function CompensationInput({ type }) {
  const { state: currentSearchState } = useCurrentSearchFilters();
  const { update } = useURLSearchStateV4();

  const [minCompensationLowEnd, setMinCompensationLowEnd] = useState(null);
  const [minCompensationHighEnd, setMinCompensationHighEnd] = useState(null);
  const [maxCompensationLowEnd, setMaxCompensationLowEnd] = useState(null);
  const [maxCompensationHighEnd, setMaxCompensationHighEnd] = useState(null);

  useEffect(() => {
    setMinCompensationLowEnd(currentSearchState.minCompensationLowEnd);
    setMinCompensationHighEnd(currentSearchState.minCompensationHighEnd);
    setMaxCompensationLowEnd(currentSearchState.maxCompensationLowEnd);
    setMaxCompensationHighEnd(currentSearchState.maxCompensationHighEnd);
  }, [
    currentSearchState.minCompensationLowEnd,
    currentSearchState.minCompensationHighEnd,
    currentSearchState.maxCompensationLowEnd,
    currentSearchState.maxCompensationHighEnd,
  ]);

  return (
    <div className="flex flex-col space-y-4">
      {/* Input Fields */}
      {type === "simple" ? (
        // Simple Mode Input
        <div className="relative">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
            {(currentSearchState.currency?.value &&
              getSymbolFromCurrency(currentSearchState.currency.value)) ||
              "$"}
          </span>
          <input
            type="number"
            className="w-full pl-9 truncate rounded-lg border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-pink-500"
            placeholder="Enter amount"
            value={maxCompensationLowEnd || ""}
            onChange={(e) => {
              const cleanValue = e.target.value.replace(/[^0-9]/g, "");
              setMaxCompensationLowEnd(cleanValue);
            }}
            onBlur={() => {
              update({
                type: URLSearchStateUpdateType.MAX_COMPENSATION_LOW_END,
                payload: maxCompensationLowEnd,
              });
            }}
          />
        </div>
      ) : (
        // Advanced Mode Inputs
        <div className="flex items-center space-x-6">
          {/* Low End Input */}
          <div className="relative w-full">
            <span className="absolute inset-y-0 left-0 flex items-center pl-2 text-gray-500">
              {(currentSearchState.currency?.value &&
                getSymbolFromCurrency(currentSearchState.currency.value)) ||
                "$"}
            </span>
            <input
              type="number"
              className="w-full pl-9 truncate rounded-lg border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-pink-500"
              placeholder="No Min"
              value={
                type === "min"
                  ? minCompensationLowEnd || ""
                  : maxCompensationLowEnd || ""
              }
              onChange={(e) => {
                const cleanValue = e.target.value.replace(/[^0-9]/g, "");
                if (type === "min") {
                  setMinCompensationLowEnd(cleanValue);
                } else {
                  setMaxCompensationLowEnd(cleanValue);
                }
              }}
              onBlur={() => {
                update({
                  type:
                    type === "min"
                      ? URLSearchStateUpdateType.MIN_COMPENSATION_LOW_END
                      : URLSearchStateUpdateType.MAX_COMPENSATION_LOW_END,
                  payload:
                    type === "min"
                      ? minCompensationLowEnd
                      : maxCompensationLowEnd,
                });
              }}
            />
          </div>
          <span className="text-gray-500">-</span>
          {/* High End Input */}
          <div className="relative w-full">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
              {(currentSearchState.currency?.value &&
                getSymbolFromCurrency(currentSearchState.currency.value)) ||
                "$"}
            </span>
            <input
              type="number"
              className="w-full pl-9 truncate rounded-lg border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-pink-500"
              placeholder="No Max"
              value={
                type === "min"
                  ? minCompensationHighEnd || ""
                  : maxCompensationHighEnd || ""
              }
              onChange={(e) => {
                const cleanValue = e.target.value.replace(/[^0-9]/g, "");
                if (type === "min") {
                  setMinCompensationHighEnd(cleanValue);
                } else {
                  setMaxCompensationHighEnd(cleanValue);
                }
              }}
              onBlur={() => {
                update({
                  type:
                    type === "min"
                      ? URLSearchStateUpdateType.MIN_COMPENSATION_HIGH_END
                      : URLSearchStateUpdateType.MAX_COMPENSATION_HIGH_END,
                  payload:
                    type === "min"
                      ? minCompensationHighEnd
                      : maxCompensationHighEnd,
                });
              }}
            />
          </div>
        </div>
      )}

      {/* Compensation Frequency Dropdown */}
      <div className="relative w-full mt-6">
        <select
          className="block w-full bg-white border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-pink-500"
          value={currentSearchState.calcFrequency}
          onChange={(e) => {
            update({
              type: URLSearchStateUpdateType.CALC_FREQUENCY,
              payload: e.target.value,
            });
          }}
        >
          {frequencyOptions
            .filter((option) => !!option.value)
            .map((freq, index) => (
              <option key={index} value={freq.value}>
                {freq.label}
              </option>
            ))}
        </select>
      </div>
    </div>
  );
}
