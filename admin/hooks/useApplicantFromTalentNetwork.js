import { clientFirestore } from "@/admin/lib/firebaseClient";
import {
  onSnapshot,
  collection,
  where,
  query,
  limit,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { useAuth } from "./useAuth";

const useApplicantFromTalentNetwork = ({ candidateID }) => {
  const { userData } = useAuth();
  const [applicant, setApplicant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!userData || !candidateID) return;

    const applicantsCollection = collection(clientFirestore, "applicants");

    let q = query(
      applicantsCollection,
      where("board_applied", "==", userData.board),
      where("candidate_id", "==", candidateID),
      limit(1)
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const applicants = snapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            ...data,
          };
        });
        setApplicant(applicants[0]);
        setLoading(false);
      },
      (error) => {
        setError(error);
        console.error(error.message);
        setLoading(false);
      }
    );
    return () => unsubscribe();
  }, [candidateID, userData]);

  return { applicant, loading, error };
};

export default useApplicantFromTalentNetwork;
