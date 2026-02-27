import useFetchPreferences from "@/hooks/useFetchPreferences";
import withAuth from "./withAuth";
import Link from "next/link";
import { ArrowUturnLeftIcon } from "@heroicons/react/24/outline";
import { useToast } from "@chakra-ui/react";
import { timeAgo } from "@/utils/helpers";

const HiddenCompaniesV4 = () => {
  const toast = useToast();
  const { userPreferences, setUserPreferences, loading } =
    useFetchPreferences();

  function unhideAllCompanies() {
    setUserPreferences({ hiddenCompaniesV4: [] });
    toast({
      title: "Success",
      description: "Successfully unhidden all companies.",
      status: "success",
      duration: 5000,
      isClosable: true,
    });
  }

  function unHideCompany(company) {
    const existingHiddenCompaniesV4 = userPreferences?.hiddenCompaniesV4 || [];

    const companyIndex = existingHiddenCompaniesV4.findIndex(
      (c) => c.token === company.token
    );
    if (companyIndex !== -1) {
      // Delete the company from the list
      existingHiddenCompaniesV4.splice(companyIndex, 1);
    }
    setUserPreferences({ hiddenCompaniesV4: existingHiddenCompaniesV4 });
    toast({
      title: "Success",
      description: "Successfully unhidden the company.",
      status: "success",
      duration: 5000,
      isClosable: true,
    });
  }

  return (
    <div className="flex flex-col items-center justify-center p-16 font-bold text-gray-400">
      Coming soon
    </div>
  );

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center p-8">
        <span className="font-bold text-gray-500">Loading...</span>
      </div>
    );
  }

  if (!(userPreferences?.hiddenCompaniesV4?.length > 0)) {
    return (
      <div className="flex flex-col justify-center items-center p-8">
        <span className="font-bold text-gray-500">{`You haven't hidden any companies yet.`}</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col space-y-4 px-4 md:px-8 xl:px-16 py-4 bg-gray-100">
      <div className="text-sm flex items-center space-x-2">
        <span className="font-bold">
          {userPreferences.hiddenCompaniesV4.length}{" "}
          {userPreferences.hiddenCompaniesV4.length > 1
            ? "companies"
            : "company"}{" "}
          hidden
        </span>
        <button
          className="text-sm text-pink-500 font-bold"
          onClick={() => {
            const confirmed = confirm(
              "Are you sure you want to unhide all companies?"
            );
            if (confirmed) {
              unhideAllCompanies();
            }
          }}
        >
          (Unhide all)
        </button>
      </div>
      {userPreferences.hiddenCompaniesV4.map((company, index) => (
        <div
          key={`${company.token || ""}___${index}`}
          className="flex items-center justify-between space-x-2 md:space-x-4 border rounded p-4 lg:p-8 bg-white"
        >
          {company.company_profile && (
            <div className="flex flex-col space-y-2">
              {company.company_profile.name && (
                <span className="font-semibold">
                  {company.company_profile.name}
                </span>
              )}{" "}
              {(company.company_profile.industry ||
                company.company_profile.tagline) && (
                <span>
                  {company.company_profile.industry && (
                    <span className="text-sm border w-fit px-1 py-0.5 rounded mr-2">
                      🏷️ {company.company_profile.industry}
                    </span>
                  )}
                  {company.company_profile.tagline && (
                    <span className="font-light text-sm">
                      {company.company_profile.tagline}
                    </span>
                  )}
                </span>
              )}
              <div className="flex items-center space-x-4">
                {company.company_profile.website && (
                  <Link
                    href={company.company_profile.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm w-fit font-medium text-pink-500"
                  >
                    Website
                  </Link>
                )}
                {company.timestamp && (
                  <span className="text-sm font-light">
                    Hidden{" "}
                    {company.timestamp && timeAgo(company.timestamp.toDate())}{" "}
                    ago
                  </span>
                )}
              </div>
            </div>
          )}
          <button
            onClick={() => {
              unHideCompany(company);
            }}
            className="flex items-center space-x-2 text-pink-500 flex-none"
          >
            <ArrowUturnLeftIcon className="h-5 w-5 md:h-7 md:w-7" />
            <span className="font-bold">Unhide</span>
          </button>
        </div>
      ))}
    </div>
  );
};

export default withAuth(HiddenCompaniesV4);
