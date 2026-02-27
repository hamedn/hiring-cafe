import { clientFirestore } from "@/admin/lib/firebaseClient";
import { doc, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";

const useJobBoost = ({ job_id }) => {
  const [jobBoost, setJobBoost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!job_id) {
      return;
    }
    const unsubscribe = onSnapshot(
      doc(clientFirestore, "job_boosts", job_id),
      (doc) => {
        if (doc.exists()) {
          setJobBoost(doc.data());
        } else {
          setJobBoost(null);
        }
        setLoading(false);
      },
      (error) => {
        setError(error);
        setLoading(false);
      }
    );
    return () => unsubscribe();
  }, [job_id]);

  return { jobBoost, loading, error, setJobBoost };
};

export default useJobBoost;
