import { useEffect, useState } from "react";
import InfiniteScrollTalentPool from "./InfiniteScrollTalentPool";
import {
  AcademicCapIcon,
  BanknotesIcon,
  BuildingLibraryIcon,
  BuildingOffice2Icon,
  BuildingOfficeIcon,
  CalendarDaysIcon,
  CheckBadgeIcon,
  MapPinIcon,
  PresentationChartLineIcon,
  WrenchScrewdriverIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import {
  CircularProgress,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
} from "@chakra-ui/react";
import Sheet from "react-modal-sheet";
import SearchBar from "./SearchBar";
import useInfiniteScroll from "./useInfiniteScroll";
import { FilterButton } from "../Filter/FilterButton";
import FilterSelection from "../Filter/FilterSelection";
import LocationFilter from "../Filter/LocationFilter";
import YearsOfExperienceFilter from "../Filter/YearsOfExperienceFilter";
import useBoard from "@/admin/hooks/useBoard";
import { useAuth } from "@/admin/hooks/useAuth";
import LoadingCandidates from "./LoadingCandidates";
import Link from "next/link";
import { usePaymentGuard } from "../../withUserCheck";
import { useRouter } from "next/router";

const defaultLocationFilter = {
  name: "Worldwide",
  type: "Anywhere",
  value: "",
  includeCandidatesWillingToWork: false,
};

const defaultYearsOfExpFilter = {
  label: "Years of Exp",
  value: null,
};

const filterLabels = {
  industries: {
    label: "Industry Exp",
    icon: BuildingOffice2Icon,
  },
  skills: {
    label: "Skills",
    icon: WrenchScrewdriverIcon,
  },
  role: {
    label: "Category",
    icon: PresentationChartLineIcon,
  },
  company: {
    label: "Company",
    icon: BuildingOfficeIcon,
  },
  credentials: {
    label: "Education",
    icon: AcademicCapIcon,
  },
  education_institute: {
    label: "University",
    icon: BuildingLibraryIcon,
  },
  // verified: {
  //   label: "Verified Human",
  //   icon: CheckBadgeIcon,
  // },
  is_salary_expectation_available: {
    label: "Salary Expectation",
    icon: BanknotesIcon,
  },
};

export default function BrowseTalent() {
  const [filters, setFilters] = useState({
    location: defaultLocationFilter,
    years_of_exp: defaultYearsOfExpFilter,
    ...Object.keys(filterLabels).reduce((acc, filter) => {
      acc[filter] = [];
      return acc;
    }, {}),
  });
  const [query, setQuery] = useState("");
  const [isMobileLocationModalOpen, setMobileLocationModalOpen] =
    useState(false);
  const [isMobileYOEModalOpen, setIsMobileYOEModalOpen] = useState(false);
  const [selectedMobileFilterForModal, setSelectedMobileFilterForModal] =
    useState(null);
  const [facetSearchTerm, setFacetSearchTerm] = useState(null);

  const { userData, user, loadingUser } = useAuth();
  const { board } = useBoard({ board_id: userData?.board || null });

  const { data, size, setSize, error, isLoading } = useInfiniteScroll(
    query,
    filters,
    user ? true : false
  );

  const router = useRouter();
  usePaymentGuard();

  useEffect(() => {
    if (userData && !userData.board) {
      router.push({
        pathname: `/admin/onboarding`,
      });
    }
  }, [router, userData]);

  const clearFilter = (filter) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [filter]: [],
    }));
    setFacetSearchTerm((prevFacetSearchTerm) => ({
      ...prevFacetSearchTerm,
      [filter]: "",
    }));
  };

  const toggleFilterSelection = ({ filter, value }) => {
    setFilters((prevFilters) => {
      if (prevFilters[filter].includes(value)) {
        const newFilters = {
          ...prevFilters,
        };
        newFilters[filter] = prevFilters[filter].filter((i) => i !== value);
        return newFilters;
      } else {
        const newFilters = {
          ...prevFilters,
        };
        newFilters[filter] = [...prevFilters[filter], value];
        return newFilters;
      }
    });
  };

  const locFilterBtn = () => {
    return (
      <FilterButton
        label={filters.location.name}
        label_icon={MapPinIcon}
        count={
          filters.location.type === "Anywhere"
            ? null
            : filters.location.value
            ? 1
            : null
        }
        hideCount={true}
      />
    );
  };

  const mobileFilters = () => {
    return (
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-4 overflow-x-auto scrollbar-hide">
          <button
            className="flex-none"
            onClick={() => setMobileLocationModalOpen(true)}
          >
            {locFilterBtn()}
          </button>
          <button
            className="flex-none"
            onClick={() => setIsMobileYOEModalOpen(true)}
          >
            {yoeFilterBtn()}
          </button>
          {Object.keys(filterLabels).map((filter) => {
            return (
              <button
                className="flex-none"
                key={filter}
                onClick={() => setSelectedMobileFilterForModal(filter)}
              >
                <FilterButton
                  label_icon={filterLabels[filter].icon}
                  label={filterLabels[filter].label}
                  count={filters[filter]?.length || null}
                />
              </button>
            );
          })}
        </div>
        {clearFilters()}
      </div>
    );
  };

  const desktopFilters = () => {
    return (
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-4 overflow-x-auto scrollbar-hide">
          <Popover isLazy={true}>
            <PopoverTrigger>
              <button className="flex-none">{locFilterBtn()}</button>
            </PopoverTrigger>
            <PopoverContent>
              <PopoverArrow />
              <PopoverCloseButton />
              <PopoverHeader>
                <span className="font-medium text-sm">Candidate Location</span>
              </PopoverHeader>
              <PopoverBody>{locationFilter()}</PopoverBody>
            </PopoverContent>
          </Popover>
          <Popover isLazy={true}>
            <PopoverTrigger>
              <button className="flex-none">{yoeFilterBtn()}</button>
            </PopoverTrigger>
            <PopoverContent>
              <PopoverArrow />
              <PopoverCloseButton />
              <PopoverHeader>
                <div className="flex items-center space-x-4">
                  <span className="font-medium text-sm">
                    {filters.years_of_exp.label}
                  </span>
                  {filters.years_of_exp.value && (
                    <button
                      className="underline font-bold text-xs"
                      onClick={() => clearYOEFilter()}
                    >
                      Clear
                    </button>
                  )}
                </div>
              </PopoverHeader>
              <PopoverBody>{yoeFilterComponent()}</PopoverBody>
            </PopoverContent>
          </Popover>
          {Object.keys(filterLabels).map((filter) => {
            return (
              <Popover key={filter} isLazy={true}>
                <PopoverTrigger>
                  <button className="flex-none">
                    <FilterButton
                      label_icon={filterLabels[filter].icon}
                      label={filterLabels[filter].label}
                      count={filters[filter]?.length || null}
                    />
                  </button>
                </PopoverTrigger>
                <PopoverContent>
                  <PopoverArrow />
                  <PopoverCloseButton />
                  <PopoverHeader>
                    <div className="flex items-center space-x-3 text-sm font-medium">
                      <span>{filterLabels[filter].label}</span>
                      {filters[filter]?.length > 0 && (
                        <button
                          className="text-xs underline font-bold"
                          onClick={() => clearFilter(filter)}
                        >
                          Clear
                        </button>
                      )}
                    </div>
                  </PopoverHeader>
                  <PopoverBody>{getFilterComponent(filter)}</PopoverBody>
                </PopoverContent>
              </Popover>
            );
          })}
        </div>
        {clearFilters()}
      </div>
    );
  };

  const yoeFilterBtn = () => {
    return (
      <FilterButton
        label={filters.years_of_exp.label}
        label_icon={CalendarDaysIcon}
        count={filters.years_of_exp.value ? 1 : null}
        hideCount={true}
      />
    );
  };

  const yoeFilterComponent = () => {
    return (
      <YearsOfExperienceFilter
        filterType={"years_of_exp"}
        yoe={filters.years_of_exp.value}
        setYOE={(value) =>
          setFilters((prevFilters) => ({
            ...prevFilters,
            years_of_exp: {
              ...prevFilters.years_of_exp,
              value,
            },
          }))
        }
      />
    );
  };

  const countFilters = () => {
    let filtersCount = Object.keys(filters).reduce((acc, filter) => {
      acc += filters[filter]?.length ? 1 : 0;
      return acc;
    }, 0);

    if (filters.location.value) {
      filtersCount++;
    }

    if (filters.years_of_exp.value) {
      filtersCount++;
    }

    return filtersCount;
  };

  const clearFilters = () => {
    return countFilters() > 0 ? (
      <button
        className="text-sm flex-none font-medium underline"
        onClick={() => {
          setFilters({
            location: defaultLocationFilter,
            years_of_exp: defaultYearsOfExpFilter,
            ...Object.keys(filterLabels).reduce((acc, filter) => {
              acc[filter] = [];
              return acc;
            }, {}),
          });
          setFacetSearchTerm(null);
        }}
      >
        {`Clear ${countFilters()} filter${countFilters() > 1 ? "s" : ""}`}
      </button>
    ) : null;
  };

  const locationFilter = () => {
    return (
      <LocationFilter
        location={filters.location}
        setLocation={(newLocation) =>
          setFilters((prevFilters) => ({
            ...prevFilters,
            location: {
              ...prevFilters.location,
              ...newLocation,
            },
          }))
        }
      />
    );
  };

  const getFilterComponent = (filter) => {
    return data?.[0]?.facets?.[filter] ? (
      <FilterSelection
        facetSearchTerm={facetSearchTerm}
        setFacetSearchTerm={setFacetSearchTerm}
        filterType={filter}
        items={data[0].facets[filter]}
        selectedItems={filters[filter]}
        toggleItem={(value) => toggleFilterSelection({ filter, value })}
      />
    ) : null;
  };

  const clearYOEFilter = () => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      years_of_exp: defaultYearsOfExpFilter,
    }));
  };

  if (user && !userData?.board) {
    return (
      <div className="flex justify-center h-screen mt-16">
        <CircularProgress isIndeterminate color="gray.600" size={"30px"} />
      </div>
    );
  }

  return (
    <>
      {board && !board.verified && (
        <div className="flex justify-center mt-2 text-sm">
          <span className="bg-red-100 text-red-600 rounded-full px-4 py-1 font-medium">
            {"Your account is under review"}
          </span>
        </div>
      )}
      <div className="flex flex-col px-4 md:px-8 pb-16">
        <div className="sticky top-0 flex flex-col space-y-3 bg-white pt-4 pb-6 z-10">
          {/* {!loadingUser && !user && (
            <div className="flex justify-center text-center">
              <Link
                href="/employers"
                className="text-yellow-600 px-4 font-bold w-full md:w-fit mx-4 md:mx-8"
              >
                Get Recruiter Pro to contact candidates
              </Link>
            </div>
          )} */}
          {/* <span className="flex justify-center text-red-600 font-medium">
            SAMPLE DATA - NOT REAL CANDIDATES
          </span> */}
          <SearchBar setQuery={setQuery} />
          <div className="hidden md:block">{desktopFilters()}</div>
          <div className="md:hidden">{mobileFilters()}</div>
        </div>
        {isLoading ? (
          <LoadingCandidates />
        ) : (
          <InfiniteScrollTalentPool
            data={data}
            size={size}
            setSize={setSize}
            error={error}
          />
        )}
      </div>
      <Sheet
        style={{ zIndex: 1900 }}
        snapPoints={[400]}
        isOpen={isMobileLocationModalOpen}
        onClose={() => setMobileLocationModalOpen(false)}
      >
        <Sheet.Container>
          <Sheet.Header>
            <div className="flex items-center justify-between px-4 py-2 border-b border-gray-200 mb-8">
              <button
                onClick={() => setMobileLocationModalOpen(false)}
                className="text-accent-slate-600"
              >
                <XMarkIcon className="h-5 w-5 flex-none" />
              </button>
              <span className="font-medium ml-2 flex justify-center">
                Candidate Location
              </span>
              <div />
            </div>
          </Sheet.Header>
          <Sheet.Content>
            <div className="flex flex-col flex-auto">
              <div className="flex-auto px-4">{locationFilter()}</div>
              <div className="flex justify-end p-4 border-t">
                <button
                  className="border px-4 py-2 bg-slate-600 text-white rounded-lg font-medium"
                  onClick={() => {
                    setMobileLocationModalOpen(false);
                  }}
                >
                  <span>Show candidates</span>
                </button>
              </div>
            </div>
          </Sheet.Content>
        </Sheet.Container>
        <Sheet.Backdrop />
      </Sheet>
      <Sheet
        snapPoints={[400]}
        isOpen={isMobileYOEModalOpen}
        onClose={() => setIsMobileYOEModalOpen(false)}
      >
        <Sheet.Container>
          <Sheet.Header>
            <div className="flex items-center justify-between px-4 py-2 border-b border-gray-200 mb-8">
              <button
                onClick={() => setIsMobileYOEModalOpen(false)}
                className="text-accent-slate-600"
              >
                <XMarkIcon className="h-5 w-5 flex-none" />
              </button>
              <div className="flex items-center space-x-3">
                <span className="font-medium flex justify-center">
                  {filters.years_of_exp.label}
                </span>
                {filters.years_of_exp.value && (
                  <button
                    className="underline font-bold text-xs"
                    onClick={() => clearYOEFilter()}
                  >
                    Clear
                  </button>
                )}
              </div>
              <div />
            </div>
          </Sheet.Header>
          <Sheet.Content>
            <div className="flex flex-col flex-auto">
              <div className="flex-auto px-4">{yoeFilterComponent()}</div>
              <div className="flex justify-end p-4 border-t">
                <button
                  className="border px-4 py-2 bg-slate-600 text-white rounded-lg font-medium"
                  onClick={() => {
                    setIsMobileYOEModalOpen(false);
                  }}
                >
                  <span>Show candidates</span>
                </button>
              </div>
            </div>
          </Sheet.Content>
        </Sheet.Container>
        <Sheet.Backdrop />
      </Sheet>
      <Sheet
        snapPoints={[400]}
        isOpen={selectedMobileFilterForModal}
        onClose={() => setSelectedMobileFilterForModal(null)}
      >
        <Sheet.Container>
          <Sheet.Header>
            <div className="flex items-center justify-between px-4 py-2 border-b border-gray-200 mb-8">
              <button
                onClick={() => setSelectedMobileFilterForModal(null)}
                className="text-accent-slate-600"
              >
                <XMarkIcon className="h-5 w-5 flex-none" />
              </button>
              <div className="flex items-center space-x-3">
                <span className="font-medium flex justify-center">
                  {filterLabels[selectedMobileFilterForModal]?.label || ""}
                </span>
                {filters[selectedMobileFilterForModal]?.length > 0 && (
                  <button
                    className="underline font-bold text-xs"
                    onClick={() => clearFilter(selectedMobileFilterForModal)}
                  >
                    Clear
                  </button>
                )}
              </div>
              <div />
            </div>
          </Sheet.Header>
          <Sheet.Content>
            <div className="flex flex-col space-y-4">
              <div className="flex flex-col flex-auto border-t border-t-gray-100 pt-4">
                {selectedMobileFilterForModal && (
                  <div className="flex-auto px-4">
                    {getFilterComponent(selectedMobileFilterForModal)}
                  </div>
                )}
              </div>
              <div className="flex justify-end p-4 border-t">
                <button
                  className="border px-4 py-2 bg-slate-600 text-white rounded-lg font-medium"
                  onClick={() => {
                    setSelectedMobileFilterForModal(null);
                  }}
                >
                  <span>Show candidates</span>
                </button>
              </div>
            </div>
          </Sheet.Content>
        </Sheet.Container>
        <Sheet.Backdrop />
      </Sheet>
    </>
  );
}
