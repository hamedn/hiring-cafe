import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { SavedJobsContext } from "contexts/savedJobsContext";
import { clientFirestore } from "@/lib/firebaseClient";
import {
  collection,
  query,
  where,
  orderBy,
  getCountFromServer,
  limit,
  startAfter,
  getDocs,
} from "firebase/firestore";
import { useAuth } from "@/hooks/useAuth";
import { CircularProgress } from "@chakra-ui/react";
import Link from "next/link";
import QuickJobSummaryCard from "./QuickJobSummaryCard";
import { QUICK_SUMMARY_CARD_VIEW_FORMAT } from "@/utils/constants";
import MyListLanding from "./MyListLanding";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@heroicons/react/20/solid";

const PAGE_SIZE = 20;

const MyList = () => {
  const { user, loading: isLoadingUser, getIDToken } = useAuth();
  const { removeJob: removeJobFromLocalContext } = useContext(SavedJobsContext);
  const [savedJobs, setSavedJobs] = useState([]);
  const [isLoadingJobs, setIsLoadingJobs] = useState(true);
  const [listType, setListType] = useState("saved");
  const [count, setCount] = useState(-1);
  const [isLoadingCount, setIsLoadingCount] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const pageCursorsRef = useRef({});

  const totalPages = count > 0 ? Math.ceil(count / PAGE_SIZE) : 0;

  const fetchCount = useCallback(async () => {
    setIsLoadingCount(true);
    if (!user) return;
    const q = query(
      collection(clientFirestore, "savedJobs"),
      where("owner", "==", user.uid),
      where("stage", "==", listType.toLowerCase()),
      orderBy("dateSaved", "desc")
    );
    try {
      const countSnapshot = await getCountFromServer(q);
      setCount(countSnapshot.data().count);
    } catch (error) {
      console.error("Error fetching count:", error);
    } finally {
      setIsLoadingCount(false);
    }
  }, [listType, user]);

  const fetchPage = useCallback(
    async (pageNum) => {
      if (!user) return;
      setIsLoadingJobs(true);

      let pageQuery;
      if (pageNum === 1) {
        pageQuery = query(
          collection(clientFirestore, "savedJobs"),
          where("owner", "==", user.uid),
          where("stage", "==", listType.toLowerCase()),
          orderBy("dateSaved", "desc"),
          limit(PAGE_SIZE)
        );
      } else {
        const cursor = pageCursorsRef.current[pageNum - 1];
        if (!cursor) {
          setIsLoadingJobs(false);
          return;
        }
        pageQuery = query(
          collection(clientFirestore, "savedJobs"),
          where("owner", "==", user.uid),
          where("stage", "==", listType.toLowerCase()),
          orderBy("dateSaved", "desc"),
          startAfter(cursor),
          limit(PAGE_SIZE)
        );
      }

      try {
        const snapshot = await getDocs(pageQuery);
        const jobs = snapshot.docs.map((d) => ({
          ...d.data(),
          docID: d.id,
        }));
        setSavedJobs(jobs);
        setCurrentPage(pageNum);
        if (snapshot.docs.length > 0) {
          pageCursorsRef.current[pageNum] =
            snapshot.docs[snapshot.docs.length - 1];
        }
      } catch (error) {
        console.error("Error fetching page:", error);
      } finally {
        setIsLoadingJobs(false);
      }

      window.scrollTo({ top: 0, behavior: "smooth" });
    },
    [user, listType]
  );

  useEffect(() => {
    fetchCount();
  }, [fetchCount]);

  useEffect(() => {
    pageCursorsRef.current = {};
    fetchPage(1);
  }, [fetchPage]);

  // Auto-navigate to previous page when all items on current page are removed
  useEffect(() => {
    if (
      !isLoadingJobs &&
      !isLoadingCount &&
      savedJobs.length === 0 &&
      currentPage > 1 &&
      count > 0
    ) {
      fetchPage(currentPage - 1);
    }
  }, [savedJobs.length, isLoadingJobs, isLoadingCount, count, currentPage, fetchPage]);

  const handleJobDelete = useCallback((deletedJobId) => {
    setSavedJobs((currentJobs) =>
      currentJobs.filter((job) => job.docID !== deletedJobId)
    );
    setCount((prev) => Math.max(0, prev - 1));
  }, []);

  const handleJobStageUpdate = useCallback(
    (deletedJobId) => {
      handleJobDelete(deletedJobId);
    },
    [handleJobDelete]
  );

  const clearSavedJobsList = async () => {
    if (
      !window.confirm(
        "Are you sure you want to remove all jobs from this list?"
      )
    )
      return;

    try {
      const userToken = await getIDToken();
      const res = await fetch("/api/resetJobList", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_token: userToken,
          stage: listType.toLowerCase(),
        }),
      });

      if (!res.ok) {
        throw new Error(`Reset failed: ${res.status}`);
      }

      for (const job of savedJobs) {
        removeJobFromLocalContext(job.objectID);
      }

      setSavedJobs([]);
      setCount(0);
      setCurrentPage(1);
      pageCursorsRef.current = {};
    } catch (error) {
      console.error("Error clearing the list:", error);
    }
  };

  if (!isLoadingUser && !user) {
    return <MyListLanding />;
  }

  if (isLoadingJobs && savedJobs.length === 0) {
    return (
      <div className="flex justify-center mt-16">
        <CircularProgress isIndeterminate size={"30px"} color="black" />
      </div>
    );
  }

  const hasNextPage =
    currentPage < totalPages && !!pageCursorsRef.current[currentPage];
  const hasPrevPage = currentPage > 1;

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex flex-col px-4 md:px-8 xl:px-16">
        <div className="flex items-center space-x-2 lg:space-x-4 pt-4 pb-2 overflow-x-auto scrollbar-hide bg-white">
          {["Saved", "Applied", "Interviewing", "Rejected", "Hidden"].map(
            (stage) => (
              <button
                key={stage}
                className={`border text-sm lg:text-base px-2 py-1 lg:px-4 rounded ${
                  stage.toLowerCase() === listType.toLowerCase()
                    ? "border-pink-500 text-pink-600 font-semibold bg-pink-50/50"
                    : "hover:bg-gray-100 text-gray-500"
                }`}
                onClick={() => {
                  if (stage.toLowerCase() === listType.toLowerCase()) return;
                  setListType(stage);
                  setSavedJobs([]);
                  setIsLoadingJobs(true);
                }}
              >
                {stage}
              </button>
            )
          )}
        </div>
        <div className="flex flex-col space-y-2 md:flex-row md:space-y-0 md:items-center md:space-x-4 mt-2 pb-4">
          <span className="text-2xl font-bold">
            Your {listType.toLowerCase()} jobs{" "}
            {isLoadingCount ? (
              <CircularProgress isIndeterminate size={"24px"} color="black" />
            ) : (
              count >= 0 && `(${count.toLocaleString()})`
            )}
          </span>
          {savedJobs.length > 0 && (
            <div>
              <button
                className="text-red-600"
                onClick={() => clearSavedJobsList()}
              >
                Reset list
              </button>
            </div>
          )}
        </div>
      </div>

      {savedJobs.length > 0 ? (
        <>
          {isLoadingJobs && (
            <div className="flex justify-center py-4">
              <CircularProgress isIndeterminate size={"24px"} color="black" />
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 px-4 pb-4 md:px-8 xl:px-16 gap-4 md:gap-6 lg:gap-8 xl:gap-10">
            {savedJobs.map((job, index) => (
              <div key={`${job.objectID}_${index}`}>
                <QuickJobSummaryCard
                  jobs={[job]}
                  viewFormat={QUICK_SUMMARY_CARD_VIEW_FORMAT.SAVED_LIST}
                  onDelete={(id) => handleJobDelete(id)}
                  onUpdateStage={(id) => handleJobStageUpdate(id)}
                />
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 py-6 px-4">
              <button
                disabled={!hasPrevPage || isLoadingJobs}
                onClick={() => fetchPage(1)}
                className="px-3 py-2 text-sm font-medium rounded-md border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                First
              </button>
              <button
                disabled={!hasPrevPage || isLoadingJobs}
                onClick={() => fetchPage(currentPage - 1)}
                className="flex items-center gap-1 px-3 py-2 text-sm font-medium rounded-md border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeftIcon className="h-4 w-4" />
                Prev
              </button>
              <span className="px-4 py-2 text-sm font-medium text-gray-600">
                Page {currentPage} of {totalPages}
              </span>
              <button
                disabled={!hasNextPage || isLoadingJobs}
                onClick={() => fetchPage(currentPage + 1)}
                className="flex items-center gap-1 px-3 py-2 text-sm font-medium rounded-md border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                Next
                <ChevronRightIcon className="h-4 w-4" />
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="flex flex-col flex-auto items-center p-8 my-8 border rounded-xl m-4">
          <span className="text-xl font-bold">
            No {listType.toLowerCase()} jobs
          </span>
          <span className="mt-2 font-light">
            Start{" "}
            <Link href="/" className="text-blue-600">
              adding jobs
            </Link>{" "}
            to your list.
          </span>
        </div>
      )}
    </div>
  );
};

export default MyList;
