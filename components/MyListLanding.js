import LottieAnimation from "./lottieAnimation";
import BearWorking from "@/animations/bear-working.json";
import { AppTrackerFAQ } from "@/utils/constants";
import Link from "next/link";
import Accordion from "./Accordation";

export default function MyListLanding() {
  return (
    <div className="flex flex-col items-center text-center px-4">
      <div className="flex flex-col items-center text-center mt-4">
        <LottieAnimation
          width="250px"
          height="250px"
          animationData={BearWorking}
          customOptions={{
            loop: false,
          }}
        />
        <div className="flex flex-col items-center text-sm md:text-base">
          <span className="mt-8 bg-orange-100 text-orange-800 px-4 py-1.5 font-medium rounded-full">{`HiringCafe Application Tracker`}</span>
          <span className="mt-4 text-3xl font-medium">
            {`Your saved jobs will appear here`}
          </span>
          <span className="mt-4 text-lg lg:max-w-xl">{`The Application Tracker helps you keep track of your job search progress. It's free and easy to use.`}</span>
        </div>
        <div className="flex flex-col mt-8">
          <Link
            href="/auth"
            className="bg-yellow-600 text-yellow-50 font-semibold rounded px-8 py-2 m-1 text-2xl"
          >
            <span>Log in to view</span>
          </Link>
          <span className="mt-2 font-medium">{`100% free, forever!`}</span>
        </div>
      </div>
      <div className="flex flex-col flex-auto justify-start items-start text-start lg:max-w-xl my-16">
        <span className="text-xl font-medium mb-4 text-yellow-600">
          Frequently Asked Questions
        </span>
        <Accordion items={AppTrackerFAQ} />
      </div>
    </div>
  );
}
