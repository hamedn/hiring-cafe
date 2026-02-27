import { SparklesIcon } from "@heroicons/react/24/outline";

export default function BetaInfoBox({ onExampleClick }) {
  const examplePrompts = [
    "Director of Customer Support, Phoenix area or remote US",
    "IT Program Manager, DC/Maryland/Virginia, 10+ YOE",
    "Channel Program Manager; $200k; West Coast",
    "VP of FP&A, strategic finance and forecasting",
    "iOS Engineer in NYC with 4 years of experience",
  ];

  return (
    <div className="w-full max-w-5xl mx-auto">
      {/* Hero Section */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-amber-500/10 to-yellow-500/10 border border-amber-500/20 rounded-full mb-6">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
          </span>
          <span className="text-xs font-medium text-amber-700">Beta</span>
        </div>

        <h1 className="text-5xl font-bold text-gray-900 leading-tight">
          HiringCafe AI Job Search
        </h1>
      </div>

      {/* Example Prompts */}
      <div className="mb-10">
        <p className="text-sm text-gray-500 text-center mb-4 font-medium">
          Try something like:
        </p>
        <div className="flex flex-wrap justify-center gap-2">
          {examplePrompts.map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => onExampleClick?.(prompt)}
              className="group px-4 py-2 bg-white hover:bg-gray-50 border border-gray-200 hover:border-gray-300 rounded-full text-sm text-gray-700 hover:text-gray-900 transition-all duration-200 shadow-sm hover:shadow"
            >
              <span className="opacity-60 group-hover:opacity-100 transition-opacity">
                &ldquo;
              </span>
              {prompt}
              <span className="opacity-60 group-hover:opacity-100 transition-opacity">
                &rdquo;
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Beta Notice - Compact */}
      <div className="bg-amber-50/50 rounded-xl border border-amber-200/60 p-4">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 mt-0.5">
            <svg
              className="h-4 w-4 text-amber-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm text-amber-900">
              <span className="font-medium">Early access:</span>{" "}
              <span className="text-amber-800">
                Currently showing US jobs{" "}
                <span className="font-bold italic underline">
                  posted a few days ago
                </span>
                . We&apos;re expanding coverage based on your feedback.
              </span>
            </p>
          </div>
          <a
            href="https://www.reddit.com/r/hiringcafe/comments/1ofis2c/hiringcafe_ai_job_search_feedback_thread/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex-shrink-0 text-xs font-medium text-amber-700 hover:text-amber-900 underline underline-offset-2"
          >
            Share feedback
          </a>
        </div>
      </div>
    </div>
  );
}
