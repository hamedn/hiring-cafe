import React, { useEffect, useState } from "react";
import axios from "axios";
import { updateMarketplaceJob } from "@/admin/utils/client/updateMarketplaceJob";

const ReactQuill =
  typeof window === "object" ? require("react-quill") : () => false;
import "quill/dist/quill.snow.css";
import useJob from "@/admin/hooks/useJob";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import { doc, updateDoc } from "firebase/firestore";
import { clientFirestore } from "@/admin/lib/firebaseClient";
import Head from "next/head";

const JobDescription = ({ job_id, public_access = null }) => {
  const [jobTitle, setJobTitle] = useState("");
  const [salary, setSalary] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const { job, loading, error } = useJob({ job_id });

  useEffect(() => {
    if (job) {
      if (job.job_info?.job_description) {
        setJobDescription(job.job_info.job_description);
      }

      if (job.job_info?.title) {
        setJobTitle(job.job_info.title);
      }

      if (job.job_info?.salary) {
        setSalary(job.job_info.salary);
      }
    }
  }, [job]);

  if (error) {
    return (
      <div className="flex items-center space-x-2 text-red-600">
        <ExclamationTriangleIcon className="flex-none h-5 w-5" />
        <span>Error loading job: {error.message}</span>
      </div>
    );
  }

  const validateJobDesc = () => {
    const strippedDesc = jobDescription.replace(/(<([^>]+)>)/gi, "");
    return strippedDesc.length > 0;
  };

  const updateJob = async (updateKey, updateValue) => {
    try {
      if (public_access) {
        const dataToSend = {
          job_id: job_id,
          access_token: public_access,
        };
        dataToSend[updateKey] = updateValue;
        await axios.post(`/api/adminpublicjob/updateJobPublic`, dataToSend);
      } else {
        await updateDoc(doc(clientFirestore, "jobs", job_id), {
          [`job_info.${updateKey}`]: updateValue,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Head>
        <title>Job Description - Hiring cafe</title>
      </Head>
      <div className="flex flex-auto flex-col items-center text-lg p-5 space-y-6">
        <span className="text-4xl font-medium pb-10">
          {`Enter job description`}
        </span>
        <div className="w-full max-w-2xl">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="jobTitle"
          >
            Job Title <a className="text-xs text-red-500">{" *"}</a>
          </label>
          <input
            id="jobTitle"
            type="text"
            value={jobTitle}
            onChange={(e) => setJobTitle(e.target.value)}
            onBlur={() => {
              if (jobTitle && jobTitle !== job.job_info?.title) {
                updateJob("title", jobTitle);
                updateMarketplaceJob(job, "job_title", jobTitle);
              }
            }}
            placeholder={loading ? "Loading..." : "Account Executive"}
            disabled={loading}
            className={`w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md max-w-2xl ${loading && "animate-pulse bg-gray-200"
              }`}
          />
        </div>
        <div className="w-full max-w-2xl">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="salary"
          >
            Salary <a className="text-xs text-red-500">{" *"}</a>
          </label>
          <input
            id="salary"
            value={salary}
            onChange={(e) => setSalary(e.target.value)}
            onBlur={() => {
              if (salary != job.job_info?.salary) {
                updateJob("salary", salary);
                updateMarketplaceJob(job, "salary_range", salary);
              }
            }}
            placeholder={
              loading
                ? "Loading..."
                : "$120k - $150k OTE ($80k base + $40k commission)"
            }
            disabled={loading}
            className={`w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md ${loading && "animate-pulse bg-gray-200"
              }`}
          />
        </div>
        <div id="jobDescription" className="w-full max-w-2xl">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="jobDescription"
          >
            Job Description
          </label>
          {loading ? (
            <div className="animate-pulse bg-gray-200 h-96 rounded"></div>
          ) : (
            <ReactQuill
              className="h-96 mb-12"
              theme="snow"
              value={jobDescription}
              onBlur={() => {
                if (validateJobDesc() && jobDescription != job.job_info.job_description) {
                  updateJob("job_description", jobDescription);
                  updateMarketplaceJob(job, "job_description", jobDescription);
                }
              }}
              onChange={setJobDescription}
              modules={{
                toolbar: [
                  [{ header: [1, false] }],
                  ["bold", "italic", "underline", "strike"],
                  [{ list: "ordered" }, { list: "bullet" }],
                  ["link"],
                ],
              }}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default JobDescription;
