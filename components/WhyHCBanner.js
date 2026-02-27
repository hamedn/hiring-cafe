import React, { useState, useEffect } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  useBreakpointValue,
} from "@chakra-ui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import CyclingBear from "@/animations/cycling-bear.json";
import LottieAnimation from "./lottieAnimation";
import useURLSearchStateV4 from "@/hooks/useURLSearchStateV4";
import Link from "next/link";

const listItems = [
  {
    number: "1",
    text: "Jobs you can't find elsewhere",
    content:
      "We scrape millions of jobs directly from company websites daily. Many of these companies don't post them on job boards and prefer to post them on their own websites.",
  },
  {
    number: "2",
    text: "No more ghost jobs",
    content:
      "We use a fine-tuned AI model to filter out ghost jobs, scams, and offshore consulting shops. On top of that, we don't force you to create an account to apply to jobs.",
  },
  {
    number: "3",
    text: "Up-to-Date Job Listings",
    content:
      "Jobs are fetched 3x a day, and we also filter out reposts to ensure jobs are fresh. Other job sites let recruiters repost jobs whenever they want, so you end up seeing the same stale listings again and again.",
  },
  {
    number: "4",
    text: "Advanced search filters",
    content:
      "We use ChatGPT's API to extract key information from each job listing, which powers our advanced filters. Learn more about how that works <a href='https://www.reddit.com/r/ChatGPT/comments/1mt2trl/update_i_scraped_41_million_jobs_with_chatgpt/' target='_blank' rel='noopener noreferrer' class='text-blue-600 underline'>here</a>.",
  },
  {
    number: "5",
    text: "Obsessed with Feedback",
    content:
      'We take every piece of feedback seriously and have a dedicated community on Reddit (<a href="https://www.reddit.com/r/hiringcafe" target="_blank" rel="noopener noreferrer" class="text-blue-600 underline">r/hiringcafe</a>) where you can post feedback and get a quick response from our team.',
  },
];

const WhyHCBanner = () => {
  const { searchState } = useURLSearchStateV4();
  const [isBannerVisible, setIsBannerVisible] = useState(false);
  const modalSize = useBreakpointValue({ base: "full", md: "xl", lg: "2xl" });
  const { isOpen, onOpen, onClose } = useDisclosure();

  // Key name in localStorage to remember dismissed banner
  const LOCAL_STORAGE_KEY = "bannerClosed";

  // Check localStorage on mount to see if banner was closed before
  useEffect(() => {
    const bannerClosed = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (bannerClosed === "true") {
      setIsBannerVisible(false);
    } else {
      setIsBannerVisible(true);
    }
  }, []);

  // Handle clicking the X button to dismiss the banner
  const handleDismiss = (e) => {
    e.stopPropagation(); // Prevent triggering the banner click event.
    setIsBannerVisible(false);
    localStorage.setItem(LOCAL_STORAGE_KEY, "true");
  };

  // Render nothing if the banner has been dismissed
  if (!isBannerVisible || Object.keys(searchState || {}).length) {
    return null;
  }

  return (
    <div className="flex justify-center items-center flex-col px-4 md:px-0 pb-4 pt-8 w-full">
      <div
        className="relative flex items-center justify-center w-full md:w-2/3 lg:w-1/2 2xl:w-1/3 bg-yellow-600/10 text-cyan-800 py-4 px-4 lg:py-0 lg:px-8 rounded-xl cursor-pointer mx-4 md:mx-0 shadow-md"
        onClick={onOpen}
      >
        <div className="flex justify-between items-center w-full">
          <div className="flex flex-col space-y-3">
            <span className="text-lg font-semibold">
              How is HiringCafe different?
            </span>
            <span className="text-sm">
              {`Our quest to destroy Indeed and LinkedIn by building a 10x better job search engine.`}
            </span>
            <span className="font-bold bg-cyan-800 rounded-full py-2 px-4 text-xs text-white w-fit">
              {"Learn more"}
            </span>
          </div>
          <div className="">
            <LottieAnimation
              width="150px"
              height="150px"
              animationData={CyclingBear}
            />
          </div>
        </div>
        {/* X Button */}
        <button
          onClick={handleDismiss}
          className="absolute top-2 right-2 p-1 hover:bg-cyan-800 text-cyan-800 hover:text-white rounded-full"
          aria-label="Close banner"
        >
          <XMarkIcon className="w-5 h-5" />
        </button>
      </div>
      <span className="text-base font-medium mt-4">
        Employers -{" "}
        <Link
          href="https://www.reddit.com/r/hiringcafe/comments/1jwrrsy/hiringcafes_message_to_employers/"
          className="text-blue-600 underline"
          target="_blank"
          rel="noopener noreferrer"
        >
          Read our message
        </Link>
      </span>
      {/* Modal */}
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        size={modalSize}
        scrollBehavior="inside"
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader className="border-b">
            <span className="text-xl text-cyan-800">HiringCafe vs Others</span>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody className="border-b">
            <p className="mb-8 mt-4">
              Get up to{" "}
              <span className="font-bold italic">{`10x more responses`}</span>
              {` in
              the same amount of time compared to other job sites. Here's why:`}
            </p>
            <div className="flex flex-col space-y-8">
              {listItems.map((item, index) => (
                <div key={index} className="flex items-start mb-2 space-x-2">
                  <span className="text-3xl font-bold mr-2 text-cyan-800/30">
                    {item.number}.
                  </span>
                  <div className="flex flex-col space-y-1">
                    <span className="text-base font-bold">{item.text}</span>
                    <span
                      className="text-sm"
                      dangerouslySetInnerHTML={{ __html: item.content }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              Got it!
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default WhyHCBanner;
