import { ClockIcon, EllipsisVerticalIcon } from "@heroicons/react/24/outline";
import { useState } from "react";

export default function ConversationList({
  conversations,
  currentConversationId,
  selectedConvoId,
  onSelectForView,
  onSwitchToCurrent,
  onUpdateTitle,
  onDelete,
}) {
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [menuOpenId, setMenuOpenId] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  const formatDate = (timestamp) => {
    if (!timestamp) return "";
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  const handleStartEdit = (e, convo) => {
    e.stopPropagation();
    setEditingId(convo.id);
    setEditTitle(convo.title);
  };

  const handleSaveEdit = async (id) => {
    if (editTitle.trim()) {
      await onUpdateTitle(id, editTitle.trim());
    }
    setEditingId(null);
  };

  const handleDelete = async (id) => {
    await onDelete(id);
    setDeleteConfirmId(null);
    setMenuOpenId(null);
  };

  return (
    <div className="flex-1 overflow-y-auto p-3 bg-neutral-50">
      {conversations.length === 0 ? (
        <div className="flex items-center justify-center h-64 text-gray-500">
          <div className="text-center">
            <p className="text-sm font-medium">No searches yet</p>
            <p className="text-xs mt-1 text-gray-400">Start a new search to begin</p>
          </div>
        </div>
      ) : (
        <div className="space-y-2">
          {conversations.map((convo) => (
            <div key={convo.id}>
              {editingId === convo.id ? (
                <div className="p-3 bg-white rounded-xl border-2 border-yellow-400 shadow-sm">
                  <input
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleSaveEdit(convo.id);
                      if (e.key === "Escape") setEditingId(null);
                    }}
                    className="w-full px-3 py-2 text-sm border-0 focus:outline-none focus:ring-0"
                    autoFocus
                    onBlur={() => handleSaveEdit(convo.id)}
                  />
                </div>
              ) : (
                <div 
                  className={`group rounded-xl border-2 transition-all duration-200 ${
                    convo.id === selectedConvoId
                      ? "border-yellow-500 shadow-lg bg-yellow-50/50"
                      : "border-transparent hover:border-neutral-200 hover:shadow-sm bg-white"
                  }`}
                >
                  <button
                    onClick={() => {
                      onSwitchToCurrent(convo.id);
                    }}
                    className="w-full p-4 text-left relative"
                  >
                    {/* Header Row */}
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-sm truncate text-gray-900">
                          {convo.title || "Untitled"}
                        </h3>
                      </div>
                      
                      {/* Three-dot menu (only on hover) */}
                      <div className="relative" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setMenuOpenId(menuOpenId === convo.id ? null : convo.id);
                          }}
                          className="p-1.5 hover:bg-neutral-200 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                        >
                          <EllipsisVerticalIcon className="h-4 w-4 text-gray-600" />
                        </button>

                        {/* Dropdown Menu */}
                        {menuOpenId === convo.id && (
                          <div className="absolute right-0 top-8 w-40 bg-white rounded-xl shadow-2xl border border-neutral-200 py-1 z-20">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleStartEdit(e, convo);
                                setMenuOpenId(null);
                              }}
                              className="w-full px-4 py-2 text-left text-sm hover:bg-neutral-50 flex items-center gap-3"
                            >
                              <span>✏️</span>
                              <span>Rename</span>
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setDeleteConfirmId(convo.id);
                                setMenuOpenId(null);
                              }}
                              className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-3"
                            >
                              <span>🗑️</span>
                              <span>Delete</span>
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Meta Info */}
                    <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
                      <span>{formatDate(convo.updated_at)}</span>
                      {convo.conversation?.filter(m => m.role === "user").length > 0 && (
                        <>
                          <span>·</span>
                          <span>{convo.conversation.filter(m => m.role === "user").length} {convo.conversation.filter(m => m.role === "user").length === 1 ? "prompt" : "prompts"}</span>
                        </>
                      )}
                    </div>

                    {/* Preview Tag */}
                    {convo.intent?.job_titles?.explicit?.value && (
                      <div className="text-xs text-gray-600 line-clamp-1">
                        {convo.intent.job_titles.explicit.value}
                        {convo.intent.workplace_type && 
                          ` · ${convo.intent.workplace_type}`}
                      </div>
                    )}
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Delete search?</h3>
            <p className="text-sm text-gray-600 mb-1">
              This will delete{" "}
              <span className="font-semibold text-gray-900">
                {conversations.find(c => c.id === deleteConfirmId)?.title || "this search"}
              </span>.
            </p>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border-2 border-neutral-300 rounded-xl hover:bg-neutral-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirmId)}
                className="flex-1 px-4 py-2.5 text-sm font-semibold text-white bg-red-600 rounded-xl hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

