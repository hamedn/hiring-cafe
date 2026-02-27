import RemoteWork from "@/animations/remote-work";
import LottieAnimation from "@/components/lottieAnimation";
import useSeekerProfile from "@/hooks/useSeekerProfile";
import { TALENT_NETWORK_WALL_MESSAGE } from "@/utils/constants";
import Link from "next/link";

export default function TalentNetworkWallMessage({ reason }) {
  const { seekerUserData } = useSeekerProfile();

  return (
    <div className="flex flex-col items-center text-center p-4">
      <LottieAnimation
        width="250px"
        height="250px"
        animationData={RemoteWork}
      />
      <span className="text-2xl font-bold">
        {TALENT_NETWORK_WALL_MESSAGE[reason].title}
      </span>
      <span className="mt-2">
        {TALENT_NETWORK_WALL_MESSAGE[reason].content}
      </span>
      <Link
        href="/talent-network"
        target="_blank"
        rel="noopener noreferrer"
        className="font-bold text-lg text-yellow-600 mt-8 p-2 rounded border-yellow-600 border-2 hover:bg-yellow-600 hover:text-white transition-all duration-500"
      >
        {!seekerUserData
          ? "Join HiringCafe Talent Network For Free"
          : "Go Live to Continue"}
      </Link>
    </div>
  );
}
