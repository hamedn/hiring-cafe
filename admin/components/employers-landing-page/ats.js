import Head from "next/head";
import { Picture } from "@/utils/picture";
import HomeNavBar from "@/admin/components/HomeNavBar";
import Link from "next/link";

export default function ATSEmployersLandingPage() {
  return (
    <>
      <Head>
        <title>HiringCafe Employers - CareerPage</title>
      </Head>
      <HomeNavBar />
      <div className="flex justify-center">
        <div className="flex flex-col flex-auto items-center">
          <div className="flex py-16 px-8">
            <div className="p-4 md:p-8 flex-auto flex flex-col md:flex-row lg:max-w-7xl items-center space-y-8 md:space-y-0 md:space-x-4">
              <div className="flex flex-col md:w-2/5">
                <span className="text-2xl xl:text-3xl font-extrabold">
                  Candidate-friendly application forms at no extra cost
                </span>
                <span className="xl:text-lg mt-8 font-medium">
                  {`Easily display your latest job openings and receive applications from anywhere - through HiringCafe, your website, social media platforms, or other job boards. Candidates aren't required to create a HiringCafe account to apply to your jobs. CareerPage is included in all `}{" "}
                  <Link
                    from
                    your
                    href="/employers/pricing"
                    className="text-yellow-600 font-bold"
                  >
                    plans
                  </Link>{" "}
                  at no extra cost.
                </span>
                <div className="mt-8">
                  <Link
                    href="/employers/form"
                    className="rounded-full text-white px-8 py-2 font-bold bg-gradient-to-t from-yellow-600 to-yellow-400 hover:from-yellow-700 hover:to-yellow-500 transition-colors duration-500"
                  >
                    Build Your Career Page
                  </Link>
                </div>
                <Link
                  href="/employers/ats-integrations"
                  className="font-bold text-yellow-600 mt-8 w-fit"
                >
                  {`Integrates with your ATS!`}
                </Link>
              </div>
              <div className="md:w-3/5">
                <Picture
                  src={"/static/images/careerpage_demo.png"}
                  alt={"ATS Demo"}
                />
              </div>
            </div>
          </div>
          <div className="mt-4 flex justify-center w-full py-16 bg-orange-100">
            <div className="p-4 flex-auto flex flex-col max-w-7xl">
              <div className="flex flex-col flex-auto max-w-xl">
                <span className="text-4xl font-semibold">CareerPage</span>
                <p className="mt-4 text-lg font-medium text-yellow-900">
                  {`Don't have a candidate-friendly ATS? Or looking to improve your candidate experience? CareerPage is the perfect solution for you. Showcase your latest job openings and receive more inbounds. Included in all plans at no extra cost.`}
                </p>
              </div>
              <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-16">
                <div className="flex flex-col space-y-4">
                  <span className="text-xl font-bold">
                    {`Account-Free Application Forms`}
                  </span>
                  <p className="">{`Candidates aren't required to create a HiringCafe account to apply to your jobs. CareerPage application forms are designed for hard-to-fill candidates who typically skip cumbersome application processes.`}</p>
                </div>
                <div className="flex flex-col space-y-4">
                  <span className="text-xl font-bold">
                    Receive Applications From Anywhere
                  </span>
                  <p className="">{`Let job seekers view and apply to your jobs from anywhere. Embed it on your website, share it on social media, post it on other job boards, or send it to your email list.`}</p>
                </div>
                <div className="flex flex-col space-y-4">
                  <span className="text-xl font-bold">
                    Candidate Management & Communication
                  </span>
                  <p className="">
                    {`Don't have an ATS? No problem! CareerPage lets you shortlist candidates and move them through your hiring stages with ease. Keep candidates in loop by sending them notifications - from rejections to offers - with a single click. Ditch the spreadsheets and legacy software.`}
                  </p>
                </div>
                <div className="flex flex-col space-y-4">
                  <span className="text-xl font-bold">Team Collaboration</span>
                  <p className="">
                    {`Keep your team in the loop. Share feedback, notes, and candidate profiles with your team. Collaborate with your team to make better hiring decisions.`}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-center w-full py-16">
            <div className="p-4 flex-auto flex flex-col max-w-5xl items-center space-y-8">
              <span className="text-3xl font-bold mb-8">
                Frequently Asked Questions
              </span>
              <div className="flex flex-col border border-gray-400 w-full p-4 rounded-xl">
                <span className="text-xl font-bold">{`What is CareerPage?`}</span>
                <span className="mt-4 font-light">
                  {`HiringCafe's CareerPage lets you easily launch your career site, build simple application forms that don't require candidates to jump through hoops, track applicants (if you don't have an ATS integration), and collaborate with your team. Candidates aren't required to create a HiringCafe account to apply for your jobs. It's easy to use and included in all plans.`}
                </span>
              </div>
              <div className="flex flex-col border border-gray-400 w-full p-4 rounded-xl">
                <span className="text-xl font-bold">{`Can I use CareerPage if we already have an ATS?`}</span>
                <span className="mt-4 font-light">
                  {`Yes! HiringCafe's CareerPage can be a great addition to your recruiting stack. Companies are using it to provide a better candidate experience (simple application process goes a long way!) and improve their employer brand.`}
                </span>
              </div>
              <div className="flex flex-col border border-gray-400 w-full p-4 rounded-xl">
                <span className="text-xl font-bold">{`Can we integrate it with our ATS?`}</span>
                <span className="mt-4 font-light">
                  {`Yes. Please check our `}
                  <Link
                    href="/employers/ats-integrations"
                    className="text-yellow-600 font-bold"
                  >
                    ATS Integrations
                  </Link>{" "}
                  {`page for more information.`}
                </span>
              </div>
              <div className="flex flex-col border border-gray-400 w-full p-4 rounded-xl">
                <span className="text-xl font-bold">{`How much does it cost?`}</span>
                <span className="mt-4 font-light">
                  {`CareerPage is available in all plans at no extra cost! Check the `}
                  <Link
                    href="/employers/pricing"
                    className="text-yellow-600 font-bold"
                  >
                    Pricing
                  </Link>{" "}
                  {`page for more information.`}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
