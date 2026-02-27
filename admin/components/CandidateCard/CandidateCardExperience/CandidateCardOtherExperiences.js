export default function CandidateCardOtherExperiences({ candidate }) {
  if (!candidate.other_experiences?.length) {
    return null;
  }

  return (
    <div className="flex flex-col space-y-2">
      <span className="text-xs font-light">
        Other Work Experience ({candidate.other_experiences.length})
      </span>
      <div className="flex flex-col border divide-y max-h-32 overflow-y-auto">
        {candidate.other_experiences.map((other_experience, index) => {
          return (
            <div
              key={`${other_experience.title}-${index}`}
              className={`flex items-center justify-between space-x-4 text-xs px-2.5 py-0.5 ${
                index === 0 ? "pb-1" : "py-1"
              }`}
            >
              <div className={`flex flex-col`}>
                {other_experience.title && (
                  <span className="font-bold">{other_experience.title}</span>
                )}
                {other_experience.organization && (
                  <span
                    className={`mt-0.5 ${
                      !other_experience.title && "font-bold"
                    }`}
                  >
                    {other_experience.organization}
                  </span>
                )}
                {other_experience.duration && (
                  <span className="flex-none">{other_experience.duration}</span>
                )}
                {other_experience.location && (
                  <span className="mt-0.5">({other_experience.location})</span>
                )}
                {other_experience.description && (
                  <span className="mt-0.5">{other_experience.description}</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
