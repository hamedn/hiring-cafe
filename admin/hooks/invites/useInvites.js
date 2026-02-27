import { clientFirestore } from "@/admin/lib/firebaseClient";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useAuth } from "../useAuth";

/// Boards where currently logged in user is invited to be an admin.
const useInvites = () => {
  const [userInvites, setUserInvites] = useState([]);
  const [loadingInvites, setLoadingInvites] = useState(true);
  const { userData, loadingUserData } = useAuth();

  useEffect(() => {
    if (loadingUserData) {
      return;
    }

    if (!userData) {
      setUserInvites([]);
      setLoadingInvites(false);
      return;
    }

    const q = query(
      collection(clientFirestore, "invites"),
      where("email", "==", userData.email)
    );

    const unsubscribe = onSnapshot(
      q,
      (querySnapshot) => {
        const invites = [];
        querySnapshot.forEach((doc) => {
          invites.push({ id: doc.id, ...doc.data() });
        });
        setUserInvites(invites);
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

  return { userInvites, loadingInvites };
};

export default useInvites;
