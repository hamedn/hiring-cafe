import { frequencyOptions } from "@/utils/constants";
import { useCurrentSearchFilters } from "contexts/CurrentSearchFiltersContext";
import { CurrencyDollarIcon, ClockIcon } from "@heroicons/react/24/outline";
import useURLSearchStateV4, {
  URLSearchStateUpdateType,
} from "@/hooks/useURLSearchStateV4";
import CompRangeSelection from "./CompRangeSelection";
import RestrictToTransparent from "./RestrictToTransparent";
import ElasticSearchComponent from "../ElasticSearchComponent";

export default function SalarySelectionV4() {
  const { state: currentSearchState } = useCurrentSearchFilters();
  const { update } = useURLSearchStateV4();

  const handleCurrencyChange = (selectedOption) => {
    update({
      type: URLSearchStateUpdateType.COMP_CURRENCY,
      payload: selectedOption,
    });
  };

  const handleFrequencyChange = (frequency) => {
    update({
      type: URLSearchStateUpdateType.COMP_FREQUENCY,
      payload: frequency,
    });
  };

  return (
    <div className="bg-white rounded-2xl shadow-2xl px-4 pt-4 pb-16">
      {/* Restrict to Transparent Salaries */}
      <RestrictToTransparent />

      {/* Compensation Range Selection */}
      <div className="mt-4">
        <CompRangeSelection />
      </div>

      {/* Updated Frequency and Currency Selection */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-10">
        {/* Frequency Selection */}
        <div className="space-y-6">
          <div className="flex items-center space-x-2">
            <ClockIcon className="h-5 w-5 flex-none text-pink-500" />
            <span className="font-semibold text-gray-800">
              Listed Frequency
            </span>
          </div>
          <div className="flex flex-wrap gap-3">
            {frequencyOptions.map((freq, index) => (
              <button
                key={index}
                onClick={() => handleFrequencyChange(freq)}
                className={`px-2 py-1 text-sm rounded-full font-medium transition-colors ${
                  currentSearchState.frequency.value === freq.value
                    ? "bg-pink-500 text-white"
                    : "bg-gray-200 text-gray-800 hover:bg-pink-100"
                }`}
              >
                {freq.label}
              </button>
            ))}
          </div>
        </div>

        {/* Currency Selection */}
        <div className="space-y-6">
          <div className="flex items-center space-x-2">
            <CurrencyDollarIcon className="h-5 w-5 flex-none text-pink-500" />
            <span className="text-md font-semibold text-gray-800">
              Listed Currency
            </span>
          </div>
          <div className="w-full">
            <ElasticSearchComponent
              facetType={"listed_compensation_currency"}
              isMulti={false}
              selected={currentSearchState.currency}
              onSelected={handleCurrencyChange}
              className="border border-gray-300 rounded-full p-3 focus:ring-2 focus:ring-pink-500"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
