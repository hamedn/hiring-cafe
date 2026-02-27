import { useRouter } from "next/router";
import LocationAutoComplete from "../LocationAutoComplete";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

export default function SelectLocation({ onClose }) {
  const router = useRouter();
  const {
    workplaceType,
    location_type,
    location_value,
    location_formatted_address,
  } = router.query;
  const radius = location_type === "city" ? location_value.split(",")[2] : null;

  return (
    <div className="flex flex-col">
      <div className="flex justify-center items-center space-x-8">
        {["Any", "Remote", "Onsite"].map((workplace) => (
          <button
            key={workplace}
            className={`font-medium ${
              (workplaceType || "Any") === workplace
                ? "underline underline-offset-8"
                : "text-gray-500"
            }`}
            onClick={() => {
              const newQuery = { ...router.query };
              if (workplace === "Any") {
                delete newQuery.workplaceType;
              } else {
                newQuery.workplaceType = workplace;
              }
              router.replace({
                query: newQuery,
              });
            }}
          >
            <span>{workplace}</span>
          </button>
        ))}
      </div>
      {workplaceType !== "Onsite" && location_type === "city" && (
        <div className="flex justify-center text-xs font-light mt-8">
          <div className="p-4 flex flex-col items-center space-y-2 rounded-xl bg-yellow-50 max-w-xs">
            <span>
              If you select a city, remote jobs that do not have a specific
              location specified may not be included in the search results.
            </span>
          </div>
        </div>
      )}
      <div className="mt-8">
        <LocationAutoComplete />
      </div>
      {location_type === "city" && (
        <div className="flex items-center space-x-4 mt-2 overflow-x-auto scrollbar-hide">
          {[
            {
              label: "Within 10 miles",
              value: 10,
            },
            {
              label: "Within 25 miles",
              value: 25,
            },
            {
              label: "Within 50 miles",
              value: 50,
            },
            {
              label: "Within 100 miles",
              value: 100,
            },
          ].map(({ label, value }) => (
            <button
              key={label}
              className={`font-medium text-sm border rounded-full p-2 bg-white flex-none ${
                radius === value.toString()
                  ? "border-black"
                  : "text-gray-500 hover:border-black"
              }`}
              onClick={() => {
                const newQuery = { ...router.query };
                newQuery.location_value = `${location_value.split(",")[0]},${
                  location_value.split(",")[1]
                },${value}`;

                router.replace({
                  query: newQuery,
                });
              }}
            >
              <span>{label}</span>
            </button>
          ))}
        </div>
      )}
      <div className="flex items-center space-x-2 justify-end border-t sticky bottom-0 mt-16 pt-4">
        {(workplaceType ||
          location_type ||
          location_value ||
          location_formatted_address) && (
          <button
            onClick={() => {
              const newQuery = {
                ...router.query,
              };
              delete newQuery.location_type;
              delete newQuery.location_value;
              delete newQuery.location_formatted_address;
              delete newQuery.workplaceType;
              router.replace({ query: newQuery });
              onClose();
            }}
            className="underline mr-8 font-medium"
          >
            Clear all
          </button>
        )}
        <button
          className="flex items-center space-x-2 bg-gray-900 text-white rounded-xl py-3 px-6 font-medium"
          onClick={() => onClose()}
        >
          <MagnifyingGlassIcon className="h-5 w-5 flex-none" />
          <span>Search</span>
        </button>
      </div>
    </div>
  );
}
