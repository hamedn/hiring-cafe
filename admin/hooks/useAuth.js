import { useState, useEffect, useContext } from "react";
import FirebaseContext from "@/admin/lib/firebaseContext";
import { clientAuth, clientFirestore } from "@/admin/lib/firebaseClient";
import { onAuthStateChanged } from "firebase/auth";
import { doc, onSnapshot } from "firebase/firestore";
import axios from "axios";

export const useAuth = () => {
  const firebaseContext = useContext(FirebaseContext);
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [loadingUserData, setLoadingUserData] = useState(true);
  const [errorLoadingUser, setErrorLoadingUser] = useState(null);
  const [errorLoadingUserData, setErrorLoadingUserData] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      clientAuth,
      async (authUser) => {
        if (authUser) {
          setUser(authUser);
          await axios.post("/api/admin/userManagement/sessionLogin", {
            idToken: await authUser.getIdToken(),
          });
        } else {
          setUser(null);
        }
        setLoadingUser(false);
      },
      (error) => {
        console.error(error);
        setErrorLoadingUser(error);
        setUser(null);
        setLoadingUser(false);
      }
    );
    return () => unsubscribe();
  }, [firebaseContext]);

  useEffect(() => {
    if (!user) return;
    return onSnapshot(
      doc(clientFirestore, `users/${user.uid}`),
      (doc) => {
        if (doc.exists()) {
          setUserData(doc.data());
          setLoadingUserData(false);
        } else {
          setLoadingUserData(false);
          setUserData(null);
        }
      },
      (error) => {
        console.error(error);
        setErrorLoadingUserData(error);
        setLoadingUserData(false);
        setUserData(null);
      }
    );
  }, [user]);

  return {
    user,
    userData,
    loadingUser,
    loadingUserData,
    isLoggedIn: user,
    errorLoadingUserData: errorLoadingUserData,
    errorLoadingUser: errorLoadingUser,
  };
};
