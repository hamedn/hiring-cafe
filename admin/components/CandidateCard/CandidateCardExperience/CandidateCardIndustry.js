export default function CandidateCardIndustry({ candidate }) {
  if (!candidate?.job_industries?.length) {
    return null;
  }

  return (
    <div className="flex flex-col space-y-2">
      <span className="text-xs font-light">
        Industry Experience ({candidate.job_industries.length})
      </span>
      <div className="flex items-center space-x-1 overflow-x-auto scrollbar-hide">
        {candidate.job_industries.map((industry, index) => {
          return (
            <span
              key={`${industry}-${index}`}
              className="font-medium text-xs flex-none border px-2 py-0.5 rounded-full"
            >
              {industry}
            </span>
          );
        })}
      </div>
    </div>
  );
}
