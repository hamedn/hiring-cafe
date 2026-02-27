import Link from "next/link";

export default function AboutEspresso() {
  return (
    <div className="flex flex-col text-black space-y-4">
      {/* <div className="flex flex-col space-y-2">
        <span className="font-medium text-gray-600">Promoted</span>
        <span className="text-sm">{`This is a promoted listing.`}</span>
      </div> */}
      <div className="flex flex-col space-y-2">
        <span className="font-medium text-gray-600">Actively Hiring</span>
        <span className="text-sm">
          This company is actively hiring for this position.
        </span>
      </div>
      <div className="flex flex-col space-y-2">
        <span className="font-medium text-gray-600">Faster Response</span>
        <span className="text-sm">
          {`You're more likely to get a response if you apply to Espresso jobs compared to other jobs.`}
        </span>
      </div>
      <div className="flex flex-col space-y-2">
        <span className="font-medium text-gray-600">Receive Coffee Beans</span>
        <span className="text-sm">
          {`You can receive coffee beans by applying to Espresso jobs. You can use coffee beans to redeem rewards. For candidates based in US & Canada only.`}
        </span>
      </div>
      <div className="flex flex-col space-y-2">
        <span className="font-medium text-gray-600">Note</span>
        <span className="text-sm">
          {`We don't recommend skipping lengthy applications. You can always save the job and apply later.`}{" "}
        </span>
      </div>
    </div>
  );
}
