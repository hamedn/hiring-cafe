import { Autocomplete, useLoadScript } from "@react-google-maps/api";
import { useState } from "react";

const libraries = ["places"];

function CityAutoComplete({ onCoordinatesChange }) {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
    libraries: libraries,
  });

  const [autocomplete, setAutocomplete] = useState(null);

  const handleLoad = (autoc) => {
    setAutocomplete(autoc);
  };

  const handlePlaceSelect = () => {
    if (autocomplete) {
      const place = autocomplete.getPlace();
      if (!place.geometry) {
        return;
      }
      const lat = place.geometry.location.lat();
      const lng = place.geometry.location.lng();
      // place.address_components is an array where one of the "types" arrays includes "country". Use this to determine the country.
      const country = place.address_components.find((component) =>
        component.types.includes("country")
      )?.short_name;

      onCoordinatesChange({
        lat,
        lng,
        country: country || "",
        formatted_address: place.formatted_address,
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
        Please contact Ali: ali@hiring.cafe`}
      </p>
    );
  }

  return (
    <Autocomplete
      onLoad={handleLoad}
      onPlaceChanged={handlePlaceSelect}
      types={["(cities)"]}
    >
      <input
        type="text"
        placeholder="Search city..."
        className="w-full p-2 border rounded my-2 outline-none z-50"
      />
    </Autocomplete>
  );
}

export default CityAutoComplete;
