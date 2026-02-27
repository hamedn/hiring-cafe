import { URLSearchStateUpdateType } from "@/hooks/useURLSearchStateV4";
import ShiftRequirementInput from "./ShiftRequirementInput";

export const ShiftRequirementMapping = {
  MORNING: {
    title: "Morning / Day / First Shift",
    field: "morningShiftWork",
    url: URLSearchStateUpdateType.MORNING_SHIFT_WORK,
  },
  AFTERNOON: {
    title: "Afternoon / Evening / Second Shift",
    field: "eveningShiftWork",
    url: URLSearchStateUpdateType.EVENING_SHIFT_WORK,
  },
  OVERNIGHT: {
    title: "Overnight / Graveyard / Third Shift",
    field: "overnightShiftWork",
    url: URLSearchStateUpdateType.OVERNIGHT_SHIFT_WORK,
  },
};

export default function ShiftRequirements() {
  return (
    <div className="flex flex-col space-y-4">
      {Object.keys(ShiftRequirementMapping).map((type) => (
        <div className="flex flex-col space-y-2" key={type}>
          <span className="font-bold text-sm">
            {ShiftRequirementMapping[type].title}
          </span>
          <ShiftRequirementInput key={type} type={type} />
        </div>
      ))}
    </div>
  );
}
