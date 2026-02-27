import AccountNavBarPopover from "./AccountNavBarPopover";
import AuthenticationModal from "./AuthenticationModal";
import { useAuth } from "@/hooks/useAuth";
import Link from "next/link";
import SearchJobs from "./SearchJobs";
import { FunnelIcon } from "@heroicons/react/24/outline";
import { FaReddit } from "react-icons/fa";
import { ThemeToggleCompact } from "./ThemeToggle";

export default function NavBarV5() {
  const { loading, isVerifiedUser } = useAuth();

  return (
    <>
      <div className="flex items-center justify-between md:hidden mb-8 md:mb-0">
        <Link href={"/"} className="flex items-center space-x-2">
          <div className="w-fit text-white bg-pink-500 rounded-full p-2">
            <FunnelIcon className="h-5 w-5 flex-none" />
          </div>
          <span className="text-pink-500 font-extrabold">HiringCafe</span>
        </Link>
        <div className="flex items-center space-x-2">
          <ThemeToggleCompact />
          <Link
            href="https://www.reddit.com/r/hiringcafe"
            className="flex-none font-semibold flex items-center space-x-2 border border-gray-600 rounded px-3 py-2"
            target="_blank"
            rel="noopener noreferrer"
          >
            <span className="text-xs">Join our community</span>
            <FaReddit className="w-4 h-4 flex-none text-red-500" />
          </Link>
        </div>
      </div>
      <div className="flex items-center justify-between md:space-x-4 w-full">
        <div className="flex items-center md:space-x-4 w-full">
          <Link
            href={"/"}
            className="hidden md:flex md:items-center md:space-x-2"
          >
            <div className="w-fit text-white bg-pink-500 rounded-full p-2">
              <FunnelIcon className="h-5 w-5 flex-none" />
            </div>
            <span className="text-pink-500 font-extrabold hidden xl:block">
              HiringCafe
            </span>
          </Link>
          <SearchJobs />
        </div>
        <div className="hidden md:flex md:space-x-4 items-center">
          {!loading && !isVerifiedUser && (
            <AuthenticationModal>
              <span className="font-semibold flex-none text-sm">Log in</span>
            </AuthenticationModal>
          )}
          <AccountNavBarPopover />
        </div>
      </div>
    </>
  );
}
