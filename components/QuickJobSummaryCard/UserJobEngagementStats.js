import LottieAnimation from "@/components/lottieAnimation";
import Fire from "@/animations/fire";
import { useAuth } from "@/hooks/useAuth";
import AuthenticationModal from "../AuthenticationModal";
import {
  ArrowTrendingUpIcon,
  BookmarkIcon,
  EyeIcon,
  PaperAirplaneIcon,
} from "@heroicons/react/24/outline";
import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  useBreakpointValue,
  useDisclosure,
} from "@chakra-ui/react";
import useJobLabelMapping from "@/hooks/useJobLabelMapping";
import { useState } from "react";

const formatNumber = (num) =>
  !num || isNaN(num) || num === 0 || num === "0"
    ? 0
    : Math.abs(num) >= 1.0e9
      ? (num / 1.0e9).toFixed(1) + "B"
      : Math.abs(num) >= 1.0e6
        ? (num / 1.0e6).toFixed(1) + "M"
        : Math.abs(num) >= 1.0e3
          ? (num / 1.0e3).toFixed(1) + "K"
          : num.toString();

export default function UserJobEngagementStats({ job, viewFormat }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { user, loading: isLoadingUser } = useAuth();
  const { numViews, numSaved, numMarkApplied, isHotJob } = useJobLabelMapping({
    job,
    viewFormat,
  });
  const [index, setIndex] = useState(0);
  const size = useBreakpointValue({ base: "full", md: "md" });
  const {
    isOpen: isHotJobInfoModalOpen,
    onOpen: onHotJobInfoModalOpen,
    onClose: onHotJobInfoModalClose,
  } = useDisclosure();

  const viewInfos = [
    {
      title: "views",
      icon: EyeIcon,
      value: numViews,
    },
    {
      title: "saves",
      icon: BookmarkIcon,
      value: numSaved,
    },
    {
      title: "applications",
      icon: PaperAirplaneIcon,
      value: numMarkApplied,
    },
  ];

  return (
    <>
      {isLoadingUser ? null : user ? (
        <div className="flex items-center space-x-6 text-xs">
          {viewInfos.map((viewInfo, i) => (
            <span
              key={viewInfo.title}
              // onClick={() => {
              //   setIndex(i);
              //   onOpen();
              // }}
              className={`flex items-center font-extralight space-x-1`}
            >
              <viewInfo.icon className="h-2.5 w-2.5 flex-none" />
              <span className="font-normal">
                {formatNumber(viewInfo.value)}
              </span>
              <span>{viewInfo.title}</span>
            </span>
          ))}
        </div>
      ) : (
        <AuthenticationModal>
          <div className="flex items-center space-x-1 text-xs">
            <ArrowTrendingUpIcon className="h-3 w-3 flex-none text-gray-600" />
            <span>See views</span>
          </div>
        </AuthenticationModal>
      )}
      <Modal isOpen={isOpen} onClose={onClose} size={size}>
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton />
          <ModalBody>
            <div className="flex flex-col text-center space-y-8 items-center space-x-4 px-8 py-16">
              <div className="flex items-center space-x-4">
                <ArrowTrendingUpIcon className="h-6 w-6 flex-none" />
                <span className="text-5xl font-extrabold">
                  {formatNumber(viewInfos[index].value)}
                </span>{" "}
              </div>
              <span className="">
                Logged in {viewInfos[index].title.toLocaleLowerCase()}
              </span>
            </div>
          </ModalBody>
        </ModalContent>
      </Modal>
      <Modal
        isOpen={isHotJobInfoModalOpen}
        onClose={onHotJobInfoModalClose}
        size={size}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton />
          <ModalBody>
            <div className="flex flex-col items-center text-center space-y-4 pb-16 p-8">
              <LottieAnimation
                width="200px"
                height="200px"
                animationData={Fire}
                customOptions={{ loop: true }}
              />
              <span className="font-medium">This job is trending!</span>
            </div>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}
