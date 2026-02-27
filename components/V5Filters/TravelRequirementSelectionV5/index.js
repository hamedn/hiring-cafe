import TravelRequirementFilter from "./TravelRequirementFilter";

export const TravelRequirementMapping = {
  AIR: {
    field: "airTravelRequirement",
    title: "Air Travel Requirement",
    url: "AIR_TRAVEL_REQUIREMENTS",
  },
  LAND: {
    field: "landTravelRequirement",
    title: "Land Travel Requirement",
    url: "LAND_TRAVEL_REQUIREMENTS",
  },
};

export default function TravelRequirementSelectionV5() {
  return (
    <div className="flex flex-col space-y-4 p-4">
      {Object.keys(TravelRequirementMapping).map((type) => (
        <div key={type} className="flex flex-col space-y-2">
          <span className="text-sm font-bold">
            {TravelRequirementMapping[type].title}
          </span>
          <TravelRequirementFilter type={type} />
        </div>
      ))}
    </div>
  );
}
