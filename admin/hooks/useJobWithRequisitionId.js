import { clientFirestore } from "@/admin/lib/firebaseClient";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";

const useJobWithRequisitionId = ({ requisition_id }) => {
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!requisition_id) {
      // Don't fetch if not available
      return;
    }
    const dbCollection = collection(clientFirestore, "jobs");
    const q = query(
      dbCollection,
      where("requisition_id", "==", requisition_id)
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        try {
          if (snapshot.docs.length === 0) {
            setLoading(false);
            throw new Error("No Job With This ID Exists.");
          }
          const jobData = snapshot.docs[0].data();
          delete jobData.temp_edit_token;
          setJob(jobData);
          setLoading(false);
        } catch (err) {
          console.log(err);
          setLoading(false);
          setError(err);
        }
      },
      (err) => {
        console.log("Encountered error: ", err);
        setLoading(false);
        setError(err);
      }
    );

    return () => {
      // clean up function
      unsubscribe();
    };
  }, [requisition_id]);

  return { job, loading, error, setJob };
};

export default useJobWithRequisitionId;
