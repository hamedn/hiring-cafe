import { useUserCountry } from "@/hooks/useUserCountry";
import { createContext } from "react";

export const UserLocationContext = createContext(null);

const UserLocationProvider = ({ children }) => {
  const {
    userCountry,
    latitude,
    longitude,
    city,
    isLoading: isLoadingUserCountry,
  } = useUserCountry();

  return (
    <UserLocationContext.Provider
      value={{
        userCountry,
        isLoadingUserCountry,
        latitude,
        longitude,
        city,
      }}
    >
      {children}
    </UserLocationContext.Provider>
  );
};

export default UserLocationProvider;
