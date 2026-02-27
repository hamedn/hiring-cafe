import MessageItem from "./messageItem";

export default function MessageList({
  selectedMessageId,
  messages,
  onMessageSelectId,
}) {
  return (
    <div className="p-4 flex flex-col">
      <h2 className="text-2xl font-medium mb-4">Messages</h2>
      <div className="flex flex-col max-h-96 overflow-y-auto">
        {messages.map((message) => (
          <MessageItem
            key={message.id}
            message={message}
            isSelected={selectedMessageId === message.id}
            onClick={() => onMessageSelectId(message.id)}
          />
        ))}
      </div>
    </div>
  );
}
