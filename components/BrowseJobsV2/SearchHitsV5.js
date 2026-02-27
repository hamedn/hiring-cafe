import {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import QuickJobSummaryCard from "../QuickJobSummaryCard";
import LottieAnimation from "../lottieAnimation";
import LoadingAnimation from "@/animations/loading-animation.json";
import TaskComplete from "@/animations/business-task.json";
import { SavedJobsContext } from "contexts/savedJobsContext";
import { useCurrentSearchFilters } from "contexts/CurrentSearchFiltersContext";
import MasonryGrid from "../MasonryGrid";
import useBrowseJobsSelectedCompany from "@/hooks/useBrowseJobsSelectedCompany";
import _ from "lodash";
import Loading from "@/animations/loading.json";
import { useRouter } from "next/router";
import { usePostHog } from "posthog-js/react";
import LoadSavedSearches from "../LoadSavedSearches";
import SearchInformation from "../SearchInformation";
import { locationLabel } from "../SearchLocationNavBar";
import { useSearchRefinements } from "@/hooks/useSearchRefinements";
import { trackedFetch } from "@/utils/trackedFetch";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  useDisclosure,
} from "@chakra-ui/react";
import { QuestionMarkCircleIcon, XMarkIcon } from "@heroicons/react/24/outline";
import WhyHCBanner from "../WhyHCBanner";
import useURLSearchStateV4 from "@/hooks/useURLSearchStateV4";
import { UserLocationContext } from "@/contexts/UserLocationContext";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";

function groupHitsByBoardToken(hits) {
  const grouped = _.groupBy(hits, "collapse_key");
  const result = _.map(grouped, (hitsArray, boardToken) => ({
    board: boardToken,
    hits: hitsArray?.map((hit) => {
      return {
        ...hit,
      };
    }),
  }));
  return result;
}

