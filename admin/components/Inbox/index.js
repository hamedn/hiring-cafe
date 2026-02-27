import MessageList from "./messageList";
import MessagesView from "./messagesView";
import { useEffect, useState } from "react";
import { ChatBubbleLeftRightIcon } from "@heroicons/react/24/outline";
import Head from "next/head";
import useMessages from "@/admin/hooks/useMessages";
import QuickCandidateSummaryCard from "../adminDashboard/candidateProfiles/QuickCandidateSummaryCard";
import { withBoard } from "../withUserCheck";

const Inbox = () => {
  const [selectedMessageId, setSelectedMessageId] = useState(null);
  const { messages, loading, error } = useMessages();

  useEffect(() => {
    if (!messages?.length) return;
    setSelectedMessageId(messages[0].id);
  }, [messages]);

  if (loading) {
    return (
      <>
        <Head>
          <title>Inbox | Hiring Cafe</title>
        </Head>
        <div className="flex flex-col h-96 items-center justify-center mt-12">
          <div className="flex space-x-2 justify-center">
            <div className="bg-gray-800 rounded-full w-2 h-2 animate-pulse"></div>
            <div className="bg-gray-600 rounded-full w-2 h-2 animate-pulse delay-75"></div>
            <div className="bg-black rounded-full w-2 h-2 animate-pulse delay-100"></div>
          </div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Head>
          <title>Inbox | Hiring Cafe</title>
        </Head>
        <div className="flex flex-col items-center justify-center mt-28 text-red-600">
          <ChatBubbleLeftRightIcon className="h-12 w-12" />
          <p className="mt-4 text-center font-medium">
            {`There was an error loading your messages. Please try again later.`}
          </p>
        </div>
      </>
    );
  }

  if (!messages || messages.length === 0) {
    return (
      <>
        <Head>
          <title>Inbox | Hiring Cafe</title>
        </Head>
        <div className="flex flex-col items-center justify-center mt-28">
          <ChatBubbleLeftRightIcon className="h-12 w-12" />
          <h2 className="mt-8 text-xl font-medium">No Messages Yet</h2>
          <p className="mt-4 text-center font-light">
            {`When you send messages to candidates, they will appear here.`}
          </p>
        </div>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>Inbox | Hiring Cafe</title>
      </Head>
      <div className={`flex h-[calc(100vh-100px)] w-full divide-x`}>
        {/* Left side - Message list */}
        <div className="w-1/4">
          <MessageList
            selectedMessageId={selectedMessageId}
            onMessageSelectId={setSelectedMessageId}
            messages={messages}
          />
        </div>

        {/* Middle - Messaging view */}
        {selectedMessageId && (
          <div className="w-2/4">
            <MessagesView
              message={messages.find(
                (message) => message.id === selectedMessageId
              )}
            />
          </div>
        )}

        {/* Right side - Candidate overview */}
        {selectedMessageId && (
          <div className="w-1/4 flex justify-center p-8">
            <QuickCandidateSummaryCard
              applicantId={
                messages.find((message) => message.id === selectedMessageId).id
              }
            />
          </div>
        )}
      </div>
    </>
  );
};

export default withBoard(Inbox);
