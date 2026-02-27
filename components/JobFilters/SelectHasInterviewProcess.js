import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function SelectHasInterviewProcess() {
  const router = useRouter();
  const [hasInterviewProcess, setHasInterviewProcess] = useState(false);

  useEffect(() => {
    const { hasInterviewProcess } = router.query;
    setHasInterviewProcess(hasInterviewProcess === "true" || false);
  }, [router]);

  return (
    <button
      className={`px-2 py-0.5 flex-none rounded-lg text-sm outline-none ${
        hasInterviewProcess
          ? "bg-purple-100 text-purple-600 shadow-inner shadow-purple-200"
          : "bg-white text-black border"
      }`}
      onClick={() => {
        const newQuery = {
          ...router.query,
        };
        const newHasInterviewProcess = !hasInterviewProcess;
        if (newHasInterviewProcess) {
          newQuery.hasInterviewProcess = "true";
        } else {
          delete newQuery.hasInterviewProcess;
        }
        router.replace({
          query: newQuery,
        });
      }}
    >
      Has Interview Process
    </button>
  );
}
