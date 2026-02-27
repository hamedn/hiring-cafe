import { clientFirestore } from "@/admin/lib/firebaseClient";
import { doc, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";

const useJobBudget = ({ jobID }) => {
  const [jobBudget, setJobBudget] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const docRef = doc(clientFirestore, "job_budgets", jobID);
    const unsubscribe = onSnapshot(
      docRef,
      (doc) => {
        if (!doc.exists()) {
          setError(
            new Error(
              "The job budget data is not available. Please contact support."
            )
          );
        } else {
          setJobBudget(doc.data());
        }
        setLoading(false);
      },
      (error) => {
        setError(error);
        setLoading(false);
      }
    );
    return () => {
      unsubscribe();
    };
  }, [jobID]);

  return { jobBudget, loading, error };
};

export default useJobBudget;
