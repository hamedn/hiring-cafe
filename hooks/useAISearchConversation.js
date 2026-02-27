import { useState, useEffect } from "react";
import { useAuth } from "./useAuth";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { clientFirestore } from "@/lib/firebaseClient";
import axios from "axios";

export default function useAISearchConversation(conversationId) {
  const { user } = useAuth();
  const [conversation, setConversation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (!user || !conversationId) {
      setLoading(false);
      return;
    }

    // Use a query instead of a document listener to leverage the 'list' permission
    // which is more permissive than 'get' and doesn't have race conditions with newly created docs
    const conversationsRef = collection(
      clientFirestore,
      "ai_search_conversations_v2"
    );
    const q = query(
      conversationsRef,
      where("__name__", "==", conversationId),
      where("uid", "==", user.uid)
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        if (!snapshot.empty) {
          const doc = snapshot.docs[0];
          setConversation({
            id: doc.id,
            ...doc.data(),
          });
          setError(null);
        } else {
          setConversation(null);
        }
        setLoading(false);
      },
      (err) => {
        console.error("Error listening to conversation:", err);
        setError(err);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user, conversationId]);

  const sendMessage = async (message, overrideConversationId = null) => {
    const idToUse = overrideConversationId || conversationId;
    if (!user || !idToUse) return;
    
    setSending(true);
    setError(null);

    try {
      const token = await user.getIdToken();
      const response = await axios.post(
        "/api/ai-search/interact",
        { 
          conversation_id: idToUse,
          message 
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return response.data;
    } catch (err) {
      console.error("Error sending message:", err);
      // Handle JSON parsing errors (when server returns HTML instead of JSON)
      const isJsonParseError = err.message?.includes("Unexpected token") || 
                               err.message?.includes("not valid JSON");
      if (isJsonParseError) {
        const genericError = "Service temporarily unavailable. Please try again.";
        setError(genericError);
        err.userFacingMessage = genericError;
      } else {
        setError(err.response?.data?.error || "Failed to send message");
      }
      throw err;
    } finally {
      setSending(false);
    }
  };

  return {
    conversation,
    loading,
    error,
    sending,
    sendMessage,
  };
}

