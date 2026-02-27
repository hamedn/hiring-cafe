import { ChevronDownIcon } from "@heroicons/react/24/outline";

export const FilterButton = (props) => {
  return (
    <div
      className={`flex items-center space-x-4 text-xs ${
        props.count
          ? "border-2 border-black font-bold"
          : "border border-gray-300 font-medium"
      } px-2 py-2 rounded-xl`}
    >
      <div className={`flex items-center space-x-2 flex-none`}>
        {props.label_icon && (
          <props.label_icon className="h-4 w-4 flex-none text-gray-500" />
        )}
        <span className="">{props.label}</span>
        {props.count && !props.hideCount && <span>({props.count})</span>}
      </div>
      <ChevronDownIcon className="h-4 w-4 flex-none text-gray-500" />
    </div>
  );
};
