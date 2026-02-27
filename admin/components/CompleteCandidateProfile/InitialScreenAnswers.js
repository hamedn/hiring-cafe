import { useState } from "react";
import VideoPlayer from "../adminDashboard/candidateProfiles/VideoPlayer";
import useApplicantScreens from "@/admin/hooks/useApplicantScreens";
import { VideoCameraSlashIcon } from "@heroicons/react/24/outline";
import {
  initialScreenQuestions,
  initialScreenVideoURLs,
} from "@/utils/helpers";

const videos = [
  {
    title:
      "What is the most complex deal you have ever closed? What made it complex and how did you navigate that complexity?",
    src: "https://media.videoask.com/transcoded/f407218b-1368-4031-bc77-c3a1cfd8df7a/video.mp4?token=eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJtZWRpYV9pZCI6ImY0MDcyMThiLTEzNjgtNDAzMS1iYzc3LWMzYTFjZmQ4ZGY3YSIsImV4cCI6MTY4NjA0NDEyM30.nNj1jfmGgDop2SLsz3FaXY-PYCNR-SSU-OOEdj9en7KPNugMSO-kvYUb-uO0Uu7cF01j7lZO1QU8OPgkd17cgY7-TjUzgn6If0rzHOjc_EKio9bqwXHKJL5PSFIPFgygMdWshdESeSiweLkyaKPjUyhRo57bOuM7Cz8v1VCwQ1uPysL6XFAx8dOvqA0Psagczd9YChK72nPuaEnFdEHJCVkpRQ9cLpevbXH4WwDiRA_fVHBin7dr_RgRcbUuW2ygyzzA_A-OV7jZLMkTv_OKb92rJcqyjzxrdGh5_8iiRm9ebOo3tSYQ9uw8RQUWbvUvg7DXjamImOXljeDhqNTPxp0u33-aLgHSvaShyDbYwz4tgsnKRgXDyIa7lXa-PLqwuPoOHdmli8C77TCvOjeF_G7-ungEG1pbRSs0gqFSdjdDgTAdhb8RGzBPUaiiyOstXkycVNp9Za_iA8LrpY7qubq3xPXnvFYTDe__DpOAv-AOHPPfkh4dQnwxF2inrB3Vkn45D9UKkzNCtog-UgTRfrBHuCAyti8apwsCFbYanfEn4mf1FIfuu4GLNtFMmKE_BRWKUTffi3xPqsWyfMYKO0rIHLFe_zHXc1_ix3yacfVWctQsKRmJ4sJ7RBajxwR07LdqT2hOk-zVUFLwIKD3nhUe7yEShVRVZ4UQo7Ja-5U",
  },
  {
    title:
      "Can you describe the sales process at your previous job? How did it compare to our process as you understand it?",
    src: "https://media.videoask.com/transcoded/7161da38-72fd-4b70-9aa9-843111e6df2f/video.mp4?token=eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJtZWRpYV9pZCI6IjcxNjFkYTM4LTcyZmQtNGI3MC05YWE5LTg0MzExMWU2ZGYyZiIsImV4cCI6MTY4NjA0NDEyOX0.qe5V9CwtYQxfpebyhKezDyYPwbHqbIVqW-F22GTK1e-1ERg6nAw66ZDMXAb3Pcn79rvk4pijZb7NuNeEIeL1bErYYtYhhua0INai1AzGMf7NsatwoFROL8aVtYc6UWllqdrBiFDFtQlZJFXq60dj6ftSBvRyjL1hTqQa253mC4sIcCE7fkB0OatLjBUxNxURcjb9ljBhjmuNEFuWnkelIF9yJ5Oo-Ns8vhyZko6hX9ZwDBnzZHh5Go3ZZyMCF2V6NIUTV1vTv6Sk_nxnCAXgs11eIOf0CDkjsrsmotuuBMbEv2KyTdEdotvApLFZFeQ5kgqmX9tfoYnXQAeH4YO49xjYICxKJTngX2tsM1cvJgztC5VMvf4J4_pM8atE97sogNKNpwTzOpi_0mYfkkWnSDUUi5ASLfeOwkPBsI-MF3uiT72-ZoU4JaNnD-3KALPhxPPe6T5E5FCVMwVVJiidOwAnpFZ4s_qpI6xK_cLoAnIOY9EShYVsFK7b6UglGWm0QYUAIufazw5tuApYOspthTJoi-UnjX3eF52wcWPvKSvx7lN_bgYGFWYDeh_X0XQauPgcNN63NIifQ9LhE3M-d_f5L35gWAeocGAp73fJuzq4E5reM5ckyMHt2J80YCdFLVcvpdYK24YYCE3JsvdXmHHVREQPKn8ktfV8ytFM-xI",
  },
  {
    title:
      "Have you ever worked in a startup environment before? How do you handle the ambiguity and fast pace of a startup?",
    src: "https://media.videoask.com/transcoded/580ea2cc-8558-41e9-aaca-10fa75f59133/video.mp4?token=eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJtZWRpYV9pZCI6IjU4MGVhMmNjLTg1NTgtNDFlOS1hYWNhLTEwZmE3NWY1OTEzMyIsImV4cCI6MTY4NjA0NDEyOX0.fCMq6f97Ub8C2ziD6XXqXRILKPUYCoY7jSekSMEBeVLduSzhbinH0XHxMMqG6QqO1oWTE5FBoAFlL_Q-MzER_vtsKAJb8arufUh1f4cN91HZ5_7xDn8GClK5lOXUJTuTuvZxTAIhATg71yxCXH7MaN1paWVlHenXhoLJL0ZgdNYz8tcbhJt-coii6I_LuzdorIBrEO-S5s701bSoQEzOtmAbBhuFQSJJruJXIq2gwNEIoPNr4ATpDPkXOBa1ZSALZLsvBfIs-C6ogwmvhB6ly0gNHqDOS9J5TTB6AJ29vJe99DDKCZBISG5XHw4dAngaCE5tYEbPPQQkmOHU31g7WLb9OhVZoXFmGjpLA-l6p__QopMzOtiL3JWnDor2yVDvWUWao_JHGb3wte8bbcbobtGe_VNeS9fOsoJ1cIVU_51mYpuEkVPIVFOVTvXOr5gE3LSOmHCNRvAqU4C-5wdJeV-osjjGy1YviL8LQh8yWxbT9Gw91sqPHTu2AlZb2hYsSdXb0ZZqg4JAr4Xt7HGbtj3h2bKQIrY37JslO81xybw8VrwfoGPwayw7huvDKOY3pdLNHYIiJyPnFc0bjNuWt6Aum_-Dg4jzLUVCBVGCSExGwfbJGy9XkqjENC1Oful3wLWTkQxwkc6JcbGwPclhjd-zc7YNRfiQRqVZ9kAZJjs",
  },
];

