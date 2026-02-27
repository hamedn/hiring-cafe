import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function SelectHasCompanyVideoPitch() {
  const router = useRouter();
  const [hasCompanyVideoPitch, setHasCompanyVideoPitch] = useState(false);

  useEffect(() => {
    const { hasCompanyVideoPitch } = router.query;
    setHasCompanyVideoPitch(hasCompanyVideoPitch === "true" || false);
  }, [router]);

  return (
    <button
      className={`px-2 py-0.5 flex-none rounded-lg text-sm outline-none ${
        hasCompanyVideoPitch
          ? "bg-purple-100 text-purple-600 shadow-inner shadow-purple-200"
          : "bg-white text-black border"
      }`}
      onClick={() => {
        const newQuery = {
          ...router.query,
        };
        const newhasCompanyVideoPitch = !hasCompanyVideoPitch;
        if (newhasCompanyVideoPitch) {
          newQuery.hasCompanyVideoPitch = "true";
        } else {
          delete newQuery.hasCompanyVideoPitch;
        }
        router.replace({
          query: newQuery,
        });
      }}
    >
      Employee Videos
    </button>
  );
}
