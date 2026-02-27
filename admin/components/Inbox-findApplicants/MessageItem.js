import { useEffect, useState } from "react";

const MessageItem = ({ message, isSelected, onClick, viewAsApplicant = false }) => {
  const [latestThread, setLatestThread] = useState(null);

  useEffect(() => {
    if (!message.thread?.length) return;
    const sortedMessages = [...(message.thread || [])].sort((a, b) => {
      return b.date - a.date;
    });
    setLatestThread(sortedMessages[0]);
  }, [message]);

  const formatMsg = (msg) => {
    return msg.replace(/<br\s*\/?>/gi, "");
  };

  const displayDate = latestThread ? new Date(latestThread.date) : null;
  const needsAttention = viewAsApplicant ? message.applicant_needs_attention : message.admin_needs_attention;

  return (
    <div
      className={`flex flex-col cursor-pointer text-sm p-4 rounded-lg ${isSelected ? "bg-gray-100" : "hover:bg-gray-50"
        }`}
      onClick={onClick}
    >
      <div className="flex flex-items">
        {needsAttention && <span className="flex-none w-2.5 h-2.5 bg-orange-500 rounded-full mr-2"></span>}
        <span
          className={`text-gray-500`}
        >
          {viewAsApplicant ? message.board_name : message.seeker_name}
        </span>
      </div>
      <p className="text-xs text-gray-500">
        {(!!displayDate) && displayDate.toDateString()}
      </p>
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
