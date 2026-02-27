import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function SelectHasFourDayWorkWeek() {
  const router = useRouter();
  const [hasFourDayWorkWeek, setHasFourDayWorkWeek] = useState(false);

  useEffect(() => {
    const { hasFourDayWorkWeek } = router.query;
    setHasFourDayWorkWeek(hasFourDayWorkWeek === "true" || false);
  }, [router]);

  return (
    <button
      className={`px-2 py-0.5 flex-none rounded-lg text-sm outline-none ${
        hasFourDayWorkWeek
          ? "bg-purple-100 text-purple-600 shadow-inner shadow-purple-200"
          : "bg-white text-black border"
      }`}
      onClick={() => {
        const newQuery = {
          ...router.query,
        };
        const newhasFourDayWorkWeek = !hasFourDayWorkWeek;
        if (newhasFourDayWorkWeek) {
          newQuery.hasFourDayWorkWeek = "true";
        } else {
          delete newQuery.hasFourDayWorkWeek;
        }
        router.replace({
          query: newQuery,
        });
      }}
    >
      4-Day Work Week
    </button>
  );
}
