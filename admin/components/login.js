import { useAuth as adminClientAuth } from "@/admin/hooks/useAuth";
import { clientAuth } from "@/admin/lib/firebaseClient";
import HiringCafeEmployersLogo from "@/components/HiringCafeEmployersLogo";
import HiringCafeLogo from "@/components/HiringCafeLogo";
import { CircularProgress } from "@chakra-ui/react";
import { GoogleAuthProvider, EmailAuthProvider } from "firebase/auth";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function Login() {
  const { user, loadingUser } = adminClientAuth();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.replace("/admin");
    }
  }, [user, router]);

  useEffect(() => {
    if (loadingUser) {
      return;
    }
    const loadFirebaseUI = async () => {
      const firebaseui = await import("firebaseui");
      await import("firebaseui/dist/firebaseui.css");

      const uiConfig = {
        signInSuccessUrl: "/admin",
        signInFlow: "popup",
        signInOptions: [
          {
            provider: EmailAuthProvider.PROVIDER_ID,
            signInMethod: EmailAuthProvider.EMAIL_LINK_SIGN_IN_METHOD,
            fullLabel: "Continue with Email",
          },
          {
            provider: GoogleAuthProvider.PROVIDER_ID,
            fullLabel: "Continue with Google",
          },
          {
            provider: "microsoft.com",
            loginHintKey: "login_hint",
            fullLabel: "Continue with Microsoft",
          },
        ],
      };

      var ui =
        firebaseui.auth.AuthUI.getInstance() ||
        new firebaseui.auth.AuthUI(clientAuth);

      if (user) {
        ui.reset();
      } else {
        ui.start("#firebaseui-auth-container", uiConfig);
      }
    };

    if (typeof window !== "undefined") {
      loadFirebaseUI();
    }
  }, [loadingUser, user]);

  if (loadingUser) {
    return (
      <div className="flex flex-auto w-full justify-center my-8">
        <CircularProgress isIndeterminate color="black" size={"24px"} />
      </div>
    );
  }

  return (
    <div className="flex justify-center h-screen">
      <div className="flex flex-col text-center items-center flex-auto sm:max-w-md m-10">
        <HiringCafeEmployersLogo />
        <div className="flex flex-col border p-4 rounded-xl bg-gray-50 shadow-md items-center text-center mt-8 text-black">
          <span className="font-extrabold text-gray-600 text-lg">
            Employers
          </span>
          {/* <span className="mt-8 font-semibold text-lg">
            Ready to take the next step?
          </span> */}
          {/* <span className="mt-2">Create an account or sign in.</span> */}
          <span className="text-xs mt-4">{`By creating an account or logging in, you understand and agree to Hiring Cafe's Terms. You also acknowledge our Cookie and Privacy policies.`}</span>
          <span className="mt-8 font-bold">
            Select an option below and use your work email.
          </span>
          <div className="my-4" id="firebaseui-auth-container" />
        </div>
        <Link href="/" className="mt-4 font-bold underline">
          Are you a job seeker?
        </Link>
      </div>
    </div>
  );
}
