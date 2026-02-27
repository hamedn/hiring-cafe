import {
  CircularProgress,
  useBreakpointValue,
  useToast,
} from "@chakra-ui/react";
import useSavedSearchV4 from "@/hooks/useSavedSearchV4";
import LottieAnimation from "./lottieAnimation";
import ClipboardCopy from "@/animations/CopySuccess.json";
import { useEffect, useState } from "react";
import {
  ArrowPathIcon,
  ArrowUpOnSquareIcon,
  DocumentDuplicateIcon,
  PencilIcon,
} from "@heroicons/react/24/outline";
import useURLSearchStateV4 from "@/hooks/useURLSearchStateV4";
import SaveSearchButton from "./SaveSearchButton";
import { useRouter } from "next/router";
import Link from "next/link";

export default function LoadSavedSearches({ loading }) {
  const router = useRouter();
  const { searchState, company } = useURLSearchStateV4();
  const { savedSearches, loadSearch, getURL } = useSavedSearchV4(true);
  const [showLottie, setShowLottie] = useState(false);
  const isSmallScreen = useBreakpointValue({ base: true, md: false });
  const toast = useToast();
  const [showCheckmark, setShowCheckmark] = useState(null);

  useEffect(() => {
    if (!loading) {
      setShowCheckmark(null);
    }
  }, [loading]);

  const handleCopyLink = (searchId) => {
    navigator.clipboard.writeText(getURL(searchId));
    setShowLottie(searchId);
    setTimeout(() => {
      setShowLottie(null);
    }, 2000);
    toast({
      title: "Link copied to clipboard",
      status: "success",
      duration: 2000,
      isClosable: true,
      position: "top",
    });
  };

  const handleLoadSearch = (searchId) => {
    loadSearch(searchId, false);
    setShowCheckmark(searchId);
  };

  const resetSearchState = () => {
    const { searchState, ...rest } = router.query;
    router.push({
      pathname: router.pathname,
      query: rest,
    });
  };

  return (
    <div className="flex flex-col space-y-2">
      {!company && savedSearches?.length > 0 && (
        <div className="flex flex-row items-center space-x-2">
          <span className="text-sm font-light">Your saved searches</span>
          <Link href="/myhiringcafe/saved-searches" className="text-pink-500">
            <PencilIcon className="h-3 w-3 flex-none" />
          </Link>
        </div>
      )}
      <div className="flex flex-col md:flex-row md:items-center md:justify-end space-y-4 md:space-y-0 md:space-x-4 lg:space-x-6 w-full">
        {!company && (
          <div className="flex items-center space-x-2 md:space-x-4 overflow-x-auto scrollbar-hide w-full">
            {(savedSearches || []).map((search) => (
              <div
                key={search.id}
                className={`relative rounded-lg font-extrabold flex-none pr-2 border border-slate-400 shadow outline-none flex items-center m-1 text-sm ${
                  showCheckmark === search.id && loading
                    ? "bg-pink-500 text-white"
                    : "bg-white"
                }`}
              >
                <button
                  onClick={() => {
                    handleLoadSearch(search.id);
                  }}
                  className="pl-3 pr-4 py-2"
                >
                  {search.name}
                </button>
                {showCheckmark === search.id && loading ? (
                  <CircularProgress
                    isIndeterminate
                    color="pink.500"
                    size="16px"
                    className="m-0.5"
                  />
                ) : (
                  <button
                    disabled={showLottie}
                    className="m-0.5 border border-gray-300 rounded-full bg-gray-50 outline-none"
                    onClick={() => {
                      if (isSmallScreen && navigator.share) {
                        navigator
                          .share({
                            title: `Check out these jobs on HiringCafe`,
                            url: getURL(search.id),
                          })
                          .catch(() => {});
                      } else {
                        handleCopyLink(search.id);
                      }
                    }}
                  >
                    {isSmallScreen && navigator.share ? (
                      <ArrowUpOnSquareIcon className="h-3 w-3 m-1 flex-none" />
                    ) : showLottie !== search.id ? (
                      <DocumentDuplicateIcon className="h-4 w-4 m-1 flex-none" />
                    ) : (
                      <LottieAnimation
                        width="24px"
                        height="24px"
                        animationData={ClipboardCopy}
                      />
                    )}
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
        {Object.keys(searchState || {}).length > 0 && (
          <div
            className={`lg:hidden flex items-center space-x-6 mx-2 my-1 flex-none`}
          >
            {!company && (
              <div className="flex-none">
                <SaveSearchButton />
              </div>
            )}
            <button
              onClick={() => {
                if (company) {
                  resetSearchState();
                } else {
                  router.push("/");
                }
              }}
              className="flex items-center space-x-2 text-sm text-gray-500 hover:text-gray-600 underline"
            >
              <ArrowPathIcon className="w-3 h-3 flex-none" />
              <span className="flex-none font-bold">Clear filters</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
