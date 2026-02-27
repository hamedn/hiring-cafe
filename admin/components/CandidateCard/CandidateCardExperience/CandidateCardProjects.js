export default function CandidateCardProjects({ candidate }) {
  if (!candidate.projects?.length) {
    return null;
  }

  return (
    <div className="flex flex-col space-y-2">
      <span className="text-xs font-light">
        Projects ({candidate.projects.length})
      </span>
      <div className="flex flex-col border divide-y max-h-32 overflow-y-auto">
        {candidate.projects.map((project, index) => {
          return (
            <div
              key={`${project.title}-${index}`}
              className={`flex flex-col px-2.5 py-0.5 ${
                index === 0 ? "pb-1" : "py-1"
              }`}
            >
              <span className="font-bold text-xs">{project.title}</span>
              {project.duration && (
                <span className="mt-0.5 text-xs flex-none">
                  {project.duration}
                </span>
              )}
              {project.summary && (
                <span className="mt-0.5 text-xs">{project.summary}</span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
