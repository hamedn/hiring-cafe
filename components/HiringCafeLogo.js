import { FunnelIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

export default function HiringCafeLogo({ href }) {
  return (
    <div className="w-fit text-pink-500">
      <Link href={href || "/"}>
        <div className={`flex items-center space-x-1`}>
          <FunnelIcon className="h-6 w-6 flex-none" />
          <div className="flex items-end space-x-1">
            <span className={`font-extrabold`}>HiringCafe</span>
          </div>
        </div>
      </Link>
    </div>
  );
}
