import WorkplaceTypeSelectionV4 from "../WorkplaceTypeSelectionV4";
import { MapPinIcon } from "@heroicons/react/24/outline";
import WorkplacePhysicalEnvironmentV5 from "../WorkplacePhysicalEnvironmentV5";
import PhysicalLaborIntensityV5 from "../PhysicalLaborIntensityV5";
import PhysicalPositionsV5 from "../PhysicalPositionsV5";
import OralCommunicationLevelsV5 from "../OralCommunicationLevelsV5";
import ComputerUsageLevelsV5 from "../ComputerUsageLevelsV5";
import CognitiveDemandLevelsV5 from "../CognitiveDemandLevelsV5";
import MultiLocationSelector from "./MultiLocationSelector";

export default function LocationSelectionV4() {
  return (
    <div className="flex flex-col pb-16">
      <div className="flex flex-col space-y-4 mt-2">
        <div className="flex items-center space-x-1.5">
          <MapPinIcon className="h-6 w-6 flex-none" />
          <span className="text-xl font-bold">Locations</span>
        </div>
        <MultiLocationSelector />
      </div>
      <div className="flex flex-col mt-8 space-y-8 border-t pt-8">
        <WorkplaceTypeSelectionV4 />
        <PhysicalPositionsV5 />
        <WorkplacePhysicalEnvironmentV5 />
        <PhysicalLaborIntensityV5 />
        <CognitiveDemandLevelsV5 />
        <ComputerUsageLevelsV5 />
        <OralCommunicationLevelsV5 />
      </div>
    </div>
  );
}
