import { useCallback, useEffect, useRef, useState } from "react";
import axios from "axios";
import xss from "xss";
import { CircularProgress, useToast } from "@chakra-ui/react";
import { PaperAirplaneIcon } from "@heroicons/react/24/outline";

export default function CandidateMessaging({ applicant_info }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [messages, setMessages] = useState([]);
  const [sentMessage, setSentMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const toast = useToast();

  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);

  function sortByDate(messageArray) {
    // Copy the JSON array to avoid modifying the original object
    const copyArray = [...messageArray];

    // Sort the array in ascending order based on the date key
    copyArray.sort((a, b) => new Date(a.date) - new Date(b.date));

    return copyArray;
  }

  const loadMessages = useCallback(async () => {
    await axios
      .post(`/api/applicant/messages/getMessages`, {
        access_token: applicant_info.candidate_token.token,
        applicant_id: applicant_info.applicantId,
      })
      .then((response) => {
        const serverMessages = response.data.messages;
        const newMessages = sortByDate(serverMessages);
        setMessages(newMessages);
      })
      .catch((error) => {
        setError(error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [applicant_info]);

  const sendMessage = async () => {
    if (!sentMessage.length) return;
    setIsSubmitting(true);
    const dataToSubmit = {
      applicant_id: applicant_info.applicantId,
      access_token: applicant_info.candidate_token.token,
      message: sentMessage,
    };
    try {
      await axios.post(`/api/applicant/messages/postMessage`, dataToSubmit);
      setSentMessage("");
      await loadMessages();
    } catch (error) {
      toast({
        title: "Error",
        message: "There was an error sending your message.",
        status: error.message,
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    loadMessages();
  }, [loadMessages]);

  useEffect(() => {
    if (messagesContainerRef.current && messagesEndRef.current) {
      messagesContainerRef.current.scrollTop = messagesEndRef.current.offsetTop;
    }
  }, [messages]);

  if (loading) {
    return (
      <div className="flex justify-center my-8">
        <CircularProgress isIndeterminate color="yellow.600" size={"30px"} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center my-8">
        <div className="flex flex-col items-center text-center text-red-600 space-y-8 border border-red-200 rounded-lg p-16">
          <PaperAirplaneIcon className="h-12 w-12" />
          <span className="font-medium">
            {"Unable to load messages (error: " + error?.message + ")"}
          </span>
        </div>
      </div>
    );
  }

  if (!messages.length) {
    return null;
  }

  return (
    <div className="flex flex-col flex-auto border rounded-b-lg">
      <span className="text-xl font-medium flex py-4 pl-4 border-b bg-slate-50">
        Messages
      </span>
      <div
        ref={messagesContainerRef}
        className="flex flex-col space-y-8 h-96 overflow-y-auto px-6 pt-6"
      >
        {messages.map((message, index) => (
          <div key={index} className="flex flex-col">
            <div
              className={`rounded-lg px-4 py-2 ${
                message.sender_type === "admin"
                  ? "bg-gray-200 text-black rounded-bl-none"
                  : "bg-blue-400 text-white rounded-br-none"
              }`}
            >
              <span className="text-xs">
                {message.sender_type === "admin"
                  ? applicant_info.boardName
                  : applicant_info.profile.name}
              </span>
              <div
                className="font-medium"
                dangerouslySetInnerHTML={{
                  __html: xss(message.body),
                }}
              />
            </div>
            <span className="text-xs ml-1 mt-1 font-light">
              {new Date(message.date).toLocaleString()}
            </span>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div className="flex flex-col space-y-4 border-t p-4 bg-slate-50 rounded-b-lg">
        <textarea
          type="text"
          value={sentMessage}
          onChange={(e) => setSentMessage(e.target.value)}
          className={`border rounded resize-none h-28 p-4 outline-none shadow ${
            !isSubmitting && "focus:border-yellow-600"
          }`}
          placeholder="Type Message"
        />
        <button
          disabled={isSubmitting || !sentMessage.length}
          className={`py-2 font-medium rounded ${
            isSubmitting
              ? "bg-gray-200 text-gray-400 cursor-not-allowed"
              : "bg-yellow-600 hover:bg-yellow-700 text-white"
          }`}
          onClick={() => sendMessage()}
        >
          {isSubmitting ? (
            <CircularProgress isIndeterminate size="20px" color="gray.800" />
          ) : (
            "Send"
          )}
        </button>
      </div>
    </div>
  );
}
