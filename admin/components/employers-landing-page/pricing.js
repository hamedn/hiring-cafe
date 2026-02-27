import HomeNavBar from "@/admin/components/HomeNavBar";
import { CheckIcon, XMarkIcon } from "@heroicons/react/20/solid";
import Head from "next/head";
import Link from "next/link";

export default function ProductPlansPage() {
  return (
    <>
      <Head>
        <title>HiringCafe Employers - Pricing</title>
      </Head>
      <div className="flex flex-col mb-64">
        <HomeNavBar />
        <div className="flex justify-center mt-8">
          <div className="flex-auto max-w-7xl flex flex-col mt-8 px-8">
            <div className="flex justify-center">
              <div className="flex flex-col items-center">
                <span className="text-5xl font-extrabold italic">
                  HiringCafe Employer Membership
                </span>
              </div>
            </div>
            <div className="mt-16 grid grid-cols-1 lg:grid-cols-3 gap-12">
              <div className="flex flex-col border rounded-lg shadow-xl">
                <div className="flex flex-col items-center bg-yellow-600 text-white p-4 rounded-t-lg">
                  <span className="font-bold text-xl">EMPLOYER GOLD</span>
                </div>
                <div className="flex flex-col p-4 mt-4">
                  <div className="flex justify-center w-full">
                    <span>
                      <span className="text-2xl font-bold">$400/mo</span> per
                      seat, billed annually
                    </span>
                  </div>
                  <div className="mt-8 flex justify-center">
                    <Link
                      href="/employers/form"
                      className="border rounded px-4 py-2 font-bold bg-yellow-600 text-white"
                    >
                      Select Gold Plan
                    </Link>
                  </div>
                  <div className="flex flex-col mt-8 divide-y">
                    <div className="flex items-center space-x-4 py-4">
                      <CheckIcon className="h-7 w-7 flex-none text-green-500" />
                      <span className="text-xl font-bold">
                        Unlimited{" "}
                        <Link href="/employers/network" className="underline">
                          Standard Invites
                        </Link>
                      </span>
                    </div>
                    <div className="flex items-center space-x-4 py-4">
                      <CheckIcon className="h-7 w-7 flex-none text-green-500" />
                      <span className="text-xl font-bold">
                        10 Free{" "}
                        <Link
                          href="/employers/turbo-invites"
                          className="underline"
                        >
                          Turbo Invites
                        </Link>{" "}
                        a month
                      </span>
                    </div>
                    <div className="flex items-center space-x-4 py-4">
                      <CheckIcon className="h-7 w-7 flex-none text-green-500" />
                      <span className="text-xl font-bold">
                        Discounts on all add-ons
                      </span>
                    </div>
                    <div className="flex items-center space-x-4 py-4">
                      <CheckIcon className="h-7 w-7 flex-none text-green-500" />
                      <span className="text-xl font-bold">
                        Unlimited{" "}
                        <Link
                          href="/employers/job-postings"
                          className="underline"
                        >
                          Job Postings
                        </Link>
                      </span>
                    </div>
                    <div className="flex items-center space-x-4 py-4">
                      <CheckIcon className="h-7 w-7 flex-none text-green-500" />
                      <span className="text-xl font-bold">
                        Manage Your Job Listings (Post, Edit, Delete)
                      </span>
                    </div>
                    <div className="flex items-center space-x-4 py-4">
                      <CheckIcon className="h-7 w-7 flex-none text-green-500" />
                      <span className="text-xl font-bold">
                        Enhanced Visibility for Job Postings
                      </span>
                    </div>
                    <div className="flex items-center space-x-4 py-4">
                      <CheckIcon className="h-7 w-7 flex-none text-green-500" />
                      <span className="text-xl font-bold">
                        Full{" "}
                        <Link href="/employers/network" className="underline">
                          Talent Network
                        </Link>{" "}
                        Advanced Search Access
                      </span>
                    </div>
                    <div className="flex items-center space-x-4 py-4">
                      <CheckIcon className="h-7 w-7 flex-none text-green-500" />
                      <Link
                        href="/employers/ats-integrations"
                        className="text-xl font-bold underline"
                      >
                        ATS Integration
                      </Link>
                    </div>
                    <div className="flex items-center space-x-4 py-4">
                      <CheckIcon className="h-7 w-7 flex-none text-green-500" />
                      <Link
                        href={"/employers/ats"}
                        className="text-xl font-bold underline"
                      >
                        Career Page
                      </Link>
                    </div>
                    <div className="flex items-center space-x-4 py-4">
                      <CheckIcon className="h-7 w-7 flex-none text-green-500" />
                      <span className="text-xl font-bold">
                        Zero Placement Fees on Hires
                      </span>
                    </div>
                    <div className="flex items-center space-x-4 py-4">
                      <CheckIcon className="h-7 w-7 flex-none text-green-500" />
                      <span className="text-xl font-bold">
                        Priority Support
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex flex-col border rounded-lg shadow-xl">
                <div className="flex flex-col items-center bg-slate-300 text-slate-700 p-4 rounded-t-lg">
                  <span className="font-bold text-xl">EMPLOYER PLUS</span>
                </div>
                <div className="flex flex-col p-4 mt-4">
                  <div className="flex justify-center w-full">
                    <span>
                      <span className="text-2xl font-bold">$120/mo</span> per
                      seat
                    </span>
                  </div>
                  <div className="mt-8 flex justify-center">
                    <Link
                      href="/employers/form"
                      className="border rounded px-4 py-2 font-bold border-black"
                    >
                      Select Plus Plan
                    </Link>
                  </div>
                  <div className="flex flex-col mt-8 divide-y">
                    <div className="flex items-center space-x-4 py-4">
                      <XMarkIcon className="h-7 w-7 flex-none text-red-600" />
                      <span className="text-xl text-gray-600 font-light">
                        Unlimited{" "}
                        <Link href="/employers/network" className="underline">
                          Standard Invites
                        </Link>
                      </span>
                    </div>
                    <div className="flex items-center space-x-4 py-4">
                      <XMarkIcon className="h-7 w-7 flex-none text-red-600" />
                      <span className="text-xl text-gray-600 font-light">
                        10 Free{" "}
                        <Link
                          href="/employers/turbo-invites"
                          className="underline"
                        >
                          Turbo Invites
                        </Link>{" "}
                        a month
                      </span>
                    </div>
                    <div className="flex items-center space-x-4 py-4">
                      <XMarkIcon className="h-7 w-7 flex-none text-red-600" />
                      <span className="text-xl text-gray-600 font-light">
                        Discounts on all add-ons
                      </span>
                    </div>
                    <div className="flex items-center space-x-4 py-4">
                      <CheckIcon className="h-7 w-7 flex-none text-green-500" />
                      <span className="text-xl font-bold">
                        Unlimited{" "}
                        <Link
                          href="/employers/job-postings"
                          className="underline"
                        >
                          Job Postings
                        </Link>
                      </span>
                    </div>
                    <div className="flex items-center space-x-4 py-4">
                      <CheckIcon className="h-7 w-7 flex-none text-green-500" />
                      <span className="text-xl font-bold">
                        Manage Your Job Listings (Post, Edit, Delete)
                      </span>
                    </div>
                    <div className="flex items-center space-x-4 py-4">
                      <XMarkIcon className="h-7 w-7 flex-none text-red-600" />
                      <span className="text-xl font-light">
                        Enhanced Visibility for Job Postings
                      </span>
                    </div>
                    <div className="flex items-center space-x-4 py-4">
                      <CheckIcon className="h-7 w-7 flex-none text-green-500" />
                      <span className="text-xl font-bold">
                        Full{" "}
                        <Link href="/employers/network" className="underline">
                          Talent Network
                        </Link>{" "}
                        Advanced Search Access
                      </span>
                    </div>
                    <div className="flex items-center space-x-4 py-4">
                      <XMarkIcon className="h-7 w-7 flex-none text-red-600" />
                      <Link
                        href="/employers/ats-integrations"
                        className="text-xl font-light underline"
                      >
                        ATS Integration
                      </Link>
                    </div>
                    <div className="flex items-center space-x-4 py-4">
                      <CheckIcon className="h-7 w-7 flex-none text-green-500" />
                      <Link
                        href={"/employers/ats"}
                        className="text-xl font-bold underline"
                      >
                        Career Page
                      </Link>
                    </div>
                    <div className="flex items-center space-x-4 py-4">
                      <CheckIcon className="h-7 w-7 flex-none text-green-500" />
                      <span className="text-xl font-bold">
                        Zero Placement Fees on Hires
                      </span>
                    </div>
                    <div className="flex items-center space-x-4 py-4">
                      <CheckIcon className="h-7 w-7 flex-none text-green-500" />
                      <span className="text-xl font-bold">
                        Priority Support
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex flex-col border rounded-lg shadow-xl">
                <div className="flex flex-col items-center bg-gray-300 text-gray-700 p-4 rounded-t-lg">
                  <span className="font-bold text-xl">EMPLOYER STARTER</span>
                </div>
                <div className="flex flex-col p-4 mt-4">
                  <div className="flex justify-center w-full">
                    <span>
                      <span className="text-2xl font-bold">$0/mo</span> Free
                      forever
                    </span>
                  </div>
                  <div className="mt-8 flex justify-center">
                    <Link
                      href="/employers/form"
                      className="border rounded px-4 py-2 font-bold border-black"
                    >
                      Select Starter Plan
                    </Link>
                  </div>
                  <div className="flex flex-col mt-8 divide-y">
                    <div className="flex items-center space-x-4 py-4">
                      <XMarkIcon className="h-7 w-7 flex-none text-red-600" />
                      <span className="text-xl text-gray-600 font-light">
                        Unlimited{" "}
                        <Link href="/employers/network" className="underline">
                          Standard Invites
                        </Link>
                      </span>
                    </div>
                    <div className="flex items-center space-x-4 py-4">
                      <XMarkIcon className="h-7 w-7 flex-none text-red-600" />
                      <span className="text-xl text-gray-600 font-light">
                        10 Free{" "}
                        <Link
                          href="/employers/turbo-invites"
                          className="underline"
                        >
                          Turbo Invites
                        </Link>{" "}
                        a month
                      </span>
                    </div>
                    <div className="flex items-center space-x-4 py-4">
                      <XMarkIcon className="h-7 w-7 flex-none text-red-600" />
                      <span className="text-xl text-gray-600 font-light">
                        Discounts on all add-ons
                      </span>
                    </div>
                    <div className="flex items-center space-x-4 py-4">
                      <CheckIcon className="h-7 w-7 flex-none text-green-500" />
                      <span className="text-xl font-bold">
                        Unlimited{" "}
                        <Link
                          href="/employers/job-postings"
                          className="underline"
                        >
                          Job Postings
                        </Link>
                      </span>
                    </div>
                    <div className="flex items-center space-x-4 py-4">
                      <CheckIcon className="h-7 w-7 flex-none text-green-500" />
                      <span className="text-xl font-bold">
                        Manage Your Job Listings (Post, Edit, Delete)
                      </span>
                    </div>
                    <div className="flex items-center space-x-4 py-4">
                      <XMarkIcon className="h-7 w-7 flex-none text-red-600" />
                      <span className="text-xl font-light">
                        Enhanced Visibility for Job Postings
                      </span>
                    </div>
                    <div className="flex items-center space-x-4 py-4">
                      <XMarkIcon className="h-7 w-7 flex-none text-red-600" />
                      <span className="text-xl font-light">
                        Full{" "}
                        <Link href="/employers/network" className="underline">
                          Talent Network
                        </Link>{" "}
                        Advanced Search Access
                      </span>
                    </div>
                    <div className="flex items-center space-x-4 py-4">
                      <XMarkIcon className="h-7 w-7 flex-none text-red-600" />
                      <Link
                        href="/employers/ats-integrations"
                        className="text-xl font-light underline"
                      >
                        ATS Integration
                      </Link>
                    </div>
                    <div className="flex items-center space-x-4 py-4">
                      <CheckIcon className="h-7 w-7 flex-none text-green-500" />
                      <Link
                        href={"/employers/ats"}
                        className="text-xl font-bold underline"
                      >
                        Career Page
                      </Link>
                    </div>
                    <div className="flex items-center space-x-4 py-4">
                      <CheckIcon className="h-7 w-7 flex-none text-green-500" />
                      <span className="text-xl font-bold">
                        Zero Placement Fees on Hires
                      </span>
                    </div>
                    <div className="flex items-center space-x-4 py-4">
                      <CheckIcon className="h-7 w-7 flex-none text-green-500" />
                      <span className="text-xl font-bold">
                        Priority Support
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-32 flex flex-col items-center" id="add-ons">
              <span className="text-5xl font-extrabold italic">Add-Ons</span>
              <span className="mt-4 text-2xl">
                Employer Gold members get 25% discounts on all add-ons!
              </span>
              <div className="mt-16 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
                <div className="flex flex-col rounded-lg border">
                  <span className="text-xl font-bold bg-gray-200 px-4 py-2 rounded-t-lg">
                    Job Boosts
                  </span>
                  <div className="flex flex-col p-4">
                    <span className="mt-2 text-lg font-bold">
                      $300 per boost
                    </span>
                    <span className="mt-2 text-lg">
                      10x job posting visibility
                    </span>
                    <span className="mt-4">
                      25% off for Employer Gold members!
                    </span>
                    <Link
                      href="/employers/job-boosts"
                      className="bg-yellow-600 text-white rounded-full px-4 py-1 font-bold mt-4 w-fit text-center text-sm"
                    >
                      Learn more
                    </Link>
                  </div>
                </div>
                <div className="flex flex-col rounded-lg border">
                  <span className="text-xl font-bold bg-gray-200 px-4 py-2 rounded-t-lg">
                    Turbo Invites
                  </span>
                  <div className="flex flex-col p-4">
                    <span className="mt-2 text-lg font-bold">
                      $20 per Invite
                    </span>
                    <span className="mt-2 text-lg">
                      3x response rate compared to standard invites
                    </span>
                    <span className="mt-4">
                      25% off for Employer Gold members!
                    </span>
                    <Link
                      href="/employers/turbo-invites"
                      className="bg-yellow-600 text-white rounded-full px-4 py-1 font-bold mt-4 w-fit text-center text-sm"
                    >
                      Learn more
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
