import { useState } from "react";
import { useAuth } from "./useAuth";
import axios from "axios";

export default function useAISearchResults() {
  const { user } = useAuth();
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const search = async (conversationId, page = 0, size = 28) => {
    if (!user || !conversationId) return;

    setLoading(true);
    setError(null);

    try {
      const token = await user.getIdToken();
      const response = await axios.post(
        "/api/ai-search/search",
        {
          conversation_id: conversationId,
          page,
          size,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setResults(response.data);
      return response.data;
    } catch (err) {
      // Silently ignore "No search intent set" errors for new conversations
      if (err.response?.data?.error === "No search intent set") {
        setResults(null);
        return;
      }

      console.error("Error searching jobs:", err);
      // Handle JSON parsing errors (when server returns HTML instead of JSON)
      const isJsonParseError = err.message?.includes("Unexpected token") || 
                               err.message?.includes("not valid JSON");
      if (isJsonParseError) {
        const genericError = "Service temporarily unavailable. Please try again.";
        setError(genericError);
        err.userFacingMessage = genericError;
      } else {
        setError(err.response?.data?.error || "Failed to search");
      }
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    results,
    loading,
    error,
    search,
    setResults,
  };
}
