import { useCallback } from "react";
import { clientAuth } from "@/lib/firebaseClient";
import { useMemoizedAuth } from "@/lib/AuthContext";

export const useAuth = () => {
  const { user, loading, userData, loadingUserData, isVerifiedUser } =
    useMemoizedAuth();

  const getIDToken = useCallback(async () => {
    // Refresh the token to get the latest custom claims
    return await clientAuth.currentUser.getIdToken();
  }, []);

  return {
    user,
    loading,
    userData,
    loadingUserData,
    getIDToken,
    isVerifiedUser,
  };
};
