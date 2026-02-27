import React, { useState, useRef, useEffect } from "react";
import {
  BoltIcon,
  ChartBarIcon,
  ChatBubbleBottomCenterTextIcon,
  ChatBubbleLeftIcon,
  CheckBadgeIcon,
  CircleStackIcon,
  CodeBracketIcon,
  Cog8ToothIcon,
  CogIcon,
  CommandLineIcon,
  ComputerDesktopIcon,
  CpuChipIcon,
  CursorArrowRaysIcon,
  DocumentChartBarIcon,
  DocumentCheckIcon,
  EnvelopeOpenIcon,
  FingerPrintIcon,
  HandThumbUpIcon,
  HeartIcon,
  InboxStackIcon,
  KeyIcon,
  MagnifyingGlassIcon,
  MegaphoneIcon,
  PaintBrushIcon,
  PencilIcon,
  PresentationChartLineIcon,
  ServerStackIcon,
  ShieldCheckIcon,
  SparklesIcon,
  Square3Stack3DIcon,
  StarIcon,
  TagIcon,
  UserCircleIcon,
  UserGroupIcon,
  UsersIcon,
  ViewfinderCircleIcon,
  BriefcaseIcon,
} from "@heroicons/react/24/outline";
import {
  BriefcaseIcon as BriefcaseIconSolid,
  ChevronLeftIcon,
  PencilIcon as PencilIconSolid,
  ChevronRightIcon,
  HeartIcon as HeartIconSolid,
  UsersIcon as UsersIconSolid,
  BanknotesIcon as BanknotesIconSolid,
  BuildingStorefrontIcon,
  ShoppingBagIcon as ShoppingBagIconSolid,
  UserIcon,
  PencilSquareIcon as PencilSquareIconSolid,
  ComputerDesktopIcon as ComputerDesktopIconSolid,
} from "@heroicons/react/20/solid";
import {
  FaBoxOpen,
  FaCar,
  FaGraduationCap,
  FaHardHat,
  FaHeadset,
  FaSun,
  FaTruck,
  FaUtensilSpoon,
  FaUtensils,
  FaWarehouse,
  FaWrench,
} from "react-icons/fa";
import { AiOutlineAndroid, AiOutlineApple } from "react-icons/ai";
import { useRouter } from "next/router";
import { supportedRolesForSearchRecommendations } from "@/utils/constants";
import _ from "lodash";

