import { clientFirestore } from "@/admin/lib/firebaseClient";
import {
  onSnapshot,
  collection,
  where,
  query,
  limit,
  orderBy,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { useAuth } from "./useAuth";

const useApplicants = ({ jobId, stage, limitApplicants }) => {
  const { userData } = useAuth();
  const [applicants, setApplicants] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!userData || !jobId) return;

    const applicantsCollection = collection(clientFirestore, "applicants");

    let q = query(
      applicantsCollection,
      where("board_applied", "==", userData.board),
      where("job_applied", "==", jobId),
      orderBy("date_applied", "asc"),
      limit(limitApplicants || 100)
    );

    if (stage) {
      q = query(
        applicantsCollection,
        where("board_applied", "==", userData.board),
        where("job_applied", "==", jobId),
        where("stage", "==", stage),
        orderBy("date_applied", "asc"),
        limit(limitApplicants || 100)
      );
    }

    setLoading(true);

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
        setApplicants(applicants);
        setLoading(false);
      },
      (error) => {
        setError(error);
        console.error(error.message);
        setLoading(false);
      }
    );
    return () => unsubscribe();
  }, [jobId, limitApplicants, stage, userData]);

  return { applicants, loading, error };
};

export default useApplicants;
