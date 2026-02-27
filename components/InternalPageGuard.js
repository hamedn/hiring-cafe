import { useEffect } from "react";
import { useRouter } from "next/router";
import { useAuth } from "@/hooks/useAuth";
import { isInternalAdmin } from "@/utils/internalAdmins";

export default function InternalPageGuard({ children }) {
  const router = useRouter();
  const { user, loading: loadingAuth, loadingUserData } = useAuth();

  const isAuthorized = user?.email && isInternalAdmin(user.email);

  useEffect(() => {
    if (loadingAuth) return;

    if (!user) {
      router.push("/");
      return;
    }

    if (loadingUserData) return;

    if (!isAuthorized) {
      router.push("/");
      return;
    }
  }, [user, loadingAuth, loadingUserData, isAuthorized, router]);

  // Show loading state
  if (loadingAuth || loadingUserData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Show nothing if not authorized (will redirect)
  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Access denied</p>
        </div>
      </div>
    );
  }

  return children;
}
