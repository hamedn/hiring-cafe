import getSymbolFromCurrency from "currency-symbol-map";
import { ISO_COUNTRIES } from "@/utils/backend/countries";
import { commitmentTypeOptions } from "@/utils/constants";
import { formattedComp, timeAgo } from "@/utils/helpers";

export const JobLabelMappingV5 = {
  locationLabel: (job) => {
    if (!job) {
      return "";
    }

    if (job.v5_processed_job_data?.is_workplace_worldwide_ok) {
      return "Anywhere in the world";
    }

    if (job.v5_processed_job_data?.formatted_workplace_location) {
      return job.v5_processed_job_data.formatted_workplace_location;
    }

    if (
      job.additional_algolia_filters?.workplaceLocations?.acceptableCities
        ?.length > 1
    ) {
      return job.additional_algolia_filters.workplaceLocations.acceptableCities.join(
        " · "
      );
    }

    if (
      job.additional_algolia_filters?.workplaceLocations?.acceptableCountries
        ?.length > 1
    ) {
      const isoToCountry = (iso) => {
        return ISO_COUNTRIES[iso] || iso;
      };
      return job.additional_algolia_filters.workplaceLocations.acceptableCountries
        .map(isoToCountry)
        .join(" · ");
    }

    if (job.gpt_data?.formatted_location) {
      return job.gpt_data.formatted_location;
    }
    const location = job.job_location || "Remote";
    if (job.isRemote && !location.toLowerCase().includes("remote")) {
      return `Remote - ${location}`;
    }
    return location;
  },

  postingTimeAgoLabel: (job) => {
    if (!job) {
      return "";
    }

    const postedDate =
      job.v5_processed_job_data?.estimated_publish_date ||
      job.additional_algolia_filters?.estimated_publish_date;

    if (postedDate) {
      return timeAgo(postedDate?.toDate?.() || postedDate);
    }
  },

  jobMarkingTimeAgoLabel: (job) => {
    if (!job) {
      return "";
    }

    if (job.dateSaved) {
      return timeAgo(job.dateSaved?.toDate?.() || job.dateSaved);
    }

    return "";
  },

  workplaceTypeLabel: (job) => {
    if (!job) {
      return "";
    }

    const workplaceType =
      job.v5_processed_job_data?.workplace_type ||
      job.gpt_data?.workplace_type?.toString?.();

    return workplaceType || "";
  },

  commitmentLabel: (job) => {
    if (!job) {
      return "";
    }

    if (job.v5_processed_job_data?.commitment?.length > 0) {
      const commitments = job.v5_processed_job_data.commitment;
      if (
        commitmentTypeOptions.every((commitment) =>
          commitments.includes(commitment)
        )
      ) {
        return "All Commitments Available";
      }

      if (commitments.length > 2) {
        return "Multiple Commitments Available";
      }

      return commitments.join(", ");
    }

    return job.gpt_data?.commitment?.toString?.() || "";
  },

  compensationLabel: (job) => {
    if (!job) {
      return null;
    }

    const v5FormattedComp = job.v5_processed_job_data
      ? formatCompensation(job.v5_processed_job_data)
      : null;

    if (v5FormattedComp) {
      return v5FormattedComp;
    }

    return job.gpt_data?.full_compensation_breakdown
      ? formattedComp(job.gpt_data.full_compensation_breakdown) || null
      : null;
  },

  requirementsSummaryLabel: (job) => {
    if (!job) {
      return "N/A";
    }

    const req =
      job.v5_processed_job_data?.requirements_summary ||
      job.requirements ||
      job.gpt_data?.requirements?.toString?.() ||
      "N/A";

    return req;
  },

  minRoleYOELabel: (job) => {
    if (!job) {
      return null;
    }

    const minRoleYOE =
      job.v5_processed_job_data?.min_industry_and_role_yoe ??
      job.gpt_data?.min_years_experience_breakdown?.industry_and_role ??
      null;

    if (minRoleYOE !== null) {
      return `${minRoleYOE}+ YOE`;
    }

    return null;
  },

  minManagementYOELabel: (job) => {
    if (!job) {
      return null;
    }

    const minManagementYOE =
      job.v5_processed_job_data?.min_management_and_leadership_yoe ??
      job.gpt_data?.min_years_experience_breakdown?.management_and_leadership ??
      null;

    if (minManagementYOE !== null) {
      return `${minManagementYOE}+ Mgmt`;
    }

    return null;
  },

  techStackLabel: (job) => {
    if (!job) {
      return "";
    }

    if (job.v5_processed_job_data?.technical_tools?.length > 0) {
      return job.v5_processed_job_data.technical_tools.join(", ");
    }

    const techStack =
      job.tech_stack?.length > 0
        ? typeof job.tech_stack === "string"
          ? !["na", "n/a", "unknown", "not specified", "none"].includes(
              job.tech_stack.toLowerCase()
            ) && job.tech_stack.length > 0
            ? job.tech_stack
            : ""
          : job.tech_stack.join(", ")
        : job.gpt_data?.technical_keywords?.join?.(", ") || "";

    return techStack;
  },

  companyNameLabel: (job) => {
    if (!job) {
      return " ";
    }

    return (
      job.enriched_company_data?.name ||
      job.v5_processed_job_data?.company_name ||
      job.job_information?.company_info?.name?.toString?.() ||
      " "
    );
  },

  companyDescriptionLabel: (job) => {
    if (!job) {
      return "N/A";
    }

    return (
      job.enriched_company_data?.tagline ||
      job.v5_processed_job_data?.company_tagline ||
      "N/A"
    );
  },

  companyImageURL: (job) => {
    if (!job) {
      return null;
    }

    const website = JobLabelMappingV5.companyWebsite(job);

    if (website) {
      return `https://www.google.com/s2/favicons?domain=${website}&sz=128`;
    }

    return null;
  },

  enrichedCompanyData: (job) => {
    if (!job) {
      return null;
    }
    if (job.enriched_company_data?.status === "VALID_COMPANY") {
      return job.enriched_company_data;
    }
    return null;
  },

  /**
   * Returns a normalized company data object for display from enriched data.
   * Returns null if no valid enriched data is present.
   */
  resolvedCompanyData: (job) => {
    if (!job) return null;

    const enriched = job.enriched_company_data;

    if (enriched?.status !== "VALID_COMPANY") return null;

    return {
      name: enriched.name ?? null,
      website: enriched.homepage_uri ?? null,
      headquarters_country: enriched.hq_country ?? null,
      industries: enriched.industries ?? null,
      activities: enriched.activities ?? null,
      tagline: enriched.tagline ?? null,
      num_employees: enriched.nb_employees ?? null,
      year_founded: enriched.year_founded ?? null,
      latest_investment_amount: enriched.latest_funding_amount ?? null,
      latest_investment_year: enriched.latest_funding_year ?? null,
      latest_investment_series: enriched.latest_funding_type ?? null,
      investors: enriched.latest_funding_investors ?? null,
      stock_exchange: enriched.stock_exchange ?? null,
      stock_symbol: enriched.stock_symbol ?? null,
      parent_company: enriched.parent_company ?? null,
      subsidiaries: enriched.subsidiaries ?? null,
      organization_type: enriched.organization_type ?? null,
    };
  },

  companyTaglineLabel: (job) => {
    if (!job) {
      return "N/A";
    }

    const getTagline = (tagline) => {
      // Remove company name prefix if present
      if (
        job.v5_processed_job_data?.company_name &&
        tagline
          .toLowerCase()
          .startsWith(job.v5_processed_job_data.company_name.toLowerCase())
      ) {
        tagline = tagline.slice(job.v5_processed_job_data.company_name.length);
      }

      // Remove ", inc." or similar (case insensitive, with or without period, with or without comma)
      tagline = tagline.replace(/\s*,?\s*inc\.?\b/gi, "");
      tagline = tagline.replace(/\s*,?\s*incorporated\b/gi, "");
      tagline = tagline.replace(/\s*,?\s*corp\.?\b/gi, "");
      tagline = tagline.replace(/\s*,?\s*corporation\b/gi, "");
      tagline = tagline.replace(/\s*,?\s*llc\.?\b/gi, "");
      tagline = tagline.replace(/\s*,?\s*l\.?l\.?c\.?\b/gi, "");
      tagline = tagline.replace(/\s*,?\s*co\.?\b/gi, "");
      tagline = tagline.replace(/\s*,?\s*company\b/gi, "");

      // Remove leading dots and extra whitespace after all removals
      tagline = tagline.replace(/^[.\s]+/, "");

      const regex = /^(?:is\s*(?:a|the|an)?\s*|a\s+company\s+)/i;

      if (regex.test(tagline)) {
        tagline = tagline.replace(regex, "");
      }

      if (tagline.length > 0) {
        tagline = tagline.charAt(0).toUpperCase() + tagline.slice(1);
      }

      return tagline;
    };

    const tagline =
      job.enriched_company_data?.tagline ||
      job.v5_processed_job_data?.company_tagline;

    if (tagline) {
      return getTagline(tagline);
    }

    return (
      job.about_company ||
      job.gpt_data?.company_profile?.tagline?.toString?.() ||
      "N/A"
    );
  },

  companyWebsite: (job) => {
    if (!job) {
      return null;
    }

    let website =
      job.enriched_company_data?.homepage_uri ||
      job.v5_processed_job_data?.company_website ||
      job?.gpt_data?.company_profile?.website ||
      null;

    if (website) {
      try {
        const urlObj = new URL(website.trim());
        let domain = urlObj.hostname.replace(/^www\./, "");
        website = domain;
      } catch (error) {
        // Fallback for cases where "website" might not be a valid URL
        let str = (website || "").trim().replace(/^https?:\/\/(www\.)?/i, "");
        str = str.split("/")[0];
        website = str.replace(/^www\./, "");
      }
    }

    if (!website) {
      return null;
    }

    const excludeKeywords = [
      "icims.com",
      "myworkdayjobs.com",
      "ultipro.com",
      "ashbyhq.com",
      "greenhouse.io",
      "lever.co",
      "paylocity.com",
      "paycomonline.net",
      "governmentjobs.com",
      "usajobs.gov",
      "linkedin.com",
      "https.com",
      "careerplug.com",
    ];

    // if any of the exclude keywords are in the url, return null
    if (
      excludeKeywords.some((keyword) =>
        website.toLowerCase().includes(keyword.toLowerCase())
      )
    ) {
      return null;
    }

    return website;
  },

  responsibilitiesLabel: (job) => {
    if (job?.v5_processed_job_data?.role_activities?.length > 0) {
      return job.v5_processed_job_data.role_activities.join(", ");
    }
    return "";
  },
};

