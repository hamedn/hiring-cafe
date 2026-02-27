import { allowedSearchTalentFilters } from "./constants";

export const listIncompleteJobFields = (job) => {
  const incompleteFields = [];
  const {
    job_info,
    category,
    interview_process,
    // initial_screen_id,
  } = job;
  const { title, job_description, salary, workplace_address } = job_info;

  if (!title || title.length === 0) incompleteFields.push("Title");

  if (!job_description || job_description.length === 0)
    incompleteFields.push("Job Description");

  if (!interview_process || interview_process.length === 0)
    incompleteFields.push("Interview Process");

  if (!workplace_address || workplace_address.length === 0)
    incompleteFields.push("Location Information");

  return incompleteFields;
};

export const isJobFullyConfigured = (job) => {
  const fields = listIncompleteJobFields(job);

  if (fields.length > 0) return false;

  return true;
};

export const isJobBudgetConfigured = (budget) => {
  const { desired_budget, warning_threshold, cost_per_introduction } = budget;

  if (!desired_budget) return false;
  if (desired_budget < cost_per_introduction) return false;

  if (warning_threshold < 1) return false;
  if (warning_threshold > desired_budget) return false;

  return true;
};

export const isBoardBillingConfigured = (billing) => {
  const { stripe_id, default_payment } = billing;

  if (!stripe_id || stripe_id.length === 0) return false;
  if (!default_payment || default_payment.length === 0) return false;

  return true;
};
