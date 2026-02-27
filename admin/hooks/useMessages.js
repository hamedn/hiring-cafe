import { clientFirestore } from "@/admin/lib/firebaseClient";
import { onSnapshot, collection, where, query } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useAuth } from "./useAuth";

const useMessages = () => {
  const { userData } = useAuth();
  const [messages, setMessages] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!userData) return;
    const messagesCollection = collection(clientFirestore, "messages");

    const q = query(messagesCollection, where("board", "==", userData.board));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const messages = snapshot.docs
          .map((doc) => {
            const data = doc.data();
            if (data?.thread?.length > 0) {
              return {
                id: doc.id,
                ...data,
              };
            } else {
              return null;
            }
          })
          .filter((message) => message !== null);
        setMessages(messages);
        setLoading(false);
      },
      (error) => {
        setError(error);
        setLoading(false);
      }
    );
    return () => unsubscribe();
  }, [userData]);

  return { messages, loading, error };
};

export default useMessages;
