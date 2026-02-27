import { MagnifyingGlassIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { useState } from "react";

export default function SearchBar({ setQuery }) {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div
      className={`flex items-center bg-white ${
        searchTerm ? "border-2 border-black" : "border"
      } rounded-md shadow-sm font-medium focus-within:border-black focus-within:ring focus-within:ring-gray-200 focus-within:ring-opacity-50 text-sm `}
    >
      <MagnifyingGlassIcon className="h-5 w-5 text-gray-500 ml-4" />
      <input
        className="grow ml-1 p-2 outline-none text-sm md:text-base placeholder:text-sm placeholder:md:text-base rounded-md"
        type="text"
        placeholder="Search keywords"
        value={searchTerm}
        onChange={(e) => {
          setSearchTerm(e.target.value);
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            setQuery(searchTerm);
          }
        }}
      />
      {searchTerm && (
        <XMarkIcon
          className="h-5 w-5 text-gray-500 cursor-pointer mx-4"
          onClick={() => {
            setSearchTerm("");
            setQuery("");
          }}
        />
      )}
    </div>
  );
}
