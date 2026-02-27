import RoleTypeSelectionV4 from "./RoleTypeSelectionV4";
import SeniorityLevelSelectionV5 from "./SeniorityLevelSelectionV5";
import YearsOfExperienceLeadershipSelectionV4 from "./YearsOfExperienceLeadershipSelectionV4";
import YearsOfExperienceRoleSelectionV4 from "./YearsOfExperienceRoleSelectionV4";

export default function QualificationsFiltersV4() {
  return (
    <div className="flex flex-col p-4 pb-32 space-y-6">
      <SeniorityLevelSelectionV5 />
      <RoleTypeSelectionV4 />
      <YearsOfExperienceRoleSelectionV4 />
      <YearsOfExperienceLeadershipSelectionV4 />
    </div>
  );
}
