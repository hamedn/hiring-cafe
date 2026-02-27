import useBrowseJobsSelectedCompany from "@/hooks/useBrowseJobsSelectedCompany";
import _ from "lodash";
import { useContext, useEffect, useState } from "react";
import { UserLocationContext } from "../UserLocationContext";
import { CurrentSearchFiltersContext, initialState, saveSearchKeys } from ".";
import { getCountryPlaceDetail } from "@/utils/helpers";
import { useRouter } from "next/router";
import { useAuth } from "@/hooks/useAuth";

export const CurrentSearchFiltersProvider = ({ children, initialSearchState }) => {
  const { user, loading: isLoadingUser } = useAuth();
  const [state, setState] = useState(initialState);
  const { company } = useBrowseJobsSelectedCompany();
  const {
    isLoadingUserCountry,
    userCountry,
    latitude: userLatitude,
    longitude: userLongitude,
  } = useContext(UserLocationContext);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (isLoadingUser) {
      return;
    }

    // Check if we should use initialSearchState (for SEO URLs) or router searchState
    const isHomePage = router.pathname === "/";
    const isSEOJobPage = router.pathname.startsWith("/jobs/");
    
    if (!router.isReady || (!isHomePage && !isSEOJobPage) || isLoadingUserCountry) {
      return;
    }

    let searchState = {};

    // Use initialSearchState for SEO job pages, otherwise use router query
    if (initialSearchState && isSEOJobPage) {
      searchState = _.pick(initialSearchState, saveSearchKeys);
    } else if (isHomePage) {
      try {
        const state = JSON.parse(
          decodeURIComponent(router.query.searchState || "") || "{}"
        );

        searchState = _.pick(state, saveSearchKeys);
      } catch (e) {
        router.replace(router.pathname, undefined, { shallow: true });
        return;
      }
    }

    const hasCompanyInfo =
      company && company.token && company.ats && company.name;

    if (hasCompanyInfo) {
      searchState.searchModeSelectedCompany = company;
    }

    if (searchState.defaultToUserLocation === false && !searchState.locations?.length) {
      searchState.locations = [];
    } else if (!searchState.locations?.length && userCountry) {
      const countryPlaceDetail = getCountryPlaceDetail({
        lat: userLatitude || null,
        lng: userLongitude || null,
        country: userCountry,
      });
      if (countryPlaceDetail) {
        searchState.locations = [countryPlaceDetail];
      }
    }

    setState({
      ...initialState,
      ...searchState,
      ...(user ? { userId: user.uid } : {}),
    });
    setIsLoading(false);
  }, [
    isLoadingUser,
    router,
    isLoadingUserCountry,
    userLatitude,
    userLongitude,
    userCountry,
    getCountryPlaceDetail,
    company,
    initialSearchState,
  ]);

  return (
    <CurrentSearchFiltersContext.Provider
      value={{
        state,
        isLoading,
      }}
    >
      {children}
    </CurrentSearchFiltersContext.Provider>
  );
};
