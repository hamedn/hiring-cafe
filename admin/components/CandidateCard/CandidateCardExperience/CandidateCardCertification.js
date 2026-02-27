export default function CandidateCardCertification({ candidate }) {
  if (!candidate?.certifications?.length) {
    return null;
  }

  return (
    <div className="flex flex-col space-y-2">
      <span className="text-xs font-light">
        Certifications ({candidate.certifications.length})
      </span>
      <div className="flex flex-col border divide-y max-h-32 overflow-y-auto">
        {candidate.certifications.map((certification, index) => {
          return (
            <div
              key={`${certification.title}-${index}`}
              className={`flex items-center justify-between space-x-4 text-xs px-2.5 py-0.5 ${
                index === 0 ? "pb-1" : "py-1"
              }`}
            >
              <div className={`flex flex-col`}>
                <span className="font-bold">{certification.title}</span>
                {certification.issuing_organization && (
                  <span className="mt-0.5">
                    {certification.issuing_organization}
                  </span>
                )}
              </div>
              {certification.date && (
                <span className="">{certification.date}</span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
