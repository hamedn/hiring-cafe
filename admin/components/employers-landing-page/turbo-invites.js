import Head from "next/head";
import HomeNavBar from "@/admin/components/HomeNavBar";
import MailBox from "@/animations/virtual-mailbox.json";
import Link from "next/link";
import {
  ArrowUpIcon,
  PaperAirplaneIcon,
  UserIcon,
} from "@heroicons/react/24/outline";
import LottieAnimation from "@/components/lottieAnimation";

export default function TurboInvitesEmployersLandingPage() {
  return (
    <>
      <Head>
        <title>HiringCafe Employers - Turbo Invites</title>
      </Head>
      <HomeNavBar />
      <div className="flex flex-col flex-auto items-center bg-gray-100">
        <div className="flex justify-center pb-16">
          <div className="mt-8 flex flex-col space-y-8 lg:flex-row lg:space-y-0 lg:space-x-8 max-w-5xl items-center lg:items-start">
            <div className="p-8 lg:p-4 flex-auto flex flex-col items-center lg:items-start">
              <span className="text-4xl font-extrabold italic text-center lg:text-start">
                Triple Your Response Rates with Turbo Invites
              </span>
              <span className="text-xl mt-8">
                {`Spotted a great candidate on the `}
                <Link
                  href="/employers/network"
                  className="text-yellow-600 font-bold"
                >
                  HiringCafe Talent Network
                </Link>
                {`? Grab their attention right away with a Turbo Invite. When you send a Turbo Invite, candidates receive an instant notification via email and SMS with your personalized message. Additionally, we'll send automatic follow-up reminders to ensure your message is seen.`}
              </span>
              <div className="mt-16">
                <Link
                  href={"/employers/form"}
                  className="text-lg md:text-xl lg:text-2xl xl:text-3xl rounded-full text-white px-8 py-2 font-medium bg-gradient-to-t from-yellow-600 to-yellow-400 hover:from-yellow-700 hover:to-yellow-500 transition-colors duration-500"
                >
                  Get Started
                </Link>
              </div>
            </div>
            <div className="">
              <LottieAnimation
                width="400px"
                height="400px"
                animationData={MailBox}
                customOptions={{ loop: false }}
              />
            </div>
          </div>
        </div>
        <div className="flex justify-center w-full bg-white pb-16">
          <div className="p-4 flex-auto flex flex-col max-w-5xl items-center">
            <div className="flex flex-col">
              <div className="mt-16 flex items-start w-full space-x-12">
                <div className="rounded-full shadow-xl border border-gray-50 p-4">
                  <PaperAirplaneIcon className="h-9 w-9 text-slate-600" />
                </div>
                <div className="flex flex-col space-y-8">
                  <span className="text-3xl font-extrabold">
                    Send Instant Notifications
                  </span>
                  <span className="text-xl mt-2 text-gray-500">
                    {`Candidates instantly receive notifications, accompanied by automatic reminders through email and SMS, that include a link to your invitation.`}
                  </span>
                </div>
              </div>
              <div className="mt-16 flex items-start w-full space-x-12">
                <div className="rounded-full shadow-xl border border-gray-50 p-4">
                  <UserIcon className="h-9 w-9 text-blue-400" />
                </div>
                <div className="flex flex-col space-y-8">
                  <span className="text-3xl font-extrabold">
                    Add Personalized Message
                  </span>
                  <span className="text-xl mt-2 text-gray-500">{`Stand out by including a personalized message with your Turbo Invite. Candidates are more likely to respond when they know you've taken the time to review their profile.`}</span>
                </div>
              </div>
              <div className="mt-16 flex items-start w-full space-x-12">
                <div className="rounded-full shadow-xl border border-gray-50 p-4">
                  <ArrowUpIcon className="h-9 w-9 text-pink-400" />
                </div>
                <div className="flex flex-col space-y-8">
                  <span className="text-3xl font-extrabold">
                    Pin Your Invite
                  </span>
                  <span className="text-xl mt-2 text-gray-500">
                    {`Get your invite featured on candidate's inbox. Your invite will be pinned to the top of the candidate's inbox until they respond.`}
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
              <span className="text-xl font-bold">{`What is a Turbo Invite?`}</span>
              <span className="mt-4 font-light">
                {`Turbo Invite is a premium feature for employers to send invitations to candidates who opt-in to the `}
                <Link
                  href="/employers/network"
                  className="text-yellow-600 font-bold"
                >
                  HiringCafe Talent Network
                </Link>
                {`.`}
              </span>
            </div>
            <div className="flex flex-col border border-gray-400 w-full p-4 rounded-xl">
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
