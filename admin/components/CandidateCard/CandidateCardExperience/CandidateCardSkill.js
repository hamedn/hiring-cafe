export default function CandidateCardSkill({ candidate }) {
  if (!candidate.skills?.length) {
    return null;
  }

  return (
    <div className="flex flex-col space-y-2">
      <span className="text-xs font-light">
        Skills ({candidate.skills.length})
      </span>
      <div className="flex items-center space-x-1 overflow-x-auto scrollbar-hide">
        {candidate.skills.map((skill, index) => {
          return (
            <span
              key={`${skill}-${index}`}
              className="font-medium text-xs flex-none border px-2 py-0.5 rounded-full"
            >
              {skill}
            </span>
          );
        })}
      </div>
    </div>
  );
}
