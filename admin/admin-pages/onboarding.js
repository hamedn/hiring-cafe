import AcceptInvites from "@/admin/components/AcceptInvites";
import CreateBoard from "@/admin/components/createBoard";
import { withAuth } from "@/admin/components/withUserCheck";
import { useAuth } from "@/admin/hooks/useAuth";
import useInvites from "@/admin/hooks/invites/useInvites";
import { CircularProgress } from "@chakra-ui/react";
import Head from "next/head";

const Onboarding = () => {
  const { userInvites, loadingInvites } = useInvites();
  const { userData, loadingUserData } = useAuth();

  if (loadingInvites || loadingUserData)
    return (
      <div className="flex justify-center mt-16">
        <CircularProgress isIndeterminate size={"24px"} color="black" />
      </div>
    );

  return (
    <>
      <Head>
        <title>{"Onboarding - HiringCafe"}</title>
      </Head>
      {userInvites.length && !userData.board ? (
        <AcceptInvites />
      ) : (
        <CreateBoard />
      )}
    </>
  );
};

export default withAuth(Onboarding);
