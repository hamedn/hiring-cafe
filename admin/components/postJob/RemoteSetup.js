import React from "react";
import TimezoneSelection from "./TimezoneSelection";
import Head from "next/head";
import useJob from "@/admin/hooks/useJob";
import { clientFirestore } from "@/admin/lib/firebaseClient";
import { doc, setDoc } from "firebase/firestore";
import { ISO_COUNTRIES } from "@/utils/backend/countries";
import { useState, useEffect } from "react";
import axios from "axios";
import { updateMarketplaceJob } from "@/admin/utils/client/updateMarketplaceJob";

const RemoteSetup = ({ job_id, public_access = null }) => {
  const { job, error, loading } = useJob({ job_id });
  const [address, setAddress] = useState("");

  useEffect(() => {
    if (!job?.job_info?.workplace_address) return;
    setAddress(job.job_info.workplace_address);
  }, [job]);

  const updateObject = async (key, value) => {
    try {
      if (public_access) {
        const dataToSend = {
          job_id: job_id,
          access_token: public_access,
        };
        dataToSend[key] = value;
        await axios.post(`/api/adminpublicjob/updateJobPublic`, dataToSend);
      } else {
        const mergeObj = {
          job_info: {},
        };
        mergeObj.job_info[key] = value;
        await setDoc(doc(clientFirestore, "jobs", job_id), mergeObj, {
          merge: true,
        });
      }
      job.job_info[key] = value;
    } catch (error) {}
  };

  if (loading || error) return null;

  return (
    <>
      <Head>
        <title>Remote Setup - Hiring cafe</title>
      </Head>
      <div className="flex justify-center">
        <div className="flex flex-col max-w-2xl space-y-2">
          <span className="text-4xl font-medium mb-8 flex justify-center">{`Enter location information`}</span>
          <div className="flex items-center text-center space-x-4">
            <span className="font-medium">{`Workplace Type`}</span>
            <select
              value={job.job_info.workplace}
              onChange={async (e) => {
                const newValue = e.target.value;
                await updateObject("workplace", newValue);
                if (newValue !== "Remote") {
                  await updateObject("workplace_address_type", "address");
                  await updateObject("workplace_address", "");
                  setAddress("");
                } else {
                  await updateObject("workplace_address_type", "anywhere");
                  await updateObject("workplace_address", "Anywhere");
                  setAddress("Anywhere");
                }
              }}
              className="p-1 m-1 border border-1 rounded"
            >
              <option value={"Remote"}>Remote</option>
              <option value={"Hybrid"}>Hybrid</option>
              <option value={"In-Office"}>In-Office</option>
            </select>
          </div>
          {/* <div className="flex items-center text-center space-x-4">
            <span className="font-medium">{`What country is this job located in?`}</span>
            <select
              id="country"
              value={job.job_info.workplace_location}
              onChange={async (e) => {
                const newValue = e.target.value;
                await updateObject("workplace_location", newValue);
                await updateMarketplaceJob(job, "country", newValue);
              }}
              className="m-1 p-1 bg-white border border-gray-300 rounded-md text-gray-900 shadow-sm focus:border-yellow-600 focus:outline-none"
            >
              {Object.keys(ISO_COUNTRIES).map((c) => (
                <option key={c} value={c}>
                  {ISO_COUNTRIES[c]}
                </option>
              ))}
            </select>
          </div> */}
          <div className="flex flex-col mt-4">
            <span className="font-medium">
              {`Where is this job located?`}
              <span className="text-red-600 font-bold"> *</span>
            </span>
          </div>
          <span className="text-xs bg-gray-200 p-2 rounded w-full max-w-sm">
            {`Pro tip: You may enter as broad (ex North America or
            Europe) or as specific (ex San Francisco, CA) as you'd like. Our system
            will automatically surface your job to the right candidates.`}
          </span>
          <div className="mt-4 w-full">
            <input
              type="text"
              placeholder="Ex: New York or SF"
              value={address}
              className="w-full m-1 py-1 px-4 bg-white border border-gray-300 rounded-md text-gray-900 shadow-sm focus:border-yellow-600 focus:outline-none"
              onChange={(e) => setAddress(e.target.value)}
              onBlur={async (e) => {
                const newValue = e.target.value;
                await updateObject("workplace_address", newValue);
                await updateMarketplaceJob(job, "addressLocality", newValue);
                await updateMarketplaceJob(job, "job_location", newValue);
              }}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default RemoteSetup;
