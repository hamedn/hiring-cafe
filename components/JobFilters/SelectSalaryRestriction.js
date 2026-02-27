import {
  Slider,
  SliderFilledTrack,
  SliderThumb,
  SliderTrack,
  Switch,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { BanknotesIcon } from "@heroicons/react/24/outline";

export default function SelectSalaryRestriction() {
  const router = useRouter();
  const [onlySalaryJobs, setOnlySalaryJobs] = useState(false);
  const [salaryValue, setSalaryValue] = useState(20000);

  useEffect(() => {
    const { salaryOnly, salaryValue } = router.query;
    setOnlySalaryJobs(salaryOnly === "true" || false);
    setSalaryValue(parseInt(parseInt(salaryValue) || 20000));
  }, [router]);

  return (
    <div className={`flex flex-col flex-none w-full`}>
      <div className={`flex items-center justify-between space-x-2`}>
        <div className="flex flex-col space-y-2">
          <span className="text-lg md:text-xl font-medium">
            Transparent salaries
          </span>
          <span className="text-sm font-light text-gray-600">
            Hide jobs that do not have salary listed.
          </span>
        </div>
        <Switch
          colorScheme="green"
          isChecked={onlySalaryJobs}
          onChange={(e) => {
            setOnlySalaryJobs(e.target.checked);
            if (e.target.checked) {
              const query = {
                ...router.query,
                salaryOnly: "true",
              };
              query.salaryValue = salaryValue;
              router.replace({
                query: query,
              });
            } else {
              const { salaryOnly, salaryValue, ...routerQuery } = router.query;
              router.replace({
                query: { ...routerQuery },
              });
            }
          }}
        />
      </div>
      {onlySalaryJobs && (
        <div className="flex flex-col mt-2 justify-center items-center">
          <Slider
            aria-label="Salary Slider"
            value={salaryValue}
            min={15000}
            max={350000}
            step={10000}
            onChangeEnd={() => {
              router.replace({
                query: { ...router.query, salaryValue: salaryValue },
              });
            }}
            onChange={(value) => {
              setSalaryValue(value);
            }}
          >
            <SliderTrack>
              <SliderFilledTrack bg="gray.500" />
            </SliderTrack>
            <SliderThumb boxSize={8} _focus={{ boxShadow: "none" }}>
              <BanknotesIcon className="h-5 w-5 text-black" />
            </SliderThumb>
          </Slider>
          <span className="font-medium mt-1 text-xs">
            ${salaryValue.toLocaleString()}
          </span>
        </div>
      )}
    </div>
  );
}
