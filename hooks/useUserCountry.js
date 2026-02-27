import axios from "axios";
import { useState, useEffect } from "react";
import { DEFAULT_LOCATION } from "@/utils/backend/countries";

export const useUserCountry = () => {
  const [userCountry, setUserCountry] = useState();
  const [latitude, setLatitude] = useState();
  const [longitude, setLongitude] = useState();
  const [city, setCity] = useState();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkCountry = async () => {
      await axios
        .get(`/api/getCountry`)
        .then((response) => {
          const { country, lat, lng, city } = response.data;
          setUserCountry(country || DEFAULT_LOCATION.country);
          setLatitude(lat || DEFAULT_LOCATION.lat);
          setLongitude(lng || DEFAULT_LOCATION.lng);
          setCity(city || DEFAULT_LOCATION.city);
        })
        .catch((error) => {
          console.log(error);
        })
        .finally(() => {
          setIsLoading(false);
        });
    };

    checkCountry();
  }, []);

  return {
    userCountry,
    latitude,
    longitude,
    city,
    isLoading,
  };
};
