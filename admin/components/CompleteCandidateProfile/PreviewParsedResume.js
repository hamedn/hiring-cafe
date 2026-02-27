import {
  ArrowTopRightOnSquareIcon,
  GlobeAltIcon,
} from "@heroicons/react/24/outline";
import { FaLinkedin } from "react-icons/fa";

export default function PreviewParsedResume() {
  const applicant = {
    profile: {
      website: "www.janedoe.com",
      linkedin: "https://www.linkedin.com/in/jane-doe/",
    },
    resume: "www.example.com/resumes/jane_doe.pdf",
    resume_summary: {
      jobs: [
        {
          title: "Account Executive",
          company: "Bravo",
          employment_type: "Full-time",
          start_date: "Jan 2021",
          end_date: "Present",
          summary:
            "Managed existing client relationships, negotiated contracts, and drove revenue growth by 39%.",
        },
        {
          title: "Junior Customer Success Specialist",
          company: "Starlyk Inc.",
          employment_type: "Full-time",
          start_date: "Jan 2016",
          end_date: "Dec 2017",
          summary:
            "Provided exceptional customer service and support, resolving technical and product issues. Collaborated with the product team to relay customer feedback, and contributed to enhancing user experience.",
        },
        {
          title: "Junior Account Executive",
          company: "Acme Inc.",
          employment_type: "Full-time",
          start_date: "Jan 2016",
          end_date: "Dec 2017",
          summary:
            "Assisted in managing key accounts, supporting sales initiatives, and contributed to improving client satisfaction scores.",
        },
      ],
      education: [
        {
          institute: "University of C",
          credentials: "Master's Degree in Business Administration",
          graduation_year: "2020",
        },
        {
          institute: "University of D",
          credentials: "Bachelor's Degree in Business Administration",
          graduation_year: "2017",
        },
      ],
    },
  };

  return (
    <div className="flex flex-col px-4 py-2">
      <div className="flex items-center space-x-4">
        <GlobeAltIcon className="h-6 w-6 text-black rounded-lg" />
        <FaLinkedin className="h-6 w-6 text-black rounded-lg" />
        <div className="flex space-x-2 border-b border-black">
          <span className="font-medium text-sm">Download Resume</span>
          <ArrowTopRightOnSquareIcon className="h-4 w-4 text-black" />
        </div>
      </div>
      <div className="flex flex-col h-64 overflow-y-auto mt-4">
        {applicant.resume_summary.jobs &&
          applicant.resume_summary.jobs.length > 0 && (
            <div
              className={`flex flex-col ${
                applicant.resume_summary.education &&
                applicant.resume_summary.education.length > 0 &&
                "border-b pb-8"
              }`}
            >
              <span className="font-medium text-xl text-gray-600">
                Experience
              </span>
              {applicant.resume_summary.jobs.map((job, index) => (
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
        {applicant.resume_summary.education &&
          applicant.resume_summary.education.length > 0 && (
            <div
              className={`flex flex-col ${
                applicant.resume_summary.jobs &&
                applicant.resume_summary.jobs.length > 0 &&
                "pt-8"
              }`}
            >
              <span className="font-medium text-xl text-gray-600">
                Education
              </span>
              {applicant.resume_summary.education.map((job, index) => (
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
    </div>
  );
}
