import { clientFirestore } from "@/admin/lib/firebaseClient";
import { doc, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";

const useBoardSubscription = ({ board_id }) => {
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!board_id) {
      return;
    }
    const unsubscribe = onSnapshot(
      doc(clientFirestore, "boards_subscriptions", board_id),
      (doc) => {
        if (doc.exists()) {
          setSubscription(doc.data());
        } else {
          setSubscription(null);
        }
        setLoading(false);
      },
      (error) => {
        setError(error);
        setLoading(false);
      }
    );
    return () => unsubscribe();
  }, [board_id]);

  return { subscription, loading, error };
};

export default useBoardSubscription;
