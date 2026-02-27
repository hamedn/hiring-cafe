import { useJobFiltersCount } from "@/hooks/useJobFiltersCount";
import { AdjustmentsHorizontalIcon } from "@heroicons/react/24/outline";

export default function FilterButton({ onClick }) {
  const { numFilters } = useJobFiltersCount();

  return (
    <button
      className={`relative border md:border-2 rounded-xl p-2 ${
        numFilters > 0 && "border-black"
      }`}
      onClick={onClick}
    >
      <div className="flex items-center space-x-2 text-xs md:text-sm font-medium">
        <AdjustmentsHorizontalIcon className="h-5 w-5 flex-none" />
        <span className="hidden md:block">Filters</span>
      </div>
      <span
        className={`${
          numFilters > 0 ? "block" : "hidden"
        } absolute -top-2 -right-2 font-medium bg-black text-white rounded-full px-2 py-1 text-xs`}
      >
        {numFilters}
      </span>
    </button>
  );
}
