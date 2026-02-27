import SearchFilter from "./SearchFilter";
import SelectLocationV3 from "../JobFilters/SelectLocationV3";
import JobFilters from "../JobFilters";
import _ from "lodash";

export default function CreateSearch({ currentOption }) {
  return (
    <>
      <div className="flex flex-col w-full">
        <div className="md:flex md:justify-center">
          <div className="flex-auto md:max-w-2xl md:my-8 md:px-4 py-4 md:rounded-xl md:bg-white md:shadow-xl">
            {currentOption === 0 ? (
              <SearchFilter />
            ) : currentOption === 1 ? (
              <SelectLocationV3 />
            ) : (
              <JobFilters />
            )}
          </div>
        </div>
      </div>
    </>
  );
}
