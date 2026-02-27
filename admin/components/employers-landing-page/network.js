import Head from "next/head";
import HomeNavBar from "@/admin/components/HomeNavBar";
import Link from "next/link";
import { useState } from "react";

export default function NetworkEmployersLandingPage() {
  const [currentFeature, setCurrentFeature] = useState(0);

  const features = [
    {
      label: "Full Network Search",
      title: "Search the entire Talent Network on HiringCafe",
      description:
        "Find the right candidates for your job openings. Use advanced filters to narrow down your search and find the perfect fit.",
      video: "/talent_search.mp4",
    },
    {
      label: "Candidate Invites",
      title: "Invite any candidate",
      description:
        "Invite any candidate to apply to your jobs. Choose between Standard Invites or Turbo Invites - whichever suits your needs.",
      video: "/talent_network_invite_demo.mp4",
    },
    {
      label: "Realtime Status Updates",
      title: "View realtime status updates",
      description:
        "Track the status of your invites in real-time. Know when candidates view your invites, accept them, and apply to your jobs.",
    },
    {
      label: "Team Collaboration",
      title: "Collaborate with your team",
      description:
        "Keep your team in the loop. Share feedback, notes, and candidate profiles with your team.",
    },
    {
      label: "Messaging",
      title: "Send messages without switching tabs",
      description:
        "Send and receive messages from candidates. HiringCafe will automatically send notifications to your candidates via SMS & email whenever you message them. Keep all your communication in one place.",
    },
  ];

  return (
    <>
      <Head>
        <title>HiringCafe Employers - Talent Network</title>
      </Head>
      <HomeNavBar />
      <div className="flex justify-center">
        <div className="flex flex-col flex-auto items-center">
          <div className="flex py-16 px-8">
            <div className="p-4 md:p-8 flex-auto flex flex-col md:flex-row lg:max-w-7xl items-center space-y-8 md:space-y-0 md:space-x-4 lg:space-x-8 xl:space-x-16">
              <div className="flex flex-col md:w-3/5">
                <span className="text-5xl lg:text-6xl xl:text-7xl font-extrabold">
                  Source More Talent{" "}
                  <span className="text-orange-600">Open for Work</span>
                </span>
                <span className="text-xl md:text-3xl mt-8">
                  {`Access full contact information when candidates accept your invites, ensuring direct connections with engaged professionals open for work.`}
                </span>
                <div className="mt-8 md:mt-10 lg:mt-12 xl:mt-14">
                  <Link
                    href="/employers/form"
                    className="text-lg md:text-xl lg:text-2xl xl:text-3xl rounded-full text-white px-8 py-2 font-medium bg-gradient-to-t from-yellow-600 to-yellow-400 hover:from-yellow-700 hover:to-yellow-500 transition-colors duration-500"
                  >
                    Get Started
                  </Link>
                </div>
              </div>
              <div className="md:w-2/5 flex justify-center">
                <video
                  src="/talent-network-demo.mp4"
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
          <div className="flex w-full justify-center border-t py-16">
            <div className="p-4 flex flex-col flex-auto items-center max-w-7xl">
              <span className="text-4xl font-bold">
                Explore Talent Network features
              </span>
              <div
                className={`mt-12 flex items-center space-x-2 bg-orange-100 font-bold rounded-full p-1 overflow-x-auto scrollbar-hide`}
              >
                {features.map((feature, i) => (
                  <button
                    key={feature.title}
                    onClick={() => {
                      setCurrentFeature(i);
                    }}
                    className={`rounded-full flex-none px-4 py-1.5 ${
                      currentFeature === i
                        ? "bg-orange-600 text-white"
                        : "text-orange-600"
                    }`}
                  >
                    {feature.label}
                  </button>
                ))}
              </div>
              <div className="mt-16 flex items-center space-x-8 max-w-5xl">
                <div
                  className={`flex flex-col ${
                    features[currentFeature].video ? "w-3/5" : "max-w-xl"
                  }`}
                >
                  <span className="text-2xl font-bold">
                    {features[currentFeature].title}
                  </span>
                  <p className="mt-4 text-lg font-light">
                    {features[currentFeature].description}
                  </p>
                </div>
                {features[currentFeature].video ? (
                  <video
                    src={features[currentFeature].video}
                    alt="HiringCafe-Demo"
                    className="w-2/5 rounded-3xl shadow-inner"
                    muted
                    controls={false}
                    autoPlay
                    loop
                    playsInline
                  />
                ) : null}
              </div>
            </div>
          </div>
          <div className="mt-8 flex justify-center w-full py-16 border-t">
            <div className="p-4 flex-auto flex flex-col max-w-5xl items-center space-y-8">
              <span className="text-3xl font-bold mb-8">
                Frequently Asked Questions
              </span>
              <div className="flex flex-col border border-gray-400 w-full p-4 rounded-xl">
                <span className="text-xl font-bold">{`What is HiringCafe Talent Network?`}</span>
                <span className="mt-4 font-light">
                  <Link
                    href="/talent-network"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-yellow-600 font-bold"
                  >
                    HiringCafe Talent Network
                  </Link>
                  {` lets you invite candidates on HiringCafe to apply to your jobs. You can access their full contact information and message them once they accept your invite.`}
                </span>
              </div>
              <div className="flex flex-col border border-gray-400 w-full p-4 rounded-xl">
                <span className="text-xl font-bold">{`How are candidates added to the HiringCafe Talent Network?`}</span>
                <span className="mt-4 font-light">
                  {`Candidates can choose to opt in or out of the HiringCafe Talent Network at any time and can accept or decline invitations from employers. This flexibility enables us to build strong trust with candidates and helps us attract more qualified talent to HiringCafe.`}
                </span>
              </div>
              <div
                className="flex flex-col border border-gray-400 w-full p-4 rounded-xl"
                id="standard-vs-turbo-invites"
              >
                <span className="text-xl font-bold">{`What's the difference between Standard Invite and Turbo Invite?`}</span>
                <span className="mt-4 font-light">
                  {`With a Standard Invite, candidates are able to view your invite in their `}
                  <Link
                    href="/talent-network"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-yellow-600 font-bold"
                  >
                    Inbox
                  </Link>{" "}
                  {`and respond at their convenience. Standard invites are also included in weekly digest emails. With a Turbo Invite, candidates receive an instant notification via email and SMS with your personalized message, and your invite is pinned to the top of their inbox until they respond.`}
                </span>
              </div>
              <div className="flex flex-col border border-gray-400 w-full p-4 rounded-xl">
                <span className="text-xl font-bold">{`What happens after a candidate accepts my invite?`}</span>
                <span className="mt-4 font-light">
                  {`When a candidate accepts your invite, you will be able to access their full contact information and send them unlimited messages. They will also be automatically added to the ATS.`}
                </span>
              </div>
              <div className="flex flex-col border border-gray-400 w-full p-4 rounded-xl">
                <span className="text-xl font-bold">{`What happens if a candidate declines my invite?`}</span>
                <span className="mt-4 font-light">
                  {`Candidates can choose two ways to decline your invite: they can either decline indefinitely or decline for a duration of time. If they decline indefinitely, they will not receive any more invites from you. If they decline for a duration of time, you can send them another invite after the duration ends.`}
                </span>
              </div>
              <div className="flex flex-col border border-gray-400 w-full p-4 rounded-xl">
                <span className="text-xl font-bold">{`How much does it cost?`}</span>
                <span className="mt-4 font-light">
                  {`Please check the `}
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