const features = {
  "Education Services": [
    {
      title: "All",
      value: "",
      icon: FaGraduationCap,
    },
    {
      title: "Teacher",
      value: "Teacher",
      icon: PencilIconSolid,
    },
    {
      title: "Principal Office",
      value: "Principal",
      icon: UsersIconSolid,
    },
    {
      title: "Tutor",
      value: "Tutor",
      icon: PencilSquareIconSolid,
    },
  ],
  "Maintenance and Repair Skilled Trades": [
    {
      title: "All",
      value: "",
      icon: FaWrench,
    },
    {
      title: "HVAC Technician",
      value: "hvac technician",
      icon: FaSun,
    },
    {
      title: "Automotive Technician",
      value: "Automotive Technician",
      icon: FaCar,
    },
    {
      title: "Service Technician",
      value: "Service Technician",
      icon: FaHardHat,
    },
  ],
  "retail-services": [
    {
      title: "All",
      value: "",
      icon: ShoppingBagIconSolid,
    },
    {
      title: "Sales Associate",
      value: "Sales Associate",
      icon: UserIcon,
    },
    {
      title: "Cashier",
      value: "Cashier",
      icon: BanknotesIconSolid,
    },
    {
      title: "Merchandiser",
      value: "Merchandiser",
      icon: FaBoxOpen,
    },
    {
      title: "Clerk",
      value: "Clerk",
      icon: ComputerDesktopIconSolid,
    },
    {
      title: "Store Associate",
      value: "Store Associate",
      icon: BuildingStorefrontIcon,
    },
    {
      title: "Manager",
      value: "Manager",
      icon: UsersIconSolid,
    },
  ],
  "Transportation and Logistics Skilled Trades": [
    {
      title: "All",
      value: "",
      icon: BanknotesIconSolid,
    },
    {
      title: "Driver",
      value: "Driver",
      icon: FaCar,
    },
    {
      title: "Warehouse Worker",
      value: "Warehouse",
      icon: FaWarehouse,
    },
    {
      title: "Fleet Manager",
      value: "Flleet Manager",
      icon: FaTruck,
    },
    {
      title: "Dispatcher",
      value: "Dispatcher",
      icon: FaHeadset,
    },
  ],
  "food-and-beverage-services": [
    {
      title: "All",
      value: "",
      icon: BanknotesIconSolid,
    },
    {
      title: "Cook",
      value: "Cook",
      icon: FaUtensilSpoon,
    },
    {
      title: "Supervisor",
      value: "Supervisor",
      icon: BriefcaseIconSolid,
    },
    {
      title: "Manager",
      value: "Manager",
      icon: UsersIconSolid,
    },
    {
      title: "Dishwasher",
      value: "Dishwasher",
      icon: FaUtensils,
    },
  ],
  Design: [
    {
      title: "All",
      value: "",
      icon: PaintBrushIcon,
    },
    {
      title: "Product Design",
      value: "Product Design",
      icon: ComputerDesktopIcon,
    },
    {
      title: "Graphic Design",
      value: "Graphic Design",
      icon: Square3Stack3DIcon,
    },
    {
      title: "UX/UI Design",
      value: "UI UX Design",
      icon: CursorArrowRaysIcon,
    },
    {
      title: "Brand Design",
      value: "Brand Design",
      icon: HeartIcon,
    },
    {
      title: "Interactive Design",
      value: "Interactive",
      icon: FingerPrintIcon,
    },
  ],
  Marketing: [
    {
      title: "All",
      value: "",
      icon: MegaphoneIcon,
    },
    {
      title: "General Marketing",
      value: "General marketing",
      icon: ChartBarIcon,
    },
    {
      title: "Product Marketing",
      value: "Product Marketing",
      icon: TagIcon,
    },
    {
      title: "Marketing Communications",
      value: "Marketing Communications",
      icon: ChatBubbleLeftIcon,
    },
    {
      title: "Content Marketing",
      value: "Content marketing",
      icon: PencilIcon,
    },
    {
      title: "Social Media marketing",
      value: "Social media marketing",
      icon: HandThumbUpIcon,
    },
    {
      title: "Email Marketing",
      value: "Email marketing",
      icon: EnvelopeOpenIcon,
    },
    {
      title: "Brand Marketing",
      value: "Brand marketing",
      icon: ShieldCheckIcon,
    },
    {
      title: "Marketing Research",
      value: "Marketing Research",
      icon: MagnifyingGlassIcon,
    },
    {
      title: "Partner Marketing",
      value: "Partner marketing",
      icon: UsersIcon,
    },
  ],
  Engineering: [
    {
      title: "All",
      value: "",
      icon: Cog8ToothIcon,
    },
    {
      title: "SWE",
      value: "Software Engineer",
      icon: CodeBracketIcon,
    },
    {
      title: "SWE - Frontend",
      value: "Frontend",
      icon: ComputerDesktopIcon,
    },
    {
      title: "SWE - Backend",
      value: "Backend",
      icon: ServerStackIcon,
    },
    {
      title: "SWE - Fullstack",
      value: "Fullstack",
      icon: CommandLineIcon,
    },
    {
      title: "iOS Engineer",
      value: "iOS Eng",
      icon: AiOutlineApple,
    },
    {
      title: "Android Engineer",
      value: "Android Eng",
      icon: AiOutlineAndroid,
    },
    {
      title: "QA Engineer",
      value: "QA Eng",
      icon: MagnifyingGlassIcon,
    },
    {
      title: "DevOps Engineer",
      value: "DevOps",
      icon: Cog8ToothIcon,
    },
    {
      title: "Security Engineer",
      value: "Security",
      icon: ShieldCheckIcon,
    },
    {
      title: "Data Engineer",
      value: "Data Eng",
      icon: CircleStackIcon,
    },
    {
      title: "Engineering Manager",
      value: "Engineering Manager",
      icon: UsersIcon,
    },
    {
      title: "Director of Engineering",
      value: "Director of Engineering",
      icon: UserGroupIcon,
    },
    {
      title: "Head of Engineering",
      value: "Head of Engineering",
      icon: UserCircleIcon,
    },
  ],
  Sales: [
    {
      title: "All",
      value: "",
      icon: PresentationChartLineIcon,
    },
    {
      title: "xDR",
      value: "Sales Representative",
      icon: InboxStackIcon,
    },
    {
      title: "Account Executive",
      value: "Account Executive",
      icon: BriefcaseIcon,
    },
    {
      title: "Account Manager",
      value: "Account Manager",
      icon: KeyIcon,
    },
    {
      title: "Customer Success",
      value: "Customer Success",
      icon: CheckBadgeIcon,
    },
    {
      title: "Revenue Ops",
      value: "Revenue Operations",
      icon: CogIcon,
    },
    {
      title: "Sales Engineer",
      value: "Sales Engineer",
      icon: CpuChipIcon,
    },
    {
      title: "Solutions Engineer",
      value: "Solutions Engineer",
      icon: ComputerDesktopIcon,
    },
    {
      title: "Solutions Consultant",
      value: "Solutions Consultant",
      icon: ChatBubbleBottomCenterTextIcon,
    },
    {
      title: "TAM",
      value: "Technical Account Manager",
      icon: BoltIcon,
    },
    {
      title: "Solutions Architect",
      value: "Solutions Architect",
      icon: DocumentChartBarIcon,
    },
    {
      title: "Channel Manager",
      value: "Channel Manager",
      icon: ViewfinderCircleIcon,
    },
    {
      title: "Sales Enablement",
      value: "Enablement",
      icon: DocumentCheckIcon,
    },
    {
      title: "Sales Manager",
      value: "Sales Manager",
      icon: UsersIcon,
    },
    {
      title: "Director of Sales",
      value: "Director of Sales",
      icon: UserGroupIcon,
    },
    {
      title: "Head of Sales",
      value: "Head of Sales",
      icon: UserCircleIcon,
    },
    {
      title: "VP of Sales",
      value: "VP of Sales",
      icon: StarIcon,
    },
    {
      title: "CRO",
      value: "Chief Revenue Officer",
      icon: SparklesIcon,
    },
  ],
};

