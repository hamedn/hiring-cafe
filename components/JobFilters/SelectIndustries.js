import { industries } from "@/utils/constants";
import { XMarkIcon } from "@heroicons/react/20/solid";
import { useRouter } from "next/router";

export default function SelectIndustries({
  selectedIndustries,
  toggleIndustrySelection,
}) {
  const router = useRouter();

  return (
    <div className="flex-auto flex items-center justify-center overflow-hidden space-x-2">
      {selectedIndustries.length ? (
        <div className="relative p-1">
          <button
            onClick={() => {
              const { selectedIndustries, ...routerQuery } = router.query;
              router.replace({
                query: routerQuery,
              });
            }}
          >
            <XMarkIcon className="h-7 w-7 flex-none text-red-600" />
            <div className="absolute top-0 right-0 bg-black rounded-full text-xs">
              <span className="px-1 text-white">
                {selectedIndustries.length}
              </span>
            </div>
          </button>
        </div>
      ) : null}
      <div className="flex space-x-2 md:space-x-4 overflow-x-scroll hide-scrollbar">
        {industries.map((industry) => (
          <button
            key={industry.name}
            onClick={() => toggleIndustrySelection(industry.name)}
            className={`flex flex-none border items-center space-x-2 p-2 rounded-full text-xs ${
              selectedIndustries.includes(industry.name)
                ? "font-medium border-black text-black"
                : "text-gray-600 text-opacity-80 border-gray-300"
            }`}
          >
            <industry.icon className="w-4 h-4" />
            <span>{industry.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
