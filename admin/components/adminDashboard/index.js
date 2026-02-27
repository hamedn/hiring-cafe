import useJobs from "@/admin/hooks/useJobs";
import Head from "next/head";
import { useEffect, useState } from "react";
import SelectStage from "./selectStage";
import ApplicantsGrid from "./ApplicantsGrid";
import Script from "next/script";
import { withBoard } from "../withUserCheck";

function AdminDashboard() {
  const [currentJobID, setCurrentJobID] = useState(null);
  const [selectedStage, setSelectedStage] = useState("Initial Video Screen");
  const [currentJobIndex, setCurrentJobIndex] = useState(null);
  const { jobs } = useJobs();

  useEffect(() => {
    if (!jobs || jobs.length === 0) return;
    setCurrentJobID(jobs[0].id);
    setCurrentJobIndex(0);
  }, [jobs]);

  const setJob = (index) => {
    setCurrentJobIndex(index);
    setCurrentJobID(jobs[index].id);
  };

  const jobSelector = () => {
    if (!jobs) return null;
    return (
      <select
        className={`flex flex-auto max-w-lg rounded border border-black px-2 mx-4 text-gray-500`}
        value={currentJobIndex}
        onChange={(e) => {
          setJob(e.target.value);
          setSelectedStage("Initial Video Screen");
        }}
      >
        {jobs.length &&
          jobs.map((jobObject, index) => (
            <option key={index} value={index}>
              {jobObject.job_info.title}
            </option>
          ))}
      </select>
    );
  };

  return (
    <>
      <Script id="hs-script-loader" src="//js-na1.hs-scripts.com/23987192.js" />
      <Head>
        <title>Applicants | HiringCafe</title>
      </Head>
      <div className="flex xl:justify-center my-8 mx-8">
        <div className="flex flex-col flex-auto max-w-7xl">
          {jobs?.[currentJobIndex]?.job_info?.title && (
            <div className="flex items-center text-3xl font-medium space-x-4">
              <span className="flex-none">Applicants for</span>
              {jobSelector()}
            </div>
          )}

          <SelectStage
            jobId={currentJobID}
            selectedStage={selectedStage}
            onStageSelect={setSelectedStage}
          />
          <div className="mt-8">
            <ApplicantsGrid jobId={currentJobID} stage={selectedStage} />
          </div>
        </div>
      </div>
    </>
  );
}

export default withBoard(AdminDashboard);
