import React from "react";

const StepTimeline = ({ steps, selectedStep, onStepSelected }) => {
  return (
    <div className="flex justify-between border rounded-xl p-2">
      {steps.map((step, index) => (
        <React.Fragment key={index}>
          <button
            className="flex flex-col items-center hover:bg-gray-100 hover:rounded-xl px-6 py-2"
            onClick={() => onStepSelected(step.id)}
          >
            <div
              className={`${
                step.id === selectedStep
                  ? "text-white bg-black"
                  : "text-gray-500 border border-gray-500"
              } z-10 flex items-center justify-center w-12 h-12 rounded-full m-2`}
            >
              {step.id}
            </div>
            <div className="font-semibold mt-2 flex-none">{step.label}</div>
          </button>
          {index < steps.length - 1 && (
            <div className="h-0.5 bg-gray-200 self-center w-full" />
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

export default StepTimeline;
