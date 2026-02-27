export const boardFlagNames = [
  "manual_candidate_approval",
  "show_billing_page",
  "show_debug_buttons",
];

export const getMarketplaceDocId = (reqID) => {
  return `HC_${reqID}`;
};

export const ReachOutOptionsInfo = [
  {
    name: "standard",
    title: "Standard Invite",
    benefits: [
      `Send your invite directly to candidate via their Inbox`,
      `Access resume & full contact info after they accept your request`,
      `Send unlimited messages when they accept your request`,
      `Automatically add candidate to ATS when they accept your request`,
    ],
  },
  {
    name: "turbo",
    title: "Turbo Invite",
    benefits: [
      `Instantly send notification via SMS & email`,
      `Send automated follow-ups if they don’t respond`,
      `Get your invite featured on candidate’s Inbox`,
      `Stand out by adding a message to your invite`,
    ],
  },
];

export const gptSeekerDataProperties = {
  jobs: {
    type: "array",
    description: `An array of job history objects. Order by most recent first.`,
    items: {
      type: "object",
      properties: {
        duration: {
          type: "string",
          description:
            "Duration of the job. Empty string if not clear or not mentioned.",
        },
        company: {
          type: "string",
          description: "Name of the company this job was at",
        },
        title: {
          type: "string",
          description: "Job Title",
        },
        summary: {
          type: "string",
          description:
            "Short summary of responsibilities and achievements, in 35 words or less. Past tense.",
        },
        employment_type: {
          type: "string",
          description: "Full-time/Part-time/Contract",
        },
        location: {
          type: "string",
          description:
            "Location of the job. Empty string if not clear or not mentioned.",
        },
        industry: {
          type: "string",
          description:
            "What industry does the company in this job best fit under? Choose only one of the following, and make a guesstimate if needed: Blockchain, Food, Transportation, Biotechnology, Climate Tech, Oil & Gas, Energy, Insurance, Non-Profit, Education, Legal, Media & Entertainment, Telecommunications, E-commerce, AI/ML, Health & Wellness, Cybersecurity, Financial Technology, Real Estate & Construction, Industrials, Government, Computer Software, Hospitality, Agriculture, Manufacturing, Robotics, Retail, Protective Services",
        },
      },
    },
  },
  other_experiences: {
    type: "array",
    description: `An array of other work experiences such as volunteering, teaching, etc. Order by most recent first. Empty array if none.`,
    items: {
      type: "object",
      properties: {
        title: {
          type: "string",
          description: "Title / name of the work",
        },
        duration: {
          type: "string",
          description:
            "Duration of the work. Empty string if not clear or not mentioned.",
        },
        organization: {
          type: "string",
          description:
            "Name of the organization this work was at. Empty string if not clear or not mentioned.",
        },
        description: {
          type: "string",
          description: "Description of the work.",
        },
        location: {
          type: "string",
          description:
            "Location of the work. Empty string if not clear or not mentioned.",
        },
      },
    },
  },
  awards: {
    type: "array",
    description: `An array of awards or empty array if none`,
    items: {
      type: "string",
    },
  },
  projects: {
    type: "array",
    description: `An array of projects or empty array if none`,
    items: {
      type: "object",
      properties: {
        title: {
          type: "string",
          description: "Title / name of the project",
        },
        duration: {
          type: "string",
          description:
            "Duration of the project. Empty string if not clear or not mentioned.",
        },
        summary: {
          type: "string",
          description: "Quick summary of the project. 35 words or less.",
        },
      },
    },
  },
  certifications: {
    type: "array",
    description: `An array of certifications, ordered by most recent first, or empty array if there is no certification.`,
    items: {
      type: "object",
      properties: {
        title: {
          type: "string",
          description: "Title / name of the certification",
        },
        issuing_organization: {
          type: "string",
          description:
            "Organization that issued the certification. Empty string if not clear or not mentioned.",
        },
        date: {
          type: "string",
          description:
            "Date of the certification. Empty string if not clear or not mentioned.",
        },
      },
    },
  },
  education: {
    type: "array",
    description: `An array of education history, ordered by most recent first, or empty array if there is no education history.`,
    items: {
      type: "object",
      properties: {
        institute: {
          type: "string",
          description: "Name of college or institute",
        },
        graduation_year: {
          type: "string",
          description:
            "Year of graduation. Empty string if not clear or not mentioned.",
        },
        credentials: {
          type: "string",
          description:
            "Full credentials (ex - BS in Computer Science, etc). Empty string if not clear or not mentioned.",
        },
        credential_major: {
          type: "string",
          description:
            "Just the major, specialization, or focus of the degree. Empty string if not clear or not mentioned.",
        },
        credential_type: {
          type: "string",
          description:
            "Doctorate, Masters, Bachelors, Associates, Diploma, etc. Empty string if not clear or not mentioned.",
        },
        location: {
          type: "string",
          description:
            "Location of the institute. Empty string if not clear or not mentioned.",
        },
      },
    },
  },
  skills: {
    type: "array",
    description:
      "Array of skills, languages, technologies, abilities listed on resume. Only include if it was listed.",
    items: {
      type: "string",
    },
  },
  role: {
    type: "string",
    description: "Choose one role that's closest fit for this individual",
    enum: [
      "Engineering",
      "Design",
      "Product",
      "Data Science",
      "Sales",
      "Marketing",
      "Customer Support",
      "Business Operations",
      "Project Management",
      "Recruiting & HR",
      "Finance",
      "Banking",
      "Legal",
      "Social Media",
      "Construction Skilled Trades",
      "Manufacturing Skilled Trades",
      "Transportation and Logistics Skilled Trades",
      "Maintenance and Repair Skilled Trades",
      "Administrative Services",
      "Healthcare Services",
      "Education Services",
      "Security and Protective Services",
      "Food and Beverage Services",
      "Retail Services",
      "Personal Care Services",
      "Operations Management",
    ],
  },
  years_of_jobs_experience: {
    type: "number",
    description: `Years of jobs experience. Do not include education years or other_experiences years.`,
  },
  name: {
    type: "string",
    description: "Name of the individual",
  },
  phone: {
    type: "string",
    description:
      "Phone number of the individual, if available. Empty string if not available.",
  },
  email: {
    type: "string",
    description:
      "Email of the individual, if available. Empty string if not available.",
  },
};

export const BROWSE_TALENT_PAGE_SIZE = 3;

export const allowedSearchTalentFilters = [
  "industries",
  "location",
  "skills",
  "credentials",
  "role",
  "is_salary_expectation_available",
  "job_title",
  "verified",
  "company",
  "years_of_exp",
  "education_institute",
];

export const CURRENT_ADMIN_USER_TYPE = {
  ANON: "anon",
  VERIFIED_ADMIN: "verified_admin",
  UNVERIFIED_ADMIN: "unverified_admin",
};
