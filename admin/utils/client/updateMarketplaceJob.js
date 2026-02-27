import axios from "axios";

export const updateMarketplaceJob = async (job, updateKey, updateValue) => {
  if (job.status !== 'listed') return;
  const job_id = job.id;
  try {
    const dataToSend = {
      job_id: job_id,
      field_string: updateKey,
      field_content: updateValue,
    };
    await axios.post(`/api/marketplaceFunctions/updateListedJobInfo`, dataToSend);
  } catch (error) {
    console.log(error);
  }
};
