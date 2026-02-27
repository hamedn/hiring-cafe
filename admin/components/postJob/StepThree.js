import React from "react";
import SetBudget from "./SetBudget";
import ReviewJobPost from "./ReviewJobPost";

const StepThree = ({ subStep, jobID }) => {
  switch (subStep) {
    case 1:
      return <SetBudget jobID={jobID} />;
    case 2:
      return <ReviewJobPost jobID={jobID} />;
    default:
      return null;
  }
};

export default StepThree;
