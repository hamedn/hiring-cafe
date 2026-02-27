import useApplicant from "@/admin/hooks/useApplicant";
import {
  ArrowTopRightOnSquareIcon,
  GlobeAltIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import { FaLinkedin } from "react-icons/fa";
import Resume from "./Resume";

export default function ParsedResume({ applicantId }) {
  const { applicant, loading, error } = useApplicant({ applicantId });

  if (!applicantId) return null;

  if (loading) {
    return <div className="px-8 py-4 animate-pulse bg-gray-300 h-96" />;
  }

  if (error) {
    return null;
  }

  return (
    <div className="flex flex-col px-4 py-2">
      <div className="flex items-center space-x-4">
        {applicant.profile.website && (
          <Link
            href={
              applicant.profile.website.startsWith("http")
                ? applicant.profile.website
                : `https://${applicant.profile.website}`
            }
            target="_blank"
            rel="noopener noreferrer"
          >
            <GlobeAltIcon className="h-6 w-6 text-black rounded-lg" />
          </Link>
        )}
        {applicant.profile.linkedin && (
          <Link
            href={
              applicant.profile.linkedin.startsWith("http")
                ? applicant.profile.linkedin
                : `https://${applicant.profile.linkedin}`
            }
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaLinkedin className="h-6 w-6 text-black rounded-lg" />
          </Link>
        )}
        <Link
          href={applicant.resume}
          target="_blank"
          rel="noopener noreferrer"
          className="border-b border-black"
        >
          <div className="flex space-x-2">
            <span className="font-medium text-sm">Download Resume</span>
            <ArrowTopRightOnSquareIcon className="h-4 w-4 text-black" />
          </div>
        </Link>
      </div>
      {applicant.jobs?.length > 0 ? (
        <div className="flex flex-col max-h-96 overflow-y-auto mt-4">
          {applicant.jobs && applicant.jobs.length > 0 && (
            <div
              className={`flex flex-col ${
                applicant.education &&
                applicant.education.length > 0 &&
                "border-b pb-8"
              }`}
            >
              <span className="font-medium text-xl text-gray-600">
                Experience
              </span>
              {applicant.jobs.map((job, index) => (
                <div key={`${index}`} className="flex flex-col text-sm mt-4">
                  <span className="text-base font-medium">{job.title}</span>
                  <span className="">
                    {job.company} · {job.employment_type}
                  </span>
                  <span className="text-gray-600">
                    {job.start_date}{" "}
                    {job.end_date ? `- ${job.end_date}` : "Present"}
                  </span>
                  <span className="text-gray-600">{job.summary}</span>
                </div>
              ))}
            </div>
          )}
          {applicant.education && applicant.education.length > 0 && (
            <div
              className={`flex flex-col ${
                applicant.jobs && applicant.jobs.length > 0 && "pt-8"
              }`}
            >
              <span className="font-medium text-xl text-gray-600">
                Education
              </span>
              {applicant.education.map((job, index) => (
                <div key={`${index}`} className="flex flex-col text-sm mt-4">
                  <span className="text-base font-medium">{job.institute}</span>
                  {job.credentials && (
                    <span className="">{job.credentials}</span>
                  )}
                  {job.graduation_year && (
                    <span className="text-gray-600">{job.graduation_year}</span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="mt-4">
          <Resume applicant={applicant} />
        </div>
      )}
    </div>
  );
}
