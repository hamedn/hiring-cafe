export default function ResultsPanel({
  results,
  loading,
  onRefresh,
  embeddingTexts,
}) {
  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Searching jobs...</p>
        </div>
      </div>
    );
  }

  if (!results) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center text-gray-500">
          <p className="text-lg font-medium">Ready to search</p>
          <p className="text-sm mt-2">
            Set your search preferences to see results
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold">Results</h3>
          <p className="text-sm text-gray-500">{results.total} jobs found</p>
        </div>
        <button
          onClick={onRefresh}
          className="text-sm text-yellow-600 hover:text-yellow-700"
        >
          Refresh
        </button>
      </div>

      {/* Results List */}
      <div className="flex-1 overflow-y-auto p-4">
        {results.jobs.length === 0 ? (
          <div className="text-center text-gray-500 mt-8">
            <p>No jobs found matching your criteria</p>
            <p className="text-sm mt-1">
              Try adjusting your search preferences
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {results.jobs.map((job) => (
              <div
                key={job.id}
                className="border rounded-lg p-4 hover:shadow-md transition-shadow bg-white"
              >
                {/* Job Title & Company - Clickable */}
                <a
                  href={`https://hiring.cafe/viewjob/${job.requisition_id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block mb-3 hover:text-yellow-600"
                >
                  <div className="font-semibold text-gray-900 text-base">
                    {job.title}
                  </div>
                  {job.company && (
                    <div className="text-sm text-gray-600 mt-1">
                      {job.company}
                    </div>
                  )}
                  <div className="text-xs text-gray-400 mt-1">
                    Match Score: {job.score.toFixed(2)}
                  </div>
                </a>

                {/* Job's v7 Embedding Texts */}
                {/* <div className="space-y-2 text-xs">
                  {job.embedding_text_explicit && (
                    <div className="bg-blue-50 p-2 rounded border border-blue-100">
                      <div className="font-semibold text-blue-800">
                        Explicit:
                      </div>
                      <div className="text-blue-700 mt-1">
                        {job.embedding_text_explicit}
                      </div>
                    </div>
                  )}
                  {job.embedding_text_inferred && (
                    <div className="bg-green-50 p-2 rounded border border-green-100">
                      <div className="font-semibold text-green-800">
                        Inferred:
                      </div>
                      <div className="text-green-700 mt-1">
                        {job.embedding_text_inferred}
                      </div>
                    </div>
                  )}
                  {job.embedding_text_company && (
                    <div className="bg-purple-50 p-2 rounded border border-purple-100">
                      <div className="font-semibold text-purple-800">
                        Company:
                      </div>
                      <div className="text-purple-700 mt-1">
                        {job.embedding_text_company}
                      </div>
                    </div>
                  )}
                </div> */}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
