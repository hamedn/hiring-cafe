import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function SelectDatePosted() {
  const router = useRouter();
  const [datePosted, setDatePosted] = useState(null);

  useEffect(() => {
    const { realDate } = router.query;
    setDatePosted(realDate);
  }, [router]);

  const options = [
    { label: "Any", value: null },
    { label: "Past 3 months", value: "pastThreeMonths" },
    { label: "Past 2 months", value: "pastTwoMonths" },
    { label: "Past week", value: "pastWeek" },
    { label: "Past 3 days", value: "pastThreeDays" },
    { label: "Past 24 hours", value: "pastDay" },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-4">
      {options.map((option, index) => {
        return (
          <button
            key={index}
            className={`p-1 flex-none rounded-full hover:border-black outline-none text-sm
            ${
              option.value === datePosted || (!option.value && !datePosted)
                ? "bg-gray-500 text-white shadow-inner shadow-gray-600"
                : "bg-white text-black border"
            }
            `}
            onClick={() => {
              const newQuery = {
                ...router.query,
              };
              if (option.value) {
                newQuery.realDate = option.value;
              } else {
                delete newQuery.realDate;
              }
              router.replace({
                query: newQuery,
              });
            }}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
