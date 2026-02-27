import React from "react";
import SetScreen from "./SetScreen";
import InterviewProcess from "./InterviewProcess";

const StepTwo = ({ subStep, jobID }) => {
  return <InterviewProcess jobID={jobID} />;
  // switch (subStep) {
  //   case 1:
  //     return <SetScreen jobID={jobID} />;
  //   case 2:
  //     return <InterviewProcess jobID={jobID} />;
  //   default:
  //     return null;
  // }
};

export default StepTwo;
