import stepProcessor from "../utils/stepProcessor";
import { useState, useEffect } from "react";
import VideoAskInitialScreen from "./VideoAskInitialScreen";
import ResumeSummary from "./resumeSummary";
import StepFinal from "./StepFinal";
import CandidateDashboard from "./CandidateDashboard";
import { CircularProgress } from "@chakra-ui/react";
import ScreenList from "./screens/screenList";

export default function CandidateSteps({ applicant_info, mutate }) {
  const [isLoading, setIsLoading] = useState(true);
  const [stepData, setStepData] = useState(null);
  /* 
        stepdata {
            index: currentStep Index
            data: any extra data needed for current step
        }
    */
  // Step 1: VideoAsk Component
  // Step 2: Resume Tokens Component
  // Step 3: Dashboard Component, Interview Availability for custom_step, Messaging, etc
  // Step 4: Completed!

  useEffect(() => {
    void (async () => {
      const retrievedStepData = await stepProcessor(applicant_info);
      setStepData(retrievedStepData);
      setIsLoading(false);
    })();
  }, [applicant_info]);

  if (isLoading) {
    return (
      <div className="flex justify-center my-16">
        <CircularProgress isIndeterminate color="yellow.600" size="30px" />
      </div>
    );
  }

  const renderStep = () => {
    const component = () => {
      switch (stepData.index) {
        case 1:
          return (
            <VideoAskInitialScreen
              applicant_info={applicant_info}
              stepData={stepData}
              mutate={mutate}
            />
          );
        // 2 is currently not being used.
        case 2:
          return (
            <ResumeSummary
              applicant_id={applicant_info.applicantId}
              access_token={applicant_info.candidate_token.token}
              mutate={mutate}
            />
          );
        case 3:
          return (
            <CandidateDashboard
              applicant_info={applicant_info}
              stepData={stepData}
              mutate={mutate}
            />
          );
        case 4:
          return (<ScreenList applicant_info={applicant_info} />);
        case 5:
          return (
            <StepFinal applicant_info={applicant_info} stepData={stepData} />
          );
        default:
          return (
            <ResumeSummary
              applicant_id={applicant_info.applicantId}
              mutate={mutate}
            />
          );
      }
    };
    return <div className="">{component()}</div>;
  };

  return renderStep();
}
