import HomeNavBar from "@/admin/components/HomeNavBar";
import { Picture } from "@/utils/picture";
import Head from "next/head";
import Link from "next/link";
import { FaLinkedin, FaReddit, FaTwitter, FaYoutube } from "react-icons/fa";

export default function EmployersForm() {
  return (
    <>
      <Head>
        <title>HiringCafe Employers - About Us</title>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0"
        />
      </Head>
      <HomeNavBar />
      <div className="flex justify-center mb-64">
        <div className="flex flex-col p-4 lg:p-16 w-full max-w-6xl items-center">
          <div className="mb-32 flex flex-col">
            <span className="text-4xl font-bold">Our Leadership</span>
            <div className="mt-16 flex items-start space-x-16">
              <Picture
                src="/static/images/ali-mir-hiringcafe.png"
                alt="Ali Mir"
                properties={
                  "h-48 w-48 rounded-xl shadow border-4 border-white object-cover"
                }
              />
              <div className="flex flex-col">
                <span className="text-2xl font-bold">Ali Mir</span>
                <span className="font-light">
                  Previously engineering at Meta, Doordash, and Rippling
                </span>
                <Link
                  href="https://www.linkedin.com/in/ali-mir-44541a253/"
                  target="_blank"
                  rel="noreferrer"
                  className="mt-4 text-yellow-600 font-bold w-fit"
                >
                  LinkedIn
                </Link>
              </div>
            </div>
            <div className="mt-16 flex items-start space-x-16">
              <Picture
                src="/static/images/hamed.png"
                alt="Hamed Nilforoshan"
                properties={
                  "h-48 w-48 rounded-xl shadow border-4 border-white object-cover"
                }
              />
              <div className="flex flex-col">
                <span className="text-2xl font-bold">Hamed Nilforoshan</span>
                <span className="font-light">
                  C.S. PhD at Stanford University
                </span>
                <div className="flex items-center space-x-2">
                  <Link
                    href="https://www.hamedn.com/"
                    target="_blank"
                    rel="noreferrer"
                    className="mt-4 text-yellow-600 font-bold"
                  >
                    Website
                  </Link>
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-start space-x-8 w-full">
            <span className="text-5xl xl:text-6xl w-1/4 font-medium">
              Our Story
            </span>
            <div className="flex flex-col w-3/4">
              <div className="flex flex-col">
                <span className="text-3xl font-medium">
                  Why we started HiringCafe
                </span>
                <p className="mt-4">
                  {`HiringCafe was created by accident. We never intended to build yet another job site. In late 2022, when we used job boards to find talent, the results were disappointing. We quickly realized the issue: job boards were not designed for the modern job seeker. Try this experiment—go to any job board, from Indeed to LinkedIn, and search for a job. You’ll encounter plenty of job postings, but the experience is so poor that you’ll likely lose interest after a few searches.`}
                </p>
                <p className="mt-8">
                  {`That's when we realized why 'top talent' avoids job boards. From irrelevant search results to outdated job postings, to full-on scams and jobs posted by agencies on behalf of other companies, it’s a complete mess. So, we decided to build a job site that we would want to use ourselves. A job site that delivers near-perfect search results, directs users to simple application forms, and is free of scams.`}
                </p>
                <p className="mt-8">
                  {`After several weeks of iteration, we launched our first version on Blind`}
                  {" ("}
                  <Link
                    href="https://www.teamblind.com/post/10392-remote-job-openings-uMXhLF7L"
                    className="text-yellow-600 font-bold"
                    target="_blank"
                    rel="noreferrer"
                  >
                    view post
                  </Link>
                  {" ) "}
                  and Reddit{" ("}
                  <Link
                    href="https://www.reddit.com/r/ChatGPT/comments/16c0b6p/i_used_gpt_to_fetch_40918_remote_jobs/?utm_source=share&utm_medium=web2x&context=3"
                    className="text-yellow-600 font-bold"
                    target="_blank"
                    rel="noreferrer"
                  >
                    view post
                  </Link>
                  {")"}
                  {`. Our post on Blind brought us to the front page of the app, and our Reddit post reached the top of the r/ChatGPT subreddit. We gained so much traction that our systems crashed, and we had to shut down for a few weeks to redesign our architecture. We hadn't anticipated such a response, but we were thrilled to see it!`}
                </p>
                <p className="mt-8">{`Since then, we've been iterating constantly and consistently delivering a product that is one step closer to our vision. We've developed a platform that we're proud of, and we're excited to share it with you!`}</p>
              </div>
              <div className="mt-16 flex flex-col">
                <span className="text-3xl font-medium">{`What we're obsessed about`}</span>
                <p className="mt-4">{`We're obsessed with quality and user experience, equally for candidates and employers. For candidates, we constantly ask ourselves, 'How can we create the best job search experience possible?'. For employers, the question is, 'What can we do to provide employers with more 'Open for Work', qualified candidates?'.`}</p>
                <p className="mt-4">
                  {`Answering these questions is challenging, but that's precisely why our team is so passionate about what we do—we love tackling hard problems!`}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
