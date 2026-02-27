import { ClockIcon } from "@heroicons/react/24/outline";

export default function ConversationHistoryView({ conversation }) {
  if (!conversation) return null;

  const userMessages =
    conversation.conversation?.filter((msg) => msg.role === "user") || [];

  const formatFullDate = (timestamp) => {
    if (!timestamp) return "";
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString([], {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  return (
    <div className="flex-1 flex flex-col bg-neutral-100 overflow-hidden">
      {/* Messages */}
      <div
        className="flex-1 overflow-y-auto"
        style={{ maxHeight: "calc(85vh - 80px)" }}
      >
        {userMessages.length === 0 ? (
          <div className="flex items-center justify-center h-full p-6">
            <div className="text-center text-gray-500">
              <div className="w-16 h-16 mx-auto mb-4 bg-neutral-200 rounded-full flex items-center justify-center">
                <ClockIcon className="h-8 w-8 text-gray-400" />
              </div>
              <p className="font-medium">No prompts yet</p>
              <p className="text-sm mt-1 text-gray-400">{`This search hasn't been refined`}</p>
            </div>
          </div>
        ) : (
          <div className="max-w-2xl mx-auto px-6 py-6">
            <div className="sticky top-0 bg-neutral-100 py-4 -mt-6 z-10">
              <div className="flex items-center gap-3">
                <div className="h-px flex-1 bg-neutral-300"></div>
                <span className="text-xs font-bold text-neutral-600 uppercase tracking-widest px-4 py-1.5 bg-white rounded-full shadow-sm border border-neutral-200">
                  {userMessages.length}{" "}
                  {userMessages.length === 1 ? "Prompt" : "Prompts"}
                </span>
                <div className="h-px flex-1 bg-neutral-300"></div>
              </div>
            </div>

            <div className="space-y-3">
              {userMessages.map((msg, idx) => (
                <div
                  key={idx}
                  className="group bg-white rounded-lg p-4 shadow-sm border border-neutral-200 hover:shadow-md hover:border-yellow-500/50 transition-all duration-200"
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-1 flex-shrink-0">
                      <div className="w-1.5 h-1.5 rounded-full bg-yellow-500 group-hover:bg-yellow-600 transition-colors"></div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm leading-relaxed text-gray-900">
                        {msg.content}
                      </p>
                      {msg.timestamp && (
                        <div className="mt-2 flex items-center gap-1.5 text-xs text-gray-500">
                          <ClockIcon className="h-3 w-3" />
                          <span>{formatFullDate(msg.timestamp)}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
