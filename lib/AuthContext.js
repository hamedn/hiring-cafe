import { useState, useEffect, useContext, createContext, useMemo } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { clientAuth, clientFirestore } from "@/lib/firebaseClient";
import { usePostHog } from "posthog-js/react";
import { doc, onSnapshot, setDoc } from "firebase/firestore";

// Create a context for auth data
const AuthContext = createContext();

// This component wraps your application and provides the auth context
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  const [loadingUserData, setLoadingUserData] = useState(true);
  const posthog = usePostHog();

  const isVerifiedUser = useMemo(() => {
    if (!user) return false;
    const providerIds = (user.providerData || []).map((p) => p.providerId);
    // If any provider is not "password", consider verified
    if (providerIds.some((id) => id !== "password")) {
      return true;
    }
    // Only password provider: must check emailVerified
    return !!user.emailVerified;
  }, [user]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(clientAuth, (authUser) => {
      if (authUser) {
        // Set the user and loading state
        setUser(authUser);
        if (isVerifiedUser) {
          posthog.identify(authUser.uid, {
            email: authUser.email,
            name: authUser.displayName || "Unknown",
          });
        }
      } else {
        setUser(null);
        posthog.reset();
      }
      setLoading(false);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [posthog, isVerifiedUser]);

  useEffect(() => {
    if (!user || !isVerifiedUser) return;
    return onSnapshot(doc(clientFirestore, `users/${user.uid}`), (doc) => {
      setUserData(doc.data());
      setLoadingUserData(false);
    });
  }, [user, isVerifiedUser]);

  // If the userData does not have a name or profilePicture, set it to the user's name and photoURL (if they exist)
  useEffect(() => {
    if (!user) return;
    if (!isVerifiedUser) return;
    if (loadingUserData) return;
    if (!userData?.name) {
      setDoc(
        doc(clientFirestore, `users/${user.uid}`),
        {
          name: user.displayName || "Unknown",
        },
        { merge: true }
      );
    }
    if (!userData?.profilePicture && user.photoURL) {
      setDoc(
        doc(clientFirestore, `users/${user.uid}`),
        {
          profilePicture: user.photoURL,
        },
        { merge: true }
      );
    }
  }, [loadingUserData, user, userData, isVerifiedUser]);

  // Memoize the context value to prevent unnecessary re-renders
  const value = useMemo(
    () => ({ user, loading, userData, loadingUserData, isVerifiedUser }),
    [user, loading, userData, loadingUserData, isVerifiedUser]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use the auth context
export const useMemoizedAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
