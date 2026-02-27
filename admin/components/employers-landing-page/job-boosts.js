import Head from "next/head";
import { Picture } from "@/utils/picture";
import HomeNavBar from "@/admin/components/HomeNavBar";
import Link from "next/link";
import {
  ChevronDoubleUpIcon,
  CpuChipIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";

export default function JobBoostsEmployersLandingPage() {
  return (
    <>
      <Head>
        <title>HiringCafe Employers - Job Boosts</title>
      </Head>
      <HomeNavBar />
      <div className="flex flex-col flex-auto items-center bg-gray-100">
        <div className="flex justify-center pb-16">
          <div className="p-4 mt-8 flex-auto flex flex-col max-w-5xl items-center">
            <span className="text-4xl font-extrabold italic text-center">
              Get up to 10x more visibility with Job Boosts
            </span>
            <span className="text-xl mt-8">
              {`Job Boosts are designed to help you stand out and attract the right candidates on HiringCafe. Boosted Jobs will appear in strategic places throughout the app, ensuring that your jobs are seen by the right candidates.`}
            </span>
            <div className="mt-16">
              <Link
                href="/employers/form"
                className="text-lg md:text-xl lg:text-2xl xl:text-3xl rounded-full text-white px-8 py-2 font-medium bg-gradient-to-t from-yellow-600 to-yellow-400 hover:from-yellow-700 hover:to-yellow-500 transition-colors duration-500"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
        <div className="flex justify-center w-full bg-white pb-16">
          <div className="p-4 flex-auto flex flex-col max-w-5xl items-center">
            <Picture
              src="/static/images/boosted_job.png"
              properties={"max-w-full"}
              alt="Job Boosts Demo"
            />
            <div className="flex flex-col">
              <div className="mt-16 flex items-start w-full space-x-12">
                <div className="rounded-full shadow-xl border border-gray-50 p-4">
                  <ChevronDoubleUpIcon className="h-9 w-9 text-green-400" />
                </div>
                <div className="flex flex-col space-y-8">
                  <span className="text-3xl font-extrabold">
                    Enhanced Visibility Across the App
                  </span>
                  <span className="text-xl mt-2 text-gray-500">
                    {`Your job is prominently displayed from the top promoted section to related job pages, ensuring maximum exposure across the app (web and mobile).`}
                  </span>
                </div>
              </div>
              <div className="mt-16 flex items-start w-full space-x-12">
                <div className="rounded-full shadow-xl border border-gray-50 p-4">
                  <MagnifyingGlassIcon className="h-9 w-9 text-blue-400" />
                </div>
                <div className="flex flex-col space-y-8">
                  <span className="text-3xl font-extrabold">
                    Expanded Search Reach
                  </span>
                  <span className="text-xl mt-2 text-gray-500">{`Broaden your job's visibility with expanded search term matching, increasing the likelihood of discovery by a diverse set of candidates.`}</span>
                </div>
              </div>
              <div className="mt-16 flex items-start w-full space-x-12">
                <div className="rounded-full shadow-xl border border-gray-50 p-4">
                  <CpuChipIcon className="h-9 w-9 text-pink-400" />
                </div>
                <div className="flex flex-col space-y-8">
                  <span className="text-3xl font-extrabold">
                    Smart Audience Targeting
                  </span>
                  <span className="text-xl mt-2 text-gray-500">
                    {`Our algorithms automatically target and present your job to the most suitable candidates, requiring no extra setup from you.`}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-16 flex justify-center w-full pb-64">
          <div className="p-4 flex-auto flex flex-col max-w-5xl items-center space-y-8">
            <span className="text-3xl font-bold mb-8">
              Frequently Asked Questions
            </span>
            <div className="flex flex-col border border-gray-400 w-full p-4 rounded-xl">
              <span className="text-xl font-bold">{`What is a Job Boost?`}</span>
              <span className="mt-4 font-light">
                {`Job Boosts allow you to enhance the visibility of your `}
                <Link
                  href="/employers/job-postings"
                  className="text-yellow-600 font-bold"
                >
                  job postings
                </Link>
                {` on HiringCafe.`}
              </span>
            </div>
            <div className="flex flex-col border border-gray-400 w-full p-4 rounded-xl">
              <span className="text-xl font-bold">{`How long does each boost last?`}</span>
              <span className="mt-4 font-light">
                {`Each boost lasts for 7 days. You can extend the duration by purchasing additional boosts.`}
              </span>
            </div>
            <div className="flex flex-col border border-gray-400 w-full p-4 rounded-xl">
              <span className="text-xl font-bold">{`How much does it cost?`}</span>
              <span className="mt-4 font-light">
                {`Please check the `}
                <Link
                  href="/employers/pricing#add-ons"
                  className="text-yellow-600 font-bold"
                >
                  Pricing
                </Link>{" "}
                {`page for the latest pricing information.`}
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
