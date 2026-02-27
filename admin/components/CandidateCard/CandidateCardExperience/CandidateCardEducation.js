export default function CandidateCardEducation({ candidate }) {
  if (!candidate?.education?.length) {
    return null;
  }

  return (
    <div className="flex flex-col space-y-2">
      <span className="text-xs font-light">
        Education ({candidate.education.length})
      </span>
      <div className="flex flex-col border divide-y max-h-32 overflow-y-auto">
        {candidate.education.map((education, index) => {
          return (
            <div
              key={`${education.institute}-${index}`}
              className={`flex items-center justify-between space-x-2 px-2.5 py-0.5 text-xs ${
                index === 0 ? "pb-1" : "py-1"
              }`}
            >
              <div className="flex flex-col">
                {education.credentials && (
                  <span className="font-bold">{education.credentials}</span>
                )}
                {education.institute && (
                  <span className="mt-0.5">
                    {education.institute}{" "}
                    {`${education.location ? `(${education.location})` : ""}`}
                  </span>
                )}
              </div>
              {education.graduation_year && (
                <span className="flex-none line-clamp-1">{`${education.graduation_year}`}</span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
