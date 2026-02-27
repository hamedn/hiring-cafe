import { useState } from "react";
import dynamic from "next/dynamic";
import { ArrowDownIcon, ArrowRightIcon } from "@heroicons/react/24/outline";
import { getFirstName } from "@/utils/helpers";
import Link from "next/link";

const EditApplicantModal = dynamic(
  () => import("@/candidates/components/EditApplicantInfoModal"),
  {
    loading: () => "loading...",
  }
);

const WithdrawApplicationModal = dynamic(
  () => import("@/candidates/components/WithdrawApplicationModal"),
  {
    loading: () => "loading...",
  }
);

export default function CandidateProfile({ applicant_info, mutate }) {
  const [isEditModalOpen, setIsModalOpen] = useState(false);
  const [isWithdrawAppModalOpen, setIsWithdrawAppModalOpen] = useState(false);

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

  const renderResumeUrl = () => {
    if (!applicant_info) return "Loading...";
    if (!applicant_info.resume) return "(Not Provided)";
    return (<Link
      target="_blank"
      href={applicant_info.resume}
    >
      Link
    </Link>);
  }

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
        {(applicant_info.stage === "Submitted" || applicant_info.stage === "Initial Video Screen") && (
          <div className={`flex flex-col`}>
            <div className="flex items-center space-x-4">
              <span className="font-medium text-gray-600">
                Confirm Your Information
              </span>
              <button
                className="px-2 text-sm bg-yellow-600 text-white rounded"
                onClick={() => setIsModalOpen(true)}
              >
                Edit
              </button>
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
                <span className="font-medium">Resume</span>
                <span className="font-light underline text-blue text-sm">
                  {renderResumeUrl()}
                </span>
              </div>
            </div>
            {isEditModalOpen && (
              <EditApplicantModal
                onModalClose={() => {
                  setIsModalOpen(false);
                }}
                mutate={mutate}
                applicantInfo={applicant_info}
              />
            )}
            {isWithdrawAppModalOpen && (
              <WithdrawApplicationModal
                onModalClose={() => {
                  setIsWithdrawAppModalOpen(false);
                }}
                mutate={mutate}
                applicantInfo={applicant_info}
              />
            )}
          </div>
        )}
        <div className="flex flex-col items-center" id="withdraw">
          <button
            className="px-2 text-sm bg-red-600 text-white rounded"
            onClick={() => setIsWithdrawAppModalOpen(true)}
          >
            Withdraw
          </button>
        </div>
      </div>
    </div>
  );
}
