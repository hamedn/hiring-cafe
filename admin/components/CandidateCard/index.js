import VerifiedUser from "@/animations/VerifiedUser";
import {
  BriefcaseIcon,
  CheckIcon,
  ClockIcon,
  UserIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import {
  CircularProgress,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
} from "@chakra-ui/react";
import MakeReachOutRequest from "../ReachOut/MakeReachOutRequest";
import CandidateCardExperience from "./CandidateCardExperience";
import { useState } from "react";
import CandidateCardPersonalInfo from "./CandidateCardPersonalInfo";
import CandidateCardNotes from "./CandidateCardNotes";
import CandidateCardTimeline from "./CandidateCardTimeline.js";
import useCandidateIntroRequest from "@/admin/hooks/useCandidateIntroRequest";
import { CheckBadgeIcon } from "@heroicons/react/20/solid";
import LottieAnimation from "@/components/lottieAnimation";
import { useAuth } from "@/admin/hooks/useAuth";

export default function CandidateCard({ candidate }) {
  const {
    isOpen: isReachOutOptionModalOpen,
    onOpen: onReachOutOptionModalOpen,
    onClose: onReachOutOptionModalClose,
  } = useDisclosure();
  const {
    isOpen: isVerifiedInfoModalOpen,
    onOpen: onVerifiedInfoModalOpen,
    onClose: onVerifiedInfoModalClose,
  } = useDisclosure();

  const {
    introRequest,
    refresh,
    loading: loadingIntroRequest,
  } = useCandidateIntroRequest({
    candidate_id: candidate.id,
  });

  const { user } = useAuth();

  const tabs = [
    {
      icon: BriefcaseIcon,
      title: "Experience",
    },
    {
      icon: UserIcon,
      title: "Personal Info",
    },
    {
      icon: ClockIcon,
      title: "Timeline",
    },
  ];
  const [selectedTab, setSelectedTab] = useState("Experience");

  function isRecent(timestamp) {
    const dateFromTimestamp = new Date(timestamp);
    const today = new Date();
    const sevenDaysAgo = new Date();

    // Set the time to the start of the day for accurate comparison
    dateFromTimestamp.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);
    sevenDaysAgo.setHours(0, 0, 0, 0);

    sevenDaysAgo.setDate(today.getDate() - 30);

    return dateFromTimestamp >= sevenDaysAgo && dateFromTimestamp <= today;
  }

  return (
    <div className="flex flex-col space-y-2 pb-2 border rounded-xl bg-white md:hover:shadow-md">
      <div className="px-4 py-2 border-b flex justify-between space-x-4">
        <div className="flex items-center space-x-4 text-black">
          {/* {candidate.verified && (
            <button className="" onClick={() => onVerifiedInfoModalOpen()}>
              <CheckBadgeIcon className="h-5 w-5 float-none text-yellow-600" />
            </button>
          )} */}
          {tabs.map((tab) => (
            <button
              key={tab.title}
              onClick={() => {
                setSelectedTab(tab.title);
              }}
              className={`flex justify-center items-center text-center text-sm rounded p-0.5 ${
                tab.title === selectedTab ? "bg-gray-600 text-white" : ""
              }`}
            >
              <tab.icon className="h-4 w-4 flex-none" />
            </button>
          ))}
          {isRecent(candidate.lastActive) ? (
            <div className="text-xs flex items-center space-x-2 text-green-700">
              <div className="h-2 w-2 rounded-full flex-none bg-green-700" />
              <span className="">Recently online</span>
            </div>
          ) : isRecent(candidate.created_at) ? (
            <div className="text-xs flex items-center space-x-2 text-green-700">
              <div className="h-2 w-2 rounded-full flex-none bg-green-700" />
              <span>Recently joined</span>
            </div>
          ) : null}
        </div>
        <div className="flex items-center space-x-4">
          {loadingIntroRequest && user ? (
            <CircularProgress isIndeterminate size="18px" color="black" />
          ) : introRequest?.current_status === "rejected" ? (
            <div className="flex items-center space-x-1 text-xs text-gray-400">
              <XMarkIcon className="h-3 w-3 flex-none" />
              <span>Rejected by candidate</span>
            </div>
          ) : introRequest ? (
            <div className="flex items-center space-x-1 text-xs text-gray-400">
              <CheckIcon className="h-3 w-3 flex-none" />
              <span>Invited</span>
            </div>
          ) : (
            <button
              onClick={() => {
                onReachOutOptionModalOpen();
              }}
              className="flex justify-center items-center space-x-1 text-center text-xs bg-gradient-to-r font-medium px-2 py-0.5 rounded border border-black hover:from-slate-500 hover:via-gray-600 hover:to-gray-700 hover:text-white transition-colors hover:border-white"
            >
              Invite
            </button>
          )}
        </div>
      </div>
      {selectedTab === "Experience" ? (
        <CandidateCardExperience candidate={candidate} />
      ) : selectedTab === "Personal Info" ? (
        <CandidateCardPersonalInfo candidate={candidate} />
      ) : selectedTab === "Notes" ? (
        <CandidateCardNotes candidate={candidate} />
      ) : selectedTab === "Timeline" ? (
        <CandidateCardTimeline candidate={candidate} />
      ) : null}
      <Modal
        size={"xl"}
        isOpen={isReachOutOptionModalOpen}
        onClose={onReachOutOptionModalClose}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Invite this candidate</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <div className="mb-4">
              <MakeReachOutRequest
                candidate={candidate}
                onFinish={() => {
                  onReachOutOptionModalClose();
                  refresh();
                }}
              />
            </div>
          </ModalBody>
        </ModalContent>
      </Modal>
      <Modal
        isOpen={isVerifiedInfoModalOpen}
        onClose={() => {
          onVerifiedInfoModalClose();
        }}
        size={"2xl"}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton />
          <ModalBody>
            <div className="flex flex-col p-2 pb-8">
              <LottieAnimation
                width="200px"
                height="100%"
                animationData={VerifiedUser}
                customOptions={{
                  loop: false,
                }}
              />
              <span className="font-bold">{`Verified Human`}</span>
              <span className="mt-2">
                {`Our team at HiringCafe has verified that this candidate is a real person. We do this by asking the candidate to record a short video of themselves. The verification process is quick (takes less than 10s) and is not meant to evaluate the candidate's skills or experience. Verification videos are confidential and are never shared with anyone other than the HiringCafe team.`}
              </span>
              <span className="font-bold mt-8">{`Why It Matters`}</span>
              <span className="mt-2">
                {`We want to make sure that you are only spending time on candidates who are real people - not bots or fake profiles! This is especially important for remote roles. The verification confirmation is not an endorsement of the candidate's skills or experience and should not be used as a proxy for evaluating the candidate.`}
              </span>
              <span className="font-bold mt-8">{`Example`}</span>
              <span className="mt-2">
                {`Below is an example of a verification video. The candidate gives a short introduction of themselves which is then reviewed by our team.`}
              </span>
              <div className="flex flex-col items-center text-center space-y-2">
                <iframe
                  src="https://ask.hiring.cafe/fcvi96we3?justvideo"
                  className="rounded-xl mt-4"
                  allow="camera *; microphone *; autoplay *; encrypted-media *; fullscreen *; display-capture *;"
                  width="100%"
                  height="300px"
                />
                <span className="font-medium text-gray-500">Demo video</span>
              </div>
            </div>
          </ModalBody>
        </ModalContent>
      </Modal>
    </div>
  );
}
