import { clientFirestore } from "@/admin/lib/firebaseClient";
import { doc, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";

const useJob = ({ job_id }) => {
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!job_id) {
      return;
    }
    const unsubscribe = onSnapshot(
      doc(clientFirestore, "jobs", job_id),
      (doc) => {
        if (doc.exists()) {
          setJob(doc.data());
        } else {
          setError(new Error("Job does not exist"));
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

  return { job, loading, error, setJob };
};

export default useJob;
