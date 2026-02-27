import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { clientAuth } from "@/lib/firebaseClient";

const useFetchCommentsForMarketplaceJob = ({ jobID }) => {
  const [loading, setLoading] = useState(true);
  const [comments, setComments] = useState([]);

  // Create getComments with useCallback to refactor
  // the function to avoid unnecessary re-renders

  const getComments = useCallback(async () => {
    try {
      const comments = await axios.post("/api/ugc/get-comments", {
        marketplace_job_id: jobID,
        user_token: clientAuth.currentUser
          ? await clientAuth.currentUser.getIdToken()
          : null,
      });

      setComments(comments.data);
      setLoading(false);
    } catch (error) {
      console.trace(error);
      setLoading(false);
    }
  }, [jobID]);

  useEffect(() => {
    getComments();
  }, [getComments, jobID]);

  return { comments, loading, getComments };
};

export default useFetchCommentsForMarketplaceJob;
