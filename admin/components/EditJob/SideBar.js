import {
  ArrowsUpDownIcon as ArrowsUpDownIconOutline,
  BuildingOfficeIcon as BuildingOfficeIconOutline,
  Cog6ToothIcon as Cog6ToothIconOutline,
  CreditCardIcon as CreditCardIconOutline,
  EyeIcon as EyeIconOutline,
  GlobeAltIcon as GlobeAltIconOutline,
  PencilIcon as PencilIconOutline,
  VideoCameraIcon as VideoCameraIconOutline,
  MegaphoneIcon as MegaphoneIconOutline,
} from "@heroicons/react/24/outline";
import {
  GlobeAltIcon as GlobeAltIconSolid,
  PencilIcon as PencilIconSolid,
  VideoCameraIcon as VideoCameraIconSolid,
  ArrowsUpDownIcon as ArrowsUpDownIconSolid,
  CreditCardIcon as CreditCardIconSolid,
  BuildingOfficeIcon as BuildingOfficeIconSolid,
  EyeIcon as EyeIconSolid,
  Cog6ToothIcon as Cog6ToothIconSolid,
  MegaphoneIcon as MegaphoneIconSolid,
} from "@heroicons/react/20/solid";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function Sidebar() {
  const router = useRouter();
  const [, jobID, componentRequest] = router.query.slug;
  const [selected, setSelected] = useState(0);
  const [hoveringIndex, setHoveringIndex] = useState(-1);

  const baseURL = "/admin/edit-job/" + jobID + "/";

  useEffect(() => {
    if (!componentRequest) return setSelected(0);
    switch (componentRequest) {
      case "remote-setup":
        setSelected(0);
        break;
      case "job-description":
        setSelected(1);
        break;
      case "screening-questions":
        setSelected(2);
        break;
      case "interview-process":
        setSelected(3);
        break;
      case "budget":
        setSelected(4);
        break;
      case "preview":
        setSelected(5);
        break;
      case "settings":
        setSelected(6);
        break;
      default:
        setSelected(0);
        break;
    }
  }, [componentRequest]);

  const settings = [
    {
      name: "Basic Info",
      href: baseURL + "remote-setup",
      selectedIcon: GlobeAltIconSolid,
      deselectedIcon: GlobeAltIconOutline,
    },
    {
      name: "Job Description",
      href: baseURL + "job-description",
      selectedIcon: PencilIconSolid,
      deselectedIcon: PencilIconOutline,
    },
    {
      name: "Screening Questions",
      href: baseURL + "screening-questions",
      selectedIcon: VideoCameraIconSolid,
      deselectedIcon: VideoCameraIconOutline,
      hidden: true,
    },
    {
      name: "Stages",
      href: baseURL + "interview-process",
      selectedIcon: ArrowsUpDownIconSolid,
      deselectedIcon: ArrowsUpDownIconOutline,
    },
    {
      name: "Budget",
      href: baseURL + "budget",
      selectedIcon: CreditCardIconSolid,
      deselectedIcon: CreditCardIconOutline,
      hidden: true,
    },
    {
      name: "Preview",
      href: baseURL + "preview",
      selectedIcon: EyeIconSolid,
      deselectedIcon: EyeIconOutline,
      hidden: true,
    },
    {
      name: "Settings",
      href: baseURL + "settings",
      selectedIcon: Cog6ToothIconSolid,
      deselectedIcon: Cog6ToothIconOutline,
    },
  ];

  return (
    <div className="flex flex-col w-64">
      {settings.map((setting, index) => (
        <Link key={setting.name} href={setting.href}>
          {!setting.hidden && (
            <div
              className={`flex items-center py-2 space-x-4 pl-4 ${
                selected === index ? "border-black border-l" : "border-l"
              }`}
              onMouseEnter={() => setHoveringIndex(index)}
              onMouseLeave={() => setHoveringIndex(-1)}
            >
              <div
                className={`flex justify-center items-center border p-1 rounded-lg ${
                  selected === index || index === hoveringIndex
                    ? "border-black text-black"
                    : "border-gray-400 text-gray-400"
                }`}
              >
                {selected === index ? (
                  <setting.selectedIcon className="w-4 h-4" />
                ) : (
                  <setting.deselectedIcon className="w-4 h-4" />
                )}
              </div>
              <span
                className={`block ${
                  selected === index
                    ? "text-black font-medium"
                    : hoveringIndex === index
                    ? "text-gray-800"
                    : "text-gray-600"
                }`}
              >
                {setting.name}
              </span>
            </div>
          )}
        </Link>
      ))}
    </div>
  );
}
