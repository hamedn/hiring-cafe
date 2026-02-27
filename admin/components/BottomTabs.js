import Link from "next/link";
import {
  BanknotesIcon,
  BriefcaseIcon,
  ClipboardDocumentListIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";
import { Picture } from "@/utils/picture";

export default function BottomTabs() {
  return (
    <div
      className={`flex md:hidden items-center space-x-4 justify-between sticky bottom-0 py-2 px-4 text-xs bg-white border-t text-gray-400`}
    >
      <Link
        href={"/admin/jobs"}
        className={`flex flex-col flex-none items-center text-center space-y-2`}
      >
        <BriefcaseIcon className="h-4 w-4 flex-none" />
        <span>Jobs</span>
      </Link>
      <Link
        href={"/admin/settings"}
        className={`flex flex-col items-center text-center space-y-2`}
      >
        <UserGroupIcon className="h-4 w-4 flex-none" />
        <span>Team</span>
      </Link>
      <Link
        href={"/admin/billing"}
        className={`flex flex-col items-center text-center space-y-2 font-medium`}
      >
        <BanknotesIcon className="h-4 w-4 flex-none" />
        <span>Billing</span>
      </Link>
      <Link
        href={"/admin"}
        className={`flex flex-col items-center text-center space-y-2 text-black font-medium`}
      >
        <Picture src="/icons/mochi.svg" properties={"w-4 h-4 flex-none"} />
        <span>Candidate Profiles</span>
      </Link>
      <Link
        href={"/admin/inbox"}
        className={`flex flex-col items-center text-center space-y-2`}
      >
        <span className="flex-none">💬</span>
        <span>Inbox</span>
      </Link>
      <Link
        href={"/admin/inbox"}
        className={`flex flex-col items-center text-center space-y-2`}
      >
        <ClipboardDocumentListIcon className="h-4 w-4 flex-none" />
        <span>ATS</span>
      </Link>
    </div>
  );
}
