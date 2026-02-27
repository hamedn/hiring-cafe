import { CircularProgress, useToast } from "@chakra-ui/react";
import useInvites from "../hooks/invites/useInvites";
import { useAuth } from "../hooks/useAuth";
import { ArrowRightOnRectangleIcon } from "@heroicons/react/24/outline";
import HiringCafeLogo from "@/components/HiringCafeLogo";
import Script from "next/script";
import Head from "next/head";
import { signout } from "../utils/client/signOut";
import axios from "axios";
import { useState } from "react";
import { useRouter } from "next/router";

export default function AcceptInvites() {
  const { userInvites, loadingInvites } = useInvites();
  const { loadingUserData } = useAuth();
  const [acceptingInvite, setAcceptingInvite] = useState(false);
  const router = useRouter();
  const toast = useToast();

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
        <meta name="robots" content="noindex"></meta>
      </Head>
      <Script id="hs-script-loader" src="//js-na1.hs-scripts.com/23987192.js" />
      <div className="flex justify-center">
        <div className="flex flex-col flex-auto items-center max-w-xl m-16">
          <HiringCafeLogo />
          <div className="flex flex-col w-full mt-16">
            {acceptingInvite ? (
              <div className="flex justify-center">
                <CircularProgress isIndeterminate size={"24px"} color="black" />
              </div>
            ) : (
              userInvites.map((invite) => (
                <div
                  className="flex items-center justify-between space-x-4 border p-4 rounded w-full"
                  key={invite.id}
                >
                  <div className="flex flex-col">
                    <span className="text-lg font-bold text-gray-600">
                      {invite.title}
                    </span>
                    <span className="mt-1 text-sm font-light">
                      Invited by {invite.inviter_name} on{" "}
                      {invite.last_sent.toDate().toLocaleDateString()}
                    </span>
                  </div>
                  <button
                    disabled={acceptingInvite}
                    className="bg-black rounded py-1 px-4 text-white"
                    onClick={async () => {
                      setAcceptingInvite(true);
                      try {
                        const { data } = await axios.post(
                          "/api/admin/board/acceptInvite",
                          {
                            invite_token: invite.id,
                          }
                        );
                        if (data.status === "Success") {
                          toast({
                            title: "Success",
                            description:
                              "You have successfully accepted the invite.",
                            status: "success",
                            duration: 5000,
                            isClosable: true,
                          });
                          router.replace("/admin");
                        }
                      } catch (error) {
                        console.trace(error.message);
                        toast({
                          title: "Error",
                          description:
                            "There was an error accepting the invite.",
                          status: "error",
                          duration: 5000,
                          isClosable: true,
                        });
                      } finally {
                        setAcceptingInvite(false);
                      }
                    }}
                  >
                    Accept Invite
                  </button>
                </div>
              ))
            )}
          </div>
          <div className="mt-16">
            <button
              onClick={() => {
                signout();
              }}
              className="flex items-center space-x-2 text-red-600 text-sm"
            >
              <ArrowRightOnRectangleIcon className="h-4 w-4" />
              <span>Log Out</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
