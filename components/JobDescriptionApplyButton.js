import { jobURLLink, jobApplicationLinkInfo } from "@/utils/helpers";
import { useAuth } from "@/hooks/useAuth";
import { ArrowTopRightOnSquareIcon } from "@heroicons/react/24/outline";
import useSeekerProfile from "@/hooks/useSeekerProfile";
import { usePostHog } from "posthog-js/react";
import onJobApply from "@/utils/onJobApply";
import useBrowseJobStatusV4 from "@/hooks/useBrowseJobStatusV4";
import { useDisclosure, useToast } from "@chakra-ui/react";
import EmailApplyModal from "./EmailApplyModal";

export default function JobDescriptionApplyButton({ job, frontend_source }) {
  const { markJobAsViewed, markJob } = useBrowseJobStatusV4({
    job,
  });
  const { setLastActive } = useSeekerProfile();
  const { user } = useAuth();

  const posthog = usePostHog();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const applyInfo = jobApplicationLinkInfo(job, user);

  return (
    <>
      <button
        onClick={async (e) => {
          e.stopPropagation();

          onJobApply({
            job,
            posthog,
            markJobAsViewed,
            setLastActive,
            frontend_source,
            toast,
            markJob,
            isLoggedIn: !!user,
          });

          if (applyInfo.type === "email") {
            onOpen();
          } else {
            window.open(applyInfo.url, "_blank");
          }
        }}
        className="outline-none"
      >
        <div className="text-white bg-pink-500 rounded px-4 py-2 font-bold text-base w-fit flex items-center space-x-1.5">
          <span className="text-sm">Apply now</span>
          <ArrowTopRightOnSquareIcon className="h-3 w-3 flex-none" />
        </div>
      </button>
      {applyInfo.type === "email" && (
        <EmailApplyModal email={applyInfo.email} isOpen={isOpen} onClose={onClose} />
      )}
    </>
  );
}
