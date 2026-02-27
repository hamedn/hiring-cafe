/**
 * AISearchScoreDebug - Debug component for displaying AI search scoring details
 * Only visible to authorized debug users (ali@hiring.cafe)
 */

const DEBUG_EMAIL = "ali@hiring.cafe";

// Format a score value for display
const formatScore = (value) => {
  if (value === null || value === undefined) return "n/a";
  return value.toFixed(3);
};

export default function AISearchScoreDebug({ job, user }) {
  // Only render for debug users
  if (!user?.email || user.email.toLowerCase() !== DEBUG_EMAIL) {
    return null;
  }

  // Only render if we have score data
  if (job._score === undefined || job._score === null) {
    return null;
  }

  return (
    <div className="w-full px-2 pt-2 flex flex-col items-start border-t border-dashed border-gray-300 mt-2">
      {/* Main Score Row */}
      <div className="w-full flex justify-between items-center text-[10px] font-mono py-1">
        <span className="text-gray-600 font-semibold">Main Score:</span>
        <span className="text-emerald-700 font-bold">
          {formatScore(job._score)}
        </span>
      </div>

      {/* Job Related Row */}
      <div className="w-full flex flex-col text-[10px] font-mono py-1 border-t border-dotted border-gray-200">
        <span className="text-gray-500 font-semibold mb-1">Job Related:</span>
        <div className="flex flex-wrap gap-x-3 gap-y-0.5">
          <span
            className="text-blue-700"
            title="Weighted job cosine similarity score"
          >
            Job: {formatScore(job._debug_job_score)}
          </span>
          <span
            className="text-orange-600"
            title="Out of scope job penalty (raw cosine)"
          >
            O: {formatScore(job._debug_out_of_scope_job + 1)}
          </span>
          <span
            className="text-amber-600"
            title="Disambiguation penalty (raw cosine)"
          >
            D: {formatScore(job._debug_disambiguation + 1)}
          </span>
          <span
            className="text-green-700 font-semibold"
            title="Net job score after penalties"
          >
            Net: {formatScore(job._debug_net_job_score)}
          </span>
        </div>
      </div>

      {/* Company Related Row */}
      <div className="w-full flex flex-col text-[10px] font-mono py-1 border-t border-dotted border-gray-200">
        <span className="text-gray-500 font-semibold mb-1">
          Company Related:
        </span>
        <div className="flex flex-wrap gap-x-3 gap-y-0.5">
          <span
            className="text-purple-700"
            title="Company inclusion similarity"
          >
            Co: {formatScore(job._debug_company_inclusion)}
          </span>
          <span className="text-pink-600" title="Company out of scope penalty">
            B: {formatScore(job._debug_company_out_of_scope)}
          </span>
          <span
            className="text-green-700 font-semibold"
            title="Net company score"
          >
            Net: {formatScore(job._debug_net_company_score)}
          </span>
        </div>
      </div>
    </div>
  );
}
