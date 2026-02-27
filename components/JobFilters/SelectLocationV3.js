import { useRouter } from "next/router";
import LocationAutoComplete from "../LocationAutoComplete";

export default function SelectLocation() {
  const router = useRouter();
  const { workplaceType, location_type, location_value } = router.query;
  const radius = location_type === "city" ? location_value.split(",")[2] : null;

  return (
    <div className="flex flex-col divide-y">
      <div className="flex flex-col space-y-4 pb-8">
        <span className="text-lg md:text-xl font-medium">Workplace Type</span>
        {workplaceType && (
          <span className="bg-gray-100 w-fit p-2 rounded text-sm font-light text-gray-600">
            {`Promoted jobs default to nearby locations, regardless of this filter.`}
          </span>
        )}
        {["Any", "Remote", "Onsite"].map((workplace) => (
          <div className="flex items-center" key={workplace}>
            <input
              id={workplace}
              type="radio"
              checked={
                workplaceType === workplace ||
                (!workplaceType && workplace === "Any")
              }
              value={workplace}
              name="default-radio"
              className="focus:outline-none accent-gray-600"
              onChange={(e) => {
                const newWorkplaceType = e.target.value;
                const newQuery = { ...router.query };
                if (newWorkplaceType === "Any") {
                  delete newQuery.workplaceType;
                } else {
                  newQuery.workplaceType = newWorkplaceType;
                }
                router.replace({
                  query: newQuery,
                });
              }}
            />
            <label htmlFor={workplace} className="ms-2 text-gray-900">
              {workplace}
            </label>
          </div>
        ))}
      </div>
      <div className="flex flex-col py-4">
        {workplaceType !== "Onsite" && location_type === "city" && (
          <div className="flex justify-center text-xs font-light">
            <div className="p-2 rounded-xl bg-yellow-50">
              Remote jobs that do not have a city specified will be excluded.
            </div>
          </div>
        )}
        <div className="flex flex-col space-y-4 mt-2 md:mt-0">
          <span className="text-lg md:text-xl font-medium">Location</span>
          <div className="flex flex-col space-y-2">
            <span className="text-sm mb-2">
              Defaults to your country if location is not specified. Promoted
              jobs default to nearby locations and are not affected by this
              filter.
            </span>
            <LocationAutoComplete bgColor="gray-100" textColor="black" />
          </div>
        </div>
        {location_type === "city" && (
          <div className="grid grid-cols-2 gap-4 mt-4 mb-16">
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
                className={`font-medium text-sm border rounded-full p-2 flex-none ${
                  radius === value.toString()
                    ? "bg-gray-500 text-white shadow-inner shadow-gray-600"
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
      </div>
    </div>
  );
}
