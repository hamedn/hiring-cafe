import LocationSearchSelect from "@/components/LocationSearchSelect";
import { SearchableRegionDropdown } from "@/components/SearchableRegionDropdown";
import { GlobeAltIcon } from "@heroicons/react/24/outline";

export default function LocationFilter({ location, setLocation }) {
  return (
    <div className="flex flex-col space-y-4">
      <div className="flex space-x-8 justify-center items-center">
        {["Countries", "City", "Anywhere"].map((type) => {
          return (
            <button
              key={type}
              className={`py-1 font-medium ${
                type === location.type
                  ? "text-black border-black border-b-2"
                  : "bg-white text-accent-slate-600 text-gray-600"
              }`}
              onClick={() => {
                setLocation({
                  ...location,
                  type,
                  name: type === "Anywhere" ? "Worldwide" : location.name,
                  value: type === "Anywhere" ? "" : location.value,
                });
              }}
            >
              {type}
            </button>
          );
        })}
      </div>
      <div className="flex flex-col space-y-4">
        {location.type === "Countries" ? (
          <SearchableRegionDropdown
            selectedRegionDropdown={
              Array.isArray(location.value) ? location.value : []
            }
            setSelectedRegionDropdown={(selectedPlaces) => {
              if (selectedPlaces.length === 0) {
                setLocation({
                  ...location,
                  name: "Worldwide",
                  type: "Countries",
                  value: "",
                });
                return;
              } else {
                setLocation({
                  ...location,
                  name:
                    selectedPlaces.length > 1
                      ? "Multiple Places"
                      : selectedPlaces[0].label,
                  type: "Countries",
                  value: selectedPlaces,
                });
              }
            }}
            onCountriesChange={() => {}}
          />
        ) : location.type === "City" ? (
          <div className="flex flex-col">
            <LocationSearchSelect
              onChange={({ lat, lng, formatted_address }) => {
                setLocation({
                  ...location,
                  name: `Around ${formatted_address}`,
                  type: "City",
                  value: `${lat}, ${lng}`,
                });
              }}
              placeholder="Search city..."
            />
          </div>
        ) : (
          <div className="flex items-center space-x-2 pb-2">
            <GlobeAltIcon className="h-5 w-5 text-accent-slate-600 flex-none" />
            <span className="text-lg font-medium">Anywhere in the world</span>
          </div>
        )}
        {location.type === "Countries" && (
          <div className="flex items-center space-x-2">
            <input
              id="open-to-work"
              type="checkbox"
              checked={location.includeCandidatesWillingToWork}
              className="appearance-none flex-none border border-gray-300 rounded-md p-2 checked:bg-slate-600 focus:outline-none"
              onChange={(e) => {
                setLocation({
                  ...location,
                  includeCandidatesWillingToWork: e.target.checked,
                });
              }}
            />
            <label htmlFor="open-to-work" className="font-medium text-sm">
              Include candidates who are open to work in this area even if they
              are not currently located here.
            </label>
          </div>
        )}
      </div>
    </div>
  );
}
