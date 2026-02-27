import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Head from "next/head";
import { CircularProgress } from "@chakra-ui/react";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import SearchNavBar from "@/components/SearchNavBar";
import BottomTabs from "@/components/BottomTabs";
import HiringCafeLogo from "@/components/HiringCafeLogo";

export default function PreferenceUnsubscribe({ apiBase, successMessage }) {
  const router = useRouter();
  const { token } = router.query;
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    const unsubscribe = async () => {
      if (!token) return;
      try {
        const res = await fetch(`${apiBase}/${token}`, { method: "POST" });
        if (res.ok) setStatus("success");
        else setStatus("error");
      } catch {
        setStatus("error");
      }
    };
    unsubscribe();
  }, [token, apiBase]);

  if (status === "loading") {
    return (
      <div className="flex justify-center m-16">
        <CircularProgress isIndeterminate color="yellow.600" size="30px" />
      </div>
    );
  }

  if (status === "success") {
    return (
      <>
        <Head>
          <title>Unsubscribed - HiringCafe</title>
          <meta name="robots" content="noindex" />
        </Head>
        <div className="hidden lg:block py-2 sticky top-0 bg-white z-20">
          <SearchNavBar />
        </div>
        <div className="lg:hidden p-4">
          <HiringCafeLogo />
        </div>
        <div className="flex justify-center m-16">
          <div className="flex flex-col min-h-screen">
            <div className="rounded-lg border border-green-200 bg-green-50 p-4 text-sm text-green-700">
              {successMessage}
            </div>
          </div>
        </div>
        <BottomTabs />
      </>
    );
  }

  return (
    <>
      <Head>
        <title>Invalid Link - HiringCafe</title>
        <meta name="robots" content="noindex" />
      </Head>
      <div className="hidden lg:block py-2 sticky top-0 bg-white z-20">
        <SearchNavBar />
      </div>
      <div className="lg:hidden p-4">
        <HiringCafeLogo />
      </div>
      <div className="flex justify-center">
        <div className="flex flex-col items-center m-16 min-h-screen">
          <div className="flex flex-col items-center text-center">
            <ExclamationTriangleIcon className="h-12 w-12 text-yellow-600" />
            <span className="font-medium mt-4">Invalid or expired link.</span>
          </div>
        </div>
      </div>
      <BottomTabs />
    </>
  );
}
