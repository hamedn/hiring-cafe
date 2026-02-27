import { FunnelIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

export default function HiringCafeEmployersLogo() {
  return (
    <div className="w-fit">
      <Link href={"/employers"}>
        <div className={`flex items-center space-x-1.5 text-yellow-600`}>
          <FunnelIcon className="h-7 w-7 flex-none" />
          <span className={`text font-light`}>for Employers</span>
        </div>
      </Link>
    </div>
  );
}
