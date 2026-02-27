import {
  AcademicCapIcon,
  ArrowTopRightOnSquareIcon,
  BriefcaseIcon,
  BuildingOffice2Icon,
  CheckBadgeIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  ClipboardDocumentListIcon,
  MapPinIcon,
  TrophyIcon,
  WrenchScrewdriverIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import { useEffect, useState } from "react";
import CandidateCardOtherExperiences from "./CandidateCardOtherExperiences";
import CandidateCardProjects from "./CandidateCardProjects";
import CandidateCardEducation from "./CandidateCardEducation";
import CandidateCardCertification from "./CandidateCardCertification";
import CandidateCardAward from "./CandidateCardAward";
import CandidateCardSkill from "./CandidateCardSkill";
import CandidateCardIndustry from "./CandidateCardIndustry";
import useSavedCandidate from "@/admin/hooks/useSavedCandidate";
import { useAuth } from "@/admin/hooks/useAuth";

export default function CandidateCardExperience({ candidate }) {
  const { user, loadingUser } = useAuth();

  const tabs = [
    {
      icon: BriefcaseIcon,
      text: "Additional Work Experience",
      hidden: !candidate.other_experiences?.length,
      component: CandidateCardOtherExperiences,
    },
    {
      icon: ClipboardDocumentListIcon,
      text: "Projects",
      hidden: !candidate.projects?.length,
      component: CandidateCardProjects,
    },
    {
      icon: AcademicCapIcon,
      text: "Education",
      hidden: !candidate.education?.length,
      component: CandidateCardEducation,
    },
    {
      icon: CheckBadgeIcon,
      text: "Certifications",
      hidden: !candidate.certifications?.length,
      component: CandidateCardCertification,
    },
    {
      icon: TrophyIcon,
      text: "Awards",
      hidden: !candidate.awards?.length,
      component: CandidateCardAward,
    },
    {
      icon: WrenchScrewdriverIcon,
      text: "Skills",
      hidden: !candidate.skills?.length,
      component: CandidateCardSkill,
    },
    {
      icon: BuildingOffice2Icon,
      text: "Industry Experience",
      hidden: !candidate.job_industries?.length,
      component: CandidateCardIndustry,
    },
  ];

  const { savedCandidate, setCandidateData } = useSavedCandidate({
    candidate_id: candidate.id,
  });
  const [showWorkExperience, setShowWorkExperience] = useState(true);

  const [selectedTab, setSelectedTab] = useState(
    // If it's education, then select not hidden tab. Otherwise -1
    tabs.findIndex((tab) => !tab.hidden && tab.text === "Education")
  );

  useEffect(() => {
    if (savedCandidate?.hide_candidate_info) {
      setShowWorkExperience(false);
      setSelectedTab(-1);
    } else {
      setShowWorkExperience(true);
    }
  }, [savedCandidate]);

  return (
    <div className="flex flex-col space-y-2">
      {candidate.jobs?.length ? (
        <div className="flex flex-col space-y-2 px-2.5">
          <div className="flex items-center space-x-4 justify-between text-xs font-light">
            <button
              onClick={() => {
                setShowWorkExperience((prev) => {
                  setCandidateData({
                    hide_candidate_info: !prev,
                  });
                  if (prev) {
                    setSelectedTab(-1);
                  }
                  setCandidateData({
                    hide_candidate_info: prev,
                  });
                  return !prev;
                });
              }}
              className={`flex items-center space-x-1`}
            >
              <span className="">
                Work Experience ({candidate.jobs.length})
              </span>
              {showWorkExperience ? (
                <ChevronDownIcon className="h-3 w-3 flex-none" />
              ) : (
                <ChevronRightIcon className="h-3 w-3 flex-none" />
              )}
            </button>
            {candidate.years_of_experience && (
              <span>{`${candidate.years_of_experience}`} years exp</span>
            )}
          </div>
          {showWorkExperience && (
            <div className="flex flex-col border divide-y max-h-64 overflow-y-auto">
              {candidate.jobs.map((job, index) => {
                return (
                  <div
                    key={`${job.title || ""}-${index}`}
                    className={`flex flex-col px-2.5 py-2 ${
                      index === 0 ? "pb-2" : "py-2"
                    } ${
                      job.company &&
                      !candidate.redacted_info &&
                      candidate.jobs?.[index - 1]?.company === job.company
                        ? "border-none pl-8"
                        : ""
                    }`}
                  >
                    <div className="flex items-center justify-between space-x-2 text-xs">
                      <div className="flex flex-col">
                        <span className="text-xs font-bold">{job.title}</span>
                        {job.duration && (
                          <span className="flex-none line-clamp-1">
                            {job.duration}
                          </span>
                        )}
                        {job.company && (
                          <Link
                            href={`https://www.google.com/search?q=${job.company}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center space-x-0.5 text-xs w-fit mt-0.5"
                          >
                            <BuildingOffice2Icon className="h-3 w-3 flex-none" />
                            <span className="line-clamp-1">{job.company}</span>
                            <ArrowTopRightOnSquareIcon className="h-3 w-3 flex-none" />
                          </Link>
                        )}
                        {job.location && (
                          <div className="flex items-center space-x-0.5 mt-0.5">
                            <MapPinIcon className="h-3 w-3 flex-none" />
                            <span className="flex-none">{job.location}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    {job.summary && (
                      <span className="text-xs mt-2">{job.summary}</span>
                    )}
                    {!loadingUser && !user && (
                      <div className="mt-2 text-xs flex justify-center text-gray-500">
                        <span className="border p-1 rounded">
                          Get Recruiter Pro to view more information.
                        </span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      ) : null}
      <div className="flex items-center space-x-4 text-xs px-4 py-0.5">
        {tabs.map((tab, index) => {
          return !tab.hidden ? (
            <button
              onClick={() => {
                // If the tab is already selected, then deselect it
                if (index === selectedTab) {
                  setSelectedTab(-1);
                  return;
                }
                // Otherwise, select the tab
                setSelectedTab(index);
              }}
              key={tab.text}
              className={`p-0.5 ${
                index === selectedTab ? "bg-gray-600 rounded text-white" : ""
              }`}
            >
              <tab.icon className="h-4 w-4 flex-none" />
            </button>
          ) : null;
        })}
      </div>
      {selectedTab >= 0 && (
        // Show the selected tab
        <div className="px-2 space-y-1 flex flex-col">
          {tabs[selectedTab].component({ candidate })}
        </div>
      )}
    </div>
  );
}
