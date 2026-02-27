import { useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { clientFirestore } from "@/lib/firebaseClient";
import { useAuth } from "./useAuth";

const useFetchUserData = () => {
  const { user } = useAuth();
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    if (!user) {
      setUserData(null);
      return;
    }
    return onSnapshot(doc(clientFirestore, `users/${user.uid}`), (doc) => {
      setUserData(doc.data());
    });
  }, [user]);

  return userData;
};

export default useFetchUserData;
