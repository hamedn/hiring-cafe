import { clientFirestore } from "@/admin/lib/firebaseClient";
import { doc, getDoc, onSnapshot, setDoc } from "firebase/firestore";
import { useCallback, useEffect, useRef, useState } from "react";
import { useAuth } from "./useAuth";

const useSavedCandidate = ({ candidate_id }) => {
  const [savedCandidate, setSavedCandidate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { userData, user } = useAuth();
  const unsubscribeRef = useRef(null); // useRef to store the unsubscribe function

  const setCandidateData = (data) => {
    if (!candidate_id || !userData || !user) return;
    setDoc(
      doc(
        clientFirestore,
        "saved_candidates",
        `${userData.board}_${candidate_id}_${user.uid}`
      ),
      {
        ...data,
        candidate_id,
        board_id: userData.board,
        user_id: user.uid,
      },
      { merge: true }
    );
    if (!savedCandidate) {
      checkDocumentAndListen();
    }
  };

  const checkDocumentAndListen = useCallback(async () => {
    if (!candidate_id || !userData || !user) return;

    const docRef = doc(
      clientFirestore,
      "saved_candidates",
      `${userData.board}_${candidate_id}_${user.uid}`
    );

    try {
      const docSnapshot = await getDoc(docRef);
      if (docSnapshot.exists()) {
        if (unsubscribeRef.current) unsubscribeRef.current(); // Unsubscribe previous listener if exists
        unsubscribeRef.current = onSnapshot(
          docRef,
          (doc) => {
            setSavedCandidate(doc.data());
            setLoading(false);
          },
          (error) => {
            setError(error);
            setLoading(false);
          }
        );
      } else {
        setError(new Error("Doc does not exist"));
        setLoading(false);
      }
    } catch (error) {
      setError(error);
      setLoading(false);
    }
  }, [candidate_id, user, userData]);

  useEffect(() => {
    if (!candidate_id || !userData || !user) return;
    checkDocumentAndListen();
    return () => {
      if (unsubscribeRef.current) unsubscribeRef.current(); // Cleanup listener
    };
  }, [candidate_id, checkDocumentAndListen, user, userData]);

  return {
    savedCandidate,
    loading,
    error,
    refresh: checkDocumentAndListen,
    setCandidateData,
  };
};

export default useSavedCandidate;
