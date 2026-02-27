import TimezoneButton from "./TimezoneButton";

const TimezoneSelection = ({ job_id, public_access = null }) => {
  return (
    <div className="grid grid-cols-2 gap-8 mt-4">
      <TimezoneButton
        job_id={job_id}
        timezone="PST"
        label="Pacific Time"
        sublabel={"(PST/PDT)"}
        public_access={public_access}
      />
      <TimezoneButton
        job_id={job_id}
        timezone="MST"
        label="Mountain Time"
        sublabel={"(MST/MDT)"}
        public_access={public_access}
      />
      <TimezoneButton
        job_id={job_id}
        timezone="CST"
        label="Central Time"
        sublabel={"(CST/CDT)"}
        public_access={public_access}
      />
      <TimezoneButton
        job_id={job_id}
        timezone="EST"
        label="Eastern Time"
        sublabel={"(EST/EDT)"}
        public_access={public_access}
      />
    </div>
  );
};

export default TimezoneSelection;