export default function InitialScreenAnswers({ applicantId }) {
  const [currentVideo, setCurrentVideo] = useState(0);
  const [showControls, setShowControls] = useState(false);
  const {
    applicantScreens,
    loading: loadingApplicantScreens,
    error: applicantScreensError,
  } = useApplicantScreens({
    applicantId,
  });

  return (
    <div
      className="flex flex-col"
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(false)}
    >
      {loadingApplicantScreens ? (
        <div className="w-full h-96 bg-gray-300 animate-pulse rounded-2xl" />
      ) : applicantScreensError ? (
        <div className="flex justify-center items-center p-4 text-center w-full h-96 bg-red-50 font-medium rounded-2xl">
          <div className="flex flex-col items-center space-y-2 text-red-600">
            <VideoCameraSlashIcon className="h-12 w-12 mr-2" />
            <span className="text-center">
              {applicantScreensError?.message || "Error loading screen videos"}
            </span>
          </div>
        </div>
      ) : initialScreenVideoURLs(applicantScreens) ? (
        <VideoPlayer
          videoSrcs={initialScreenVideoURLs(applicantScreens)}
          showControls={showControls}
          onVideoChange={(index) => {
            setCurrentVideo(index);
          }}
        />
      ) : (
        <div className="flex justify-center p-4 items-center w-full h-96 bg-gray-300 font-medium rounded-2xl">
          <div className="flex flex-col items-center text-center space-y-2">
            <VideoCameraSlashIcon className="h-12 w-12 text-black mr-2" />
            <span className="text-center">Please contact support</span>
          </div>
        </div>
      )}
      {applicantScreens && initialScreenQuestions(applicantScreens) && (
        <span className="flex justify-center mt-4 text-xl font-medium italic text-gray-500">
          {initialScreenQuestions(applicantScreens)[currentVideo]}
        </span>
      )}
    </div>
  );
}
