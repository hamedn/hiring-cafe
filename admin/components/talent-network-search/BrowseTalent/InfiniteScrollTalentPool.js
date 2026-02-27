import InfiniteScroll from "react-infinite-scroll-component";
import CandidateCard from "../../CandidateCard";
import LoadingCandidates from "./LoadingCandidates";

export default function InfiniteScrollTalentPool({
  data,
  size,
  setSize,
  error,
}) {
  let items = [];
  let totalHits = 0;
  if (data) {
    items = data.flatMap((pageData) => pageData.candidates);
    totalHits =
      data[data.length - 1].totalHits -
      data.reduce((accumulator, curr) => {
        return accumulator + curr.numFilteredOutCandidates;
      }, 0);
  }

  const loadMore = () => {
    setSize(size + 1);
  };

  if (error) {
    return (
      <div className="flex justify-center pt-32">
        <span className="text-red-600 p-4">{error.message}</span>
      </div>
    );
  }

  if (!items?.length) {
    return (
      <div className="flex justify-center pt-32">
        <div className="flex flex-col items-center text-center p-4 space-y-4">
          <span className="font-medium text-2xl">No exact matches</span>
          <span className="font-light text-lg">
            Try changing or removing some of your filters, location, or search
            terms.
          </span>
        </div>
      </div>
    );
  }

  return (
    <InfiniteScroll
      dataLength={items.length}
      next={loadMore}
      hasMore={true}
      loader={
        items.length < totalHits ? (
          <div className="mt-8">
            <LoadingCandidates numItems={7} />
          </div>
        ) : null
      }
      scrollableTarget="infiniteJobsScrollDivAdmin"
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8 items-start md:min-h-screen">
        {items.map((candidate) => (
          <CandidateCard key={candidate.id} candidate={candidate} />
        ))}
      </div>
    </InfiniteScroll>
  );
}
