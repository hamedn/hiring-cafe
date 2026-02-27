import { XMarkIcon } from "@heroicons/react/24/outline";
import ConversationList from "./ConversationList";
import DebugPanel from "./DebugPanel";

export default function SearchHistoryModal({
  isOpen,
  onClose,
  conversations,
  currentConversationId,
  conversation,
  onSelectConversation,
  onCreateConversation,
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-4 border-b flex items-center justify-between">
          <h2 className="text-xl font-bold">Search History & Debug</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden grid grid-cols-2 gap-4 p-4">
          {/* Conversation List */}
          <div className="bg-gray-50 rounded-lg overflow-hidden">
            <ConversationList
              conversations={conversations}
              currentConversationId={currentConversationId}
              onSelectConversation={(id) => {
                onSelectConversation(id);
                onClose();
              }}
              onCreateConversation={() => {
                onCreateConversation();
                onClose();
              }}
            />
          </div>

          {/* Debug Panel */}
          <div className="bg-gray-50 rounded-lg overflow-hidden">
            <DebugPanel searchState={conversation} />
          </div>
        </div>
      </div>
    </div>
  );
}

