import { clientFirestore } from "@/admin/lib/firebaseClient";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useAuth } from "../useAuth";

/// All invited users for the current board.
const useAllBoardInvites = () => {
  const [invites, setInvites] = useState([]);
  const [loadingInvites, setLoadingInvites] = useState(true);
  const { userData, loadingUserData } = useAuth();

  useEffect(() => {
    if (loadingUserData) {
      return;
    }

    if (!userData) {
      setInvites([]);
      setLoadingInvites(false);
      return;
    }

    const q = query(
      collection(clientFirestore, "invites"),
      where("board", "==", userData.board)
    );

    const unsubscribe = onSnapshot(
      q,
      (querySnapshot) => {
        const invites = [];
        querySnapshot.forEach((doc) => {
          invites.push({ id: doc.id, ...doc.data() });
        });
        setInvites(invites);
        setLoadingInvites(false);
      },
      (error) => {
        console.trace("Error fetching invites:", error);
        setLoadingInvites(false);
      }
    );

    // Cleanup function to unsubscribe from the Firestore listener when the component unmounts or userData changes
    return () => unsubscribe();
  }, [loadingUserData, userData]);

  return { invites, loadingInvites };
};

export default useAllBoardInvites;
