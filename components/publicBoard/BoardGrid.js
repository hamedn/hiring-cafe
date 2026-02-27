import useJobsFromPublicToken from "@/admin/hooks/useJobsFromPublicToken";
import { CircularProgress } from "@chakra-ui/react";
import BoardJobCard from "./BoardJobCard";

export default function BoardGrid({ board }) {
  const { jobs, loadingJobs, error } = useJobsFromPublicToken(board);

  return (
    <div className="p-8 m-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4 gap-x-12 gap-y-16">
      {loadingJobs &&
        <CircularProgress isIndeterminate color="gray.600" size={"30px"} />
      }
      {error &&
        <div>Error loading Jobs... Please contact support.</div>
      }
      {jobs?.map((job) => (
        <div key={job.id}>
          {job.status === "listed" &&
            <div key={job.id} className="m-2 border border-1 rounded-lg p-4">
              <div className="flex justify-center">
                <BoardJobCard job={job} />
              </div>
            </div>
          }
        </div>
      ))}
    </div>
  );
}
