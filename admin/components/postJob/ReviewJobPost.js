import React from "react";
import ReviewQuickSummaryCard from "./ReviewQuickSummaryCard";
import Head from "next/head";

const ReviewJobPost = ({ jobID }) => {
  return (
    <>
      <Head>
        <title>Review Posting - Hiring cafe</title>
      </Head>
      <div className="flex justify-center">
        <div className="flex flex-auto flex-col text-lg max-w-4xl">
          <div className="flex flex-col">
            <span className="text-6xl font-medium">{`Review your post`}</span>
            <span className="mt-8 text-gray-500 font-medium">{`Here's what we'll show to candidates. Make sure everything looks good.`}</span>
          </div>
          <div className="flex justify-center">
            <div className="flex flex-auto justify-between mt-8 space-x-16 items-center">
              <div className="w-96 flex justify-center shadow-2xl rounded-2xl border border-gray-100">
                <ReviewQuickSummaryCard jobID={jobID} />
              </div>
              <div className="flex max-w-md flex-auto">
                <div className="flex flex-col space-y-4">
                  <span className="text-2xl font-medium">{`What's next?`}</span>
                  <span>{`Once you edit the Quick Summary Card and confirm your job post, it will be scheduled to go live within the next 24 hours.`}</span>
                  <span>{`Should we have any queries regarding your job post, we will be sure to reach out to you.`}</span>
                  <span>{`When candidates submit their applications, you will receive an email notification, and their applications will be available for viewing on your dashboard.`}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ReviewJobPost;
