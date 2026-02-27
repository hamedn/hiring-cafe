import React from "react";
import ScreenVideoForm from "../screen/ScreenVideoForm";
import useJob from "@/admin/hooks/useJob";
import Head from "next/head";

const SetScreen = ({ jobID, public_access = null }) => {
  const { job, loading, error } = useJob({ job_id: jobID });

  return (
    <>
      <Head>
        <title>Screening Questions - Hiring cafe</title>
      </Head>
      <div className="flex justify-center flex-auto">
        <div className="flex flex-col items-center text-lg max-w-2xl flex-auto">
          <div className="flex flex-col items-center text-center">
            <span className="text-4xl font-medium text-start">{`Set Up Your Videos`}</span>
            {/* <span className="mt-6 text-gray-500 font-medium text-start">{`Only candidates who submitted the job application will be able to view and answer your screening questions.`}</span> */}
          </div>
          <div className="w-full mt-8">
            {loading ? (
              <div className="flex flex-col items-center">
                <div className="w-full h-96 bg-gray-200 animate-pulse" />
              </div>
            ) : error || !job.initial_screen_id ? (
              <div>
                {/* Display error message */}
                <div className="flex flex-col items-center">
                  <span className="text-red-500 font-medium">
                    {error?.message ||
                      "Something went wrong. Please contact support. (Dev: ScreenID not found for job)"}
                  </span>
                </div>
              </div>
            ) : (
              <ScreenVideoForm
                screenID={job.initial_screen_id}
                job_id={jobID}
                public_access={public_access}
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default SetScreen;