const FeatureSelector = () => {
  const router = useRouter();
  const { selectedRole, searchQuery } = useRouter().query;

  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    const scrollElement = scrollRef.current;

    function updateScrollPos() {
      if (scrollElement) {
        setCanScrollLeft(scrollElement.scrollLeft > 0);
        setCanScrollRight(
          scrollElement.scrollLeft + scrollElement.offsetWidth <
            scrollElement.scrollWidth
        );
      }
    }

    updateScrollPos();
    window.addEventListener("resize", updateScrollPos);
    scrollElement.addEventListener("scroll", updateScrollPos);
    return () => {
      window.removeEventListener("resize", updateScrollPos);
      if (scrollElement) {
        scrollElement.removeEventListener("scroll", updateScrollPos);
      }
    };
  }, []);

  const scroll = (direction) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        top: 0,
        left: direction === "left" ? -200 : 200,
        behavior: "smooth",
      });
    }
  };

  if (!supportedRolesForSearchRecommendations.includes(selectedRole)) {
    return null;
  }

  return (
    <div className="relative flex items-center">
      {canScrollLeft && (
        <div className="absolute left-0 text-gray-500 cursor-pointer p-0.5 rounded-full bg-white border border-gray-400 transition-all">
          <ChevronLeftIcon
            className="h-4 w-4 md:h-6 md:w-6 flex-none"
            onClick={() => scroll("left")}
          />
        </div>
      )}
      <div ref={scrollRef} className="flex overflow-x-scroll hide-scrollbar">
        {features[selectedRole].map((feature, i) => (
          <div
            key={i}
            onClick={() => {
              const newQuery = { ...router.query };
              if (feature.value) {
                newQuery.searchQuery = feature.value;
              } else {
                delete newQuery.searchQuery;
              }
              router.replace({
                query: newQuery,
              });
            }}
            className={`cursor-pointer space-x-2 flex items-center mx-1 md:mx-4 p-2 min-w-max ${
              searchQuery === feature.value || (!searchQuery && i === 0)
                ? "font-bold text-black"
                : "text-gray-500"
            }`}
          >
            {/* <feature.icon className="h-4 w-4" /> */}
            <p className="text-sm text-center">{feature.title}</p>
          </div>
        ))}
      </div>
      {canScrollRight && (
        <div className="absolute right-0 text-gray-500 cursor-pointer p-0.5 rounded-full bg-white border border-gray-400 transition-all">
          <ChevronRightIcon
            className="h-4 w-4 md:h-6 md:w-6 flex-none"
            onClick={() => scroll("right")}
          />
        </div>
      )}
    </div>
  );
};

export default FeatureSelector;
