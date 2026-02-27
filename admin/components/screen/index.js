import ScreenVideoForm from "./ScreenVideoForm";

export default function ScreenComponent({ screenID, job_id }) {
  return (
    <div className="container mx-auto px-4">
      <ScreenVideoForm screenID={screenID} job_id={job_id} />
    </div>
  );
}
