import { useEffect, useState } from "react";
import useURLSearchStateV4, {
  URLSearchStateUpdateType,
} from "@/hooks/useURLSearchStateV4";
import { useCurrentSearchFilters } from "@/contexts/CurrentSearchFiltersContext";
import ElasticSearchComponent from "./ElasticSearchComponent";

export default function StageAndFundingSelectionV5() {
  const { state: currentState } = useCurrentSearchFilters();
  const { update } = useURLSearchStateV4();

  const [tempYearRange, setTempYearRange] = useState(
    currentState.latestInvestmentYearRange || [null, null]
  );
  const [tempInvestmentAmount, setTempInvestmentAmount] = useState(
    currentState.latestInvestmentAmount || ""
  );

  useEffect(() => {
    setTempYearRange(currentState.latestInvestmentYearRange || [null, null]);
  }, [currentState.latestInvestmentYearRange]);

  useEffect(() => {
    setTempInvestmentAmount(currentState.latestInvestmentAmount || "");
  }, [currentState.latestInvestmentAmount]);

  return (
    <div className="p-4 space-y-6">
      <div
        className={`flex flex-col space-y-4 shadow-md rounded-lg p-4 ${
          currentState.investors?.length > 0 ||
          currentState.excludedInvestors?.length > 0
            ? "border border-pink-600 bg-pink-50/30"
            : "border-2"
        }`}
      >
        {/* Investors */}
        <div className="flex flex-col space-y-2">
          <label className="font-bold text-sm">Investors</label>
          <ElasticSearchComponent
            facetType={"investors"}
            isMulti
            isCreatable
            selected={currentState.investors.map((keyword) => ({
              label: keyword,
              value: keyword,
            }))}
            onSelected={(keywords) => {
              update({
                type: URLSearchStateUpdateType.INVESTORS,
                payload: keywords,
              });
            }}
          />
        </div>

        {/* Exclude Investors */}
        <div className="flex flex-col space-y-1">
          <span className="font-bold text-sm">Exclude Investors</span>
          <ElasticSearchComponent
            facetType="investors"
            isMulti
            isCreatable
            selected={
              currentState.excludedInvestors?.map((keyword) => ({
                label: keyword,
                value: keyword,
              })) || []
            }
            onSelected={(keywords) => {
              update({
                type: URLSearchStateUpdateType.EXCLUDED_INVESTORS,
                payload: keywords,
              });
            }}
          />
        </div>
      </div>

      <div
        className={`flex flex-col space-y-4 shadow-md rounded-lg p-4 ${
          currentState.latestInvestmentSeries?.length > 0 ||
          currentState.excludedLatestInvestmentSeries?.length > 0
            ? "border border-pink-600 bg-pink-50/30"
            : "border-2"
        }`}
      >
        {/* Latest Investment Series */}
        <div className="flex flex-col space-y-2">
          <label className="font-bold text-sm">Latest Round</label>
          <ElasticSearchComponent
            facetType={"latest_investment_series"}
            isMulti
            isCreatable
            selected={currentState.latestInvestmentSeries.map((keyword) => ({
              label: keyword,
              value: keyword,
            }))}
            onSelected={(keywords) => {
              update({
                type: URLSearchStateUpdateType.LATEST_INVESTMENT_SERIES,
                payload: keywords,
              });
            }}
          />
        </div>

        {/* Exclude Latest Round */}
        <div className="flex flex-col space-y-1">
          <span className="font-bold text-sm">Exclude Latest Round</span>
          <ElasticSearchComponent
            facetType="latest_investment_series"
            isMulti
            isCreatable
            selected={currentState.excludedLatestInvestmentSeries.map(
              (keyword) => ({
                label: keyword,
                value: keyword,
              })
            )}
            onSelected={(keywords) => {
              update({
                type: URLSearchStateUpdateType.EXCLUDED_LATEST_INVESTMENT_SERIES,
                payload: keywords,
              });
            }}
          />
        </div>
      </div>

      {/* Latest Round Year Range */}
      <div className="flex flex-col space-y-2">
        <label className="font-bold text-sm">Raised In Or After</label>
        <div className="flex items-center space-x-2">
          <input
            type="number"
            placeholder="Year"
            value={tempYearRange[0] || ""}
            onChange={(e) => {
              const newMin = e.target.value ? Number(e.target.value) : null;
              setTempYearRange([newMin, tempYearRange[1]]);
            }}
            onBlur={() => {
              if (
                tempYearRange?.[0] !==
                currentState.latestInvestmentYearRange?.[0]
              ) {
                update({
                  type: URLSearchStateUpdateType.LATEST_INVESTMENT_YEAR_RANGE,
                  payload: tempYearRange,
                });
              }
            }}
            className={`border p-2 rounded w-24 ${
              !!tempYearRange?.[0] ? "border-green-600" : ""
            }`}
          />
        </div>
      </div>

      {/* Latest Investment Amount & Currency */}
      <div className="flex flex-col space-y-4">
        <label className="font-bold text-sm">Latest Round Amount Raised</label>
        <div className="flex items-center space-x-2">
          <input
            type="number"
            placeholder="$"
            value={tempInvestmentAmount}
            onChange={(e) => {
              setTempInvestmentAmount(e.target.value);
            }}
            onBlur={() => {
              if (
                tempInvestmentAmount !== currentState.latestInvestmentAmount
              ) {
                update({
                  type: URLSearchStateUpdateType.LATEST_INVESTMENT_AMOUNT,
                  payload: tempInvestmentAmount,
                });
              }
            }}
            className={`border border-gray-400 p-2 rounded w-full outline-none ${
              !!tempInvestmentAmount ? "border-green-600" : ""
            }`}
          />
        </div>
      </div>
    </div>
  );
}
