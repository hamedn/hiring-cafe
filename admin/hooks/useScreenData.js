import { doc, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";
import { clientFirestore } from "@/admin/lib/firebaseClient";

const useScreenData = (screenId) => {
  const [screen, setScreen] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!screenId) {
      return;
    }

    const screenRef = doc(clientFirestore, "screens", screenId);

    const unsubscribe = onSnapshot(
      screenRef,
      (docSnapshot) => {
        setScreen({ ...docSnapshot.data(), id: docSnapshot.id });
        setLoading(false);
      },
      (err) => {
        setError(err);
        setLoading(false);
      }
    );

    return () => {
      unsubscribe();
    };
  }, [screenId]);

  return { screen, loading, error };
};

export default useScreenData;
