import { useState, useEffect } from "react";
import { useAuth } from "./useAuth";
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  addDoc,
  Timestamp,
} from "firebase/firestore";
import { clientFirestore } from "@/lib/firebaseClient";

export default function useAISearchConversations() {
  const { user } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const conversationsRef = collection(
      clientFirestore,
      "ai_search_conversations_v2"
    );
    const q = query(
      conversationsRef,
      where("uid", "==", user.uid),
      where("deleted", "==", false),
      orderBy("updated_at", "desc")
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const convos = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setConversations(convos);
        setLoading(false);
        setError(null);
      },
      (err) => {
        console.error("Error listening to conversations:", err);
        setError(err);
        setLoading(false);
        setConversations([]);
      }
    );

    return () => unsubscribe();
  }, [user]);

  const createConversation = async () => {
    if (!user) return null;

    try {
      setError(null);

      const newConvo = {
        uid: user.uid,
        title: "New Search",
        created_at: Timestamp.now(),
        updated_at: Timestamp.now(),
        conversation: [],
        intent: null,
        embedding_text_explicit: "",
        embedding_text_inferred: "",
        embedding_text_company: "",
        exclusion_text_job: "",
        exclusion_text_company: "",
        embedding_explicit: null,
        embedding_inferred: null,
        embedding_company: null,
        exclusion_embedding_job: null,
        exclusion_embedding_company: null,
        deleted: false,
      };

      const docRef = await addDoc(
        collection(clientFirestore, "ai_search_conversations_v2"),
        newConvo
      );

      return docRef.id;
    } catch (err) {
      console.error("Error creating conversation:", err);
      setError(err);
      return null;
    }
  };

  return {
    conversations,
    loading,
    error,
    createConversation,
  };
}