export default function SearchHitsV5() {
  const router = useRouter();
  const { user, getIDToken } = useAuth();
  const [isReadyToFetchJobs, setIsReadyToFetchJobs] = useState(false);
  const { state: currentSearchState, isLoading: isLoadingSearchState } =
    useCurrentSearchFilters();
  const { jobs: savedJobsLocalContext } = useContext(SavedJobsContext);
  const { userCountry } = useContext(UserLocationContext);
  const { company: selectedCompany } = useBrowseJobsSelectedCompany();
  const { searchState } = useURLSearchStateV4();
  const { totalCount, collapsedTotal } = useSearchRefinements();
  const [hits, setHits] = useState([]);
  const [page, setPage] = useState(0);
  const [isLastPage, setIsLastPage] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isFreshJobsBannerVisible, setIsFreshJobsBannerVisible] =
    useState(false);
  const [isAISearchBannerVisible, setIsAISearchBannerVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [isSlowLoading, setIsSlowLoading] = useState(false);

  const { locations = [] } = currentSearchState;

  const locationInfo = useMemo(() => {
    return locationLabel(locations);
  }, [locations]);

  const posthog = usePostHog();

  const debouncedPostHogCapture = useCallback(
    _.debounce(
      (searchState) => {
        posthog.capture("search_event_v5", searchState);
      },
      5000,
      { leading: false, trailing: true }
    ),
    [posthog]
  );

  // Load fresh jobs banner preference from localStorage
  useEffect(() => {
    const bannerDismissed = localStorage.getItem("freshJobsBannerDismissed");
    if (bannerDismissed === "true") {
      setIsFreshJobsBannerVisible(false);
    }
  }, []);

  // Load AI search banner preference from localStorage
  useEffect(() => {
    const aiSearchBannerDismissed = localStorage.getItem(
      "aiSearchBannerDismissed"
    );
    if (aiSearchBannerDismissed === "true") {
      setIsAISearchBannerVisible(false);
    }
  }, []);

  const handleCloseFreshJobsBanner = () => {
    setIsFreshJobsBannerVisible(false);
    localStorage.setItem("freshJobsBannerDismissed", "true");
  };

  const handleCloseAISearchBanner = () => {
    setIsAISearchBannerVisible(false);
    localStorage.setItem("aiSearchBannerDismissed", "true");
  };

  const isFullScreenLoading =
    !isReadyToFetchJobs ||
    isLoadingSearchState ||
    (isLoading && !hits.length);

  useEffect(() => {
    if (!isFullScreenLoading) {
      setIsSlowLoading(false);
      return;
    }
    const timer = setTimeout(() => setIsSlowLoading(true), 5000);
    return () => clearTimeout(timer);
  }, [isFullScreenLoading]);

  // Track the most recent fetch so that stale requests don't override state
  const lastFetchIdRef = useRef(0);

  const fetchHits = useCallback(
    async (pageToFetch = 0, reset = false) => {
      if (isLoadingSearchState || !isReadyToFetchJobs) {
        return;
      }

      // Increment and capture the current fetch ID
      const fetchId = lastFetchIdRef.current + 1;
      lastFetchIdRef.current = fetchId;

      if (!isLoading) {
        setIsLoading(true);
      }

      try {
        // Homepage (no filters, page 0, no company) = plain GET (edge cached)
        // Everything else = GET with encoded searchState param
        // SEO pages (/jobs/*) pass filters via context, not URL — never treat as homepage
        const isSEOPage = router.pathname.startsWith("/jobs/");
        const isHomepage =
          !isSEOPage &&
          (!searchState || Object.keys(searchState).length === 0) &&
          pageToFetch === 0 &&
          !selectedCompany;

        let url = "/api/search-jobs";
        if (!isHomepage) {
          // Use btoa for browser-compatible base64 encoding
          // Note: userId is NOT included in searchState - it's verified server-side via auth token
          const { userId, ...searchStateWithoutUserId } = currentSearchState;
          const encodedSearchState = btoa(encodeURIComponent(JSON.stringify(searchStateWithoutUserId)));
          const params = new URLSearchParams({
            s: encodedSearchState,
            size: "40",
            page: String(pageToFetch),
          });
          url = `/api/search-jobs?${params.toString()}`;
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

        const data = await response.json();

        // If this fetch isn't the latest one anymore, ignore the result
        if (fetchId !== lastFetchIdRef.current) {
          return;
        }

        if (response.ok) {
          // Clear any previous errors on successful fetch
          setErrorMessage(null);

          if (pageToFetch === 0) {
            debouncedPostHogCapture(currentSearchState);
            const handleBeforeUnload = () => {
              debouncedPostHogCapture.flush();
            };
            window.addEventListener("beforeunload", handleBeforeUnload);
          }

          if (reset) {
            setHits(data.results);
            setPage(1);
          } else {
            setHits((prevHits) => [...prevHits, ...data.results]);
            setPage((prevPage) => prevPage + 1);
          }

          setIsLastPage(data.results.length === 0 || data.results.length < 20);

          if (pageToFetch === 0) {
            return () => {
              window.removeEventListener("beforeunload", handleBeforeUnload);
              debouncedPostHogCapture.cancel();
            };
          }
        } else {
          console.error("Error fetching hits:", data.error);
          setErrorMessage(
            data.error || "Failed to load jobs. Please try again."
          );
          setIsLastPage(true);
          // Keep existing hits instead of clearing them
          // setHits([]);
          // setPage(0);
        }
      } catch (error) {
        // If this fetch isn't the latest one anymore, ignore the result
        if (fetchId !== lastFetchIdRef.current) {
          return;
        }
        console.error("Error fetching hits:", error);
        setErrorMessage(
          "Unable to connect to the server. Please check your internet connection and try again."
        );
        setIsLastPage(true);
        // Keep existing hits instead of clearing them
        setHits([]);
        setPage(0);
      } finally {
        // Only turn off loading if this is still the most recent fetch
        if (fetchId === lastFetchIdRef.current) {
          setIsLoading(false);
        }
      }
    },
    [currentSearchState, isLoading, isLoadingSearchState, isReadyToFetchJobs, user, getIDToken, searchState, selectedCompany]
  );

  useEffect(() => {
    if (isReadyToFetchJobs) {
      return;
    }

    if (!router.isReady && isLoadingSearchState) {
      return;
    }
    setIsReadyToFetchJobs(true);
  }, [router.isReady, isLoadingSearchState]);

  useEffect(() => {
    if (isReadyToFetchJobs) {
      setPage(0);
      fetchHits(0, true);
    }
  }, [isReadyToFetchJobs, currentSearchState]);

  useEffect(() => {
    if (page === 0) {
      window.scrollTo({ top: 0, behavior: "instant" });
    }
  }, [page]);

  const groupedHits = useMemo(
    () => (selectedCompany ? hits : groupHitsByBoardToken(hits)),
    [hits, selectedCompany]
  );

  const processedGroupedHits = useMemo(() => {
    if (!selectedCompany) {
      return groupedHits.map((group) => {
        const filteredJobs = group.hits.filter((job) => {
          const localContextJob = savedJobsLocalContext?.find(
            (j) => j.objectID === job.objectID
          );

          if (localContextJob?.type?.toLowerCase() === "hidden") {
            return false;
          }

          if (
            localContextJob &&
            currentSearchState.hideJobTypes?.includes(localContextJob.type)
          ) {
            return false;
          }

          return true;
        });
        return {
          board: group.board,
          companyName: group.companyName,
          hits: filteredJobs,
          source: group.source,
        };
      });
    } else {
      return groupedHits
        .map((job) => {
          const localContextJob = savedJobsLocalContext?.find(
            (j) => j.objectID === job.objectID
          );

          if (localContextJob?.type?.toLowerCase() === "hidden") {
            return null;
          }

          if (
            localContextJob &&
            currentSearchState.hideJobTypes?.includes(localContextJob.type)
          ) {
            return null;
          }

          return {
            board: job.board_token,
            companyName: "",
            hits: [job],
            source: job.source,
          };
        })
        .filter(Boolean);
    }
  }, [groupedHits, savedJobsLocalContext, currentSearchState, selectedCompany]);

  const items = useMemo(() => {
    let items = processedGroupedHits.map((group, i) => {
      return (
        <QuickJobSummaryCard
          key={`${group.board}___${group.source}___${i}`}
          jobs={group.hits}
        />
      );
    });

    return items.filter(Boolean);
  }, [processedGroupedHits]);

  if (errorMessage) {
    return (
      <div className="flex justify-center items-center px-4 md:px-8 lg:px-16 py-3 text-sm bg-red-50 border-y border-red-300">
        <div className="flex items-center space-x-2">
          <svg
            className="h-5 w-5 text-red-500 flex-shrink-0"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span className="text-red-800">{errorMessage}</span>
        </div>
      </div>
    );
  }

  if (
    !isReadyToFetchJobs ||
    isLoadingSearchState ||
    (isLoading && !groupedHits.length)
  ) {
    return (
      <div className="flex flex-col items-center m-4 h-full min-h-screen">
        {isSlowLoading && (
          <div className="w-full max-w-xl mb-6 mt-2 rounded-xl border border-amber-200 bg-amber-50 px-5 py-4 text-center shadow-sm animate-fade-in">
            <p className="text-amber-900 font-semibold text-base">
              Hang tight — we&apos;re experiencing higher than usual traffic
            </p>
            <p className="text-amber-700 text-sm mt-1.5 leading-relaxed">
              We&apos;re seeing a surge of users right now, so things are a bit
              slower than usual. You can wait here and results will appear
              shortly, or check back in a few minutes.
            </p>
          </div>
        )}
        <LottieAnimation width="80px" height="80px" animationData={Loading} />
      </div>
    );
  }

  if (!groupedHits.length && !isLoading && !isLoadingSearchState) {
    return (
      <div className="flex flex-col min-h-screen">
        <div className="px-4 md:px-8 xl:px-16 my-4">
          <LoadSavedSearches loading={isLoading || isLoadingSearchState} />
        </div>
        <div className="px-4 md:px-8 xl:px-16">
          <SearchInformation />
        </div>
        <div className="flex justify-center p-8 text-center text-sm">
          <div className="flex flex-col flex-auto items-center max-w-5xl">
            <LottieAnimation
              width="200px"
              height="200px"
              animationData={TaskComplete}
              customOptions={{
                loop: false,
              }}
            />
            <span className="text-gray-500 font-medium text-xl">
              {`You're all caught up!`}
            </span>
            <span className="text-gray-500 text-base mt-1 font-light">
              {`Try adjusting your filters for more results.`}
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      {isLoading && (
        <div className="absolute inset-x-0 h-0.5 bg-neutral-200 overflow-hidden">
          <div className="absolute top-0 left-0 h-full bg-pink-500 w-full animate-slim-slide" />
        </div>
      )}
      {isFreshJobsBannerVisible && (
        <div className="flex justify-between items-center px-2 md:px-4 lg:px-8 py-2 text-center text-xs bg-green-50 border-y border-green-600">
          <div className="font-bold">
            {`📣 You may see fewer "fresh jobs" now—we've filtered out reposted and
          ghost jobs. `}
          </div>
          <div className="flex items-center space-x-4 flex-none">
            <Link
              href="https://www.reddit.com/r/hiringcafe/comments/1nvl51o/less_reposted_jobs_less_fresh_jobs/"
              className="bg-white text-black border border-gray-300 rounded-md p-2 font-bold hover:bg-gray-100 flex-none"
              target="_blank"
              rel="noopener noreferrer"
            >
              Learn more
            </Link>
            <button
              onClick={handleCloseFreshJobsBanner}
              aria-label="Close banner"
              title="Don't show again"
            >
              <XMarkIcon className="h-4 w-4 stroke-2" />
            </button>
          </div>
        </div>
      )}
      <WhyHCBanner />
      <div className="px-4 md:px-8 xl:px-16 my-4">
        <LoadSavedSearches loading={isLoading || isLoadingSearchState} />
      </div>
      <div className="p-2 text-center text-xs bg-neutral-200 text-black font-bold">
        📣 HiringCafe is hiring Founding Engineers (focused on AI job search)! <Link className="text-pink-600 underline" href="https://docs.google.com/document/d/1hJl0VtyiywYc9DR2Da0iEdtLFYyCVyzEOcVHdXeJASA" target="_blank" rel="noopener noreferrer">Learn More</Link> · <Link className="text-pink-600 underline" href="https://form.typeform.com/to/EFEfSSb1" target="_blank" rel="noopener noreferrer">Apply here</Link>
      </div>
      <div className="px-4 md:px-8 xl:px-16 my-4">
        <SearchInformation />
      </div>
      <div className="px-4 md:px-8 xl:px-16 my-4">
        {totalCount ? (
          <div className="flex items-center space-x-1 text-xs font-semibold italic w-full overflow-auto scrollbar-hide">
            {/* Hide job count and company count on SEO pages */}
            {!(typeof window !== "undefined" && window.__SEO_URL_MODE) && (
              <>
                <span className="flex-none">
                  {totalCount.toLocaleString()} job{totalCount === 1 ? "" : "s"}
                </span>
                {collapsedTotal && (
                  <button
                    onClick={onOpen}
                    className="flex-none flex items-center space-x-1 text-gray-800 hover:text-black focus:outline-none"
                    aria-label="Learn about collapsed companies"
                  >
                    <span className="flex-none">
                      · {collapsedTotal.toLocaleString()} companies
                    </span>
                    <QuestionMarkCircleIcon className="h-4 w-4" />
                  </button>
                )}
                <span className="text-sm font-normal not-italic flex-none">
                  -{" "}
                </span>
              </>
            )}
            <span className="text-sm font-normal not-italic flex-none">
              {searchState && !Object.keys(searchState).length
                ? "Latest jobs - "
                : ""}
              {locationInfo || "selected location"}
            </span>
          </div>
        ) : null}
      </div>
      {/* AI Job Search Promotional Banner - Desktop Only & US Only */}
      {isAISearchBannerVisible && userCountry === "US" && (
        <div className="hidden lg:block px-4 md:px-8 xl:px-16 mb-6">
          <div className="relative group bg-gradient-to-r from-purple-50 to-pink-50 hover:from-purple-100 hover:to-pink-100 border-2 border-purple-200 rounded-xl p-4 transition-all duration-200 hover:shadow-lg">
            <Link href="/ai-search" className="block">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="bg-purple-600 text-white rounded-lg p-2 group-hover:scale-110 transition-transform">
                    <svg
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 10V3L4 14h7v7l9-11h-7z"
                      />
                    </svg>
                  </div>
                  <div>
                    <div className="font-bold text-gray-900 flex items-center space-x-2">
                      <span>Try AI Job Search</span>
                      <span className="text-xs bg-purple-600 text-white px-2 py-0.5 rounded-full">
                        Beta
                      </span>
                    </div>
                    <div className="text-sm text-gray-600 mt-0.5">
                      Describe your ideal job in plain language and let AI find
                      the best matches
                    </div>
                  </div>
                </div>
                <div className="text-purple-600 group-hover:translate-x-1 transition-transform">
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
              </div>
            </Link>
            <button
              onClick={(e) => {
                e.preventDefault();
                handleCloseAISearchBanner();
              }}
              className="absolute top-2 right-2 p-1 text-gray-400 hover:text-gray-600 hover:bg-white/50 rounded transition-colors"
              aria-label="Close banner"
              title="Don't show again"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}
      <InfiniteScroll
        className={`${isLoading && page === 0
          ? "opacity-30 pointer-events-none"
          : "opacity-100"
          } transition-opacity duration-300`}
        dataLength={groupedHits.length}
        next={() => fetchHits(page)}
        hasMore={!isLastPage}
        loader={
          <div className="flex justify-center m-4">
            <LottieAnimation
              width="50px"
              height="50px"
              animationData={LoadingAnimation}
            />
          </div>
        }
        scrollThreshold={0.9}
      >
        {selectedCompany ? (
          <MasonryGrid items={items} />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-x-4 gap-y-12 md:gap-x-10 px-4 md:px-8 xl:px-16 pb-4">
            {items}
          </div>
        )}
      </InfiniteScroll>

      <Modal
        isOpen={isOpen}
        onClose={onClose}
        size={{ base: "full", md: "xl" }}
        scrollBehavior="inside"
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Why We Group Jobs by Company</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <video
              controls={false}
              className="mt-4 w-full max-w-xs mx-auto"
              autoPlay
              loop
            >
              <source src="/hiringcafe-cards-demo.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
            <p className="text-sm leading-relaxed mt-6 mb-32">
              {`We group multiple job postings from the same company into a single
              card. Without collapsing, some companies with hundreds or even
              thousands of job listings might overshadow other valuable
              opportunities. Collapsing them helps keep your feed organized. If
              a company has multiple jobs, you can use the left and right arrows
              to browse the additional jobs, or click "View All" to see all of
              that company's postings.`}
            </p>
          </ModalBody>
        </ModalContent>
      </Modal>
    </div>
  );
}
