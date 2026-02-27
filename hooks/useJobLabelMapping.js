import { JobLabelMappingV5 } from "@/components/JobLabelMappingV5";
import {
  maxYearsOfExperience,
  useCurrentSearchFilters,
} from "contexts/CurrentSearchFiltersContext";
import { useMemo } from "react";

export default function useJobLabelMapping({ job, viewFormat }) {
  const { state: currentSearchState } = useCurrentSearchFilters();

  const isPromoted = useMemo(() => {
    return ["appcast_ecp_cpa", "appcast_cpa"].includes(job?.source || "");
  }, [job]);

  const location = useMemo(
    () => JobLabelMappingV5.locationLabel(job, viewFormat),
    [job, viewFormat]
  );

  const postingTimeAgo = useMemo(
    () => JobLabelMappingV5.postingTimeAgoLabel(job, viewFormat),
    [job, viewFormat]
  );

  const jobMarkingTimeAgo = useMemo(
    () => JobLabelMappingV5.jobMarkingTimeAgoLabel(job, viewFormat),
    [job, viewFormat]
  );

  const workplaceType = useMemo(
    () => JobLabelMappingV5.workplaceTypeLabel(job),
    [job]
  );

  const commitment = useMemo(
    () => JobLabelMappingV5.commitmentLabel(job),
    [job]
  );

  const compensation = useMemo(
    () => JobLabelMappingV5.compensationLabel(job),
    [job]
  );

  const shouldShowUndisclosedSalaryLabel = useMemo(() => {
    if (
      !isPromoted &&
      !compensation &&
      (currentSearchState.minCompensationLowEnd > 0 ||
        currentSearchState.minCompensationHighEnd > 0 ||
        currentSearchState.maxCompensationLowEnd > 0 ||
        currentSearchState.maxCompensationHighEnd > 0)
    ) {
      return true;
    }

    return false;
  }, [
    isPromoted,
    compensation,
    currentSearchState.maxCompensationHighEnd,
    currentSearchState.maxCompensationLowEnd,
    currentSearchState.minCompensationHighEnd,
    currentSearchState.minCompensationLowEnd,
  ]);

  const requirementsSummary = useMemo(
    () => JobLabelMappingV5.requirementsSummaryLabel(job),
    [job]
  );

  const minRoleYOE = useMemo(
    () => JobLabelMappingV5.minRoleYOELabel(job),
    [job]
  );

  const minManagementYOE = useMemo(
    () => JobLabelMappingV5.minManagementYOELabel(job),
    [job]
  );

  const shouldDisplayNoMinRoleYOELabel = useMemo(() => {
    if (
      !minRoleYOE &&
      (currentSearchState.roleYoeRange?.[0] > 0 ||
        currentSearchState.roleYoeRange?.[1] < maxYearsOfExperience)
    ) {
      return true;
    }

    return false;
  }, [currentSearchState.roleYoeRange, minRoleYOE]);

  const shouldDisplayNoMinManagementYOELabel = useMemo(() => {
    if (
      job?.v5_processed_job_data?.role_type === "People Manager" &&
      !minManagementYOE &&
      !shouldDisplayNoMinRoleYOELabel &&
      (currentSearchState.managementYoeRange?.[0] > 0 ||
        currentSearchState.managementYoeRange?.[1] < maxYearsOfExperience)
    ) {
      return true;
    }

    return false;
  }, [
    currentSearchState.managementYoeRange,
    minManagementYOE,
    minRoleYOE,
    shouldDisplayNoMinRoleYOELabel,
  ]);

  const techStack = useMemo(() => JobLabelMappingV5.techStackLabel(job), [job]);

  const companyImageURL = useMemo(
    () => JobLabelMappingV5.companyImageURL(job),
    [job]
  );

  const companyDescription = useMemo(
    () => JobLabelMappingV5.companyDescriptionLabel(job),
    [job]
  );

  const companyName = useMemo(
    () => JobLabelMappingV5.companyNameLabel(job),
    [job]
  );

  const companyTagline = useMemo(
    () => JobLabelMappingV5.companyTaglineLabel(job),
    [job]
  );

  const website = useMemo(() => JobLabelMappingV5.companyWebsite(job), [job]);

  const responsibilities = useMemo(
    () => JobLabelMappingV5.responsibilitiesLabel(job),
    [job]
  );

  const resolvedCompanyData = useMemo(
    () => JobLabelMappingV5.resolvedCompanyData(job),
    [job]
  );

  const numSaved = useMemo(
    () => job?.job_information?.savedFromUsers?.length || 0,
    [job]
  );

  const numMarkApplied = useMemo(
    () => job?.job_information?.appliedFromUsers?.length || 0,
    [job]
  );

  const numViews = useMemo(() => {
    let num = job?.job_information?.viewedByUsers?.length || 0;
    num = Math.max(num, numSaved, numMarkApplied);
    return num + 1;
  }, [job, numSaved, numMarkApplied]);

  const isHotJob = useMemo(() => {
    return (
      job?.job_information?.savedFromUsers?.length > 2 ||
      job?.job_information?.appliedFromUsers?.length > 2
    );
  }, [job]);

  return {
    location,
    postingTimeAgo,
    jobMarkingTimeAgo,
    workplaceType,
    commitment,
    compensation,
    shouldShowUndisclosedSalaryLabel,
    requirementsSummary,
    minRoleYOE,
    shouldDisplayNoMinRoleYOELabel,
    minManagementYOE,
    shouldDisplayNoMinManagementYOELabel,
    techStack,
    companyName,
    companyTagline,
    website,
    responsibilities,
    numViews,
    numSaved,
    numMarkApplied,
    isHotJob,
    isPromoted,
    companyDescription,
    companyImageURL,
    resolvedCompanyData,
  };
}
