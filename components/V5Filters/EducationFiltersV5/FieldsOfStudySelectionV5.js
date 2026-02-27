import useURLSearchStateV4 from "@/hooks/useURLSearchStateV4";
import ElasticSearchComponent from "../ElasticSearchComponent";
import { useCurrentSearchFilters } from "contexts/CurrentSearchFiltersContext";

export const EducationFieldsOfStudyMapping = {
  ASSOCIATES: {
    title: "Associate's Degree",
    field: "associatesDegreeFieldsOfStudy",
    excludeField: "excludedAssociatesDegreeFieldsOfStudy",
    api: "associates_degree_fields_of_study",
    urlInclude: "ASSOCIATES_DEGREE_FIELDS_OF_STUDY",
    urlExclude: "EXCLUDED_ASSOCIATES_DEGREE_FIELDS_OF_STUDY",
  },
  BACHELORS: {
    title: "Bachelor's Degree",
    field: "bachelorsDegreeFieldsOfStudy",
    excludeField: "excludedBachelorsDegreeFieldsOfStudy",
    api: "bachelors_degree_fields_of_study",
    urlInclude: "BACHELORS_DEGREE_FIELDS_OF_STUDY",
    urlExclude: "EXCLUDED_BACHELORS_DEGREE_FIELDS_OF_STUDY",
  },
  MASTERS: {
    title: "Master's Degree",
    field: "mastersDegreeFieldsOfStudy",
    excludeField: "excludedMastersDegreeFieldsOfStudy",
    api: "masters_degree_fields_of_study",
    urlInclude: "MASTERS_DEGREE_FIELDS_OF_STUDY",
    urlExclude: "EXCLUDED_MASTERS_DEGREE_FIELDS_OF_STUDY",
  },
  DOCTORATE: {
    title: "Doctorate Degree",
    field: "doctorateDegreeFieldsOfStudy",
    excludeField: "excludedDoctorateDegreeFieldsOfStudy",
    api: "doctorate_degree_fields_of_study",
    urlInclude: "DOCTORATE_DEGREE_FIELDS_OF_STUDY",
    urlExclude: "EXCLUDED_DOCTORATE_DEGREE_FIELDS_OF_STUDY",
  },
};

const FieldsOfStudySelectionV5 = ({ education }) => {
  const { state: currentSearchState } = useCurrentSearchFilters();
  const { update } = useURLSearchStateV4();

  if (!education || !EducationFieldsOfStudyMapping[education]) {
    return null;
  }

  const mapping = EducationFieldsOfStudyMapping[education];

  return (
    <div className="flex flex-col space-y-4">
      <div className="flex flex-col space-y-2">
        <div className="flex flex-col space-y-0">
          <div className="flex items-center space-x-1">
            <span className="font-bold">Include Majors</span>
          </div>
        </div>
        <ElasticSearchComponent
          isCreatable
          facetType={mapping.api}
          isMulti
          selected={currentSearchState[mapping.field]?.map((major) => ({
            label: major,
            value: major,
          }))}
          onSelected={(majors) => {
            update({
              type: mapping.urlInclude,
              payload: majors,
            });
          }}
        />
      </div>
      <div className="flex flex-col space-y-1">
        <span className="font-bold">Exclude Majors</span>
        <ElasticSearchComponent
          facetType={mapping.api}
          isMulti
          selected={currentSearchState[mapping.excludeField]?.map((major) => ({
            label: major,
            value: major,
          }))}
          onSelected={(majors) => {
            update({
              type: mapping.urlExclude,
              payload: majors,
            });
          }}
        />
      </div>
    </div>
  );
};

export default FieldsOfStudySelectionV5;
