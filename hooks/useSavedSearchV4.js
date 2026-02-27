import {
  initialState as currentSearchFiltersInitialState,
  saveSearchKeys,
  useCurrentSearchFilters,
} from "contexts/CurrentSearchFiltersContext";
import useFetchPreferences from "./useFetchPreferences";
import { nanoid } from "nanoid";
import { useEffect, useState } from "react";
import _ from "lodash";
import { Timestamp } from "firebase/firestore";
import { useRouter } from "next/router";
import { validSavedSearchTimestamp } from "@/components/SavedSearchesV4";

export default function useSavedSearchV4(filterOutdated = false) {
  const router = useRouter();
  const [savedSearches, setSavedSearches] = useState([]);
  const {
    userPreferences,
    setUserPreferences,
    loading: isLoadingUserPrefs,
  } = useFetchPreferences();
  const { state: currentSearchState } = useCurrentSearchFilters();
  const [savableSearch, setSavableSearch] = useState({});
  const [loading, setLoading] = useState(true);

  /* ------------------------------------------------------ */
  /*  derive local list from user prefs                     */
  /* ------------------------------------------------------ */
  useEffect(() => {
    // handle the "no saved searches" case
    if (
      !isLoadingUserPrefs &&
      (!userPreferences?.savedSearchesV4 ||
        userPreferences.savedSearchesV4.length === 0)
    ) {
      setSavedSearches([]);
      setLoading(false);
      return;
    }

    if (userPreferences?.savedSearchesV4) {
      let searches = userPreferences.savedSearchesV4;

      /* sort by explicit order if present, else by timestamp desc */
      if (searches.some((s) => s.sortOrder !== undefined)) {
        searches = _.sortBy(searches, (s) =>
          s.sortOrder !== undefined ? s.sortOrder : Number.MAX_SAFE_INTEGER
        );
      } else {
        searches = _.orderBy(
          searches,
          [
            (s) => {
              // ensure Firestore timestamps sort correctly
              const date = s.timestamp?.toDate
                ? s.timestamp.toDate()
                : new Date(s.timestamp);
              return date.getTime();
            },
          ],
          ["desc"]
        );
      }

      searches = searches.filter(
        (s) =>
          (s.timestamp?.toDate ? s.timestamp.toDate() : new Date(s.timestamp)) >
            validSavedSearchTimestamp || !filterOutdated
      );

      setSavedSearches(searches);
      setLoading(false);
    }
  }, [userPreferences?.savedSearchesV4, isLoadingUserPrefs, filterOutdated]);

  /* ------------------------------------------------------ */
  /*  compute "savable" diff of current search filters      */
  /* ------------------------------------------------------ */
  useEffect(() => {
    const search = _.pick(currentSearchState, saveSearchKeys);
    Object.keys(search).forEach((key) => {
      if (_.isEqual(search[key], currentSearchFiltersInitialState[key])) {
        delete search[key];
      }
    });
    setSavableSearch(search);
  }, [currentSearchState]);

  /* ------------------------------------------------------ */
  /*  helpers                                               */
  /* ------------------------------------------------------ */

  /* persist a new ordering */
  const reorderSavedSearches = async (orderedIds = []) => {
    if (!userPreferences) return;
    const original = userPreferences.savedSearchesV4 || [];

    const newSavedSearches = orderedIds
      .map((id, idx) => {
        const found = original.find((s) => s.id === id);
        return found ? { ...found, sortOrder: idx } : null;
      })
      .filter(Boolean);

    /* keep any searches that weren't dragged (defensive) */
    original
      .filter((s) => !orderedIds.includes(s.id))
      .forEach((s) =>
        newSavedSearches.push({ ...s, sortOrder: newSavedSearches.length })
      );

    setUserPreferences({ savedSearchesV4: newSavedSearches });
  };

  const updateSearch = async ({ searchID }) => {
    if (!userPreferences) return;
    const newSavedSearches = (userPreferences.savedSearchesV4 || []).map(
      (search) => {
        if (search.id !== searchID) return search;
        return {
          ...search,
          state: JSON.stringify(savableSearch),
          timestamp: Timestamp.now(),
        };
      }
    );
    setUserPreferences({ savedSearchesV4: newSavedSearches });
  };

  const saveCurrentSearch = async ({ searchName, isPublic = false }) => {
    if (Object.keys(savableSearch).length === 0) return;

    const existing = userPreferences?.savedSearchesV4 || [];
    const newSavedSearches = [
      ...existing,
      {
        id: nanoid(),
        name: searchName,
        state: JSON.stringify(savableSearch),
        timestamp: Timestamp.now(),
        is_public: isPublic,
        sortOrder: existing.length, // keep at end
      },
    ];

    setUserPreferences({ savedSearchesV4: newSavedSearches });
  };

  const deleteSearch = async (searchID) => {
    if (!userPreferences) return;
    const newSavedSearches = (userPreferences.savedSearchesV4 || []).filter(
      (s) => s.id !== searchID
    );
    setUserPreferences({ savedSearchesV4: newSavedSearches });
  };

  const deleteAllSavedSearches = async () => {
    if (!userPreferences) return;
    setUserPreferences({ savedSearchesV4: [] });
  };

  const loadSearch = async (searchID, newWindow) => {
    if (!userPreferences) return;
    const search = (userPreferences.savedSearchesV4 || []).find(
      (s) => s.id === searchID
    );

    // respect newWindow even on missing state
    if (!search?.state) {
      const target = "/";
      if (newWindow) {
        window.open(target, "_blank");
      } else {
        router.push(target);
      }
      return;
    }

    let parsedState = search.state;
    if (typeof parsedState === "string") {
      try {
        parsedState = JSON.parse(parsedState);
      } catch {
        parsedState = {};
      }
    }
    parsedState = _.pick(parsedState || {}, saveSearchKeys);

    const urlQuery = `?searchState=${encodeURIComponent(
      JSON.stringify(parsedState)
    )}`;

    if (newWindow) {
      window.open("/" + urlQuery, "_blank");
    } else {
      router.push(
        { pathname: "/", query: { searchState: JSON.stringify(parsedState) } },
        undefined,
        { shallow: true }
      );
    }
  };

  const getURL = (searchID) => {
    if (!userPreferences) return;
    const search = (userPreferences.savedSearchesV4 || []).find(
      (s) => s.id === searchID
    );
    if (!search?.state) {
      // use dynamic origin rather than hardcoded
      return typeof window !== "undefined" ? `${window.location.origin}/` : "/";
    }

    let parsedState = search.state;
    if (typeof parsedState === "string") {
      try {
        parsedState = JSON.parse(parsedState);
      } catch {
        parsedState = {};
      }
    }
    return `${
      typeof window !== "undefined" ? window.location.origin : ""
    }/?searchState=${encodeURIComponent(JSON.stringify(parsedState))}`;
  };

  const renameSearch = async (searchID, newName) => {
    if (!userPreferences) return;
    const newSavedSearches = (userPreferences.savedSearchesV4 || []).map(
      (search) => {
        if (search.id !== searchID) return search;
        return {
          ...search,
          name: newName,
          timestamp: Timestamp.now(),
        };
      }
    );
    setUserPreferences({ savedSearchesV4: newSavedSearches });
  };

  /* ------------------------------------------------------ */
  return {
    savedSearches,
    isSearchSavable: Object.keys(savableSearch).length > 0,
    updateSearch,
    saveCurrentSearch,
    deleteSearch,
    deleteAllSavedSearches,
    loadSearch,
    loading,
    getURL,
    renameSearch,
    reorderSavedSearches, // expose to component
  };
}
