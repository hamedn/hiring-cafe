import { useEffect, useState } from "react";
import useURLSearchStateV4, {
  URLSearchStateUpdateType,
} from "@/hooks/useURLSearchStateV4";
import { useCurrentSearchFilters } from "@/contexts/CurrentSearchFiltersContext";
import { ArrowTopRightOnSquareIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { Mentions } from "antd";
import { trackedFetch } from "@/utils/trackedFetch";

const exampleQueries = [
  {
    label: "Strategy & Operations",
    query: `("strategy" AND ("operations" OR "transformation") OR ("business strategy" OR "business planning"))`,
  },
  {
    label: "Nurse Practitioner",
    query: `("nurse practitioner" OR "advanced practice nurse") AND NOT "registered nurse"`,
  },
  {
    label: "Data Scientist",
    query: `("data scientist" OR ("machine learning" AND (engineer OR scientist))) AND NOT "data analyst"`,
  },
  {
    label: "Construction Project Manager",
    query: `(construction AND ("project manager" OR "site manager"))`,
  },
  {
    label: "iOS Developer",
    query: `(ios AND (developer OR engineer)) AND NOT android`,
  },
  {
    label: "Human Resources Generalist",
    query: `("human resources" OR "hr") AND generalist`,
  },
  {
    label: "Elementary School Teacher",
    query: `("elementary school" AND teacher) AND NOT ("high school" OR "middle school")`,
  },
  {
    label: "Restaurant Manager",
    query: `("restaurant manager" OR "food service manager") AND NOT "assistant"`,
  },
  {
    label: "Mechanical Engineer",
    query: `(mechanical AND engineer) AND NOT civil`,
  },
];

function JobTitleQueryBuilder() {
  const { update } = useURLSearchStateV4();
  const { state: currentSearchState } = useCurrentSearchFilters();

  const [text, setText] = useState("");
  const [options, setOptions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setText(currentSearchState.jobTitleQuery || "");
  }, [currentSearchState.jobTitleQuery]);

  const handleSearch = async (value) => {
    setIsLoading(true);
    try {
      // Build GET URL with query params
      const params = new URLSearchParams({
        facetType: "job_title",
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
      console.error("Error fetching job title suggestions:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (newValue) => {
    setText(newValue);
  };
  const handleSelect = (option) => {
    setText((prev) => prev.replace(`@${option.value}`, option.value));
  };

  return (
    <div className="flex flex-col space-y-4">
      <label htmlFor="jobTitleMentions" className="text-sm font-bold">
        Job Title Terms
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
                    type: URLSearchStateUpdateType.JOB_TITLE_QUERY,
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
      <div className="text-sm text-gray-500 italic">
        {`Pro tip: Use "@" to search for job titles.`}
      </div>
      <Mentions
        id="jobTitleMentions"
        value={text}
        onChange={handleChange}
        onSelect={handleSelect}
        onBlur={() => {
          if (text !== currentSearchState.jobTitleQuery) {
            update({
              type: URLSearchStateUpdateType.JOB_TITLE_QUERY,
              payload: text,
            });
          }
        }}
        rows={3}
        style={{ width: "100%" }}
        options={options}
        onSearch={handleSearch}
        loading={isLoading}
        allowClear
        placeholder={`Add boolean query`}
        onClear={() => {
          update({
            type: URLSearchStateUpdateType.JOB_TITLE_QUERY,
            payload: "",
          });
        }}
        prefix="@"
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
}

export default JobTitleQueryBuilder;
