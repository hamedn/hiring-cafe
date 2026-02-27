import BriefJDSummaryV3 from "./BriefJDSummaryV3";
import { QUICK_SUMMARY_CARD_VIEW_FORMAT } from "@/utils/constants";
import { useRef, useState } from "react";
import { CheckIcon } from "@heroicons/react/24/outline";
import cleanJobHTML from "@/utils/cleanJobHTML";

export default function FullJobDescription({
  job,
  viewFormat = QUICK_SUMMARY_CARD_VIEW_FORMAT.SEARCH_RESULTS,
  onFullJDClose,
  onDelete = () => {},
  onUpdateStage = () => {},
  isFromAISearch = false,
}) {
  const jdRef = useRef(null);
  const [isCopied, setIsCopied] = useState(false);

  const handleCopyJD = () => {
    if (jdRef.current && !isCopied) {
      const textToCopy = jdRef.current.innerText;
      navigator.clipboard.writeText(textToCopy).then(() => {
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 10_000);
      });
    }
  };

  return (
    <>
      <div className="flex flex-col">
        <div className="flex justify-center">
          <div className="flex flex-col flex-auto w-full">
            <BriefJDSummaryV3
              job={job}
              viewFormat={viewFormat}
              onJobMarked={onFullJDClose}
              onDelete={onDelete}
              onUpdateStage={onUpdateStage}
              isFromAISearch={isFromAISearch}
            />
            <div className="flex flex-col items-center mb-16 border shadow-2xl rounded-3xl">
              <span className="text-md border my-2 px-2 font-semibold rounded-full text-gray-600">
                Job Description
              </span>
              <button
                className="mt-4 inline-flex items-center space-x-2 bg-pink-50 rounded px-4 py-2 text-pink-600 text-xs font-semibold hover:bg-pink-600 hover:text-white focus:outline-none focus:ring-2 focus:ring-pink-300"
                onClick={handleCopyJD}
              >
                {isCopied ? (
                  <>
                    <CheckIcon
                      className="h-4 w-4 flex-none"
                      aria-hidden="true"
                    />
                    <span>Copied!</span>
                  </>
                ) : (
                  <span>Copy Job Description</span>
                )}
              </button>
              <article className="prose prose-h1:text-2xl pt-4 pb-16">
                <div
                  ref={jdRef}
                  className="max-w-sm md:max-w-md lg:max-w-full overflow-auto px-4"
                  dangerouslySetInnerHTML={{
                    __html: cleanJobHTML(job),
                  }}
                />
              </article>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
