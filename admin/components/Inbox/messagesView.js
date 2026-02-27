import xss from "xss";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useToast } from "@chakra-ui/react";
import useApplicant from "@/admin/hooks/useApplicant";

export default function MessagesView({ message }) {
  const toast = useToast();
  const isApplicant = (thread) => thread.sender_type === "applicant";
  const bottomRef = useRef(null);

  const [newMessage, setNewMessage] = useState("");
  const [sendingMessage, setSendingMessage] = useState(false);

  const { applicant } = useApplicant({ applicantId: message?.id });

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "auto" });
  }, [message]);

  const sendMessage = async () => {
    setSendingMessage(true);
    try {
      await axios.post("/api/admin/inbox/sendMessageToApplicant", {
        applicant: message.id,
        messagebody: newMessage,
      });
    } catch (error) {
      console.log(error);
      toast({
        title: "Error",
        description: "There was an error sending your message.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setNewMessage("");
      setSendingMessage(false);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    await sendMessage();
  };

  return (
    <div className="p-4 flex flex-col justify-between h-full">
      {message.thread?.length > 0 && (
        <div className="bg-white p-4 overflow-y-auto">
          {message.thread.map((thread, index) => (
            <div
              key={`${index}`}
              className={`flex flex-col ${
                isApplicant(thread) ? "items-start mb-4" : "items-end mb-4"
              }`}
            >
              <div
                className={`px-4 py-2 rounded-lg max-w-xs ${
                  isApplicant(thread)
                    ? "bg-gray-200 text-black rounded-bl-none"
                    : "bg-blue-400 text-white rounded-br-none"
                }`}
              >
                <p className="text-sm">
                  <div
                    dangerouslySetInnerHTML={{
                      __html: xss(thread.body),
                    }}
                  />
                </p>
              </div>
              <p
                className={`text-xs ${
                  isApplicant(thread) ? "text-left" : "text-right"
                }`}
              >
                {new Date(thread.date.seconds * 1000).toLocaleDateString(
                  "en-US",
                  {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  }
                )}
              </p>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>
      )}
      <form onSubmit={handleSubmit} className="flex-none mt-2">
        <div className="flex border rounded-lg p-2">
          <textarea
            type="text"
            className="w-full h-18 rounded-lg px-4 py-2 mr-2 border-gray-400 focus:outline-none resize-none"
            placeholder="Type your message..."
            value={newMessage}
            onChange={(event) => setNewMessage(event.target.value)}
            disabled={applicant?.stage === "Rejected"}
          />
        </div>
        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-gray-800 hover:bg-black text-white rounded px-16 py-2 mt-2"
            disabled={sendingMessage || newMessage.trim() === ""}
          >
            {sendingMessage ? "Sending..." : "Send"}
          </button>
        </div>
      </form>
    </div>
  );
}
