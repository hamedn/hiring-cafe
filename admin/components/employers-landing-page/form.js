import HomeNavBar from "@/admin/components/HomeNavBar";
import Head from "next/head";

export default function EmployersForm() {
  return (
    <>
      <Head>
        <title>HiringCafe Employers - Get Started</title>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0"
        />
      </Head>
      <HomeNavBar />
      <div className="flex justify-center">
        <iframe
          src="https://tally.so/embed/w7x6k0"
          width="100%"
          height="100%"
          className="h-[500px] w-full md:max-w-xl m-8 p-4 border rounded-lg shadow-lg"
        />
      </div>
    </>
  );
}
