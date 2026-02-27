import { useEffect, useState } from "react";
import { Mentions } from "antd";
import { XMarkIcon } from "@heroicons/react/20/solid";

import { useCurrentSearchFilters } from "contexts/CurrentSearchFiltersContext";
import { trackedFetch } from "@/utils/trackedFetch";
import useURLSearchStateV4, {
  URLSearchStateUpdateType,
} from "@/hooks/useURLSearchStateV4";
import Link from "next/link";
import { ArrowTopRightOnSquareIcon } from "@heroicons/react/24/outline";

const exampleQueries = [
  {
    label: "No Microsoft",
    query: `NOT (excel OR outlook OR office)`,
  },
  {
    label: "AWS or Azure",
    query: `"AWS" OR "Azure"`,
  },
  {
    label: "Modern Frontend",
    query: `"React" AND "Next.js" AND "Tailwind" AND "TypeScript"`,
  },
  {
    label: "JS Full-Stack",
    query: `("react" OR "vue") AND NOT ("django" OR "flask")`,
  },
];

const TechnologyKeywordSelectionV5 = () => {
  const { state: currentSearchState } = useCurrentSearchFilters();
  const { update } = useURLSearchStateV4();

  const [text, setText] = useState("");
  const [options, setOptions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    setText(currentSearchState.technologyKeywordsQuery || "");
  }, [currentSearchState.technologyKeywordsQuery]);

  const handleChange = (newValue) => {
    setText(newValue);
  };

  const handleSelect = (option) => {
    setText((prevValue) => prevValue.replace(`@${option.value}`, option.value));
  };

  const handleSearch = async (value) => {
    setIsLoading(true);
    try {
      // Build GET URL with query params
      const params = new URLSearchParams({
        facetType: "technology_keywords",
        query: value || "",
        size: "50",
      });
      
      const res = await trackedFetch(`/api/search-facets?${params.toString()}`);
      const data = await res.json();
      const newOptions = data.suggestions.map((item) => ({
        label: item,
        value: `"${item}"`,
      }));
      setOptions(newOptions);
    } catch (error) {
      console.error("Error fetching suggestions:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col space-y-4">
      <label htmlFor="technical-keywords" className="text-sm font-bold">
        Technical Keywords
      </label>
      {!text && (
        <div className="flex items-center space-x-2 rounded px-2 border border-gray-400">
          <span className="text-gray-500">Examples:</span>
          <div className="flex items-center space-x-2 overflow-x-auto scrollbar-hide w-full">
            {exampleQueries.map((example, index) => (
              <button
                key={index}
                className="flex-none"
                onClick={() => {
                  update({
                    type: URLSearchStateUpdateType.TECHNOLOGY_KEYWORDS_QUERY,
                    payload: example.query,
                  });
                }}
              >
                <span>
                  <span className="text-pink-600 hover:text-pink-700 hover:underline">
                    {example.label}
                  </span>
                  <span>{index < exampleQueries.length - 1 ? "," : ""}</span>
                </span>
              </button>
            ))}
          </div>
        </div>
      )}
      <div className="text-sm italic text-gray-600">
        {`Pro tip: Use "@" to search for available keywords.`}
      </div>
      <Mentions
        id="technical-keywords"
        value={text}
        onChange={handleChange}
        onSelect={handleSelect}
        onBlur={() => {
          if (text !== currentSearchState.technologyKeywordsQuery) {
            update({
              type: URLSearchStateUpdateType.TECHNOLOGY_KEYWORDS_QUERY,
              payload: text,
            });
          }
        }}
        placeholder={`Add boolean query`}
        onSearch={handleSearch}
        rows={3}
        style={{ width: "100%" }}
        options={options}
        loading={isLoading}
        allowClear={{
          clearIcon: (
            <div className="bg-gray-300 rounded-full p-0.5 hover:bg-gray-600">
              <XMarkIcon className="w-2.5 h-2.5 flex-none text-white" />
            </div>
          ),
        }}
        onClear={() => {
          update({
            type: URLSearchStateUpdateType.TECHNOLOGY_KEYWORDS_QUERY,
            payload: "",
          });
        }}
        prefix={"@"}
        split=""
      />
      <Link
        href="https://en.wikipedia.org/wiki/Full-text_search#Boolean_queries"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center space-x-1 text-sm text-gray-500 italic w-fit"
      >
        <span>How boolean queries work</span>
        <ArrowTopRightOnSquareIcon className="h-4 w-4 text-gray-500" />
      </Link>
    </div>
  );
};

export default TechnologyKeywordSelectionV5;
