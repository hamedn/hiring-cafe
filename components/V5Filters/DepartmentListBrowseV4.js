import useURLSearchStateV4, {
  URLSearchStateUpdateType,
} from "@/hooks/useURLSearchStateV4";
import { useCurrentSearchFilters } from "contexts/CurrentSearchFiltersContext";

export default function DepartmentListBrowseV4() {
  const { update } = useURLSearchStateV4();
  const { state: currentSearchState } = useCurrentSearchFilters();

  if (currentSearchState.departments?.length > 0) {
    return null;
  }

  return (
    <div className="flex items-center space-x-2 md:space-x-3 text-xs text-gray-500 mb-4 overflow-x-auto scrollbar-hide mx-4 md:mx-8 xl:mx-16">
      {[
        {
          label: "Software Development",
          value: {
            type: URLSearchStateUpdateType.DEPARTMENTS,
            payload: ["Software Engineering", "Software Development"],
          },
        },
        {
          label: "Hardware Engineering",
          value: {
            type: URLSearchStateUpdateType.DEPARTMENTS,
            payload: ["Hardware Engineering"],
          },
        },
        {
          label: "Marketing",
          value: {
            type: URLSearchStateUpdateType.DEPARTMENTS,
            payload: ["Marketing"],
          },
        },
        {
          label: "Sales",
          value: {
            type: URLSearchStateUpdateType.DEPARTMENTS,
            payload: ["Sales"],
          },
        },
        {
          label: "Design",
          value: {
            type: URLSearchStateUpdateType.DEPARTMENTS,
            payload: ["Design"],
          },
        },
        {
          label: "Product Management",
          value: {
            type: URLSearchStateUpdateType.DEPARTMENTS,
            payload: ["Product Management"],
          },
        },
        {
          label: "Program and Project Management",
          value: {
            type: URLSearchStateUpdateType.DEPARTMENTS,
            payload: ["Program and Project Management"],
          },
        },
        {
          label: "Customer Support",
          value: {
            type: URLSearchStateUpdateType.DEPARTMENTS,
            payload: ["Customer Support"],
          },
        },
        {
          label: "Business Operations",
          value: {
            type: URLSearchStateUpdateType.DEPARTMENTS,
            payload: ["Business Operations"],
          },
        },
        {
          label: "Recruiting & HR",
          value: {
            type: URLSearchStateUpdateType.DEPARTMENTS,
            payload: ["Recruiting & HR"],
          },
        },
        {
          label: "Accounting and Finance",
          value: {
            type: URLSearchStateUpdateType.DEPARTMENTS,
            payload: ["Accounting and Finance"],
          },
        },
        {
          label: "Legal and Compliance",
          value: {
            type: URLSearchStateUpdateType.DEPARTMENTS,
            payload: ["Legal and Compliance"],
          },
        },
        {
          label: "Research",
          value: {
            type: URLSearchStateUpdateType.DEPARTMENTS,
            payload: ["Research"],
          },
        },
        {
          label: "Construction Skilled Trades",
          value: {
            type: URLSearchStateUpdateType.DEPARTMENTS,
            payload: ["Construction Skilled Trades"],
          },
        },
        {
          label: "Manufacturing Skilled Trades",
          value: {
            type: URLSearchStateUpdateType.DEPARTMENTS,
            payload: ["Manufacturing Skilled Trades"],
          },
        },
        {
          label: "Transportation and Logistics Skilled Trades",
          value: {
            type: URLSearchStateUpdateType.DEPARTMENTS,
            payload: ["Transportation and Logistics Skilled Trades"],
          },
        },
        {
          label: "Maintenance and Repair Skilled Trades",
          value: {
            type: URLSearchStateUpdateType.DEPARTMENTS,
            payload: ["Maintenance and Repair Skilled Trades"],
          },
        },
        {
          label: "Administrative Services",
          value: {
            type: URLSearchStateUpdateType.DEPARTMENTS,
            payload: ["Administrative Services"],
          },
        },
        {
          label: "Healthcare Services",
          value: {
            type: URLSearchStateUpdateType.DEPARTMENTS,
            payload: ["Healthcare Services"],
          },
        },
        {
          label: "Education Services",
          value: {
            type: URLSearchStateUpdateType.DEPARTMENTS,
            payload: ["Education Services"],
          },
        },
        {
          label: "Public Safety Services",
          value: {
            type: URLSearchStateUpdateType.DEPARTMENTS,
            payload: ["Public Safety Services"],
          },
        },
        {
          label: "Food and Beverage Services",
          value: {
            type: URLSearchStateUpdateType.DEPARTMENTS,
            payload: ["Food and Beverage Services"],
          },
        },
        {
          label: "Retail Services",
          value: {
            type: URLSearchStateUpdateType.DEPARTMENTS,
            payload: ["Retail Services"],
          },
        },
        {
          label: "Personal Care Services",
          value: {
            type: URLSearchStateUpdateType.DEPARTMENTS,
            payload: ["Personal Care Services"],
          },
        },
        {
          label: "Operations Management",
          value: {
            type: URLSearchStateUpdateType.DEPARTMENTS,
            payload: ["Operations Management"],
          },
        },
      ].map((item) => (
        <button
          onClick={() => {
            update(item.value);
          }}
          key={item.label}
          className="p-3 rounded flex-none bg-gray-100 font-bold border border-gray-300"
        >
          {item.label}
        </button>
      ))}
    </div>
  );
}
