import React, { useEffect, useState } from "react";
import VideoPlayer from "./VideoPlayer";
import { ArrowsUpDownIcon, XMarkIcon } from "@heroicons/react/24/outline";

export default function FakeQuickCandidateSummaryCard({
  videos,
  name,
  email,
  sub,
}) {
  const [showControls, setShowControls] = useState(false);
  const [showActionItemStyle, setShowActionItemStyle] =
    useState("opacity-0 h-0 mt-0");

  useEffect(() => {
    let timeout;
    if (showControls) {
      timeout = setTimeout(() => {
        setShowActionItemStyle("opacity-100 h-auto mt-4");
      }, 1000); // waits for 1 second before executing
    } else {
      setShowActionItemStyle("opacity-0 h-0 mt-0");
    }

    // Cleanup function to clear the timeout
    return () => {
      clearTimeout(timeout);
    };
  }, [showControls]);

  return (
    <div
      className="flex flex-col w-full rounded-2xl"
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(false)}
    >
      <VideoPlayer videoSrcs={videos} showControls={showControls} />
      <div className={`flex flex-col`}>
        <div
          className={`transition-all ease-in-out duration-500 overflow-hidden ${showActionItemStyle}`}
        >
          <div
            className={`flex items-center justify-between space-x-2 font-medium`}
          >
            <button className="flex justify-center items-center text-center space-x-2 border w-1/2 py-1 rounded-lg text-white border-red-600 hover:text-white hover:bg-red-600 bg-red-600 transition-all ease-in-out duration-300">
              <XMarkIcon className="h-4 w-4" />
              <span>Reject</span>
            </button>
            <button className="flex justify-center items-center text-center space-x-2 border w-1/2 py-1 rounded-lg hover:text-white hover:bg-gray-600 transition-all ease-in-out duration-300">
              <ArrowsUpDownIcon className="h-4 w-4" />
              <span className="">Stage</span>
            </button>
          </div>
        </div>
        <button className="flex flex-col text-sm text-start">
          <span className={`text-base mt-2 font-medium`}>{name}</span>
          <span className="font-medium text-xs mt-1 text-gray-300">
            {email}
          </span>
          <span className="font-medium mt-1 text-gray-300">{sub}</span>
          <span className="bg-gray-600 px-2 py-0.5 rounded mt-2">Resume</span>
        </button>
      </div>
    </div>
  );
}
