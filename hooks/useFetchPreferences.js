import { useEffect, useState } from "react";
import { doc, getDoc, onSnapshot, setDoc } from "firebase/firestore";
import { clientFirestore } from "@/lib/firebaseClient";
import { useAuth } from "./useAuth";

const useFetchPreferences = () => {
  const { user, loading: isLoadingUser } = useAuth();
  const [userPreferences, setUserPreferences] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const fetchPreferences = async () => {
      try {
        const ref = doc(clientFirestore, `usersPreferences/${user.uid}`);
        const fetchedDoc = await getDoc(ref);
        if (fetchedDoc.exists()) {
          const preferencesData = fetchedDoc.data();
          preferencesData && setUserPreferences(preferencesData);
        }
      } catch (error) {
        console.error("Error fetching preferences:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPreferences();
  }, [user]);

  useEffect(() => {
    if (user) {
      const unsubscribe = onSnapshot(
        doc(clientFirestore, `usersPreferences/${user.uid}`),
        (doc) => {
          if (doc.exists()) {
            const preferencesData = doc.data();
            preferencesData && setUserPreferences(preferencesData);
          }
          setLoading(false);
        }
      );
      return () => unsubscribe();
    }
  }, [user]);

  useEffect(() => {
    if (!isLoadingUser && !user) {
      setLoading(false);
    }
  }, [isLoadingUser, user]);

  // Set user preferences
  const setUserPreferencesHandler = async (preferences) => {
    if (!user) return;
    try {
      const ref = doc(clientFirestore, `usersPreferences/${user.uid}`);
      setDoc(ref, preferences, { merge: true });
    } catch (error) {
      console.error("Error setting preferences:", error);
    }
  };

  return {
    userPreferences,
    setUserPreferences: setUserPreferencesHandler,
    loading,
  };
};

export default useFetchPreferences;
