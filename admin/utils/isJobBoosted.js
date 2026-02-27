import { boostDurationMS } from "@/utils/constants";

export const isJobBoosted = (jobBoost) => {
  if (!jobBoost) return false;
  const {
    date
  } = jobBoost;
  if (!date) return false;

  const today = new Date().getTime();

  if (date + boostDurationMS > today) return true;

  return false;
};