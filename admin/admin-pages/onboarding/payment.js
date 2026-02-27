import PaymentDashboard from "@/admin/components/payments/PaymentDashboard";
import { withAuth } from "@/admin/components/withUserCheck";
import { useAuth } from "@/admin/hooks/useAuth";
import { useBilling } from "@/admin/hooks/useBilling";
import useJobs from "@/admin/hooks/useJobs";
import { clientFirestore } from "@/admin/lib/firebaseClient";
import { signout } from "@/admin/utils/client/signOut";
import HiringCafeLogo from "@/components/HiringCafeLogo";
import { CircularProgress } from "@chakra-ui/react";
import { doc, setDoc } from "firebase/firestore";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import Script from "next/script";
import { useState } from "react";

function PaymentPage() {
  const { loading: loadingBillingData } = useBilling();
  const { jobs } = useJobs();
  const router = useRouter();
  const [selectdPlan, setSelectedPlan] = useState(null);
  const { userData } = useAuth();

  if (loadingBillingData) {
    return (
      <div className="flex justify-center h-screen mt-16">
        <CircularProgress isIndeterminate color="gray.600" size={"30px"} />
      </div>
    );
  }

  return (
    <>
      <Script id="hs-script-loader" src="//js-na1.hs-scripts.com/23987192.js" />
      <Head>
        <title>Choose a Plan - Hiring cafe</title>
      </Head>
      <div className="min-h-screen flex items-center justify-center bg-gray-200 p-8">
        <div className="flex-auto max-w-4xl bg-white p-8 rounded-lg shadow-xl">
          <div className="flex flex-col items-center justify-center">
            <HiringCafeLogo />
            <div className="mt-16 flex flex-col">
              <span className="text-2xl">Select a Plan</span>
              <Link
                href={"/employers/pricing"}
                target="_blank"
                rel="noreferrer"
                className="text-yellow-600 font-bold text-sm w-fit mt-2"
              >
                View Pricing Details
              </Link>
              <div className="mt-8 grid grid-cols-3 gap-8">
                <button
                  onClick={() => {
                    setSelectedPlan("gold");
                    setDoc(
                      doc(clientFirestore, "boards", userData.board),
                      {
                        membership: "gold",
                      },
                      { merge: true }
                    );
                  }}
                  className={`flex flex-col rounded-lg p-4 text-center items-center hover:scale-105 transition-all ${
                    selectdPlan === "gold" ? "border-black border-2" : "border"
                  }`}
                >
                  <span className="text-xl font-bold">Employer Gold</span>
                  <span className="mt-4">
                    Enhanced Job Posting Visibility, Unlimited Talent Network
                    Standard Invites, Discounts on Add-Ons, and more
                  </span>
                </button>
                <button
                  onClick={() => {
                    setSelectedPlan("plus");
                    setDoc(
                      doc(clientFirestore, "boards", userData.board),
                      {
                        membership: "plus",
                      },
                      { merge: true }
                    );
                  }}
                  className={`flex flex-col rounded-lg p-4 text-center items-center hover:scale-105 transition-all ${
                    selectdPlan === "plus" ? "border-black border-2" : "border"
                  }`}
                >
                  <span className="text-xl font-bold">Employer Plus</span>
                  <span className="mt-4">
                    Free Job Postings, Unlimited Talent Network Access, Limited
                    Standard Invites
                  </span>
                </button>
                <button
                  onClick={() => {
                    setSelectedPlan("starter");
                    setDoc(
                      doc(clientFirestore, "boards", userData.board),
                      {
                        membership: "starter",
                      },
                      { merge: true }
                    );
                  }}
                  className={`flex flex-col rounded-lg p-4 text-center items-center hover:scale-105 transition-all ${
                    selectdPlan === "starter"
                      ? "border-black border-2"
                      : "border"
                  }`}
                >
                  <span className="text-xl font-bold">Employer Starter</span>
                  <span className="mt-4">
                    Only Free Job Posting, Purchase Add-ons Anytime
                  </span>
                </button>
              </div>
            </div>
            <div className="mt-16 w-full flex flex-col">
              <span className="text-sm bg-yellow-100 p-3 mb-8 w-fit rounded">
                You must add a payment method to continue. This helps us reduce
                spam. Final charges will be based on your plan selection and
                usage. You will receive notifications before any charges are
                made.
              </span>
              <PaymentDashboard />
            </div>
          </div>
          <div className="flex justify-between items-center space-x-8 mt-16">
            <button
              className="text-red-600 text-sm font-medium"
              onClick={() => {
                signout();
                router.reload();
              }}
            >
              Log out
            </button>
            <button
              disabled={!selectdPlan}
              onClick={() => {
                if (jobs?.length === 1) {
                  router.push({
                    pathname: `/admin/post-a-job/${jobs[0].id}`,
                  });
                } else {
                  router.push({
                    pathname: `/admin`,
                  });
                }
              }}
              className={`bg-yellow-600 text-white rounded-lg p-2 px-4 font-extrabold ${
                !selectdPlan ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default withAuth(PaymentPage);
