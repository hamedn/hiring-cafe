import { PromotedJobsContext } from "contexts/PromotedJobsContext";
import { useContext, useMemo } from "react";
import QuickJobSummaryCard from "../QuickJobSummaryCard";
import { SavedJobsContext } from "contexts/savedJobsContext";
import { useCurrentSearchFilters } from "contexts/CurrentSearchFiltersContext";

export default function AdCard({ indexPosition }) {
  const { boards } = useContext(PromotedJobsContext);
  const { state: currentSearchState } = useCurrentSearchFilters();
  const { jobs: savedJobsLocalContext } = useContext(SavedJobsContext);

  const board = useMemo(() => {
    const filteredBoard = (
      boards?.[indexPosition % boards.length] || []
    ).filter((job) => {
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

    return filteredBoard;
  }, [boards, indexPosition, savedJobsLocalContext, currentSearchState]);

  if (!board?.length) {
    return null;
  }

  return <QuickJobSummaryCard jobs={board} />;
}
