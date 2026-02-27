import {
  BuildingStorefrontIcon,
  HeartIcon,
  UserIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import { useRouter } from "next/router";
import { FaTwitter } from "react-icons/fa";

export default function SideMenu() {
  const router = useRouter();

  // Helper function to determine current page
  const isCurrentPage = (path) => {
    return router.pathname === path;
  };

  return (
    <div className="flex flex-col flex-auto bg-orange-50">
      <Link href={"/"} className="flex m-4">
        <span className="text-xl">☕</span>
      </Link>
      <div className="flex flex-col h-full justify-between">
        <div className="flex flex-col space-y-4">
          <Link
            href={"/"}
            className={`${
              isCurrentPage("/") && "bg-yellow-700 text-white"
            } m-2 p-2 rounded-xl`}
          >
            <BuildingStorefrontIcon className="h-5 w-5" />
          </Link>
          <Link
            href={"/list"}
            className={`${
              isCurrentPage("/list") && "bg-yellow-700 text-white"
            } m-2 p-2 rounded-xl`}
          >
            <HeartIcon className="h-5 w-5" />
          </Link>
        </div>
        <div className="flex flex-col">
          <Link
            href={"/auth"}
            className={`${
              isCurrentPage("/auth") && "bg-yellow-700 text-white"
            } m-2 p-2 rounded-xl`}
          >
            <UserIcon className="h-5 w-5" />
          </Link>
          <Link
            href={"/message"}
            target="_blank"
            rel="noopener noreferrer"
            className={`m-2 p-2 rounded-xl`}
          >
            <span>V2</span>
          </Link>
          <Link
            href={"https://twitter.com/ali_mir_1/status/1645897044589187072"}
            target="_blank"
            rel="noopener noreferrer"
            className={`m-2 p-2 mb-8 rounded-xl`}
          >
            <FaTwitter className="h-5 w-5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
