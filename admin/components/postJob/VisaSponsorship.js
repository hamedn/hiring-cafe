import { useState } from "react";

export default function VisaSponsorship() {
  const [visa, setVisa] = useState(null);

  return (
    <div className="flex flex-col space-y-4">
      <span className="text-xl font-medium">
        Is US visa sponsorship available?
      </span>
      <div>
        <input
          type="radio"
          id="visaYes"
          name="visa"
          value="yes"
          className="text-black form-radio accent-black"
          onChange={() => setVisa("yes")}
        />
        <label htmlFor="visaYes" className="ml-2">
          Yes
        </label>
      </div>
      <div>
        <input
          type="radio"
          id="visaNo"
          name="visa"
          value="no"
          className="text-black form-radio accent-black"
          onChange={() => setVisa("no")}
        />
        <label htmlFor="visaNo" className="ml-2">
          No
        </label>
      </div>
    </div>
  );
}
