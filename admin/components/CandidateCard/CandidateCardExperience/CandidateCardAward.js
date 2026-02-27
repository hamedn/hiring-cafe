export default function CandidateCardAward({ candidate }) {
  if (!candidate.awards?.length) {
    return null;
  }

  return (
    <div className="flex flex-col space-y-2">
      <span className="text-xs font-light">
        Awards ({candidate.awards.length})
      </span>
      <div className="flex flex-col border divide-y max-h-32 overflow-y-auto">
        {candidate.awards.map((award, index) => {
          return (
            <div
              key={`${award}-${index}`}
              className={`text-xs px-2.5 py-0.5 ${
                index === 0 ? "pb-1" : "py-1"
              }`}
            >
              {award}
            </div>
          );
        })}
      </div>
    </div>
  );
}
