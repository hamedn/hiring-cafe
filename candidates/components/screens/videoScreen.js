import { useState, useEffect } from "react";
import axios from "axios";
import { CircularProgress } from "@chakra-ui/react";
import { VideoCameraSlashIcon } from "@heroicons/react/24/outline";
import { getFirstName } from "@/utils/helpers";
import VideoPlayer from "@/admin/components/adminDashboard/candidateProfiles/VideoPlayer";
import Script from "next/script";
import { useRouter } from "next/router";

export default function VideoScreenApplicant({ applicant_info, screenData }) {
  const router = useRouter();
  const [showLocalSubmissionLoading, setLocalSubmissionLoading] =
    useState(false);

  useEffect(() => {
    const submitCompletion = async () => {
      if (!applicant_info.applicantId || !screenData.id) {
        return;
      }
      const submitData = {
        applicant_id: applicant_info.applicantId,
        access_token: applicant_info.candidate_token.token,
        screen_id: screenData.id,
      };
      try {
        await axios.post(
          `/api/applicant/screens/markScreenAsCompleted`,
          submitData
        );
        // router.push previous page
        router.push(`/applicant/${applicant_info.candidate_token.token}`);
      } catch (error) {
        console.trace(error);
      }
    };

    let isSubscribed = true;
    const submittedVideo = (message) =>
      message.data?.type === "videoask_submitted";

    const handler = async (message) => {
      if (!submittedVideo(message)) {
        return;
      }
      setLocalSubmissionLoading(true);
      await submitCompletion();
    };

    window.addEventListener("message", handler);
    return () => isSubscribed && window.removeEventListener("message", handler);
  }, [applicant_info, screenData]);

  const handleStartScreen = () => {
    window.videoask.loadModal({
      url: `${screenData.screen.videoask_share_url}#applicant_id=${applicant_info.applicantId}&screen_id=${screenData.id}&type=VIDEO_SCREEN&candidate_token=${applicant_info.candidate_token.token}`,
      options: { modalType: "Fullscreen" },
    });
  };

  if (!screenData)
    return (
      <div className="flex justify-center my-8">
        <div className="flex flex-col items-center space-y-8 text-red-600 border p-16 rounded-xl border-red-200">
          <VideoCameraSlashIcon className="w-12 h-12" />
          <span className="font-medium">Unable to load screen data.</span>
        </div>
      </div>
    );

  const renderStepInfo = () => {
    const readableDate = (dateString) => {
      const date = new Date(dateString);
      const options = {
        weekday: "short",
        year: "numeric",
        month: "short",
        day: "numeric",
      };
      return date.toLocaleDateString(undefined, options);
    };

    return (
      <div className="flex flex-col">
        <div className="flex flex-col items-center mb-8 space-y-4">
          <span className="flex font-medium justify-center text-2xl md:text-3xl">
            Video Screen
          </span>
          <span className="text-lg">
            Deadline:{" "}
            <span className="font-medium">
              {readableDate(screenData.deadline)}
            </span>
          </span>
          <span className="bg-red-50 font-medium p-4 rounded lg:max-w-md">
            {`${getFirstName(
              applicant_info.profile.name
            )}, open the link below to view our message and answer 3 quick screening questions. It shouldn't take you more than 5-8 minutes. Please complete this step by the deadline above.`}
          </span>
        </div>
        {/* <VideoPlayer
          videoSrcs={[screenData.screen.intro.media_url]}
          showControls={true}
        /> */}
        <button
          className="mt-4 bg-blue-600 hover:bg-blue-700 py-2 rounded-xl text-white font-medium transition duration-200 ease-in-out"
          onClick={handleStartScreen}
        >
          Open Video Screen
        </button>
      </div>
    );
  };

  const isProcessing = data.status === "started" || showLocalSubmissionLoading;

  return (
    <>
      <Script id="s1" src="https://www.videoask.com/embed/embed.js" />
      {isProcessing ? (
        <div className="flex justify-center items-center my-8">
          <div className="flex flex-col items-center text-center space-y-8 text-yellow-600 border border-yellow-400 p-16 rounded-lg">
            <CircularProgress isIndeterminate color="yellow.600" size="24px" />
            <div className="flex flex-col space-y-1">
              <span className="">Your video is processing...</span>
              <span className="font-medium">
                Refresh the page if this takes longer than 5 minutes.
              </span>
            </div>
          </div>
        </div>
      ) : (
        renderStepInfo()
      )}
    </>
  );
}
