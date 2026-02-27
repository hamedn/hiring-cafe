import useMobileDeviceDetection from "@/hooks/useMobileDeviceDetection";
import {
  ChatBubbleOvalLeftIcon,
  ClipboardIcon,
  HomeIcon,
  UserIcon,
} from "@heroicons/react/20/solid";
import Link from "next/link";
import { useRouter } from "next/router";

export default function BottomTabs() {
  const router = useRouter();
  const currentPath = router.pathname;
  const { slug } = router.query;
  const { isIOS, isInStandaloneMode } = useMobileDeviceDetection();

  return (
    <div className={`lg:hidden flex flex-col sticky bottom-0 text-xs z-20`}>
      <div
        className={`flex font-medium items-center space-x-4 justify-between bg-white px-4 ${
          isInStandaloneMode && isIOS ? "pt-4 pb-10" : "py-6"
        }`}
      >
        <Link href={"/"}>
          <HomeIcon
            className={`flex-none h-7 w-7 ${
              currentPath === "/" ? "text-pink-500" : "text-gray-400"
            }`}
          />
        </Link>
        <Link href={"/myhiringcafe/tracker"}>
          <ClipboardIcon
            className={`flex-none h-7 w-7 ${
              ["tracker", "hidden-companies", "saved-searches"].includes(slug)
                ? "text-pink-500"
                : "text-gray-400"
            }`}
          />
        </Link>
        <Link href={"/talent-network"}>
          <ChatBubbleOvalLeftIcon
            className={`flex-none h-7 w-7 ${
              currentPath === "/talent-network"
                ? "text-pink-500"
                : "text-gray-400"
            }`}
          />
        </Link>
        <Link href={"/account"}>
          <UserIcon
            className={`flex-none h-7 w-7 ${
              currentPath === "/account" ? "text-pink-500" : "text-gray-400"
            }`}
          />
        </Link>
      </div>
    </div>
  );
}
