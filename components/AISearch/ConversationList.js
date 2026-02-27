import { PlusIcon, ClockIcon } from "@heroicons/react/24/outline";

export default function ConversationList({
  conversations,
  currentConversationId,
  onSelectConversation,
  onCreateConversation,
}) {
  const formatDate = (timestamp) => {
    if (!timestamp) return "";
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b">
        <h2 className="text-lg font-bold">Your Searches</h2>
      </div>

      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto">
        {conversations.length === 0 ? (
          <div className="p-4 text-center text-gray-500">
            <p>No conversations yet</p>
            <p className="text-sm mt-1">Create one to get started!</p>
          </div>
        ) : (
          <div className="divide-y">
            {conversations.map((convo) => (
              <button
                key={convo.id}
                onClick={() => onSelectConversation(convo.id)}
                className={`w-full text-left p-4 hover:bg-gray-50 transition-colors ${
                  convo.id === currentConversationId
                    ? "bg-yellow-50 border-l-4 border-yellow-500"
                    : ""
                }`}
              >
                <div className="font-medium truncate">
                  {convo.title || "Untitled Search"}
                </div>
                <div className="text-sm text-gray-500 mt-1 flex items-center space-x-1">
                  <ClockIcon className="h-4 w-4" />
                  <span>{formatDate(convo.updated_at)}</span>
                </div>
                {convo.intent?.job_titles?.explicit?.value && (
                  <div className="text-xs text-gray-400 mt-1 truncate">
                    {convo.intent.job_titles.explicit.value}
                    {convo.intent.workplace_type &&
                      ` · ${convo.intent.workplace_type}`}
                    {convo.intent.workplace_locations
                      ?.length > 0 &&
                      ` · ${
                        convo.intent.workplace_locations[0]
                          .city ||
                        convo.intent.workplace_locations[0]
                          .state ||
                        convo.intent.workplace_locations[0]
                          .country
                      }`}
                  </div>
                )}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
