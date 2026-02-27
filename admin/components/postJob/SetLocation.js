import { clientFirestore } from "@/admin/lib/firebaseClient";
import { doc, setDoc } from "firebase/firestore";
import { ISO_COUNTRIES, regions } from "@/utils/backend/countries";
import { useState, useEffect } from "react";
import axios from "axios";
import { updateMarketplaceJob } from "@/admin/utils/client/updateMarketplaceJob";

const SetLocation = ({ job_id, job, public_access = null }) => {
  const [locationType, setLocationType] = useState("anywhere");
  const [locationAddress, setLocationAddress] = useState("");

  useEffect(() => {
    setLocationType(job.job_info.workplace_address_type);
    setLocationAddress(job.job_info.workplace_address);
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
    } catch (error) { }
  };

  return (
    <div className="flex flex-col text-center space-y-4">
      <div className="font-medium">
        {"Where do you allow applicants for this job to work from?"}
      </div>
      <select
        className="p-1 m-1 border border-1 rounded"
        value={locationType}
        onChange={async (e) => {
          const newValue = e.target.value;
          setLocationType(newValue);
          await updateObject("workplace_address_type", newValue);
          if (newValue === "anywhere") {
            await updateObject("workplace_address", "Anywhere");
            await updateMarketplaceJob(job, "addressLocality", "Remote");
            await updateMarketplaceJob(job, "job_location", "Remote");
          } else {
            await updateObject("workplace_address", "");
          }
          job.job_info.workplace_address_type = newValue;
          job.job_info.workplace_address = "";
        }}
      >
        <option value="" disabled>
          Select...
        </option>
        <option value={"region"}>Limit by Region</option>
        <option value={"country"}>Limit by Country</option>
        <option value={"anywhere"}>Anywhere in the world</option>
        <option value={"address"}>Custom Location</option>
      </select>
      {locationType === "region" && (
        <div>
          <div>What region do you want to limit applicants to?</div>
          <select
            className="p-1 m-1 border border-1 rounded"
            value={locationAddress}
            onChange={async (e) => {
              setLocationAddress(e.target.value);
              await updateObject("workplace_address", e.target.value);
              job.job_info.workplace_address = e.target.value;
              await updateMarketplaceJob(job, "addressLocality", e.target.value);
              await updateMarketplaceJob(job, "job_location", e.target.value);
            }}
          >
            <option value="" disabled>
              Select...
            </option>
            {regions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
      )}
      {locationType === "country" && (
        <div>
          <div>What country do you want to limit applicants to?</div>
          <select
            className="p-1 m-1 border border-1 rounded"
            value={locationAddress}
            onChange={async (e) => {
              setLocationAddress(e.target.value);
              await updateObject("workplace_address", e.target.value);
              job.job_info.workplace_address = e.target.value;
              const countryName = ISO_COUNTRIES[e.target.value];
              await updateMarketplaceJob(job, "addressLocality", countryName);
              await updateMarketplaceJob(job, "job_location", countryName); 
            }}
          >
            <option value="" disabled>
              Select...
            </option>
            {Object.keys(ISO_COUNTRIES).map((c) => (
              <option key={c} value={c}>
                {ISO_COUNTRIES[c]}
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
};

export default SetLocation;
