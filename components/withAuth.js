import { useRouter } from "next/router";
import { useAuth } from "@/hooks/useAuth";
import { useEffect } from "react";
import { CircularProgress } from "@chakra-ui/react";

const withAuth = (WrappedComponent) => {
  const AuthComponent = (props) => {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
      if (!user && !loading) {
        router.replace("/auth");
      }
    }, [user, router, loading]);

    if (loading) {
      return (
        <div className="flex justify-center h-screen mt-16">
          <CircularProgress isIndeterminate size={"24px"} color="black" />
        </div>
      );
    }

    return <>{user && <WrappedComponent {...props} />}</>;
  };

  return AuthComponent;
};

export default withAuth;
