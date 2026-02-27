import SearchNavBar from "../SearchNavBar";
import SelectedCompanyBioV4 from "../V5Filters/SelectedCompanyBioV4";
import SearchHitsV5 from "./SearchHitsV5";

export default function BrowseJobsV2() {
  return (
    <>
      <div
        className={`flex flex-col md:bg-neutral-50 w-full py-2 lg:sticky lg:top-0 md:border-b md:z-50`}
      >
        <div className="flex justify-center w-full">
          <div className="flex flex-col w-full max-w-[2000px] space-y-8 md:space-y-2 items-center">
            <SearchNavBar />
            <SelectedCompanyBioV4 />
          </div>
        </div>
      </div>
      <div className="flex justify-center md:bg-neutral-100">
        <div className="flex flex-col w-full max-w-[2000px]">
          <SearchHitsV5 />
        </div>
      </div>
    </>
  );
}
