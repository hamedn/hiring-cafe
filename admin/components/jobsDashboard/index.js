import useJobs from "@/admin/hooks/useJobs";
import Head from "next/head";
import JobsGrid from "./JobsGrid";
import { CircularProgress } from "@chakra-ui/react";
import useBoardSubscription from "@/admin/hooks/useBoardSubscription";
import { useAuth } from "@/admin/hooks/useAuth";
import { withBoard } from "../withUserCheck";

function JobsDashboard() {
  const { jobs, loading } = useJobs();
  const { userData } = useAuth();
  const { subscription, loading: loadingSubscription } = useBoardSubscription({
    board_id: userData?.board || "",
  });

  return (
    <>
      <Head>
        <title>Jobs | HiringCafe</title>
      </Head>
      <div className="flex xl:justify-center my-8 mx-8">
        <span className="m-2 text-xl font-bold items-center">Your Jobs</span>
      </div>
      <div className="flex xl:justify-center my-16 mx-8">
        <div className="flex flex-col flex-auto max-w-7xl">
          {loading || loadingSubscription ? (
            <CircularProgress isIndeterminate color="gray.600" size={"30px"} />
          ) : (
            <JobsGrid jobs={jobs} subscription={subscription} />
          )}
        </div>
      </div>
    </>
  );
}

export default withBoard(JobsDashboard);
