import { useEffect, useState } from "react";
import { Timestamp, doc, onSnapshot, updateDoc } from "firebase/firestore";
import { clientFirestore } from "@/lib/firebaseClient";
import { useAuth } from "./useAuth";

const useSeekerProfile = () => {
  const { user, loading: loadingUser } = useAuth();
  const [seekerUserData, setSeekerUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      return;
    }
    const seekerDataDoc = doc(clientFirestore, `seeker_profiles/${user.uid}`);
    const unsubscribe = onSnapshot(seekerDataDoc, (doc) => {
      const seekerData = doc.exists() ? doc.data() : null;
      setSeekerUserData(seekerData);
      setLoading(false);
    });
    return () => unsubscribe();
  }, [loadingUser, user]);

  useEffect(() => {
    if (!loadingUser && !user) {
      setLoading(false);
      setSeekerUserData(null);
    }
  }, [loadingUser, user]);

  const setLastActive = async () => {
    if (seekerUserData) {
      const lastActive = seekerUserData.lastActive;
      if (lastActive) {
        // If lastActive was set less than 8 hours ago, don't update it
        const lastActiveDate = lastActive.toDate();
        const now = new Date();
        const diff = now - lastActiveDate;
        const diffHours = diff / (1000 * 60 * 60);
        if (diffHours < 8) {
          return;
        }
      }
      const seekerDataDoc = doc(clientFirestore, `seeker_profiles/${user.uid}`);
      updateDoc(seekerDataDoc, {
        lastActive: Timestamp.now(),
      });
    }
  };

  return { seekerUserData, setLastActive, loading };
};

export default useSeekerProfile;
