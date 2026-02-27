import { ReachOutOptionsInfo } from "@/admin/utils/constants";
import { BoltIcon as BoltIconSolid } from "@heroicons/react/20/solid";
import { BoltIcon, CheckIcon } from "@heroicons/react/24/outline";
import { useState } from "react";

export default function ReachOutOptions({ onReachoutOptionSelect }) {
  const [selectedOption, setSelectedOption] = useState(0);

  return (
    <div className="flex justify-center">
      <div className="flex flex-col flex-auto">
        <span className="text-sm">
          {ReachOutOptionsInfo[selectedOption].name === "standard"
            ? "Invite them to your job and access their full resume & contact info after they accept your request."
            : "Found a strong candidate? Grab their attention right away!"}
        </span>
        <div className="flex items-center border justify-evenly text-center rounded-xl mt-4">
          {ReachOutOptionsInfo.map((option, index) => (
            <button
              key={option.name}
              className={`flex items-center justify-center px-4 text-center space-x-2 py-2 w-full ${
                index === selectedOption
                  ? index === 1
                    ? "bg-yellow-600 text-white font-medium rounded-xl"
                    : "bg-gray-200 text-black font-medium rounded-xl"
                  : index === 1 && "text-yellow-600 font-medium"
              }`}
              onClick={() => {
                setSelectedOption(index);
                onReachoutOptionSelect(ReachOutOptionsInfo[index].name);
              }}
            >
              {option.name === "turbo" &&
                (index === selectedOption ? (
                  <BoltIconSolid className="h-4 w-4 flex-none" />
                ) : (
                  <BoltIcon className="h-4 w-4 flex-none" />
                ))}
              <span className="text-center">{option.title}</span>
            </button>
          ))}
        </div>
        <div className={`flex flex-col space-y-1 mt-4`}>
          {ReachOutOptionsInfo[selectedOption].benefits.map((benefit) => (
            <div key={benefit} className={`flex items-center space-x-2`}>
              <CheckIcon className="w-4 h-4 flex-none" />
              <span>{benefit}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
