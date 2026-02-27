import React from "react";
import RemoteSetup from "./RemoteSetup";
import JobDescription from "./JobDescription";

const StepOne = ({ subStep, job_id }) => {
  switch (subStep) {
    case 1:
      return <RemoteSetup job_id={job_id} />;
    case 2:
      return <JobDescription job_id={job_id} />;
    default:
      return null;
  }
};

export default StepOne;
