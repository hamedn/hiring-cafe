import { Tooltip } from "@chakra-ui/react";
import { useEffect, useState } from "react";

const randomGradients = [
  // Linear Gradients
  "bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500",
  "bg-pink-600 bg-opacity-30",
  "bg-gradient-to-bl from-blue-400 via-blue-300 to-teal-500",
  "bg-gradient-to-br from-purple-400 via-pink-500 to-orange-400",
  "bg-black bg-opacity-30",
  "bg-blue-900 shadow-inner shadow-blue-300 bg-opacity-60",
  "bg-gradient-to-t from-green-400 via-green-300 to-green-200",
  "bg-gradient-to-l from-blue-500 via-blue-400 to-blue-300",
  "bg-blue-600 bg-opacity-30",
  "bg-gradient-to-r from-yellow-500 via-yellow-400 to-yellow-300",
  "bg-orange-600 bg-opacity-30",
  "bg-green-600 bg-opacity-30",
  "bg-gradient-to-t from-green-500 via-green-400 to-green-300",
  "bg-purple-600 bg-opacity-30",
  "bg-gray-900 shadow-inner shadow-black bg-opacity-50",
];

export default function Comment({ comment }) {
  const [randomGradientIndex, setRandomGradientIndex] = useState(0);
  useEffect(() => {
    // Random number between 0 and num randomGradients.length
    setRandomGradientIndex(Math.floor(Math.random() * randomGradients.length));
  }, []);

  return (
    <div className="flex space-x-3 w-full">
      <Tooltip label="User" aria-label="User">
        <div
          className={`h-7 w-7 flex-none ${randomGradients[randomGradientIndex]} rounded-full`}
        />
      </Tooltip>
      <span className="text-large font-bold h-full">
        {new Date(comment.timestamp).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })}{" "}
        <span className="text-normal text-black font-normal">
          {" "}
          {comment.commentText}
        </span>
      </span>
    </div>
  );
}
