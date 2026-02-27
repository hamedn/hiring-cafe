import { useAuth } from "@/hooks/useAuth";
import { Picture } from "@/utils/picture";
import {
  Box,
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  useDisclosure,
  useOutsideClick,
} from "@chakra-ui/react";
import { Bars3Icon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { useContext, useRef } from "react";
import ThemeToggle from "./ThemeToggle";
import { UserLocationContext } from "@/contexts/UserLocationContext";

export default function AccountNavBarPopover() {
  const { user, loading } = useAuth();
  const discloser = useDisclosure();
  const ref = useRef();
  const { userCountry } = useContext(UserLocationContext);

  useOutsideClick({
    ref: ref,
    handler: () => {
      ref?.current && discloser.onClose();
    },
  });

  return (
    <Box className="flex items-center space-x-6 flex-none" ref={ref}>
      <Popover isLazy {...discloser}>
        <PopoverTrigger>
          <button className="border rounded-full flex items-center space-x-3 pr-2 pl-3 py-2 hover:shadow-lg bg-white border-neutral-300">
            <Bars3Icon className="h-4 w-4 flex-none" />
            <div className="rounded-full">
              {user ? (
                <div className="h-5 w-5 flex-none bg-gradient-to-tr from-gray-200 to-pink-500 rounded-full" />
              ) : (
                <div className="h-5 w-5 flex-none bg-gradient-to-tr from-gray-200 to-gray-500 rounded-full" />
              )}
            </div>
          </button>
        </PopoverTrigger>
        <PopoverContent>
          <PopoverBody p={0}>
            <div className="flex flex-col divide-y py-2 text-sm">
              {!loading && !user && (
                <div className="flex flex-col mb-1">
                  <Link
                    href={"/auth"}
                    className="py-2 px-4 font-medium hover:bg-gray-100"
                    onClick={discloser.onClose}
                  >
                    Sign up
                  </Link>
                  <Link
                    href={"/auth"}
                    className="py-2 px-4 font-medium hover:bg-gray-100"
                    onClick={discloser.onClose}
                  >
                    Log in
                  </Link>
                </div>
              )}
              <div className="flex flex-col mb-1">
                <Link
                  href={"/myhiringcafe/tracker"}
                  className="py-2 px-4 font-medium hover:bg-gray-100"
                  onClick={discloser.onClose}
                >
                  Saved jobs
                </Link>
                {user && (
                  <Link
                    href={"/myhiringcafe/saved-searches"}
                    className="py-2 px-4 font-medium hover:bg-gray-100"
                    onClick={discloser.onClose}
                  >
                    Saved searches
                  </Link>
                )}
                {/* {user && (
                  <Link
                    href={"/myhiringcafe/hidden-companies"}
                    className="py-2 px-4 font-medium hover:bg-gray-100"
                    onClick={discloser.onClose}
                  >
                    Hidden companies
                  </Link>
                )} */}
                {user && (
                  <Link
                    href={"/account"}
                    className="py-2 px-4 font-medium hover:bg-gray-100"
                    onClick={discloser.onClose}
                  >
                    Account
                  </Link>
                )}
              </div>
              {userCountry === "US" && (
                <div className="flex flex-col pb-1 pt-1">
                  <Link
                    href={"/ai-search"}
                    className="flex items-center gap-2 py-2 px-4 font-medium hover:bg-gray-100 group"
                    onClick={discloser.onClose}
                  >
                    <span className="text-lg">✨</span>
                    <span>AI Job Search</span>
                    <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-semibold group-hover:bg-blue-200 transition-colors">
                      Beta
                    </span>
                  </Link>
                </div>
              )}
              <div className="flex flex-col pb-1 pt-1">
                <Link
                  href={"/talent-network"}
                  className="py-2 px-4 font-medium hover:bg-gray-100"
                  onClick={discloser.onClose}
                >
                  Talent Network
                </Link>
                {user && (
                  <Link
                    href={"/inbox"}
                    className="py-2 px-4 font-medium hover:bg-gray-100"
                    onClick={discloser.onClose}
                  >
                    Inbox
                  </Link>
                )}
              </div>
              <div className="flex flex-col pb-1 pt-1">
                <Link
                  href="/about"
                  className="py-2 px-4 font-medium hover:bg-gray-100"
                  onClick={discloser.onClose}
                >
                  About Us
                </Link>
                <Link
                  href="https://www.reddit.com/r/hiringcafe"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 py-2 px-4 font-medium hover:bg-gray-100"
                  onClick={discloser.onClose}
                >
                  <Picture
                    src="/static/images/logos/reddit.png"
                    properties={"h-4 w-4 flex-none"}
                  />
                  <span>Follow on Reddit</span>
                </Link>
                {/* <Link
                  href="https://www.linkedin.com/company/hiring-cafe"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 py-2 px-4 font-medium hover:bg-gray-100"
                  onClick={discloser.onClose}
                >
                  <Picture
                    src="/static/images/logos/linkedin_2.png"
                    properties={"h-4 w-4 flex-none"}
                  />
                  <span>Follow on LinkedIn</span>
                </Link> */}
              </div>
              <div className="flex flex-col pt-1">
                {/* <Link
                  href="https://tally.so/r/nGLxN2"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 py-2 px-4 font-medium hover:bg-gray-100"
                  onClick={discloser.onClose}
                >
                  <span>Jobs API</span>
                </Link> */}
                <Link
                  href="https://tally.so/r/n9rv4p"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 py-2 px-4 font-medium hover:bg-gray-100"
                  onClick={discloser.onClose}
                >
                  <span>🏢</span>
                  <span>Employers</span>
                </Link>
              </div>
              <div className="flex flex-col pt-4 pb-2 px-4">
                <ThemeToggle />
              </div>
            </div>
          </PopoverBody>
        </PopoverContent>
      </Popover>
    </Box>
  );
}
