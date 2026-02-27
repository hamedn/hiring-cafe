import { useRouter } from "next/router";
import SelectCommitmentType from "./SelectCommitmentType";
import SelectDatePosted from "./SelectDatePosted";
import SelectExperience from "./SelectExperience";
import SelectSalaryRestriction from "./SelectSalaryRestriction";
import { Checkbox, Switch } from "@chakra-ui/react";

export default function JobFilters() {
  const router = useRouter();

  return (
    <div className="flex flex-col bg-white">
      <div className="flex flex-col mb-6 divide-y">
        <div
          className={`flex items-center justify-between space-x-4 md:space-y-8 lg:space-x-16 pb-8`}
        >
          <div className="flex flex-col space-y-2">
            <span className="text-lg md:text-xl font-medium">
              Simple Application Form
            </span>
            <span className="text-sm font-light text-gray-600">
              {`Hide jobs with a lengthy application process. For example, if they
              require you to create an account, structure your resume in a
              specific way, etc. At the moment, all jobs on HiringCafe have simple
              application forms which is why you can't change this filter.`}
            </span>
            <span className="text-sm font-light text-gray-600">
              Note: Not applicable for Promoted Jobs
            </span>
          </div>
          <Switch colorScheme="green" isChecked={true} disabled />
        </div>
        <div className="py-8">
          <SelectSalaryRestriction />
        </div>
        <div className="flex flex-col py-8">
          <div className="flex flex-col space-y-2 mb-4">
            <div className="flex items-center space-x-2">
              <span className="text-lg md:text-xl font-medium">Experience</span>
              {router.query.selectedExperience && (
                <div>
                  <button
                    onClick={() => {
                      const newQuery = { ...router.query };
                      delete newQuery.selectedExperience;
                      router.replace({
                        query: newQuery,
                      });
                    }}
                    className="text-xs underline font-light"
                  >
                    Reset
                  </button>
                </div>
              )}
            </div>
            <span className="text-sm">
              Years of experience required for the role.
            </span>
          </div>
          <SelectExperience />
        </div>
        <div className="flex flex-col py-8">
          <div className="flex flex-col mb-4">
            <span className="text-lg md:text-xl font-medium">Commitment</span>
            <span className="text-sm mt-2">
              Full time, Part time, Contract, Internship, Temporary, Other
            </span>
          </div>
          <SelectCommitmentType />
        </div>
        <div className="flex flex-col py-8">
          <div className="flex flex-col space-y-1 mb-4">
            <span className="text-lg md:text-xl font-medium">Date posted</span>
            {router.query.realDate && (
              <div className="text-xs bg-yellow-50 font-light p-2 rounded">
                {`Some companies may keep their job listings open for a longer period of time if they're hiring for multiple roles or if they have a hard-to-fill role. When adding this filter, you may miss out on such opportunities. BTW, jobs are sorted by date posted by default ;)`}
              </div>
            )}
          </div>
          <SelectDatePosted />
        </div>
        {/* <div className="flex flex-col py-8">
          <span className="text-lg md:text-xl font-medium mb-4">
            Unique Benefits
          </span>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Checkbox
              size="lg"
              colorScheme="gray"
              defaultChecked={router.query.hasFourDayWorkWeek === "true"}
              checked={router.query.hasFourDayWorkWeek === "true"}
              onChange={(e) => {
                const newQuery = { ...router.query };
                if (e.target.checked) {
                  newQuery.hasFourDayWorkWeek = "true";
                } else {
                  delete newQuery.hasFourDayWorkWeek;
                }
                router.replace({
                  query: newQuery,
                });
              }}
            >
              <span className="text-base">Four Day Work Week</span>
            </Checkbox>
            <Checkbox
              size="lg"
              colorScheme="gray"
              defaultChecked={router.query.hasUnlimitedPTO === "true"}
              checked={router.query.hasUnlimitedPTO === "true"}
              onChange={(e) => {
                const newQuery = { ...router.query };
                if (e.target.checked) {
                  newQuery.hasUnlimitedPTO = "true";
                } else {
                  delete newQuery.hasUnlimitedPTO;
                }
                router.replace({
                  query: newQuery,
                });
              }}
            >
              <span className="text-base">Unlimited PTO</span>
            </Checkbox>
          </div>
        </div> */}
        {/* <div className="flex flex-col py-8">
          <span className="text-lg md:text-xl font-medium mb-4">Insights</span>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Checkbox
              size="lg"
              colorScheme="gray"
              defaultChecked={router.query.hasInterviewProcess === "true"}
              checked={router.query.hasInterviewProcess === "true"}
              onChange={(e) => {
                const newQuery = { ...router.query };
                if (e.target.checked) {
                  newQuery.hasInterviewProcess = "true";
                } else {
                  delete newQuery.hasInterviewProcess;
                }
                router.replace({
                  query: newQuery,
                });
              }}
            >
              <span className="text-base">Transparent Interview Process</span>
            </Checkbox>
          </div>
        </div> */}
      </div>
    </div>
  );
}
