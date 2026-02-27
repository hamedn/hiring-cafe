import { XMarkIcon } from "@heroicons/react/20/solid";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function SelectQuery() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const currentPage = router.pathname;

  useEffect(() => {
    const querySearchTerm = router.query.searchQuery || "";
    setSearchTerm(querySearchTerm || "");
  }, [router]);

  const onKeyDown = (e) => {
    if (e.key === "Enter") {
      if (currentPage !== "/") {
        router.push({
          pathname: "/",
          query: { searchQuery: searchTerm },
        });
        return;
      }
      if (searchTerm) {
        const { ...query } = router.query;
        router.replace({
          query: { ...query, searchQuery: searchTerm },
        });
      } else {
        const { searchQuery, restrictByTitle, ...routerQuery } = router.query;
        router.replace({
          query: { ...routerQuery },
        });
      }
      const queryToSave = router.query || {};
      if (searchTerm) {
        queryToSave.searchQuery = searchTerm || null;
      } else {
        delete queryToSave.searchQuery;
      }
      e.target?.blur();
    }
  };

  return (
    <div
      className={`flex items-center bg-gray-100 w-full rounded-xl focus-within:border-black border border-white`}
    >
      <MagnifyingGlassIcon className="ml-3 h-5 w-5 flex-none text-gray-500" />
      <input
        className="mx-3 my-2 w-full outline-none placeholder:text-sm placeholder:text-gray-500 placeholder:lg:text-base bg-gray-100 font-medium"
        type="text"
        placeholder="Job title, requirements, and/or tech"
        value={searchTerm}
        onBlur={() => {
          onKeyDown({ key: "Enter" });
        }}
        onChange={(e) => {
          setSearchTerm(e.target.value);
        }}
        onKeyDown={onKeyDown}
      />
      {searchTerm && (
        <button
          onClick={() => {
            const { searchQuery, restrictByTitle, ...routerQuery } =
              router.query;
            router.replace({
              query: { ...routerQuery },
            });
          }}
          className="hover:bg-gray-300 rounded-full p-2"
        >
          <XMarkIcon className="h-4 w-4 md:h-5 md:w-5 flex-none p-0.5 bg-black text-white rounded-full" />
        </button>
      )}
    </div>
  );
}
