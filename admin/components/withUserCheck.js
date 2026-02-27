import { useRouter } from "next/router";
import { useAuth } from "@/admin/hooks/useAuth";
import { useEffect } from "react";
import { CircularProgress } from "@chakra-ui/react";
import Head from "next/head";
import { useBilling } from "../hooks/useBilling";
import useBoard from "../hooks/useBoard";

const withAuth = (WrappedComponent) => {
  const Component = (props) => {
    const { user, loadingUser, loadingUserData } = useAuth();
    const router = useRouter();

    useEffect(() => {
      if (!user && !loadingUser) {
        router.push({
          pathname: `/employers`,
        });
      }
    }, [user, router, loadingUser]);

    if (loadingUser || loadingUserData) {
      return (
        <>
          <Head>
            <title>{"Admin - Hiring Cafe"}</title>
          </Head>
          <div className="flex justify-center h-screen mt-16">
            <CircularProgress isIndeterminate color="gray.600" size={"30px"} />
          </div>
        </>
      );
    }

    return <>{user && <WrappedComponent {...props} />}</>;
  };
  return Component;
};

export const usePaymentGuard = () => {
  const { billingData, loading: loadingBillingData } = useBilling();
  const { userData } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (
      !loadingBillingData &&
      userData?.board &&
      !billingData?.default_payment
    ) {
      router.push({
        pathname: `/admin/onboarding/payment`,
      });
    }
  }, [billingData, loadingBillingData, router, userData]);
};

export const useMembershipSelectionGuard = () => {
  const router = useRouter();
  const { userData } = useAuth();
  const { board } = useBoard({ board_id: userData?.board });

  useEffect(() => {
    if (board && !board.membership) {
      router.push({
        pathname: `/admin/onboarding/payment`,
      });
    }
  }, [board, router, userData]);
};

const withBoard = (WrappedComponent) => {
  const Component = (props) => {
    const { user, loadingUser, userData } = useAuth();
    const router = useRouter();
    useMembershipSelectionGuard();
    usePaymentGuard();

    useEffect(() => {
      if (!user && !loadingUser) {
        router.push("/employers");
      }
    }, [user, router, loadingUser]);

    useEffect(() => {
      if (userData && !userData.board) {
        router.push({
          pathname: `/admin/onboarding`,
        });
      }
    }, [router, userData]);

    if (!userData?.board) {
      return (
        <>
          <Head>
            <title>{"Admin - Hiring Cafe"}</title>
          </Head>
          <div className="flex justify-center h-screen mt-16">
            <CircularProgress isIndeterminate color="gray.600" size={"30px"} />
          </div>
        </>
      );
    }

    return <>{userData?.board && <WrappedComponent {...props} />}</>;
  };
  return Component;
};

export { withAuth, withBoard };
