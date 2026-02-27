import CandidateMessaging from "./CandidateMessaging";
import InterviewAvailability from "./interviewAvailability";

export default function CandidateDashboard({
  applicant_info,
  stepData,
  mutate,
}) {
  return (
    <div className="flex flex-col space-y-16 mt-8">
      <CandidateMessaging applicant_info={applicant_info} />
      <InterviewAvailability applicant_info={applicant_info} mutate={mutate} />
    </div>
  );
}
