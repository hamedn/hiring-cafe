import { useRouter } from "next/router";
import LottieAnimation from "@/components/lottieAnimation";
import BirthdayBearAnimation from "@/animations/birthday-bear.json";
import HiringCafeLogo from "@/components/HiringCafeLogo";

export default function AISearchLanding({ isLoggedIn }) {
  const router = useRouter();

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100 flex flex-col p-4">
        {/* Logo */}
        <div className="absolute top-4 left-4">
          <button
            onClick={() => router.push("/")}
            className="hover:opacity-80 transition-opacity"
          >
            <HiringCafeLogo />
          </button>
        </div>

        <div className="flex-1 flex items-center justify-center">
          <div className="max-w-md w-full text-center">
            <div className="mb-6">
              <LottieAnimation
                width="200px"
                height="200px"
                animationData={BirthdayBearAnimation}
              />
            </div>

            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              AI Job Search
            </h1>

            <p className="text-gray-600 mb-8">
              Describe your ideal job naturally and let our AI find the matches.
              Beta version.
            </p>

            <button
              onClick={() => router.push("/auth")}
              className="w-full bg-gradient-to-r from-yellow-500 to-amber-500 text-white font-bold py-4 px-8 rounded-xl hover:from-yellow-600 hover:to-amber-600 transition-all shadow-lg hover:shadow-xl"
            >
              Sign In to Get Started
            </button>

            <p className="text-sm text-gray-500 mt-6">
              Don&apos;t have an account?{" "}
              <button
                onClick={() => router.push("/auth")}
                className="text-yellow-600 hover:text-yellow-700 font-medium"
              >
                Sign up for free
              </button>
            </p>
          </div>
        </div>
      </div>
    );
  }

  // User is logged in but not in talent network
  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100 flex flex-col p-4">
      {/* Logo */}
      <div className="absolute top-4 left-4">
        <button
          onClick={() => router.push("/")}
          className="hover:opacity-80 transition-opacity"
        >
          <HiringCafeLogo />
        </button>
      </div>

      <div className="flex-1 flex items-center justify-center">
        <div className="max-w-md w-full text-center">
          <div className="mb-6">
            <LottieAnimation
              width="200px"
              height="200px"
              animationData={BirthdayBearAnimation}
            />
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            AI Job Search is Finally Here!
          </h1>

          <p className="text-gray-600 mb-8">
            {`Describe your ideal job naturally and let our AI find the matches. It's 100% free, forever.`}
          </p>

          <button
            onClick={() => router.push("/talent-network")}
            className="w-full bg-gradient-to-r from-yellow-500 to-amber-500 text-white font-bold py-4 px-8 rounded-xl hover:from-yellow-600 hover:to-amber-600 transition-all shadow-lg hover:shadow-xl"
          >
            Join Talent Network to Continue
          </button>

          <div className="mt-8 p-6 bg-white rounded-xl shadow-sm border border-neutral-200">
            <h3 className="font-semibold text-gray-900 mb-3">
              Why Join Talent Network?
            </h3>
            <ul className="text-sm text-gray-600 space-y-2 text-left">
              <li className="flex items-start gap-2">
                <span className="text-yellow-500 mt-0.5">✓</span>
                <span>AI-powered job search with natural language</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-yellow-500 mt-0.5">✓</span>
                <span>Save and refine your searches over time</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-yellow-500 mt-0.5">✓</span>
                <span>Get matched with roles that fit your exact criteria</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-yellow-500 mt-0.5">✓</span>
                <span>Let companies apply to you</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
