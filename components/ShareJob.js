import Link from "next/link";
import { useState } from "react";
import { FaLink, FaLinkedinIn, FaShare, FaTwitter } from "react-icons/fa";

// Accepts either a full `job` object (preferred),
// or legacy props: `requisition_id` or `job_id`.
export default function ShareJob({ job, requisition_id, job_id }) {
  const reqId = job?.requisition_id || requisition_id || null;
  const legacyId = job?.objectID || job_id || null;
  const url = reqId
    ? `https://hiring.cafe/viewjob/${encodeURIComponent(reqId)}`
    : legacyId
      ? `https://hiring.cafe/job/${btoa(legacyId)}`
      : `https://hiring.cafe/`;
  const [copyLinkText, setCopyLinkText] = useState("Copy link");

  const shares = [
    {
      icon: FaLinkedinIn,
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${url}`,
      color: "blue-600",
      name: "LinkedIn",
    },
    {
      icon: FaTwitter,
      url: `https://twitter.com/intent/tweet?text=Check out this job: ${url}`,
      color: "black",
      name: "X",
    },
  ];

  return (
    <div className="flex flex-col mx-auto items-center text-center text-xs">
      <span className="font-medium text-base">Share this job</span>
      {/* {job.id}  */}
      <div className="flex items-center space-x-6 mt-8">
        {shares.map((share) => (
          <Link
            key={share.name}
            href={share.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center text-center space-y-2"
          >
            <div className={`bg-${share.color} text-white p-3 rounded-full`}>
              <share.icon className="w-6 h-6" />
            </div>
            <span className="">{share.name}</span>
          </Link>
        ))}
        <button
          onClick={() => {
            navigator.clipboard.writeText(url);
            setCopyLinkText("Link copied!");
          }}
          className="flex flex-col items-center text-center space-y-2"
        >
          <div className={`bg-gray-600 text-white p-3 rounded-full`}>
            <FaLink className="w-6 h-6" />
          </div>
          <span className="">{copyLinkText}</span>
        </button>
      </div>
      <button
        onClick={() => {
          if (navigator.share) {
            navigator
              .share({
                title: `Check out this job on HiringCafe`,
                url: url,
              })
              .catch((error) => {
                console.trace(error);
              });
          }
        }}
        className={`flex flex-col items-center text-center mt-8 space-y-2 ${
          navigator.share ? "block" : "hidden"
        }`}
      >
        <div className={`bg-gray-600 text-white p-3 rounded-full`}>
          <FaShare className="w-6 h-6" />
        </div>
        <span className="">Share via</span>
      </button>
    </div>
  );
}
