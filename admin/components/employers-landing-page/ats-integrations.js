import Head from "next/head";
import HomeNavBar from "@/admin/components/HomeNavBar";
import DataTransformation from "@/animations/data-transformation.json";
import Link from "next/link";
import {
  ArrowDownIcon,
  ArrowTrendingUpIcon,
  ArrowUpRightIcon,
  UserIcon,
  VideoCameraIcon,
} from "@heroicons/react/24/outline";
import LottieAnimation from "@/components/lottieAnimation";
import { useState } from "react";

export default function ATSIntegrationsEmployersLandingPage() {
  const options = ["Basic ATS Integration", "Advanced ATS Integration"];
  const [selectedOption, setSelectedOption] = useState(0);

  return (
    <>
      <Head>
        <title>HiringCafe Employers - ATS Integrations</title>
      </Head>
      <HomeNavBar />
      <div className="flex flex-col flex-auto items-center bg-gray-100">
        <div className="flex justify-center py-16">
          <div className="flex flex-col space-y-8 lg:flex-row lg:space-y-0 lg:space-x-8 max-w-5xl items-center lg:items-start">
            <div className="p-8 lg:p-4 flex-auto flex flex-col items-center lg:items-start">
              <span className="text-4xl font-extrabold italic text-center lg:text-start">
                Connect Your ATS to HiringCafe
              </span>
              <span className="text-xl mt-8">
                {`HiringCafe integrates with major Applicant Tracking Systems (ATS). Basic and Advanced ATS integrations are available to help you make the most of HiringCafe.`}
              </span>
              <div className="mt-16">
                <Link
                  href="/employers/form"
                  className="text-lg rounded-full text-white px-8 py-2 font-medium bg-gradient-to-t from-yellow-600 to-yellow-400 hover:from-yellow-700 hover:to-yellow-500 transition-colors duration-500"
                >
                  Get Started
                </Link>
              </div>
              <Link
                href="/employers/ats"
                className="font-bold text-yellow-600 mt-8"
              >{`Don't have an ATS?`}</Link>
            </div>
            <div className="">
              <LottieAnimation
                width="400px"
                height="400px"
                animationData={DataTransformation}
                customOptions={{ loop: false }}
              />
            </div>
          </div>
        </div>
        <div className="flex w-full justify-center pt-16 pb-64 bg-white">
          <div className="p-4 flex flex-col flex-auto items-center max-w-7xl">
            <span className="text-4xl font-bold">
              Explore Integration Options
            </span>
            <div
              className={`mt-12 flex items-center space-x-2 bg-orange-100 font-bold rounded-full p-1 overflow-x-auto scrollbar-hide`}
            >
              {options.map((option, i) => (
                <button
                  key={option}
                  onClick={() => {
                    setSelectedOption(i);
                  }}
                  className={`rounded-full flex-none px-4 py-1.5 ${
                    selectedOption === i
                      ? "bg-orange-600 text-white"
                      : "text-orange-600"
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
            <div className="mt-4 flex flex-col max-w-5xl">
              {/* {selectedOption === 0 ? (
                <span className="flex justify-center mt-4 font-bold">
                  Included in all plans
                </span>
              ) : (
                <span className="flex justify-center mt-4 font-bold">
                  For customers on the Gold plan
                </span>
              )} */}
              {selectedOption === 0 ? (
                <div className="flex flex-col mt-16 space-y-16">
                  <div className="flex items-start w-full space-x-12">
                    <div className="rounded-full shadow-xl border border-gray-50 p-4">
                      <ArrowDownIcon className="h-9 w-9 text-slate-600" />
                    </div>
                    <div className="flex flex-col space-y-8">
                      <span className="text-3xl font-extrabold">
                        Automatic Job Imports
                      </span>
                      <div className="flex flex-col space-y-4">
                        <span className="text-xl mt-2 text-gray-500">
                          {`Automatically import job listings from your ATS.`}
                        </span>
                        <span>
                          {`Supported ATS's: All major ATS's. If you don't see your ATS on the dashboard, we'll help you import jobs at no extra cost.`}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-start w-full space-x-12">
                    <div className="rounded-full shadow-xl border border-gray-50 p-4">
                      <ArrowUpRightIcon className="h-9 w-9 text-blue-400" />
                    </div>
                    <div className="flex flex-col space-y-8">
                      <span className="text-3xl font-extrabold">
                        External Job Posting Links
                      </span>
                      <div className="flex flex-col space-y-4">
                        <span className="text-xl mt-2 text-gray-500">{`Direct candidates to job application forms hosted on your ATS.`}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col mt-16 space-y-16">
                  <div className="flex items-start w-full space-x-12">
                    <div className="rounded-full shadow-xl border border-gray-50 p-4">
                      <UserIcon className="h-9 w-9 text-slate-600" />
                    </div>
                    <div className="flex flex-col space-y-8">
                      <span className="text-3xl font-extrabold">
                        Candidate Sync
                      </span>
                      <span className="text-xl mt-2 text-gray-500">
                        {`Push candidates from `}{" "}
                        <Link
                          href="/employers/network"
                          className="font-bold text-yellow-600"
                        >
                          Talent Network
                        </Link>{" "}
                        {` or `}{" "}
                        <Link
                          href="/employers/ats"
                          className="font-bold text-yellow-600"
                        >
                          CareerPage
                        </Link>{" "}
                        {`directly to your ATS. Sync manually or automatically.`}
                      </span>
                    </div>
                  </div>
                  {/* <div className="flex items-start w-full space-x-12">
                    <div className="rounded-full shadow-xl border border-gray-50 p-4">
                      <VideoCameraIcon className="h-9 w-9 text-blue-400" />
                    </div>
                    <div className="flex flex-col space-y-8">
                      <span className="text-3xl font-extrabold">
                        Employer Branding Assets
                      </span>
                      <span className="text-xl mt-2 text-gray-500">{`Automatically pull images, videos, and other assets directly from your career page and have them displayed natively on job postings and reach outs.`}</span>
                    </div>
                  </div> */}
                  <div className="flex items-start w-full space-x-12">
                    <div className="rounded-full shadow-xl border border-gray-50 p-4">
                      <ArrowTrendingUpIcon className="h-9 w-9 text-pink-400" />
                    </div>
                    <div className="flex flex-col space-y-8">
                      <span className="text-3xl font-extrabold">
                        Deeper Insights
                      </span>
                      <span className="text-xl mt-2 text-gray-500">
                        {`Fetch candidate data from your ATS to access advanced reports. Share metrics with your team to evaluate performance and make data-driven decisions.`}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
