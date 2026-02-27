import { clientFirestore } from "@/admin/lib/firebaseClient";
import { onSnapshot, collection, where, query } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useAuth } from "./useAuth";

const useJobs = () => {
  const { userData } = useAuth();
  const [jobs, setJobs] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!userData?.board) return;
    const jobsCollection = collection(clientFirestore, "jobs");

    const q = query(jobsCollection, where("board.id", "==", userData.board));

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
  }, [userData]);

  useEffect(() => {
    if (!userData) {
      setJobs(null);
      setLoading(false);
    }
  }, [userData]);

  return { jobs, loading, error };
};

export default useJobs;
