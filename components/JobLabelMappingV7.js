import getSymbolFromCurrency from "currency-symbol-map";
import { commitmentTypeOptions } from "@/utils/constants";
import { timeAgo } from "@/utils/helpers";
import { JobLabelMappingV5 } from "./JobLabelMappingV5";

export const JobLabelMappingV7 = {
  locationLabel: (job) => {
    if (!job) return "";

    const locations = job.v7_processed_job_data?.work_arrangement?.workplace_locations;
    if (!locations?.length) return "";

    if (locations.length === 1) {
      const loc = locations[0];
      if (loc.kind === "city") return `${loc.city}, ${loc.state}`;
      if (loc.kind === "county") return `${loc.county}, ${loc.state}`;
      if (loc.kind === "state") return loc.state;
      if (loc.kind === "country") return loc.country_code || loc.country;
    }
    
    return locations.map(loc => loc.city || loc.county || loc.state || loc.country_code).join(" · ");
  },

  postingTimeAgoLabel: (job) => {
    if (!job) return "";
    const postedDate = job.v7_processed_job_data?.estimated_post_date;
    if (postedDate) return timeAgo(postedDate?.toDate?.() || postedDate);
    return "";
  },

  jobMarkingTimeAgoLabel: (job) => {
    if (!job?.dateSaved) return "";
    return timeAgo(job.dateSaved?.toDate?.() || job.dateSaved);
  },

  workplaceTypeLabel: (job) => {
    return job?.v7_processed_job_data?.work_arrangement?.workplace_type || "";
  },

  commitmentLabel: (job) => {
    if (!job) return "";

    const commitments = job.v7_processed_job_data?.work_arrangement?.commitment;
    if (!commitments?.length) return "";

    if (commitmentTypeOptions.every((c) => commitments.includes(c))) {
      return "All Commitments Available";
    }

    if (commitments.length > 2) return "Multiple Commitments Available";
    
    return commitments.join(", ");
  },

  compensationLabel: (job) => {
    if (!job) return null;

    const salary = job.v7_processed_job_data?.compensation_and_benefits?.salary;
    if (!salary || (salary.low == null && salary.high == null)) return null;

    const symbol = getSymbolFromCurrency(salary.currency || "USD");
    const freq = salary.frequency?.toLowerCase();
    const freqMap = {
      yearly: "/yr",
      monthly: "/mo",
      "bi-weekly": "/bi-wk",
      weekly: "/wk",
      daily: "/day",
      hourly: "/hr",
    };
    const freqAbbr = freqMap[freq] || "";

    const formatNum = (n) => (n >= 1000 ? `${Math.round(n / 1000)}k` : Math.round(n));

    if (salary.low === salary.high && salary.low != null) {
      return `${symbol}${formatNum(salary.low)}${freqAbbr}`;
    } else if (salary.low != null && salary.high != null) {
      return `${symbol}${formatNum(salary.low)}-${symbol}${formatNum(salary.high)}${freqAbbr}`;
    } else if (salary.low != null) {
      return `${symbol}${formatNum(salary.low)}+${freqAbbr}`;
    } else if (salary.high != null) {
      return `Up to ${symbol}${formatNum(salary.high)}${freqAbbr}`;
    }

    return null;
  },

  requirementsSummaryLabel: (job) => {
    return job?.v7_processed_job_data?.experience_requirements?.requirements_summary || "N/A";
  },

  minRoleYOELabel: (job) => {
    const yoe = job?.v7_processed_job_data?.experience_requirements?.min_years_breakdown?.industry_and_role_yoe;
    if (yoe !== null && yoe !== undefined) return `${yoe}+ YOE`;
    return null;
  },

  minManagementYOELabel: (job) => {
    const yoe = job?.v7_processed_job_data?.experience_requirements?.min_years_breakdown?.management_and_leadership_yoe;
    if (yoe !== null && yoe !== undefined) return `${yoe}+ Mgmt`;
    return null;
  },

  techStackLabel: (job) => {
    if (!job?.v7_processed_job_data?.skills) return "";

    const skills = [
      ...(job.v7_processed_job_data.skills.explicit || []),
      ...(job.v7_processed_job_data.skills.inferred || []),
    ]
      .map((s) => s.value)
      .slice(0, 10);

    return skills.join(", ");
  },

  companyNameLabel: (job) => {
    return (
      job?.v7_processed_job_data?.company_profile?.name ||
      job?.job_information?.company_info?.name ||
      " "
    );
  },

  companyTaglineLabel: (job) => {
    if (!job) return "N/A";

    let tagline = job.v7_processed_job_data?.company_profile?.tagline;
    if (!tagline) return "N/A";

    const companyName = job.v7_processed_job_data?.company_profile?.name;
    
    // Remove company name prefix
    if (companyName && tagline.toLowerCase().startsWith(companyName.toLowerCase())) {
      tagline = tagline.slice(companyName.length);
    }

    // Clean up corporate suffixes
    tagline = tagline.replace(/\s*,?\s*(inc|incorporated|corp|corporation|llc|l\.?l\.?c|co|company)\.?\b/gi, "");
    tagline = tagline.replace(/^[.\s]+/, "");
    tagline = tagline.replace(/^(?:is\s*(?:a|the|an)?\s*|a\s+company\s+)/i, "");

    if (tagline.length > 0) {
      tagline = tagline.charAt(0).toUpperCase() + tagline.slice(1);
    }

    return tagline || "N/A";
  },

  companyWebsite: (job) => {
    let website = job?.v7_processed_job_data?.company_profile?.website;
    if (!website) return null;

    try {
      const urlObj = new URL(website.trim());
      website = urlObj.hostname.replace(/^www\./, "");
    } catch {
      website = website.trim().replace(/^https?:\/\/(www\.)?/i, "");
      website = website.split("/")[0].replace(/^www\./, "");
    }

    const excludeKeywords = [
      "icims.com", "myworkdayjobs.com", "ultipro.com", "ashbyhq.com",
      "greenhouse.io", "lever.co", "paylocity.com", "paycomonline.net",
      "governmentjobs.com", "usajobs.gov", "linkedin.com", "https.com"
    ];

    if (excludeKeywords.some((k) => website.toLowerCase().includes(k))) {
      return null;
    }

    return website;
  },

  companyDescriptionLabel: (job) => {
    return job?.v7_processed_job_data?.company_profile?.tagline || "N/A";
  },

  companyImageURL: (job) => {
    return JobLabelMappingV5.companyImageURL(job); // TODO: v7 currently doesn't support company data
  },

  responsibilitiesLabel: (job) => {
    // v7 doesn't have this, use v5 fallback
    return job?.v5_processed_job_data?.role_activities?.join(", ") || "";
  },
};

