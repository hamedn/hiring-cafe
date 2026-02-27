import { clientFirestore } from "@/admin/lib/firebaseClient";
import { doc, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";

const useApplicant = ({ applicantId }) => {
  const [applicant, setApplicant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!applicantId) {
      return;
    }
    const unsubscribe = onSnapshot(
      doc(clientFirestore, "applicants", applicantId),
      (doc) => {
        if (doc.exists()) {
          setApplicant(doc.data());
        } else {
          setError(new Error("Applicant does not exist"));
        }
        setLoading(false);
      },
      (error) => {
        setError(error);
        setLoading(false);
      }
    );
    return () => unsubscribe();
  }, [applicantId]);

  return { applicant, loading, error };
};

export default useApplicant;
