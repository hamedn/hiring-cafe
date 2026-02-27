import { clientFirestore } from "@/lib/firebaseClient";
import { onSnapshot, collection, where, query } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";

const useMessagesSeeker = () => {
  const { user, loading: loadingUser } = useAuth();
  const [messages, setMessages] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user) return;
    const messagesCollection = collection(clientFirestore, "seeker_threads");

    const q = query(messagesCollection, where("seeker", "==", user.uid));

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
  }, [user]);

  return { messages, loading, error };
};

export default useMessagesSeeker;
