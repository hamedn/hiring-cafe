import { useState } from "react";

export default function LocationRequirements() {
  const [usCandidatesOnly, setUSCandidatesOnly] = useState(null);

  return (
    <div className="flex flex-col">
      <span className="font-medium text-xl">
        Can candidates outside of the US apply for this job?
      </span>
      <div className="mt-4">
        <input
          type="radio"
          id="usCandidatesOnlyYes"
          name="usCandidatesOnly"
          value="yes"
          className="text-black form-radio accent-black"
          onChange={() => setUSCandidatesOnly("yes")}
        />
        <label htmlFor="usCandidatesOnlyYes" className="ml-2 font-medium">
          Yes
        </label>
        <div className="text-sm ml-6">
          As long as they are authorized to work in their location, are
          proficient in English, and can work in our timezone
        </div>
      </div>
      <div className="mt-4">
        <input
          type="radio"
          id="usCandidatesOnlyNo"
          name="usCandidatesOnly"
          value="no"
          className="text-black form-radio accent-black"
          onChange={() => setUSCandidatesOnly("no")}
        />
        <label htmlFor="usCandidatesOnlyNo" className="ml-2 font-medium">
          No
        </label>
        <div className="text-sm ml-6">We only accept US applicants</div>
      </div>
    </div>
  );
}
