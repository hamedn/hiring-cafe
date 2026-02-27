import { XMarkIcon } from "@heroicons/react/24/outline";
import { useState, useEffect } from "react";
import ConversationList from "./ConversationList";
import ConversationHistoryView from "./ConversationHistoryView";

export default function SearchHistoryModal({
  isOpen,
  onClose,
  conversations,
  currentConversationId,
  conversation,
  onSelectConversation,
  onCreateConversation,
  onUpdateTitle,
  onDeleteConversation,
}) {
  const [selectedConvoId, setSelectedConvoId] = useState(currentConversationId);

  // Auto-select current conversation when modal opens
  useEffect(() => {
    if (isOpen && currentConversationId) {
      setSelectedConvoId(currentConversationId);
    }
  }, [isOpen, currentConversationId]);

  if (!isOpen) return null;

  const selectedConvo = conversations.find(c => c.id === selectedConvoId) || conversations.find(c => c.id === currentConversationId);

  const isExpanded = selectedConvoId !== null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4">
      <div 
        className={`bg-neutral-50 rounded-2xl w-full h-[85vh] overflow-hidden flex shadow-2xl transition-all duration-300 ${
          isExpanded ? "max-w-6xl" : "max-w-md"
        }`}
      >
        {/* Left: Search List */}
        <div className={`border-r border-neutral-200 flex flex-col bg-white transition-all duration-300 ${
          isExpanded ? "w-96" : "flex-1"
        }`}>
          <div className="p-5 border-b border-neutral-200 bg-white">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">Your Searches</h2>
              {!isExpanded && (
                <button onClick={onClose} className="p-2 hover:bg-neutral-100 rounded-xl transition-colors">
                  <XMarkIcon className="h-5 w-5 text-gray-600" />
                </button>
              )}
            </div>
          </div>
          <ConversationList
            conversations={conversations}
            currentConversationId={currentConversationId}
            selectedConvoId={selectedConvoId}
            onSelectForView={setSelectedConvoId}
            onSwitchToCurrent={(id) => {
              onSelectConversation(id);
              onClose();
            }}
            onUpdateTitle={onUpdateTitle}
            onDelete={onDeleteConversation}
          />
        </div>

        {/* Right: Conversation History (only show when expanded) */}
        {isExpanded && (
          <div className="flex-1 flex flex-col bg-neutral-100">
            <div className="p-5 border-b border-neutral-200 bg-white flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <h2 className="text-lg font-bold text-gray-900 truncate">
                  {selectedConvo?.title || "Conversation"}
                </h2>
                <p className="text-xs text-gray-500 mt-0.5">View your search refinements</p>
              </div>
              <button 
                onClick={onClose} 
                className="p-2 hover:bg-neutral-100 rounded-xl transition-colors ml-4"
              >
                <XMarkIcon className="h-5 w-5 text-gray-600" />
              </button>
            </div>

            <ConversationHistoryView conversation={selectedConvo} />
          </div>
        )}
      </div>
    </div>
  );
}

