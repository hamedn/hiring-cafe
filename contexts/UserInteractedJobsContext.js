import { useAuth } from "@/hooks/useAuth";
import { clientFirestore } from "@/lib/firebaseClient";
import {
  Timestamp,
  collection,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import { createContext, useEffect, useState } from "react";

export const UserInteractedJobsContext = createContext(null);

/// Only returns last 5 min. This is to avoid getting all the jobs from the user.
/// Useful to filter out jobs on the client side.
const UserInteractedJobsProvider = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [interactedJobs, setInteractedJobs] = useState([]);
  const { user, loading: isLoadingUser } = useAuth();

  useEffect(() => {
    if (user) {
      const q = query(
        collection(clientFirestore, "savedJobs"),
        where("owner", "==", user.uid),
        // Last 3 min
        where(
          "dateSaved",
          ">",
          Timestamp.fromDate(new Date(Date.now() - 5 * 60 * 1000))
        )
      );
      return onSnapshot(q, (querySnapshot) => {
        const newJobs = [];
        querySnapshot.forEach((doc) => {
          const jobData = doc.data();
          newJobs.push({
            id: doc.id,
            job_id: jobData.objectID,
            stage: jobData.stage,
          });
        });
        setInteractedJobs(newJobs);
        setLoading(false);
      });
    }
  }, [user]);

  useEffect(() => {
    if (!isLoadingUser && !user) {
      setLoading(false);
      setInteractedJobs([]);
    }
  }, [isLoadingUser, user]);

  const addOfflineInteractedJob = ({ job_id, stage }) => {
    if (user) {
      return;
    }
    const newJob = {
      job_id,
      stage,
    };
    setInteractedJobs([...interactedJobs, newJob]);
  };

  return (
    <UserInteractedJobsContext.Provider
      value={{ interactedJobs, addOfflineInteractedJob, loading }}
    >
      {children}
    </UserInteractedJobsContext.Provider>
  );
};

export default UserInteractedJobsProvider;
