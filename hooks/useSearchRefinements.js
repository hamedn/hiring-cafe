import { useCurrentSearchFilters } from "@/contexts/CurrentSearchFiltersContext";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/router";
import useURLSearchStateV4 from "@/hooks/useURLSearchStateV4";
import { useAuth } from "@/hooks/useAuth";
import { trackedFetch } from "@/utils/trackedFetch";

export function useSearchRefinements() {
  const router = useRouter();
  const { user, getIDToken } = useAuth();
  const { state: currentSearchState, isLoading: isLoadingSearchState } =
    useCurrentSearchFilters();
  const { searchState, company } = useURLSearchStateV4();
  const [totalCount, setTotalCount] = useState(0);
  const [collapsedTotal, setCollapsedTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  
  // Track the most recent fetch to ignore stale responses
  const lastFetchIdRef = useRef(0);

  useEffect(() => {
    const fetchTotalCount = async () => {
      // Increment and capture the current fetch ID
      const fetchId = lastFetchIdRef.current + 1;
      lastFetchIdRef.current = fetchId;
      
      setIsLoading(true);
      try {
        // Homepage (no filters, no company) = plain GET (edge cached)
        // Everything else = GET with encoded searchState param
        const isHomepage =
          (!searchState || Object.keys(searchState).length === 0) && !company;

        let url = "/api/search-jobs/get-total-count";
        if (!isHomepage) {
          // Use btoa for browser-compatible base64 encoding
          // Note: userId is NOT included in searchState - it's verified server-side via auth token
          const { userId, ...searchStateWithoutUserId } = currentSearchState;
          const encodedSearchState = btoa(encodeURIComponent(JSON.stringify(searchStateWithoutUserId)));
          url = `/api/search-jobs/get-total-count?s=${encodeURIComponent(encodedSearchState)}`;
        }

        // Build headers - include auth token if user is logged in
        const headers = {};
        if (user) {
          try {
            const token = await getIDToken();
            headers["Authorization"] = `Bearer ${token}`;
          } catch (e) {
            // If token fetch fails, continue without auth
            console.error("Failed to get auth token:", e);
          }
        }

        const response = await trackedFetch(url, { headers });

        // Ignore stale responses
        if (fetchId !== lastFetchIdRef.current) {
          return;
        }

        const data = await response.json();
        setTotalCount(data.total);
        setCollapsedTotal(data.collapsedTotal);
      } catch (error) {
        console.error("Error fetching search refinements:", error);
      } finally {
        // Only update loading state if this is still the latest fetch
        if (fetchId === lastFetchIdRef.current) {
          setIsLoading(false);
        }
      }
    };

    if (!isLoadingSearchState && router.isReady) {
      fetchTotalCount();
    }
  }, [currentSearchState, isLoadingSearchState, router.isReady, searchState, company, user, getIDToken]);

  return { totalCount, collapsedTotal, isLoading };
}
