import { industries } from "@/utils/constants";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function SelectIndustriesV3() {
  const router = useRouter();
  const [selectedIndustries, setSelectedIndustries] = useState([]);

  useEffect(() => {
    const { selectedIndustries } = router.query;
    if (selectedIndustries) {
      const industriesToSet = selectedIndustries.split("~");
      setSelectedIndustries(industriesToSet);
    } else {
      setSelectedIndustries([]);
    }
  }, [router]);

  function toggleIndustrySelection(industry) {
    const selectedIndustriesSet = new Set(selectedIndustries);
    if (selectedIndustriesSet.has(industry)) {
      selectedIndustriesSet.delete(industry);
    } else {
      selectedIndustriesSet.add(industry);
    }
    const newIndustries = Array.from(selectedIndustriesSet);
    const newQuery = { ...router.query };
    if (newIndustries.length > 0) {
      newQuery.selectedIndustries = newIndustries.join("~");
    } else {
      delete newQuery.selectedIndustries;
    }
    router.replace({
      query: newQuery,
    });
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {industries.map((industry) => (
        <button
          key={industry.name}
          onClick={() => toggleIndustrySelection(industry.name)}
          className={`flex border items-center flex-none space-x-2 py-1 md:py-2 px-4 rounded-full text-xs ${
            selectedIndustries.includes(industry.name)
              ? "bg-gray-500 text-white shadow-inner shadow-gray-600"
              : "text-gray-600 text-opacity-80 border-gray-300 hover:border-black hover:text-black"
          }`}
        >
          <industry.icon className="w-4 h-4 flex-none hidden md:block" />
          <span className="truncate">{industry.name}</span>
        </button>
      ))}
    </div>
  );
}
