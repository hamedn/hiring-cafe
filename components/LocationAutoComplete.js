import { ISO_COUNTRIES } from "@/utils/backend/countries";
import { defaultJobSearchRadius } from "@/utils/constants";
import { MagnifyingGlassIcon, XMarkIcon } from "@heroicons/react/20/solid";
import { Autocomplete, useLoadScript } from "@react-google-maps/api";
import { UserLocationContext } from "contexts/UserLocationContext";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";

const libraries = ["places"];

function LocationAutoComplete({ bgColor = "white", textColor = "black" }) {
  const router = useRouter();

  const { location_formatted_address } = router.query;

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
    libraries: libraries,
  });

  const [autocomplete, setAutocomplete] = useState(null);
  const [inputValue, setInputValue] = useState("");
  const { userCountry } = useContext(UserLocationContext);

  const handleLoad = (autoc) => {
    setAutocomplete(autoc);
  };

  useEffect(() => {
    const { location_formatted_address } = router.query;
    setInputValue(
      location_formatted_address || ISO_COUNTRIES[userCountry || ""] || ""
    );
  }, [router, userCountry]);

  const handlePlaceSelect = () => {
    const constructLocQuery = (googlePlace) => {
      if (googlePlace) {
        const {
          address_components,
          geometry,
          types,
          adr_address,
          formatted_address,
        } = googlePlace;
        switch (types[0]) {
          case "continent":
            return {
              location_type: "continent",
              location_value: adr_address,
              location_formatted_address: adr_address,
            };
          case "country":
            return {
              location_type: "country",
              location_value: [address_components[0].short_name],
              location_formatted_address: formatted_address,
            };
          case "locality":
            const { lat, lng } = geometry.location;
            return {
              location_type: "city",
              location_value: `${lat()},${lng()},${defaultJobSearchRadius}`,
              location_formatted_address: formatted_address,
            };
          default:
            return null;
        }
      } else {
        return null;
      }
    };

    if (autocomplete) {
      const place = autocomplete.getPlace();
      const locQuery = constructLocQuery(place);
      let newQuery = { ...router.query, ...locQuery };
      if (!locQuery) {
        delete newQuery.location_type;
        delete newQuery.location_value;
        delete newQuery.location_formatted_address;
      }
      router.replace({
        query: newQuery,
      });
    }
  };

  if (!isLoaded) {
    return <p>Loading...</p>;
  }

  if (loadError) {
    return (
      <p>
        {`Well this is embarrassing. The site couldn't load Google Maps API.
        Please contact ali@hiring.cafe`}
      </p>
    );
  }

  return (
    <div
      className={`flex items-center space-x-2 rounded-xl my-2 z-50 bg-${bgColor} text-${textColor} text-sm`}
    >
      <MagnifyingGlassIcon className="h-5 w-5 flex-none ml-4" />
      <div className="w-full flex items-center">
        <div className="grow rounded-r-xl">
          <Autocomplete
            onLoad={handleLoad}
            onPlaceChanged={handlePlaceSelect}
            types={["country", "continent", "locality"]}
          >
            <input
              value={inputValue}
              type="text"
              placeholder="Search location..."
              className={`w-full py-4 outline-none focus:outline-none bg-${bgColor} text-${textColor}`}
              onChange={(e) => setInputValue(e.target.value)}
            />
          </Autocomplete>
        </div>
        {(location_formatted_address || inputValue) && (
          <button
            onClick={() => {
              const newQuery = { ...router.query };
              delete newQuery.location_type;
              delete newQuery.location_value;
              delete newQuery.location_formatted_address;
              router
                .replace({
                  query: newQuery,
                })
                .then(() => setInputValue(""));
            }}
            className="bg-gray-800 text-white p-1 shrink rounded-full mr-2"
          >
            <XMarkIcon className="h-4 w-4 flex-none" />
          </button>
        )}
      </div>
    </div>
  );
}

export default LocationAutoComplete;
