import Head from "next/head";
import HomeNavBar from "@/admin/components/HomeNavBar";
import Link from "next/link";
import { CheckIcon, XMarkIcon } from "@heroicons/react/20/solid";

export default function JobPostingsEmployersLandingPage() {
  return (
    <>
      <Head>
        <title>HiringCafe Employers - Job Postings</title>
      </Head>
      <HomeNavBar />
      <div className="flex justify-center">
        <div className="flex flex-col flex-auto items-center">
          <div className="flex py-16 px-8">
            <div className="p-4 md:p-8 flex-auto flex flex-col lg:max-w-7xl items-center">
              <div className="flex flex-col items-center">
                <span className="text-5xl lg:text-6xl xl:text-7xl font-extrabold">
                  Receive More Inbounds From Talent Seeking{" "}
                  <span className="text-orange-600">Meaningful Work</span>
                </span>
                <span className="text-xl md:text-3xl mt-8">
                  {`Every day, tens of thousands of new job seekers use HiringCafe to find exciting opportunities. Thanks to our obsession with candidate experience, we've successfully attracted many candidates who normally avoid job boards. According to our recent survey, 60% of users use HiringCafe exclusively as their primary job search tool. Additionally, we have consistently scored 80%+ on NPS surveys. Our traffic is growing rapidly, and we're excited to offer you the opportunity to reach this untapped talent pool.`}
                </span>
                <div className="mt-8 md:mt-10 lg:mt-12 xl:mt-14">
                  <Link
                    href="/employers/form"
                    className="text-lg md:text-xl lg:text-2xl xl:text-3xl rounded-full text-white px-8 py-2 font-medium bg-gradient-to-t from-yellow-600 to-yellow-400 hover:from-yellow-700 hover:to-yellow-500 transition-colors duration-500"
                  >
                    Post a Job
                  </Link>
                </div>
              </div>
              <div className="flex justify-center mt-16">
                <video
                  src="/job-postings-demo.mp4"
                  alt="HiringCafe-Demo"
                  className="w-full rounded-3xl shadow-inner"
                  muted
                  controls={false}
                  autoPlay
                  loop
                  playsInline
                />
              </div>
            </div>
          </div>
          <div className="mt-16 flex justify-center w-full pb-16">
            <div className="p-4 flex-auto flex flex-col max-w-7xl">
              <div className="flex flex-col flex-auto max-w-xl">
                <span className="text-4xl font-semibold">
                  Why Candidates Love HiringCafe
                </span>
                <p className="mt-4 text-lg font-medium text-yellow-900">
                  We attract candidates by offering the best job search
                  experience possible. Our frustration with traditional job
                  boards fueled our drive to create HiringCafe. We invite you to
                  give it a try as a candidate to see the difference for
                  yourself.
                </p>
              </div>
              <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-16">
                <div className="flex flex-col space-y-4">
                  <span className="text-xl font-bold">
                    1. Near Perfect Search
                  </span>
                  <p className="">{`Candidates enjoy blazingly fast and accurate search results, receive all the necessary job details in just a few sentences thanks to Quick Job Description cards, and can access advanced filters such as industries in which they have expertise. We leverage AI throughout our platform to make this possible.`}</p>
                </div>
                <div className="flex flex-col space-y-4">
                  <span className="text-xl font-bold">2. Free Tools</span>
                  <p className="">
                    {`With our `}{" "}
                    <Link
                      href="/application-tracker"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-bold text-yellow-600"
                    >
                      job tracking
                    </Link>{" "}
                    {`tool, candidates can track job applications directly on HiringCafe. Recognizing that job hunting can feel like a full-time job itself, we've streamlined the process to boost candidate engagement, driving even more traffic to our site – and bringing you more potential hires.`}
                  </p>
                </div>
                <div className="flex flex-col space-y-4">
                  <span className="text-xl font-bold">
                    3. Unmatched User Experience
                  </span>
                  <p className="">
                    {`We've designed HiringCafe to be the most user-friendly job board on the market. Our clean, intuitive interface makes it easy for candidates to find and apply to jobs. We've also optimized our platform for mobile, ensuring that candidates can access HiringCafe from anywhere. This focus on user experience has helped us attract a diverse pool of candidates.`}
                  </p>
                </div>
                <div className="flex flex-col space-y-4">
                  <span className="text-xl font-bold">4. Source of Truth</span>
                  <p className="">
                    {`We strive to ensure the accuracy and legitimacy of every job posting. We can't believe we have to say this, but unlike other job boards, all job applications link directly to company ATS's (or to `}{" "}
                    <Link
                      href="/employers/ats"
                      className="text-yellow-600 font-bold"
                    >
                      CareerPage
                    </Link>
                    {`). We do not allow 'fake jobs', links to other job boards, or agencies posting on behalf of other companies. With the rise of deceptive job listings`}{" "}
                    and{" "}
                    <Link
                      href="https://en.wikipedia.org/wiki/Ghost_jobs"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-yellow-600 font-bold"
                    >
                      Ghost Jobs
                    </Link>
                    {`, candidates seek reliable platforms. By offering a
                    trustworthy space, we draw in those who might otherwise stay
                    away from job boards.`}
                  </p>
                </div>
              </div>
            </div>
          </div>
          {/* <div className="mt-16 flex justify-center w-full py-16 border-t">
            <div className="flex flex-col max-w-5xl items-center text-center">
              <span className="text-3xl font-bold">
                Free vs Membership Job Postings
              </span>
              <span className="mt-4 text-xl">
                {`We offer two types of job postings: Free and Employer Membership postings. Free postings are available to all companies, while Employer Membership postings are available to companies who purchase a `}{" "}
                <Link
                  href="/employers/pricing"
                  className="text-yellow-600 font-bold"
                >
                  HiringCafe Employer membership
                </Link>{" "}
                plan.
              </span>
              <div className="grid grid-cols-2 gap-8 mt-8">
                <div className="flex flex-col w-full">
                  <span className="my-2 font-bold text-lg">
                    Employer Membership (All Plans)
                  </span>
                  <div className="flex flex-col border rounded-lg p-4 font-bold space-y-2 w-full">
                    <div className="flex items-center space-x-2 w-full">
                      <CheckIcon className="h-4 w-4 text-green-600" />
                      <span>Unlimited job postings</span>
                    </div>
                    <div className="flex items-center space-x-2 w-full">
                      <CheckIcon className="h-4 w-4 text-green-600" />
                      <span>Up to 5x higher ranking in search results</span>
                    </div>
                    <div className="flex items-center space-x-2 w-full">
                      <CheckIcon className="h-4 w-4 text-green-600" />
                      <span>
                        Access to employer dashboard to manage listings
                      </span>
                    </div>
                    <div className="flex items-center space-x-2 w-full">
                      <CheckIcon className="h-4 w-4 text-green-600" />
                      <span>
                        Purchase{" "}
                        <Link
                          className="text-yellow-600 font-bold"
                          href="/employers/job-boosts"
                        >
                          Job Boosts
                        </Link>
                      </span>
                    </div>
                    <div className="flex items-center space-x-2 w-full">
                      <CheckIcon className="h-4 w-4 text-green-600" />
                      <span>Verification badge</span>
                    </div>
                    <div className="flex items-center space-x-2 w-full">
                      <CheckIcon className="h-4 w-4 text-green-600" />
                      <span>Video pitch for company profile</span>
                    </div>
                    <div className="flex items-center space-x-2 w-full">
                      <CheckIcon className="h-4 w-4 text-green-600" />
                      <span>Larger Quick Job Description cards</span>
                    </div>
                    <div className="flex items-center space-x-2 w-full">
                      <CheckIcon className="h-4 w-4 text-green-600" />
                      <span>Send traffic directly to your ATS</span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col w-full">
                  <span className="my-2 font-light text-lg">Free Postings</span>
                  <div className="flex flex-col border rounded-lg p-4 font-light space-y-2 w-full">
                    <div className="flex items-center space-x-2 w-full">
                      <XMarkIcon className="h-4 w-4 text-red-600" />
                      <span>Unlimited job postings</span>
                    </div>
                    <div className="flex items-center space-x-2 w-full">
                      <XMarkIcon className="h-4 w-4 text-red-600" />
                      <span>Up to 5x higher ranking in search results</span>
                    </div>
                    <div className="flex items-center space-x-2 w-full">
                      <XMarkIcon className="h-4 w-4 text-red-600" />
                      <span>
                        Access to employer dashboard to manage listings
                      </span>
                    </div>
                    <div className="flex items-center space-x-2 w-full">
                      <XMarkIcon className="h-4 w-4 text-red-600" />
                      <span>
                        Purchase{" "}
                        <Link
                          className="text-yellow-600 font-bold"
                          href="/employers/job-boosts"
                        >
                          Job Boosts
                        </Link>
                      </span>
                    </div>
                    <div className="flex items-center space-x-2 w-full">
                      <XMarkIcon className="h-4 w-4 text-red-600" />
                      <span>Verification badge</span>
                    </div>
                    <div className="flex items-center space-x-2 w-full">
                      <XMarkIcon className="h-4 w-4 text-red-600" />
                      <span>Video pitch for company profile</span>
                    </div>
                    <div className="flex items-center space-x-2 w-full">
                      <XMarkIcon className="h-4 w-4 text-red-600" />
                      <span>Larger Quick Job Description cards</span>
                    </div>
                    <div className="flex items-center space-x-2 w-full font-bold">
                      <CheckIcon className="h-4 w-4 text-green-600" />
                      <span>
                        {`Send traffic directly to candidate friendly ATS's`}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div> */}
          <div className="mt-16 flex justify-center w-full py-16 border-t">
            <div className="p-4 flex-auto flex flex-col max-w-5xl items-center space-y-8">
              <span className="text-3xl font-bold mb-8">
                Frequently Asked Questions
              </span>
              <div className="flex flex-col border border-gray-400 w-full p-4 rounded-xl">
                <span className="text-xl font-bold">{`How do I post jobs on HiringCafe?`}</span>
                <span className="mt-4 font-light">
                  <span className="mt-2 font-light">
                    <Link
                      href="/employers/pricing"
                      className="text-yellow-600 font-bold"
                    >
                      Join HiringCafe Employer membership
                    </Link>{" "}
                    and post jobs from the dashboard. You can post manually or
                    import jobs from your ATS.
                  </span>
                </span>
              </div>
              <div className="flex flex-col border border-gray-400 w-full p-4 rounded-xl">
                <span className="text-xl font-bold">{`How do I promote my job postings?`}</span>
                <span className="mt-4 font-light">
                  {`You can promote your job postings by purchasing `}{" "}
                  <Link
                    href="/employers/job-boosts"
                    className="text-yellow-600 font-bold"
                  >
                    Job Boosts
                  </Link>{" "}
                  {` from your dashboard.`}
                </span>
              </div>
              <div className="flex flex-col border border-gray-400 w-full p-4 rounded-xl">
                <span className="text-xl font-bold">{`How much does it cost?`}</span>
                <span className="mt-4 font-light">
                  {`Posting jobs is 100% free for all companies! However, we offer additional features and benefits to companies who purchase a plan. See `}
                  <Link
                    href="/employers/pricing"
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
      </div>
    </>
  );
}
