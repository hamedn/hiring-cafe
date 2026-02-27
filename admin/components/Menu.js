import Link from "next/link";
import {
  ArrowRightOnRectangleIcon,
  BriefcaseIcon,
  UserGroupIcon,
  ClipboardDocumentListIcon,
  BanknotesIcon,
  LockClosedIcon,
} from "@heroicons/react/24/outline";
import { useRouter } from "next/router";
import { Picture } from "@/utils/picture";
import { useAuth } from "../hooks/useAuth";
import { signout } from "../utils/client/signOut";
import HiringCafeEmployersLogo from "@/components/HiringCafeEmployersLogo";

export const Menu = () => {
  const router = useRouter();
  const { user, loadingUser } = useAuth();

  // A helper function to determine if the link is active
  const isActive = (href) => router.asPath === href;

  const activeStyleFind =
    "bg-orange-200 text-orange-800 font-bold py-1.5 px-2 rounded";

  return (
    <div className="flex flex-col w-44 ml-1">
      <div className="flex flex-col overflow-y-auto scrollbar-hide h-full">
        <div className="flex flex-col space-y-2">
          <HiringCafeEmployersLogo />
        </div>
        <div className="flex flex-col border-t mt-4 py-4">
          <span className="text-xs font-bold text-gray-500">Setup</span>
          <div className="mt-4 flex flex-col space-y-4">
            <Link
              href={`/admin/jobs`}
              className={`flex justify-between items-center space-x-2 font-medium text-sm flex-none ${
                isActive("/admin/jobs") ? "bg-gray-200 py-1.5 px-2 rounded" : ""
              }`}
            >
              <div className="flex items-center space-x-2">
                <BriefcaseIcon className="h-4 w-4" />
                <span>Jobs</span>
              </div>
              {!loadingUser && !user && <LockClosedIcon className="h-4 w-4" />}
            </Link>
            {/* <Link
              href={`/admin/boost-outreach`}
              className={`flex items-center space-x-2 font-medium text-sm flex-none ${
                isActive("/admin/boost-outreach")
                  ? "bg-gray-200 py-1.5 px-2 rounded"
                  : ""
              }`}
            >
              <FireIcon className="h-4 w-4" />
              <span>Hot Outreach</span>
            </Link> */}
            <Link
              href={`/admin/settings`}
              className={`flex items-center justify-between space-x-2 font-medium text-sm flex-none ${
                isActive("/admin/settings")
                  ? "bg-gray-200 py-1.5 px-2 rounded"
                  : ""
              }`}
            >
              <div className="flex items-center space-x-2">
                <UserGroupIcon className="h-4 w-4" />
                <span>Team</span>
              </div>
              {!loadingUser && !user && <LockClosedIcon className="h-4 w-4" />}
            </Link>
            <Link
              href={`/admin/billing`}
              className={`flex items-center justify-between space-x-2 font-medium text-sm flex-none ${
                isActive("/admin/billing")
                  ? "bg-gray-200 py-1.5 px-2 rounded"
                  : ""
              }`}
            >
              <div className="flex items-center space-x-2">
                <BanknotesIcon className="h-4 w-4" />
                <span>Billing</span>
              </div>
              {!loadingUser && !user && <LockClosedIcon className="h-4 w-4" />}
            </Link>
          </div>
        </div>
        <div className="flex flex-col border-t py-4">
          <span className="text-xs font-bold text-gray-500">Source</span>
          <Link
            href={"/admin/"}
            className={`flex items-center justify-between text-sm mt-4 ${
              isActive("/admin") ? activeStyleFind : "font-medium"
            }`}
          >
            <div className="flex items-center space-x-2">
              <div className="bg-orange-600 rounded-full p-0.5">
                <UserGroupIcon className="h-4 w-4 flex-none text-white" />
              </div>
              <span>Talent Network</span>
            </div>
          </Link>
          <Link
            href={"/admin/job-postings"}
            className={`flex items-center justify-between text-sm mt-4 ${
              isActive("/admin/job-postings") ? activeStyleFind : "font-medium"
            }`}
          >
            <div className="flex items-center space-x-2">
              <Picture
                src="/icons/job-posting.svg"
                properties={"w-4 h-4 flex-none"}
              />
              <span>Job Postings</span>
            </div>
          </Link>
        </div>
        <div className="flex flex-col py-4 border-t">
          <span className="text-xs font-bold text-gray-500">Toolkit</span>
          <div className="mt-4 flex flex-col space-y-4">
            <Link
              href={"/admin/inbox"}
              className={`flex items-center justify-between space-x-2 font-medium text-sm flex-none ${
                isActive("/admin/inbox")
                  ? "bg-gray-200 py-1.5 px-2 rounded"
                  : ""
              }`}
            >
              <div className="flex items-center space-x-2">
                <span>💬</span>
                <span>Inbox</span>
              </div>
              {!loadingUser && !user && <LockClosedIcon className="h-4 w-4" />}
            </Link>
            <Link
              href={"/admin/ats"}
              className={`flex items-center justify-between space-x-2 font-medium text-sm flex-none ${
                isActive("/admin/ats") ? "bg-gray-200 py-1.5 px-2 rounded" : ""
              }`}
            >
              <div className="flex items-center space-x-2">
                <ClipboardDocumentListIcon className="h-4 w-4 flex-none" />
                <span>ATS</span>
              </div>
              {!loadingUser && !user && <LockClosedIcon className="h-4 w-4" />}
            </Link>
          </div>
        </div>
      </div>
      <div
        className={`flex items-center justify-center sticky bottom-0 bg-white py-4 border-t`}
      >
        {user ? (
          <div className="flex flex-col items-center space-y-2 mt-2 w-full">
            <div className="mb-8 flex flex-col space-y-1 text-xs border p-2 rounded-xl">
              <span className="font-bold">Customer Support</span>
              <span>Email: ali@hiring.cafe</span>
              <span>Phone: +1-408-466-5110</span>
            </div>
            <span className="text-xs">{user.email}</span>
            <button
              onClick={async () => {
                if (confirm("Are you sure you want to log out?")) {
                  await signout();
                  router.reload();
                }
              }}
              className="flex items-center text-start space-x-2 text-red-600"
            >
              <ArrowRightOnRectangleIcon className="h-4 w-4" />
              <span className="text-sm font-medium">Log Out</span>
            </button>
          </div>
        ) : (
          <Link
            href="/admin/auth"
            className="w-full flex items-center text-center justify-center space-x-2 text-orange-800 text-sm font-medium bg-orange-200 py-2 rounded-full"
          >
            Employers Log In
          </Link>
        )}
      </div>
    </div>
  );
};
