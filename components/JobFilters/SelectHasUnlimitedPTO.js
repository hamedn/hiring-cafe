import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function SelectHasUnlimitedPTO() {
  const router = useRouter();
  const [hasUnlimitedPTO, setHasUnlimitedPTO] = useState(false);

  useEffect(() => {
    const { hasUnlimitedPTO } = router.query;
    setHasUnlimitedPTO(hasUnlimitedPTO === "true" || false);
  }, [router]);

  return (
    <button
      className={`px-2 py-0.5 flex-none rounded-lg text-sm outline-none ${
        hasUnlimitedPTO
          ? "bg-purple-100 text-purple-600 shadow-inner shadow-purple-200"
          : "bg-white text-black border"
      }`}
      onClick={() => {
        const newQuery = {
          ...router.query,
        };
        const newhasUnlimitedPTO = !hasUnlimitedPTO;
        if (newhasUnlimitedPTO) {
          newQuery.hasUnlimitedPTO = "true";
        } else {
          delete newQuery.hasUnlimitedPTO;
        }
        router.replace({
          query: newQuery,
        });
      }}
    >
      Unlimited PTO
    </button>
  );
}
