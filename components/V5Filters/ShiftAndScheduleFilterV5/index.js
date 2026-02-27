import AdditionalAvailability from "./AdditionalAvailability";
import OncallRequirements from "./OncallRequirements";
import ShiftRequirements from "./ShiftRequirements";

export default function ShiftAndScheduleFilterV5() {
  return (
    <div className="flex flex-col space-y-8 p-4 pb-16">
      <ShiftRequirements />
      <AdditionalAvailability />
      <OncallRequirements />
    </div>
  );
}
