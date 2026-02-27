import { useState } from "react";

const Step = ({ selected, onSelect, label, id }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => onSelect(id)}
      className={`${
        selected ? "text-white bg-blue-500" : "text-gray-500 bg-white"
      } 
      ${
        hovered && "border-blue-500"
      } cursor-pointer border-2 rounded-full h-12 w-12 flex items-center justify-center mx-auto`}
    >
      <span>{id}</span>
      <span className="text-xs">{label}</span>
    </div>
  );
};

export default Step;
