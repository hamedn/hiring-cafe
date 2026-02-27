import useApplicant from "@/admin/hooks/useApplicant";
import { useEffect, useState } from "react";

const MessageItem = ({ message, isSelected, onClick }) => {
  const { applicant, loading, error } = useApplicant({
    applicantId: message.id,
  });

  const [latestThread, setLatestThread] = useState(null);

  useEffect(() => {
    if (!message.thread?.length) return;
    const sortedMessages = [...(message.thread || [])].sort((a, b) => {
      return b.date.toDate() - a.date.toDate();
    });
    setLatestThread(sortedMessages[0]);
  }, [message]);

  if (loading) {
    return (
      <div className="p-2 h-16 bg-gray-300 animate-pulse rounded-lg mb-2" />
    );
  }

  if (error) {
    return null;
  }

  const formatMsg = (msg) => {
    return msg.replace(/<br\s*\/?>/gi, "");
  };

  return (
    <div
      className={`flex flex-col cursor-pointer text-sm p-4 rounded-lg ${
        isSelected ? "bg-gray-100" : "hover:bg-gray-50"
      }`}
      onClick={onClick}
    >
      <span
        className={`${
          applicant.stage === "Rejected" ? "text-red-600" : "text-gray-500"
        }`}
      >
        {applicant.profile.name}
      </span>
      {applicant.stage === "Rejected" && (
        <span className="text-red-600">Rejected</span>
      )}
      <p className="text-xs text-gray-500">
        {latestThread?.date && latestThread.date.toDate().toDateString()}
      </p>
      <span>{message.date}</span>
      {latestThread && (
        <p className="text-gray-700 mt-1">
          {formatMsg(latestThread.body).length > 50
            ? formatMsg(latestThread.body).slice(0, 50) + "..."
            : formatMsg(latestThread.body)}
        </p>
      )}
    </div>
  );
};

export default MessageItem;
