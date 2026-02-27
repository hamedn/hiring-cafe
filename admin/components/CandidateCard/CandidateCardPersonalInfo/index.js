import useApplicantFromTalentNetwork from "@/admin/hooks/useApplicantFromTalentNetwork";
import { useAuth } from "@/admin/hooks/useAuth";
import WorkingLaptop from "@/animations/WorkingLaptop";
import LottieAnimation from "@/components/lottieAnimation";
import { ISO_COUNTRIES } from "@/utils/backend/countries";
import {
  CircularProgress,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  useDisclosure,
} from "@chakra-ui/react";
import { CheckCircleIcon } from "@heroicons/react/20/solid";
import {
  MapPinIcon,
  QuestionMarkCircleIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";

export default function CandidateCardPersonalInfo({ candidate }) {
  const {
    isOpen: isStatusInfoEducationModalOpen,
    onOpen: onStatusInfoEducationModalOpen,
    onClose: onStatusInfoEducationModalClose,
  } = useDisclosure();

  const { applicant, loading } = useApplicantFromTalentNetwork({
    candidateID: candidate.id,
  });
  const { user } = useAuth();

  if (user && loading) {
    return (
      <div className="flex justify-center py-4 h-56 flex-col items-center">
        <CircularProgress isIndeterminate size="24px" color="black" />
      </div>
    );
  }

  return (
    <div className="flex flex-col space-y-2 px-2 py-2 text-xs max-h-96 overflow-y-auto">
      <div className="flex flex-col space-y-1">
        <span className="font-bold">Name</span>
        <span>
          {applicant?.profile?.name ||
            "Revealed when candidate accepts your invite."}
        </span>
      </div>
      <div className="flex flex-col space-y-1">
        <span className="font-bold">Email</span>
        <span>
          {applicant?.profile?.email ||
            "Revealed when candidate accepts your invite."}
        </span>
      </div>
      <div className="flex flex-col space-y-1">
        <span className="font-bold">Resume</span>
        {applicant?.resume ? (
          <Link
            className="underline w-fit"
            href={applicant.resume}
            rel="noreferrer"
            target="_blank"
          >
            Download Resume
          </Link>
        ) : (
          "Revealed when candidate accepts your invite."
        )}
      </div>
      {applicant?.profile?.website && (
        <div className="flex flex-col space-y-1">
          <span className="font-bold">Website</span>
          <span>{applicant.profile.website}</span>
        </div>
      )}
      {applicant?.profile?.linkedin && (
        <div className="flex flex-col space-y-1">
          <span className="font-bold">Linkedin</span>
          <span>{applicant.profile.website}</span>
        </div>
      )}
      <button
        onClick={() => {
          onStatusInfoEducationModalOpen();
        }}
        className="flex flex-col space-y-1"
      >
        <div className="flex items-center space-x-1 font-bold">
          <span>Status</span>
          <QuestionMarkCircleIcon className="h-3 w-3 flex-none" />
        </div>
        <div className="flex items-center space-x-1 text-green-600">
          <CheckCircleIcon className="h-3 w-3 flex-none" />
          <span className="">Actively exploring new opportunities</span>
        </div>
      </button>
      <div className="flex flex-col space-y-1">
        <span className="font-bold">Current Location</span>
        <div className="flex items-center space-x-1">
          <MapPinIcon className="h-3 w-3 flex-none" />
          <span className="">
            {candidate.current_location?.formatted_address || "-"}
          </span>
        </div>
      </div>
      {candidate.locations?.length ? (
        <div className="flex flex-col space-y-1">
          <span className="font-bold">
            Open to other locations (including remote)
          </span>
          <div className="flex items-center space-x-1">
            <div className="flex items-center space-x-2 overflow-x-auto scrollbar-hide">
              {candidate.locations.map((countryCode) => (
                <span
                  className="flex-none border rounded-full py-0.5 px-2"
                  key={countryCode}
                >
                  {ISO_COUNTRIES[countryCode]}
                </span>
              ))}
            </div>
          </div>
        </div>
      ) : null}
      {candidate.min_salary && (
        <div className="flex flex-col space-y-1">
          <span className="font-bold">Salary expectation</span>
          <span>{candidate.min_salary}</span>
        </div>
      )}
      <Modal
        isOpen={isStatusInfoEducationModalOpen}
        onClose={() => {
          onStatusInfoEducationModalClose();
        }}
        size={"2xl"}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton />
          <ModalBody>
            <div className="flex flex-col p-2 pb-8">
              <LottieAnimation
                width="300px"
                height="100%"
                animationData={WorkingLaptop}
              />
              <span className="font-bold">{`They're open to new opportunities!`}</span>
              <span className="mt-2">
                {`Interested in this candidate? Go ahead and send them an invite! This candidate is using HiringCafe to explore new opportunities and is waiting for you to reach out. They trust us with their latest information, including contact details and resume, which we'll gladly share with you upon their acceptance of your invite.`}
              </span>
              <span className="font-bold mt-8">{`How it Works`}</span>
              <span className="mt-2">
                {`Every candidate in HiringCafe's Talent Network can decide whether or not they want their profile to be visible on search results. It's as simple as toggling a switch. When a candidate is open to explore new job opportunities, they can turn on the switch and we'll show their profile in search results. When they're not, we'll hide their profile from search results.`}
              </span>
            </div>
          </ModalBody>
        </ModalContent>
      </Modal>
    </div>
  );
}
