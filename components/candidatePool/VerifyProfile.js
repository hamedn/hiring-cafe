import { useAuth } from "@/hooks/useAuth";
import useSeekerProfile from "@/hooks/useSeekerProfile";
import { clientFirestore } from "@/lib/firebaseClient";
import { CheckBadgeIcon, VideoCameraIcon } from "@heroicons/react/24/outline";
import { doc, setDoc } from "firebase/firestore";
import Script from "next/script";
import { useEffect, useState } from "react";
import Accordion from "../Accordation";
import { MochiVerificationFAQ } from "@/utils/constants";
import VideoPlayer from "@/admin/components/adminDashboard/candidateProfiles/VideoPlayer";
import { useUserCountry } from "@/hooks/useUserCountry";

export default function VerifyProfile() {
  const { user } = useAuth();
  const { seekerUserData } = useSeekerProfile();
  const [showExampleVideo, setShowExampleVideo] = useState(-1);
  const { userCountry } = useUserCountry();

  const exampleVideos = [
    {
      url: "",
      title: "Software Engineer",
    },
    {
      url: "",
      title: "Sales",
    },
  ];

  useEffect(() => {
    if (!user) return;
    let isSubscribed = true;
    const submittedVideo = (message) =>
      message.data &&
      message.data.mediaType &&
      message.data.mediaType === "video" &&
      message.data.type &&
      message.data.type === "videoask_question_submitted";

    const handler = async (message) => {
      if (!submittedVideo(message)) {
        return;
      }
      const seekerRef = doc(clientFirestore, `seeker_profiles/${user.uid}`);
      setDoc(
        seekerRef,
        { processing_verification_video: true },
        { merge: true }
      );
    };

    window.addEventListener("message", handler);
    return () => isSubscribed && window.removeEventListener("message", handler);
  }, [user]);

  const handleUpdateQuestionVideo = () => {
    if (!window.videoask || !user) return;
    window.videoask.loadModal({
      url: `https://ask.hiring.cafe/f147vz4sb#contact_email=${
        user.email
      }&contact_name=${user.displayName || "Unknown"}&uid=${user.uid}`,
      options: { modalType: "Fullscreen" },
    });
  };

  if (!seekerUserData) {
    return null;
  }

  showExampleVideo >= 0 && console.log(exampleVideos[showExampleVideo].url);

  return (
    <>
      <Script
        id="videoask-embed"
        src="https://www.videoask.com/embed/embed.js"
      />
      <div className="flex flex-col">
        <div className="flex flex-col mb-6">
          <span className="font-medium text-2xl">
            {!seekerUserData?.verified ? "10 Second" : ""} Account Verification
          </span>
          <span className="mt-2 font-light">
            {`Prove you're a real person. Companies will see a "Verified" badge on your profile.`}
          </span>
        </div>
        {seekerUserData?.videoask_info?.contact?.share_url ? (
          <div className="flex flex-col items-center w-full mb-8">
            <div className="flex items-center space-x-2 text-green-600 font-medium">
              <CheckBadgeIcon className="w-6 h-6 flex-none" />
              <span className="">{`Your account has been verified`}</span>
            </div>
            <iframe
              className="rounded-xl mt-4"
              src={seekerUserData?.videoask_info?.contact?.share_url}
              allow="autoplay *; encrypted-media *; fullscreen *;"
              width="100%"
              height="300px"
            />
          </div>
        ) : null}
        <div>
          <button
            disabled={seekerUserData.processing_verification_video}
            className={`text-xl px-4 text-white py-2 rounded-md font-bold transition duration-200 ease-in-out ${
              seekerUserData.processing_verification_video
                ? "bg-gray-500"
                : "bg-orange-600 hover:bg-orange-500"
            }`}
            onClick={() => handleUpdateQuestionVideo()}
          >
            {seekerUserData.processing_verification_video
              ? "Processing..."
              : seekerUserData.verified
              ? "Update Video"
              : "Verify Now"}
          </button>
        </div>
        <div className="flex flex-col mt-4">
          <div className="flex flex-col mt-2 text-sm">
            <span>
              {`Account verification is an important step to ensure that
                  companies are talking to real people.`}
            </span>
            <span className="mt-2">
              {`Once verified, companies will see a "Verified" badge on your profile.`}
            </span>
            <span className="mt-2 font-medium">
              Your account verification video is not meant to evaluate your
              candidacy and will{" "}
              <span className="font-extrabold underline">never</span> be shared
              with companies.
            </span>
            <span className="text-lg font-light mt-8 mb-2">
              Frequently Asked Questions
            </span>
            <Accordion items={MochiVerificationFAQ} />
          </div>
          {/* <div className="flex items-center space-x-8">
              {exampleVideos.map((video, index) => (
                <button
                  key={video.url}
                  onClick={() => setShowExampleVideo(index)}
                  className={`flex items-center text-start space-x-2 mt-8 transition-colors duration-200 ease-in-out rounded-md py-2 px-4 text-sm
                   ${
                     index === showExampleVideo
                       ? "bg-gray-200 font-medium"
                       : "hover:bg-gray-200"
                   }`}
                >
                  <VideoCameraIcon className="h-5 w-5 flex-none text-start" />
                  <div className="flex flex-col">
                    <span>Example - {video.title}</span>
                  </div>
                </button>
              ))}
            </div>
            {showExampleVideo >= 0 ? (
              <div className="mt-4">
                <VideoPlayer
                  showControls={true}
                  videoSrcs={[exampleVideos[showExampleVideo].url]}
                ></VideoPlayer>
              </div>
            ) : null}
            <span className="text-lg font-light mt-8 mb-2">
              Frequently Asked Questions
            </span>
            <Accordion items={MochiVerificationFAQ} /> */}
        </div>
      </div>
    </>
  );
}
