import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/20/solid";
import {
  BoltIcon,
  ChevronDoubleUpIcon,
  ComputerDesktopIcon,
  MegaphoneIcon,
  PuzzlePieceIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";
import HiringCafeLogo from "@/components/HiringCafeLogo";

export default function HomeNavBar() {
  const [isProductsPopoverOpen, setIsProductsPopoverOpen] = useState(false);
  const [isSolutionsPopoverOpen, setIsSolutionsPopoverOpen] = useState(false); // New state for Solutions popover
  const productsPopoverRef = useRef();
  const solutionsPopoverRef = useRef(); // New ref for Solutions popover

  // Toggle Popover visibility for Products
  const toggleProductsPopover = () => {
    setIsProductsPopoverOpen(!isProductsPopoverOpen);
  };

  // Toggle Popover visibility for Solutions
  const toggleSolutionsPopover = () => {
    setIsSolutionsPopoverOpen(!isSolutionsPopoverOpen);
  };

  // Close Popover if click is outside of popoverRef (for both Products and Solutions)
  const handleClickOutside = (event) => {
    if (
      productsPopoverRef.current &&
      !productsPopoverRef.current.contains(event.target)
    ) {
      setIsProductsPopoverOpen(false);
    }
    if (
      solutionsPopoverRef.current &&
      !solutionsPopoverRef.current.contains(event.target)
    ) {
      // Additional check for Solutions
      setIsSolutionsPopoverOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside, true);
    return () => {
      document.removeEventListener("click", handleClickOutside, true);
    };
  }, []);

  return (
    <div className="flex items-center space-x-4 justify-between bg-white border-b p-4 sticky top-0 z-20">
      <div className="flex items-center space-x-4 md:space-x-8">
        <HiringCafeLogo />
        <div
          className="text-gray-600 hover:underline relative"
          ref={productsPopoverRef}
        >
          <button
            onClick={toggleProductsPopover}
            className="focus:outline-none"
          >
            <div className="flex items-center space-x-1 text-lg">
              <span>Products</span>
              {isProductsPopoverOpen ? (
                <ChevronUpIcon className="h-4 w-4" />
              ) : (
                <ChevronDownIcon className="h-4 w-4" />
              )}
            </div>
          </button>
          {isProductsPopoverOpen && (
            <div className="absolute flex flex-col mt-2 w-80 rounded-md shadow-lg bg-white z-20 border">
              <Link
                href="/employers/job-postings"
                className="hover:bg-yellow-50 px-4 py-2"
                onClick={() => {
                  setIsProductsPopoverOpen(false);
                }}
              >
                <div className="flex items-start space-x-4">
                  <MegaphoneIcon className="h-5 w-5 flex-none mt-1" />
                  <div className="flex flex-col">
                    <span className="font-medium text-black">Job Postings</span>
                    <span className="text-xs">
                      Post your jobs on HiringCafe
                    </span>
                  </div>
                </div>
              </Link>
              <Link
                href="/employers/network"
                className="hover:bg-yellow-50 px-4 py-2"
                onClick={() => {
                  setIsProductsPopoverOpen(false);
                }}
              >
                <div className="flex items-start space-x-4">
                  <UserGroupIcon className="h-5 w-5 flex-none mt-1" />
                  <div className="flex flex-col">
                    <span className="font-medium text-black">
                      Talent Network
                    </span>
                    <span className="text-xs">
                      Source talent open for work on HiringCafe
                    </span>
                  </div>
                </div>
              </Link>
              {/* <Link
                href="/employers/ats"
                className="hover:bg-yellow-50 px-4 py-2"
                onClick={() => {
                  setIsProductsPopoverOpen(false);
                }}
              >
                <div className="flex items-start space-x-4">
                  <ComputerDesktopIcon className="h-5 w-5 flex-none mt-1" />
                  <div className="flex flex-col">
                    <span className="font-medium text-black">CareerPage</span>
                    <span className="text-xs">
                      Build candidate-friendly career page at no extra cost
                    </span>
                  </div>
                </div>
              </Link> */}
            </div>
          )}
        </div>
        <div
          className="text-gray-600 hover:underline relative"
          ref={solutionsPopoverRef}
        >
          <button
            onClick={toggleSolutionsPopover}
            className="focus:outline-none"
          >
            <div className="flex items-center space-x-1 text-lg">
              <span>Solutions</span>
              {isSolutionsPopoverOpen ? (
                <ChevronUpIcon className="h-4 w-4" />
              ) : (
                <ChevronDownIcon className="h-4 w-4" />
              )}
            </div>
          </button>
          {isSolutionsPopoverOpen && (
            <div className="absolute flex flex-col space-y-4 w-80 items-start mt-2 rounded-md shadow-lg bg-white z-20 border px-2 py-4">
              <div className="flex flex-col w-full">
                <span className="px-4 font-bold text-black mb-2">
                  Boost Your Pipeline
                </span>
                <Link
                  href="/employers/job-boosts"
                  className="hover:bg-yellow-50 px-4 py-2"
                  onClick={() => setIsSolutionsPopoverOpen(false)}
                >
                  <div className="flex items-start space-x-4">
                    <ChevronDoubleUpIcon className="h-5 w-5 flex-none mt-1" />
                    <div className="flex flex-col">
                      <span className="font-medium text-black">Job Boosts</span>
                      <span className="text-xs">
                        Get up to 10x more visibility for your job postings
                      </span>
                    </div>
                  </div>
                </Link>
                <Link
                  href="/employers/turbo-invites"
                  className="hover:bg-yellow-50 px-4 py-2"
                  onClick={() => setIsSolutionsPopoverOpen(false)}
                >
                  <div className="flex items-start space-x-4">
                    <BoltIcon className="h-5 w-5 flex-none mt-1" />
                    <div className="flex flex-col">
                      <span className="font-medium text-black">
                        Turbo Invites
                      </span>
                      <span className="text-xs">
                        Triple your response rates on HiringCafe Talent Network
                      </span>
                    </div>
                  </div>
                </Link>
              </div>
              {/* <div className="flex flex-col w-full">
                <span className="px-4 font-bold text-black mb-2">
                  Plug Into Your Stack
                </span>
                <Link
                  href="/employers/ats-integrations"
                  className="hover:bg-yellow-50 px-4 py-2"
                  onClick={() => setIsSolutionsPopoverOpen(false)}
                >
                  <div className="flex items-start space-x-4">
                    <PuzzlePieceIcon className="h-5 w-5 flex-none mt-1" />
                    <div className="flex flex-col">
                      <span className="font-medium text-black">
                        ATS Integration
                      </span>
                      <span className="text-xs">
                        Connect your ATS to HiringCafe
                      </span>
                    </div>
                  </div>
                </Link>
              </div> */}
            </div>
          )}
        </div>
        <div className="text-lg text-gray-600 hover:underline">
          <Link href="/employers/pricing" className="">
            Pricing
          </Link>
        </div>
        <div className="text-lg text-gray-600 hover:underline">
          <Link href="/employers/about" className="">
            About
          </Link>
        </div>
      </div>
      <Link
        href="/employers/form"
        className="rounded-full px-4 py-2 text-sm bg-yellow-600 text-white font-bold"
      >
        Get Started
      </Link>
    </div>
  );
}
