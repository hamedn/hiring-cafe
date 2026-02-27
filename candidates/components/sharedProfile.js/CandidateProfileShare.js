import { ArrowDownIcon } from "@heroicons/react/24/outline";

export default function CandidateProfileShare({ applicant_info }) {
  const getStages = () => {
    return [
      "Submitted",
      "Initial Video Screen",
      ...(applicant_info.stages || []),
    ];
  };

  const currStage = () => {
    return applicant_info.stage === "Submitted"
      ? "Initial Video Screen"
      : applicant_info.stage;
  };

  const hideComponent = () => {
    if (applicant_info.stage === "Rejected") return true;
    if (applicant_info.stage === "Withdrawn") return true;
    if (applicant_info.stage === "Submitted" && applicant_info.job_status === "unlisted") return true;
    return false;
  }

  if (hideComponent()) return null;

  return (
    <div className="flex justify-center ">
      <div className={`flex flex-col space-y-8 w-full lg:max-w-lg`}>
        {(applicant_info.stage === "Submitted" ||
          applicant_info.stage === "Initial Video Screen") && (
            <div className={`flex flex-col`}>
              <div className="flex items-center space-x-4">
                <span className="font-medium text-gray-600">
                  Applicant's Information
                </span>
              </div>
              <div className="flex flex-col divide-y border rounded-xl mt-2">
                <div className="flex flex-col space-y-1 px-6 py-2">
                  <span className="font-medium">Name</span>
                  <span className="font-light text-sm">
                    {applicant_info.profile.name}
                  </span>
                </div>
                <div className="flex flex-col space-y-1 px-6 py-2">
                  <span className="font-medium">Email</span>
                  <span className="font-light text-sm">
                    {applicant_info.profile.contact_email}
                  </span>
                </div>
                <div className="flex flex-col space-y-1 px-6 py-2">
                  <span className="font-medium">Phone</span>
                  <span className="font-light text-sm">
                    {applicant_info.profile.phone || "(Not Provided)"}
                  </span>
                </div>
              </div>
            </div>
          )}
        <div className={`flex flex-col`}>
          <span className="font-medium text-gray-600">
            Interview Process for {applicant_info.jobInfo.title} at{" "}
            {applicant_info.boardName}
          </span>
          <div
            className={`flex flex-col text-center items-center rounded-xl mt-2 border p-4`}
          >
            {getStages().map((stage, index) => (
              <div key={stage} className="flex flex-col items-center">
                <span
                  className={`${stage === currStage()
                    ? "font-medium text-black"
                    : "font-light text-gray-600"
                    }`}
                >
                  {stage === "Submitted"
                    ? "Submit Application"
                    : stage === "Initial Video Screen"
                      ? `Initial Video Screen`
                      : stage}
                </span>
                {index !== getStages().length - 1 && (
                  <ArrowDownIcon className="flex-none w-4 h-4 text-gray-400 my-2" />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
