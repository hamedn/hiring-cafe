import MessageItem from "./MessageItem";
import { clientFirestore } from "@/lib/firebaseClient";
import { doc, updateDoc } from "firebase/firestore";

export default function MessageList({
  selectedMessageId,
  messages,
  onMessageSelectId,
  viewAsApplicant = false,
}) {

  const triggerSelectMessage = async (message) => {
    onMessageSelectId(message.id);
    if ((!viewAsApplicant) && message.admin_needs_attention) {
      try {
        await updateDoc(doc(clientFirestore, `seeker_threads/${message.id}`), { admin_needs_attention: false });
      } catch (error) {
        console.log(error);
      }
    } else if (viewAsApplicant && message.applicant_needs_attention) {
      try {
        await updateDoc(doc(clientFirestore, `seeker_threads/${message.id}`), { applicant_needs_attention: false });
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <div className="p-4 flex flex-col">
      <h2 className="text-2xl font-medium mb-4">Messages</h2>
      <div className="flex flex-col max-h-96 overflow-y-auto">
        {messages.map((message) => (
          <MessageItem
            viewAsApplicant={viewAsApplicant}
            key={message.id}
            message={message}
            isSelected={selectedMessageId === message.id}
            onClick={() => triggerSelectMessage(message)}
          />
        ))}
      </div>
    </div>
  );
}
