import Link from "next/link";
import { codeToCountry, codeToEmoji } from "@/utils/countryCodes";

export default function BoardJobCard({ job }) {
  if (job.status !== "listed") return "hi";

  const getShortString = (input) => {
    if (input.length < 30) return input;
    else return (`${input.slice(0, 27)}...`);
  };

  const getAddress = () => {
    if (job.job_info.workplace_address) return job.job_info.workplace_address;
    else return codeToCountry[job.job_info.workplace_location] || "Remote-US-Canada";
  };

  return (
    <div
      className="w-72 rounded-2xl pb-4"
    >
      <div className={`flex flex-col mb-2`}>
        <Link
          className={`text-base mt-2 font-medium underline text-blue-500 text-lg`}
          href={`/req/${job.requisition_id}`}
        >
          {getShortString(job.job_info.title)}
        </Link>
        <div className="font-semibold text-lg">
          Job Type: {job.category}
        </div>
        <div
          className="flex flex-col text-sm"
        >
          <span className="font-medium mt-1 text-gray-500">
            {"Salary: "}{job.job_info.salary || "No Salary Info"}{" "}
          </span>
          <span className="text-gray-500 mt-1">
            {codeToEmoji[job.job_info.workplace_location] || "📍"}{" "}
            {getAddress()}
          </span>
        </div>
      </div>
      <Link
        className={`p-2 mt-2 mb-4 bg-blue-500 text-white rounded font-semibold`}
        href={`/req/${job.requisition_id}`}
      >
        Apply Now
      </Link>
    </div>
  );
}
