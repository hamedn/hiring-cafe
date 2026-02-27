export default function DebugPanel({ searchState }) {
  return (
    <div className="h-full overflow-y-auto p-4">
      <h3 className="text-lg font-bold mb-4">Debug: Search State</h3>
      
      {/* User's Embedding Texts */}
      {searchState && (
        <div className="mb-4 space-y-2">
          <h4 className="font-semibold text-sm">Positive Embeddings (What User Wants):</h4>
          <div className="bg-blue-50 p-3 rounded text-xs">
            <div className="font-semibold text-blue-800 mb-1">Explicit:</div>
            <div className="text-blue-700">{searchState.embedding_text_explicit || "None"}</div>
          </div>
          <div className="bg-green-50 p-3 rounded text-xs">
            <div className="font-semibold text-green-800 mb-1">Inferred:</div>
            <div className="text-green-700">{searchState.embedding_text_inferred || "None"}</div>
          </div>
          <div className="bg-purple-50 p-3 rounded text-xs">
            <div className="font-semibold text-purple-800 mb-1">Company:</div>
            <div className="text-purple-700">{searchState.embedding_text_company || "None"}</div>
          </div>
        </div>
      )}

      {/* Exclusion Embedding Texts */}
      {searchState && (searchState.exclusion_text_job || searchState.exclusion_text_company) && (
        <div className="mb-4 space-y-2">
          <h4 className="font-semibold text-sm">Exclusion Embeddings (What User Wants to Avoid):</h4>
          {searchState.exclusion_text_job && (
            <div className="bg-red-50 p-3 rounded text-xs border border-red-200">
              <div className="font-semibold text-red-800 mb-1">Job-Related Exclusions:</div>
              <div className="text-red-700">{searchState.exclusion_text_job}</div>
            </div>
          )}
          {searchState.exclusion_text_company && (
            <div className="bg-orange-50 p-3 rounded text-xs border border-orange-200">
              <div className="font-semibold text-orange-800 mb-1">Company-Related Exclusions:</div>
              <div className="text-orange-700">{searchState.exclusion_text_company}</div>
            </div>
          )}
        </div>
      )}

      {/* Full State JSON */}
      <h4 className="font-semibold text-sm mb-2">Full State:</h4>
      <pre className="bg-gray-50 p-4 rounded-lg text-xs overflow-x-auto">
        {JSON.stringify(
          searchState
            ? {
                ...searchState,
                // Hide embedding vectors (too large)
                embedding_explicit: searchState.embedding_explicit ? "[vector hidden]" : null,
                embedding_inferred: searchState.embedding_inferred ? "[vector hidden]" : null,
                embedding_company: searchState.embedding_company ? "[vector hidden]" : null,
                exclusion_embedding_job: searchState.exclusion_embedding_job ? "[vector hidden]" : null,
                exclusion_embedding_company: searchState.exclusion_embedding_company ? "[vector hidden]" : null,
              }
            : null,
          null,
          2
        )}
      </pre>
    </div>
  );
}

