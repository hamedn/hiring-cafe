import { JobLabelMappingV7 } from "@/components/JobLabelMappingV7";
import { useMemo } from "react";

export default function useJobLabelMappingV7({ job, viewFormat }) {
  const isPromoted = useMemo(() => {
    return ["appcast_ecp_cpa", "appcast_cpa"].includes(job?.source || "");
  }, [job]);

  const location = useMemo(() => JobLabelMappingV7.locationLabel(job), [job]);
  const postingTimeAgo = useMemo(() => JobLabelMappingV7.postingTimeAgoLabel(job), [job]);
  const jobMarkingTimeAgo = useMemo(() => JobLabelMappingV7.jobMarkingTimeAgoLabel(job), [job]);
  const workplaceType = useMemo(() => JobLabelMappingV7.workplaceTypeLabel(job), [job]);
  const commitment = useMemo(() => JobLabelMappingV7.commitmentLabel(job), [job]);
  const compensation = useMemo(() => JobLabelMappingV7.compensationLabel(job), [job]);
  const requirementsSummary = useMemo(() => JobLabelMappingV7.requirementsSummaryLabel(job), [job]);
  const minRoleYOE = useMemo(() => JobLabelMappingV7.minRoleYOELabel(job), [job]);
  const minManagementYOE = useMemo(() => JobLabelMappingV7.minManagementYOELabel(job), [job]);
  const techStack = useMemo(() => JobLabelMappingV7.techStackLabel(job), [job]);
  const companyName = useMemo(() => JobLabelMappingV7.companyNameLabel(job), [job]);
  const companyTagline = useMemo(() => JobLabelMappingV7.companyTaglineLabel(job), [job]);
  const website = useMemo(() => JobLabelMappingV7.companyWebsite(job), [job]);
  const responsibilities = useMemo(() => JobLabelMappingV7.responsibilitiesLabel(job), [job]);
  const companyDescription = useMemo(() => JobLabelMappingV7.companyDescriptionLabel(job), [job]);
  const companyImageURL = useMemo(() => JobLabelMappingV7.companyImageURL(job), [job]);

  const shouldShowUndisclosedSalaryLabel = false; // No search filters in AI search
  const shouldDisplayNoMinRoleYOELabel = false;
  const shouldDisplayNoMinManagementYOELabel = false;

  const numSaved = useMemo(() => job?.job_information?.savedFromUsers?.length || 0, [job]);
  const numMarkApplied = useMemo(() => job?.job_information?.appliedFromUsers?.length || 0, [job]);
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
  };
}

