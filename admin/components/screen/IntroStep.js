import { useState, useEffect } from "react";
import useScreenData from "@/admin/hooks/useScreenData";
import Script from "next/script";
import { doc, setDoc } from "firebase/firestore";
import { CircularProgress } from "@chakra-ui/react";
import { clientFirestore } from "@/admin/lib/firebaseClient";
import VideoPlayer from "../adminDashboard/candidateProfiles/VideoPlayer";
import axios from "axios";

const IntroStep = ({ screenID, job_id, public_access = null }) => {
  const { screen } = useScreenData(screenID);
  const [intro, setIntro] = useState(null);

  useEffect(() => {
    if (screen && screen.intro) {
      setIntro(screen.intro);
    }
  }, [screen]);

  useEffect(() => {
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

      const dataToPatch = {
        intro: {
          ...screen.intro,
          is_processing_video_update: true,
        },
      };

      try {
        if (public_access) {
          const dataToSend = {
            screenId: screenID,
            job_id: job_id,
            access_token: public_access,
            intro: dataToPatch.intro,
          };
          await axios.patch("/api/admin/videoScreen/publicUpdateVideoScreenQuestion", dataToSend);
        } else {
          await setDoc(
            doc(clientFirestore, "screens", screenID),
            dataToPatch,
            { merge: true }
          );
        }
      } catch (error) {
        console.log(error)
      }
    };

    window.addEventListener("message", handler);
    return () => isSubscribed && window.removeEventListener("message", handler);
  }, [screen, screenID]);

  const handleUpdateIntro = () => {
    console.log(screen.intro.videoask_question_id);
    window.videoask.loadModal({
      url: `https://ask.hiring.cafe/f6nz4yao9#question_to_update=${screen.intro.videoask_question_id}&screen_id=${screenID}&screen_type=INITIAL_VIDEO_SCREEN_INTRO`, // TODO: Make videoask url dynamic
      options: { modalType: "Fullscreen" },
    });
  };

  if (!intro || !screen) return null;

  return (
    <>
      <Script id="s1" src="https://www.videoask.com/embed/embed.js"></Script>
      <div className="flex flex-col items-start">
        {intro.media_url && (
          <div className="flex flex-col space-y-10 w-full">
            <span className="font-medium">
              {
                "This is your chance to pitch candidates. Tell them about your company, the role, and why they should apply."
              }
            </span>
            <span>
              Be sure to keep it natural. Candidates are more likely to submit
              unscripted vidoes if your pitch video is also unscripted.
            </span>
            <VideoPlayer videoSrcs={[intro.media_url]} showControls={true} />
            <div className="flex justify-center">
              {intro.is_processing_video_update ? (
                <div>
                  <div className="mt-2 flex items-center space-x-2 text-yellow-500">
                    <CircularProgress
                      isIndeterminate
                      color="yellow.500"
                      size="20px"
                    />
                    <span>Video is being processed...</span>
                  </div>
                </div>
              ) : (
                <button
                  className="border border-black rounded px-6 py-2 w-full hover:text-white font-bold hover:bg-gray-900 hover:border-gray-900 hover:shadow-xl hover:scale-105 transition-all ease-in-out duration-300"
                  onClick={handleUpdateIntro}
                >
                  Change Intro Video
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default IntroStep;
