import { useState, useEffect } from "react";
import axios from "axios";
import { CircularProgress } from "@chakra-ui/react";
import { VideoCameraSlashIcon } from "@heroicons/react/24/outline";
import { getFirstName } from "@/utils/helpers";
import VideoPlayer from "@/admin/components/adminDashboard/candidateProfiles/VideoPlayer";
import Script from "next/script";

export default function VideoAskInitialScreen({
  applicant_info,
  stepData,
  mutate,
}) {
  const data = stepData.data;
  const [screenData, setScreenData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showLocalSubmissionLoading, setLocalSubmissionLoading] =
    useState(false);

  useEffect(() => {
    const loadScreenData = async () => {
      const dataToSubmit = {
        applicant_id: applicant_info.applicantId,
        access_token: applicant_info.candidate_token.token,
        screen_id: data.screen,
      };
      await axios
        .post(`/api/applicant/screens/getScreen`, dataToSubmit)
        .then((response) => {
          const serverScreenData = response.data.screen;
          setScreenData(serverScreenData);
          setLoading(false);
        });
    };
    loadScreenData();
  }, [applicant_info, data]);

  useEffect(() => {
    /// Keep mutating every 10 seconds to check for status change as long as stage is "Submitted"
    /// Quit after 5 minutes.
    const keepMutating = async () => {
      let count = 0;
      const dataToSubmit = {
        applicant_id: applicant_info.applicantId,
        access_token: applicant_info.candidate_token.token,
      };
      await mutate();
      const interval = setInterval(async () => {
        // get state.
        await axios
          .post(`/api/applicant/screens/getScreenStatus`, dataToSubmit)
          .then((response) => {
            const stage = response.data.stage;
            if (stage !== "Submitted" || count > 30) {
              clearInterval(interval);
              setLocalSubmissionLoading(false);
              mutate();
            }
          });
        count++;
      }, 10000);
    };

    const submitCompletion = async () => {
      if (!applicant_info.applicantId) {
        return;
      }
      const submitData = {
        applicant_id: applicant_info.applicantId,
        access_token: applicant_info.candidate_token.token,
      };
      try {
        await axios.post(
          `/api/applicant/screens/markInitialScreenSubmitted`,
          submitData
        );
        await keepMutating();
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
  }, [applicant_info, data, mutate]);

  const handleStartScreen = () => {
    window.videoask.loadModal({
      url: `${screenData.videoask_share_url}#applicant_id=${applicant_info.applicantId}&type=INITIAL_VIDEO_SCREEN&candidate_token=${applicant_info.candidate_token.token}`,
      options: { modalType: "Fullscreen" },
    });
  };

  if (loading)
    return (
      <div className="flex justify-center my-32">
        <CircularProgress isIndeterminate color="yellow.600" size="30px" />
      </div>
    );

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
            Initial Video Screen
          </span>
          <span className="text-lg">
            Deadline:{" "}
            <span className="font-medium">
              {readableDate(applicant_info.deadline)}
            </span>
          </span>
          <span className="bg-red-50 font-medium p-4 rounded lg:max-w-md">
            {`${getFirstName(
              applicant_info.profile.name
            )}, open the link below to view our message and answer 3 quick screening questions. It shouldn't take you more than 5-8 minutes. Please complete this step by the deadline above.`}
          </span>
        </div>
        {/* <VideoPlayer
          videoSrcs={[screenData.intro.media_url]}
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
