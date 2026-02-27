import { clientFirestore } from "@/admin/lib/firebaseClient";
import { doc, getDoc, onSnapshot } from "firebase/firestore";
import { useCallback, useEffect, useRef, useState } from "react";
import { useAuth } from "./useAuth";

const useCandidateIntroRequest = ({ candidate_id }) => {
  const [introRequest, setIntroRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { userData } = useAuth();
  const unsubscribeRef = useRef(null); // useRef to store the unsubscribe function

  const checkDocumentAndListen = useCallback(async () => {
    const docRef = doc(
      clientFirestore,
      "candidate_intro_requests",
      `${userData.board}_${candidate_id}`
    );

    try {
      const docSnapshot = await getDoc(docRef);
      if (docSnapshot.exists()) {
        if (unsubscribeRef.current) unsubscribeRef.current(); // Unsubscribe previous listener if exists
        unsubscribeRef.current = onSnapshot(
          docRef,
          (doc) => {
            setIntroRequest(doc.data());
            setLoading(false);
          },
          (error) => {
            setError(error);
            setLoading(false);
          }
        );
      } else {
        setError(new Error("Intro request does not exist"));
        setLoading(false);
      }
    } catch (error) {
      setError(error);
      setLoading(false);
    }
  }, [candidate_id, userData]);

  useEffect(() => {
    if (userData) {
      checkDocumentAndListen();
    }
    return () => {
      if (unsubscribeRef.current) unsubscribeRef.current(); // Cleanup listener
    };
  }, [checkDocumentAndListen, userData]);

  return { introRequest, loading, error, refresh: checkDocumentAndListen };
};

export default useCandidateIntroRequest;
