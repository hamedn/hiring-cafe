import HomeNavBar from "@/admin/components/HomeNavBar";
import { Picture } from "@/utils/picture";
import {
  BuildingOffice2Icon,
  MapIcon,
  MapPinIcon,
  Squares2X2Icon,
} from "@heroicons/react/24/outline";
import Head from "next/head";
import Link from "next/link";
import { FaAmazon, FaApple } from "react-icons/fa";

export default function EmployersLandingPage() {
  const candidateTestimonials = [
    {
      author: "Leah",
      text: "Thank you for doing this!!",
      position: "Enterprise Account Executive",
    },
    {
      author: "",
      text: "Amazing site. Much better than LinkedIn 👏",
      position: "Software Engineer at DataDog",
    },
    {
      author: "",
      text: "This is Amazing! Did you build this yourself? Way better than LinkedIn, ZipRecruiter, Google, etc where they have teams of SWEs building these",
      position: "Employee at Amazon",
    },
    {
      author: "Andrew",
      text: "Absolutely incredible. If you are on the job hunt. You might find a role you didn't even know was interesting to you",
      position: "Solutions Engineer",
    },
    {
      author: "Kevin",
      text: "It’s been a great resource for me in my job search over the last month or so. It’s intuitive and straightforward.",
      position: "QA Analyst",
    },
    {
      author: "",
      text: "Realizes LinkedIn does not have ALL jobs. Drops Jaw. Applies Furiously.",
      position: "Software Engineer at Zoom",
    },
    {
      author: "",
      text: "I f*ckin love you",
      position: "Employee at Google",
    },
    {
      author: "David",
      text: "this is fantastic!",
      position: "Sales Ops",
    },
    {
      author: "",
      text: "This is dope. If you ever monetize this, please hire me.",
      position: "Employee at Affirm",
    },
    {
      author: "",
      text: "This is awesome - well done!",
      position: "Recruiter at Pinterest",
    },
    {
      author: "",
      text: "Cool 🆒😎",
      position: "Engineering Manager at Google",
    },
    {
      author: "",
      text: "I would gladly pay money to use this.",
      position: "Design at BigCommerce",
    },
    {
      author: "",
      text: "Thank you so much for such as awesome portal!! Kudos!!",
      position: "Product Manager at Microsoft",
    },
    {
      author: "",
      text: "Love it. Good job on creating this site.",
      position: "Data at Amazon",
    },
    {
      author: "",
      text: "I only stumbled upon this yesterday but this is definitely more useful than linkedin. You are doing God's work. Thank you",
      position: "Employee at Adyen",
    },
    {
      author: "",
      text: "You're a legend! This is exactly what I was needing.",
      position: "Reddit user",
    },
    {
      author: "",
      text: "We just went through a massive layoff. Good people were fired. I’m sharing this with as many as I can. Thank you!",
      position: "Reddit user",
    },
    {
      author: "Larbi",
      text: "For those of you currently looking for #remotework, check out hiring.cafe",
      position: "Chief of Staff at a Bio company",
    },
    {
      author: "Zaza",
      text: "I've found that utilizing job boards can be an excellent way to enhance your job search and find the perfect job for you. Check out HiringCafe.",
      position: "DEI Talent Strategist",
    },
    {
      author: "",
      text: "Amazing job! Love the filters and super clean UI! And holy sh*t having the Requirements show directly is also super smart to avoid waste of time!",
      position: "Reddit user",
    },
    {
      author: "",
      text: "It's fast. You should put in a few milliseconds delay so it looks like it's doing something. This is great.",
      position: "Reddit user",
    },
  ];

  return (
    <>
      <Head>
        <title>HiringCafe For Employers</title>
      </Head>
      <div className="flex flex-col mb-16">
        <HomeNavBar />
        <div className="flex justify-center mt-4">
          <div className="p-4 md:p-8 flex-auto flex flex-col md:flex-row lg:max-w-6xl items-center space-y-8 md:space-y-0 md:space-x-4">
            <div className="flex flex-col md:w-2/3">
              <span className="text-2xl font-semibold rounded text-orange-600">
                HiringCafe Employer Portal
              </span>
              <span className="mt-8 text-5xl md:text-6xl lg:text-7xl xl:text-7xl font-extrabold">
                {`Reach More Talent With HiringCafe`}
              </span>
              <span className="mt-8 text-2xl">
                {`The fastest way to reach talent with experience in Engineering, Sales, Marketing, Product, Design, Project Management, and more, with backgrounds in Tech, Health, Fintech, Education, E-Commerce, Non-Profit, Government, and beyond.`}
              </span>
              <span className="mt-8 text-2xl">
                {`The HiringCafe Employer Portal gives all the tools you need to post jobs and source talent on `}{" "}
                <Link href="/" className="text-yellow-600 font-bold">
                  HiringCafe
                </Link>
                .
              </span>
              <div className="mt-8 md:mt-10 lg:mt-12 xl:mt-14">
                <Link
                  href="/employers/form"
                  className="text-lg md:text-xl lg:text-2xl xl:text-3xl rounded-full text-white px-8 py-2 font-medium bg-gradient-to-t from-yellow-600 to-yellow-500 hover:from-yellow-700 hover:to-yellow-600 transition-colors duration-500"
                >
                  Get Started
                </Link>
              </div>
              <span className="mt-8">
                Job Seeker?{" "}
                <Link href={"/"} className="w-fit underline">
                  Click here.
                </Link>
              </span>
            </div>
            <div className="md:w-1/3 flex justify-center">
              <video
                src="/static/HCDemo.mp4"
                alt="HiringCafe-Demo"
                className="lg:max-h-full lg:h-[600px] rounded-3xl shadow-xl object-contain"
                muted
                controls={false}
                autoPlay
                loop
                playsInline={false}
              />
            </div>
          </div>
        </div>
        <div className="flex flex-col mt-16 px-16 select-none py-16 bg-orange-50 bg-opacity-50">
          <div className="flex flex-col items-center text-center">
            <span className="mt-2 text-2xl font-semibold">
              {`Trusted by World's Leading Companies`}
            </span>
          </div>
          <div className="mt-16 flex items-center space-x-8 grayscale justify-between">
            <Picture
              src={"/static/images/amazon-logo.webp"}
              properties={"w-28 h-16 object-contain flex-none"}
            />
            <Picture
              src={"/static/images/guardant.png"}
              properties={"w-28 h-16 object-contain flex-none"}
            />
            <Picture
              src={"/static/images/Aramark.png"}
              properties={"w-28 h-16 object-contain flex-none"}
            />
            <Picture
              src={"/static/images/adp.png"}
              properties={"w-28 h-16 object-contain flex-none"}
            />
            <Picture
              src={"/static/images/microsoft.png"}
              properties={"w-28 h-16 object-contain flex-none"}
            />
            <Picture
              src={"/static/images/leidos.png"}
              properties={"w-28 h-16 object-contain flex-none"}
            />
          </div>
        </div>
        <div className="flex flex-col mt-16 px-16 select-none py-16 bg-gray-100 mx-8 lg:mx-16 rounded-xl">
          <div className="flex flex-col items-center text-center">
            <span className="mt-2 text-2xl font-semibold">
              {`HiringCafe by the Numbers`}
            </span>
          </div>
          <div className="mt-16 flex flex-col space-y-8 lg:flex-row lg:space-y-0 items-center lg:space-x-8 justify-between">
            <div className="flex flex-col items-center text-center w-full max-w-xs space-y-8">
              <span className="text-5xl font-extrabold">2.21 Million</span>
              <span>
                Job searches per month. Popular categories: Engineering, Data
                Science, Sales, Marketing, Design, Product, Project Management,
                HR & Recruiting, and Customer Support
              </span>
            </div>
            <div className="flex flex-col items-center text-center w-full max-w-xs space-y-8">
              <span className="text-5xl font-extrabold">60%</span>
              <span>
                Users who exclusively use HiringCafe for their job search,
                according to a recent survey. This means your job postings are
                in front of candidates who are not on other job boards.
              </span>
            </div>
            <div className="flex flex-col items-center text-center w-full max-w-xs space-y-8">
              <span className="text-5xl font-extrabold">20+</span>
              <span>
                Industries that candidates have experience in. Popular
                industries: Tech, Health, Fintech, Education, E-Commerce,
                Climate Tech, Insurance, Cybersecurity, Non-Profit, Government,
                and more
              </span>
            </div>
          </div>
        </div>
        <div className="flex flex-col mt-16 px-16 py-16">
          <div className="flex justify-center font-semibold text-center">
            <span className="max-w-xl text-yellow-900 text-4xl">
              Build Your Talent Pipeline Over a Sip of Coffee
            </span>
          </div>
          <div className="mt-20 grid grid-cols-1 lg:grid-cols-2 gap-16 text-center">
            <div className="flex flex-col bg-yellow-500 text-white rounded-2xl py-8 px-16">
              <span className="text-3xl font-extrabold">
                Receive New Inbounds
              </span>
              <span className="mt-4 text-lg font-medium">
                {`Put your jobs in front of candidates who exclusively use HiringCafe for their job search. Plus, increase your reach by tapping into passive candidates who regularly visit HiringCafe to find exciting roles.`}
              </span>
              <div className="flex justify-center">
                <Link
                  href="/employers/job-postings"
                  className="mt-8 text-lg font-bold border-2 border-white rounded-full px-8 py-2 hover:bg-white hover:text-yellow-500 transition-colors duration-500"
                >
                  Learn More
                </Link>
              </div>
              <div className="mt-8">
                <Picture
                  src="/static/images/post-job.png"
                  properties={"w-full h-full rounded-lg"}
                />
              </div>
            </div>
            <div className="flex flex-col bg-orange-100 text-yellow-600 rounded-2xl py-8 px-16">
              <span className="text-3xl font-extrabold">
                {`Invite Candidates Open to New Opportunities`}
              </span>
              <span className="mt-4 text-lg font-medium">
                {`Leverage HiringCafe Talent Network to invite candidates who are actively looking for new opportunities. Use advanced filters to narrow down your search and reach out to the best talent.`}
              </span>
              <div className="flex justify-center">
                <Link
                  href="/employers/network"
                  className="mt-8 text-lg font-bold border-2 border-yellow-600 rounded-full px-8 py-2 hover:bg-yellow-600 hover:text-orange-100 transition-colors duration-500"
                >
                  Learn More
                </Link>
              </div>
              <div className="mt-8">
                <Picture
                  src="/static/images/source-talent.png"
                  properties={"w-full h-full rounded-lg"}
                />
              </div>
            </div>
          </div>
          <div className="mt-8 gap-8 grid grid-cols-1 md:grid-cols-3">
            <div className="flex flex-col items-center text-center border rounded-xl p-8 border-yellow-900 border-opacity-20">
              <Squares2X2Icon className="w-16 h-16 text-yellow-900" />
              <span className="my-4 text-xl font-extrabold text-gray-600">
                Showcase Your Opportunity
              </span>
              <span className="">{`Quick Job Description Cards allow you to succinctly spotlight the essentials and attract the best talent on HiringCafe. Ensure key details stand out and resonate with prospective candidates.`}</span>
            </div>
            <div className="flex flex-col items-center text-center border rounded-xl p-8 border-yellow-900 border-opacity-20">
              <MapPinIcon className="w-16 h-16 text-yellow-900" />
              <span className="my-4 text-xl font-extrabold text-gray-600">
                Smart Location Reach
              </span>
              <span>{`Define the scope of your job's location from broad regions (ex 'East Coast - USA') to specific cities (ex 'Los Angeles, CA'). Craft a single job post that reaches ideal candidates across desired locales without the hassle of multiple listings.`}</span>
            </div>
            <div className="flex flex-col items-center text-center border rounded-xl p-8 border-yellow-900 border-opacity-20">
              <BuildingOffice2Icon className="w-16 h-16 text-yellow-900" />
              <span className="my-4 text-xl font-extrabold text-gray-600">
                Advanced Industry Filters
              </span>
              <span>{`Reach candidates with pinpoint accuracy using HiringCafe's industry filters. Select from over 20 industries including Tech, Health, Fintech, Education, E-Commerce, Non-Profit, Government, and more.`}</span>
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
                We attract candidates by offering the best job search experience
                possible. Our frustration with traditional job boards fueled our
                drive to create HiringCafe. We invite you to give it a try as a
                candidate to see the difference for yourself.
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
        <div className="mt-16 flex justify-center w-full">
          <div className="flex flex-col bg-orange-50 p-16 mx-16 text-center w-full items-center rounded-xl">
            <span className="text-4xl font-semibold text-yellow-900">
              Hear From Candidates
            </span>
            <span className="mt-8 w-full max-w-3xl text-lg">
              Our{" "}
              <Link
                className="text-yellow-600 font-bold"
                href={
                  "https://www.reddit.com/r/ChatGPT/comments/16c0b6p/i_used_gpt_to_fetch_40918_remote_jobs/"
                }
                target="_blank"
                rel="noreferrer"
              >
                Reddit post
              </Link>{" "}
              made it to the front page of r/ChatGPT. Our{" "}
              <Link
                className="text-yellow-600 font-bold"
                href={
                  "https://www.teamblind.com/post/10392-remote-job-openings-uMXhLF7L"
                }
                target="_blank"
                rel="noreferrer"
              >
                Blind post
              </Link>{" "}
              was featured on the home page.{" "}
              <Link
                className="text-yellow-600 font-bold"
                href="https://www.linkedin.com/posts/jacob-shriar-56199324_jobhunting-activity-7051192103787192320-1l-4"
                target="_blank"
                rel="noreferrer"
              >
                People
              </Link>{" "}
              are{" "}
              <Link
                className="text-yellow-600 font-bold"
                href="https://www.tiktok.com/@andyhafell/video/7280924022106246405"
                target="_blank"
                rel="noreferrer"
              >
                talking about
              </Link>{" "}
              it{" "}
              <Link
                href={
                  "https://www.linkedin.com/posts/thomasianwilson_hiringcafe-job-search-engine-activity-7169303676044398592-jXRg/"
                }
                target="_blank"
                rel="noreferrer"
                className="text-yellow-600 font-bold"
              >
                all over
              </Link>{" "}
              the{" "}
              <Link
                href="https://www.linkedin.com/posts/richard-chen-082b868a_productmanagement-productmanagementcareers-activity-7137494536506732545-FnUQ/"
                className="text-yellow-600 font-bold"
                target="_blank"
                rel="noreferrer"
              >
                web
              </Link>{" "}
              (see{" "}
              <Link
                className="text-yellow-600 font-bold"
                href="https://elpha.com/posts/fq6scll6/aggregated-all-remote-jobs"
                target="_blank"
                rel="noreferrer"
              >
                this
              </Link>
              ).
            </span>
            <span className="mt-8">
              Best part? <span className="font-bold">None</span> of it was
              sponsored.
            </span>
            <div className="mt-8 flex flex-col w-full text-start max-w-3xl">
              <span className="font-bold">More links:</span>
              <div className="flex flex-col space-y-2">
                <ul className="list-disc list-inside">
                  <li>
                    <Link
                      href="https://www.reddit.com/r/ChatGPT/comments/16c0b6p/i_used_gpt_to_fetch_40918_remote_jobs/?utm_source=share&utm_medium=web2x&context=3"
                      className="underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Reddit launch
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="https://www.teamblind.com/post/10392-remote-job-openings-uMXhLF7L"
                      className="underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Blind launch
                    </Link>
                  </li>
                  <li>
                    LinkedIn:{" "}
                    <Link
                      href="https://www.linkedin.com/posts/jacob-shriar-56199324_jobhunting-activity-7051192103787192320-1l-4/"
                      className="underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Post
                    </Link>{" "}
                    |{" "}
                    <Link
                      href="https://www.linkedin.com/posts/thomasianwilson_hiringcafe-job-search-engine-activity-7169303676044398592-jXRg"
                      className="underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Post
                    </Link>{" "}
                    |{" "}
                    <Link
                      href="https://www.linkedin.com/posts/richard-chen-082b868a_productmanagement-productmanagementcareers-activity-7137494536506732545-FnUQ"
                      className="underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Post
                    </Link>{" "}
                    |{" "}
                    <Link
                      href="https://www.linkedin.com/posts/noah-little_i-just-found-the-best-remote-job-board-activity-7115697167784173568-9BIL"
                      className="underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Post
                    </Link>{" "}
                    |{" "}
                    <Link
                      href="https://www.linkedin.com/posts/julioadamp_jobsearch-remotejobs-hiring-activity-7045564474711314433-uU7W"
                      className="underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Post
                    </Link>{" "}
                    |{" "}
                    <Link
                      href="https://www.linkedin.com/posts/davidrap_opentowork-businessoperations-hiringtips-activity-7113195197726953473-llm_"
                      className="underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Post
                    </Link>{" "}
                    |{" "}
                    <Link
                      href="https://www.linkedin.com/posts/millerclaytonr_hiring-alert-account-executive-remote-roles-activity-7129227571837206529-MrYl"
                      className="underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Post
                    </Link>
                  </li>
                  <li>
                    TikTok:{" "}
                    <Link
                      href="https://www.tiktok.com/@hannagetshired/photo/7332232049509600554"
                      className="underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Video
                    </Link>{" "}
                    |{" "}
                    <Link
                      href="https://www.tiktok.com/@andyhafell/video/7280924022106246405"
                      className="underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Video
                    </Link>{" "}
                    |{" "}
                    <Link
                      href="https://www.tiktok.com/@techduoita/video/7229728130548649242"
                      className="underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Video
                    </Link>{" "}
                    |{" "}
                    <Link
                      href="https://www.tiktok.com/@theremotechic/video/7340429489723247877"
                      className="underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Video
                    </Link>{" "}
                    |{" "}
                    <Link
                      href="https://www.tiktok.com/@krunitaextra/video/7332717971221122312"
                      className="underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Video
                    </Link>
                  </li>
                  <li>
                    Reviews:{" "}
                    <Link
                      href="https://www.getbridged.co/resource/hiringcafe-the-latest-in-job-search"
                      className="underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Bridged
                    </Link>{" "}
                    |{" "}
                    <Link
                      href="https://elpha.com/posts/fq6scll6/aggregated-all-remote-jobs"
                      className="underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Elpha
                    </Link>{" "}
                  </li>
                  <li>
                    Twitter:{" "}
                    <Link
                      href="https://twitter.com/RamosAuthor/status/1728774880705773890"
                      className="underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Post
                    </Link>{" "}
                    |{" "}
                    <Link
                      href="https://twitter.com/abskoop/status/1705237205109637388"
                      className="underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Post
                    </Link>
                  </li>
                  <li>
                    Youtube:{" "}
                    <Link
                      href="https://www.youtube.com/watch?v=WsfofAgzNwg"
                      className="underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Video
                    </Link>{" "}
                    |{" "}
                    <Link
                      href="https://www.youtube.com/shorts/XmQNqn-yCHE"
                      className="underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Video
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-16 flex justify-center w-full">
          <div className="flex flex-col bg-orange-50 p-16 text-center w-full items-center">
            <span className="text-4xl w-full max-w-xl font-semibold text-yellow-900">
              Our Obsession With the Candidate Experience is Working
            </span>
            <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 text-start">
              {candidateTestimonials.map((testimonial, index) => (
                <div
                  key={index}
                  className="flex flex-col border rounded-lg p-8 border-yellow-900 border-opacity-30"
                >
                  <span className="text-xl">{`"${testimonial.text}"`}</span>
                  <span className="mt-8 font-bold text-lg opacity-50">
                    {testimonial.author}
                  </span>
                  <span className="text-lg opacity-50">
                    {testimonial.position}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 mt-16 px-16 select-none gap-4">
          <div className="flex flex-col border rounded-lg p-4 shadow">
            <span className="font-bold">Jackie</span>
            <span className="border-b pb-2 mb-2">
              Talent Acquisition at Enertiv
            </span>
            <span className="">{`"I'm definitely rooting for your company success because I believe you are building for the needs of your users and I've found this isn't always the case with those 'industry standards'."`}</span>
          </div>
          <div className="flex flex-col border rounded-lg p-4 shadow">
            <span className="font-bold">Samantha</span>
            <span className="border-b pb-2 mb-2">
              Technical Recruiter at Nike Inc.
            </span>
            <span className="">{`"The quality of talent on HiringCafe is unmatched. One of the things that stood out to me was that every candidate I reached out to was actually in the market."`}</span>
          </div>
          <div className="flex flex-col border rounded-lg p-4 shadow">
            <span className="font-bold">Ron</span>
            <span className="border-b pb-2 mb-2">GTM Recruiter at ADP</span>
            <span className="">{`"HiringCafe has been a game-changer for me. It's evident that the platform attracts people who are not just looking for any job, but the right job."`}</span>
          </div>
        </div>
      </div>
    </>
  );
}
