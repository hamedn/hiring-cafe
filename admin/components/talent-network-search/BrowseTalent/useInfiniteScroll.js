import useSWRInfinite from "swr/infinite";
import fetcher from "@/utils/fetcher";

export default function useInfiniteScroll(query, filters, isLoggedIn) {
  const getKey = (pageIndex, previousPageData) => {
    // If there is no more data, return null
    if (previousPageData && !previousPageData.candidates.length) {
      return null;
    }

    // Construct the API endpoint with query and filters
    let params = new URLSearchParams({ search: query, page: pageIndex });
    const encodedFilters = encodeURIComponent(JSON.stringify(filters));
    return `/api/admin/search/searchTalent?${params.toString()}&filters=${encodedFilters}&isLoggedIn=${isLoggedIn}`;
  };

  return useSWRInfinite(getKey, fetcher);
}
