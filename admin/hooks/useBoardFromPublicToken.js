import { clientFirestore } from "@/admin/lib/firebaseClient";
import { onSnapshot, collection, where, query } from "firebase/firestore";
import { useEffect, useState } from "react";

const useBoardWithPublicToken = ({ boardToken }) => {
  const [board, setBoard] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!boardToken || !boardToken.length) return;
    const q = query(
      collection(clientFirestore, "boards"),
      where("public_board_id", "==", boardToken)
    );
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        if(snapshot.docs.length !== 1) {
          setError(new Error("Invalid Board ID"));
          setLoading(false);
        }
        const board = snapshot.docs[0].data();

        setBoard(board);
        setLoading(false);
      },
      (error) => {
        setError(error);
        setLoading(false);
      }
    );
    return () => unsubscribe();
  }, [boardToken]);

  return { board, loading, error };
};

export default useBoardWithPublicToken;
