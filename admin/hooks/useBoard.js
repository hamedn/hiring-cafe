import { clientFirestore } from "@/admin/lib/firebaseClient";
import { doc, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";

const useBoard = ({ board_id }) => {
  const [board, setBoard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!board_id) {
      return;
    }
    const unsubscribe = onSnapshot(
      doc(clientFirestore, "boards", board_id),
      (doc) => {
        if (doc.exists()) {
          setBoard(doc.data());
        } else {
          setError(new Error("Board does not exist"));
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

  return { board, loading, error };
};

export default useBoard;
