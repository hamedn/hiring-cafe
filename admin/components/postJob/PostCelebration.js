import Head from "next/head";
import CongratsAnimation from "@/animations/congrats.json";
import LottieAnimation from "@/components/lottieAnimation";
import useJob from "@/admin/hooks/useJob";
import Link from "next/link";
import { HomeIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/router";

const PostCelebration = () => {
  const router = useRouter();
  const [jobID] = router.query.slug;
  const { job } = useJob({ job_id: jobID });

  if (!jobID || !job) return null;

  return (
    <>
      <Head>
        <title>{"Congrats on Posting - Hiring Cafe"}</title>
      </Head>
      <div className="flex justify-center p-4">
        <div className="flex flex-col text-center items-center flex-auto max-w-5xl">
          <LottieAnimation
            width="100%"
            height="200px"
            animationData={CongratsAnimation}
          />
          <span className="mt-8 text-5xl font-medium">
            Your job has been created!
          </span>
          <span className="mt-8 text-3xl text-light">{`You can now post your job and invite candidates on HiringCafe.`}</span>
          <Link
            href={"/admin"}
            className="mt-16 border border-black text-black p-4 rounded-lg font-medium hover:bg-black hover:text-white transition-all duration-300 ease-in-out"
          >
            <div className="flex justify-center items-center space-x-4 text-2xl">
              <HomeIcon className="flex-none h-8 w-8" />
              <span>{"Go to dashboard"}</span>
            </div>
          </Link>
        </div>
      </div>
    </>
  );
};

export default PostCelebration;
