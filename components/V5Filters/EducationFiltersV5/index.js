import EducationOptionV5 from "./EducationOptionV5";
import { EducationFieldsOfStudyMapping } from "./FieldsOfStudySelectionV5";

export default function EducationFiltersV5() {
  return (
    <div className="flex flex-col space-y-6 p-4 pb-16">
      {Object.keys(EducationFieldsOfStudyMapping).map((education) => {
        return <EducationOptionV5 key={education} education={education} />;
      })}
    </div>
  );
}
