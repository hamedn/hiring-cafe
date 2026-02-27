import { clientFirestore } from "@/admin/lib/firebaseClient";
import { onSnapshot, collection, where, query } from "firebase/firestore";
import { useEffect, useState } from "react";

const useApplicantScreens = ({ applicantId }) => {
  const [applicantScreens, setApplicantScreens] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!applicantId) return;

    const applicantScreensCollection = collection(
      clientFirestore,
      "applicant_screens"
    );

    const q = query(
      applicantScreensCollection,
      where("applicant", "==", applicantId)
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const applicantScreens = snapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            ...data,
          };
        });
        setApplicantScreens(applicantScreens);
        setLoading(false);
      },
      (error) => {
        setError(error);
        setLoading(false);
      }
    );
    return () => unsubscribe();
  }, [applicantId]);

  return { applicantScreens, loading, error };
};

export default useApplicantScreens;
