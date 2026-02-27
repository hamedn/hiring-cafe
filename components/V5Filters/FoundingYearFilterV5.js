import useURLSearchStateV4, {
  URLSearchStateUpdateType,
} from "@/hooks/useURLSearchStateV4";
import { useCurrentSearchFilters } from "@/contexts/CurrentSearchFiltersContext";
import { useEffect, useState } from "react";

export default function FoundingYearFilterV5() {
  const { state: currentState } = useCurrentSearchFilters();
  const { update } = useURLSearchStateV4();

  // We’ll track local changes so we only update the URL onBlur
  const [tempMinYear, setTempMinYear] = useState(
    currentState.minYearFounded || ""
  );
  const [tempMaxYear, setTempMaxYear] = useState(
    currentState.maxYearFounded || ""
  );

  useEffect(() => {
    setTempMinYear(currentState.minYearFounded || "");
  }, [currentState.minYearFounded]);

  useEffect(() => {
    setTempMaxYear(currentState.maxYearFounded || "");
  }, [currentState.maxYearFounded]);

  const handleBlurMin = () => {
    if (tempMinYear !== currentState.minYearFounded) {
      update({
        type: URLSearchStateUpdateType.MIN_YEAR_FOUNDED,
        payload: tempMinYear,
      });
    }
  };

  const handleBlurMax = () => {
    if (tempMaxYear !== currentState.maxYearFounded) {
      update({
        type: URLSearchStateUpdateType.MAX_YEAR_FOUNDED,
        payload: tempMaxYear,
      });
    }
  };

  return (
    <div className="p-4 space-y-6">
      <div className="flex flex-col space-y-2">
        <label className="font-bold text-sm">Enter Founding Year Range</label>
        <div className="flex space-x-2 items-center">
          {/* Min Year Founded */}
          <input
            type="number"
            placeholder="Min Year"
            className={`border p-2 rounded w-24 ${
              tempMinYear ? "border-green-600" : ""
            }`}
            value={tempMinYear}
            onChange={(e) => setTempMinYear(e.target.value)}
            onBlur={handleBlurMin}
          />
          <span className="text-gray-500">to</span>
          {/* Max Year Founded */}
          <input
            type="number"
            placeholder="Present"
            className={`border p-2 rounded w-24 ${
              tempMaxYear ? "border-green-600" : ""
            }`}
            value={tempMaxYear}
            onChange={(e) => setTempMaxYear(e.target.value)}
            onBlur={handleBlurMax}
          />
        </div>
      </div>
    </div>
  );
}
