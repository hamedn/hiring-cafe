import { clientFirestore } from "@/admin/lib/firebaseClient";
import { doc, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";

const useMessage = ({ applicantId }) => {
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!applicantId) {
      return;
    }
    const unsubscribe = onSnapshot(
      doc(clientFirestore, "messages", applicantId),
      (doc) => {
        if (doc.exists()) {
          setMessage({
            id: doc.id,
            ...doc.data(),
          });
        } else {
          setError(new Error("Message does not exist"));
        }
        setLoading(false);
      },
      (error) => {
        setError(error);
        setLoading(false);
      }
    );
    return () => unsubscribe();
  }, [applicantId]);

  return { message, loading, error };
};

export default useMessage;
