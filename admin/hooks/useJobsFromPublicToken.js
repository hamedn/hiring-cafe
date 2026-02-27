import { clientFirestore } from "@/admin/lib/firebaseClient";
import { collection, where, query, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";

const useJobsFromPublicToken = (board) => {
  const [jobs, setJobs] = useState(null);
  const [loadingJobs, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!board) return;
    const q = query(
      collection(clientFirestore, "jobs"),
      where("board.id", "==", board.id)
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const jobs = snapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            ...data,
          };
        });
        jobs.sort(function (x, y) {
          if (x.created_at.toDate() < y.created_at.toDate()) {
            return -1;
          }
          if (x.created_at.toDate() > y.created_at.toDate()) {
            return 1;
          }
          return 0;
        });
        setJobs(jobs);
        setLoading(false);
      },
      (error) => {
        setError(error);
        setLoading(false);
      }
    );
    return () => unsubscribe();
  }, [board]);

  return { jobs, loadingJobs, error };
};

export default useJobsFromPublicToken;
