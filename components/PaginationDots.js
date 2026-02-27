import React from "react";
import "tailwindcss/tailwind.css";

const PaginationDots = ({
  count,
  current,
  hovering = false,
  onDotClick = () => {},
}) => {
  const getAnimationClasses = (index) => {
    if (index === current) {
      return "animate-scale";
    }
    return "";
  };

  return (
    <div className="flex justify-center space-x-2">
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className={`flex items-center justify-center transition-all duration-300 ease-in-out transform ${getAnimationClasses(
            index
          )}`}
        >
          <button
            onClick={() => {
              onDotClick(index);
            }}
            className={`rounded-full ${
              index === current
                ? `${hovering ? "bg-white" : "bg-gray-800"} w-2 h-2`
                : `${hovering ? "bg-gray-300" : "bg-gray-400"} w-1.5 h-1.5`
            } flex-none`}
          />
        </div>
      ))}
    </div>
  );
};

export default PaginationDots;
