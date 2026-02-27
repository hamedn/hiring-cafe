import xss from "xss";

export default function StepFinal({ applicant_info, stepData }) {
  const renderStatus = () => {
    if (stepData.data.stageName === "Hired") {
      return (
        <div>
          <div>Your Application is Complete. Status: Hired</div>
          <div>
            Check your Email for any further info or contact your recruiter
            directly.
          </div>
        </div>
      );
    } else if (stepData.data.stageName === "PreSubmitted") {
      return (
        <div>
          <div>We are reviewing your application</div>
          <div>
            Please check back later.
          </div>
        </div>
      );
    } else {
      return (
        <div>
          <div
            dangerouslySetInnerHTML={{
              __html: xss(stepData.data.rejection_message || ""),
            }}
          />
        </div>
      );
    }
  };
  return <div>{renderStatus()}</div>;
}
