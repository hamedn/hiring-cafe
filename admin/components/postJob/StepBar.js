import React from "react";

const StepBar = ({ step, subStep, maxSubStep }) => {
  const percentage = ((subStep - 1) / maxSubStep) * 100;

  const renderSteps = () => {
    let steps = [];
    // set this and w1/2 to 3 when adding back budget/preview
    for (let i = 0; i < 2; i++) {
      steps.push(
        <div
          key={i}
          className={`w-1/2 h-1.5 bg-gray-200 rounded-full overflow-hidden ${
            i < 2 && "mr-2"
          }`}
        >
          {i < step && (
            <div
              style={{ width: i + 1 === step ? `${percentage}%` : "100%" }}
              className="h-full bg-black rounded-full transition-all duration-500"
            ></div>
          )}
        </div>
      );
    }
    return steps;
  };

  return <div className="w-full h-4 flex">{renderSteps()}</div>;
};

export default StepBar;