function formatCompensation(data) {
  // Helper function to format numbers
  function formatNumber(n, includeK = true) {
    if (n >= 1000) {
      return `${Math.round(n / 1000)}${includeK ? "k" : ""}`;
    } else {
      return `${Math.round(n)}`;
    }
  }

  // Map frequencies to abbreviations
  const frequencyAbbreviations = {
    yearly: "/yr",
    monthly: "/mo",
    "bi-weekly": "/bi-wk",
    weekly: "/wk",
    daily: "/day",
    hourly: "/hr",
  };

  // Get the listed compensation frequency and currency
  let frequency = data.listed_compensation_frequency;
  const currency = data.listed_compensation_currency;

  if (!frequency) {
    return null;
  }

  frequency = frequency.toLowerCase();
  if (!frequencyAbbreviations.hasOwnProperty(frequency)) {
    return null;
  }

  const freqAbbreviation = frequencyAbbreviations[frequency];

  // Build the min and max field names based on frequency
  const minField = `${frequency}_min_compensation`;
  const maxField = `${frequency}_max_compensation`;

  // Get the min and max compensation values
  let low = data[minField];
  let high = data[maxField];

  // If both low and high are missing, return null
  if (low == null && high == null) {
    return null;
  }

  // Convert to numbers and handle NaN
  low = Number(low);
  high = Number(high);

  if (isNaN(low)) {
    low = null;
  }
  if (isNaN(high)) {
    high = null;
  }

  // If both low and high are still missing, return null
  if (low == null && high == null) {
    return null;
  }

  // If only one of low or high is present, set the other to the same value
  if (low == null) {
    low = high;
  }
  if (high == null) {
    high = low;
  }

  // Format the numbers
  const symbol = getSymbolFromCurrency(currency);
  const formattedLow = formatNumber(low);
  const formattedHigh = formatNumber(high);

  let formattedCompensation = "";

  if (low === high) {
    formattedCompensation = `${symbol}${formattedLow}${freqAbbreviation}`;
  } else {
    formattedCompensation = `${symbol}${formattedLow}-${symbol}${formattedHigh}${freqAbbreviation}`;
  }

  return formattedCompensation;
}
