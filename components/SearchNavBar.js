import JobFiltersNavBar from "./JobFiltersNavBar";
import { useRouter } from "next/router";
import NavBarV5 from "./NavBarV5";

export default function SearchNavBar() {
  const router = useRouter();
  return (
    <div className="flex flex-col w-full space-y-8 md:space-y-4">
      <div className="px-4 xl:px-8 mt-4 md:mt-0">
        <NavBarV5 />
      </div>
      {(router.pathname === "/" || router.pathname.startsWith("/jobs/")) && (
        <div className="w-full px-4 xl:px-8">
          <JobFiltersNavBar />
        </div>
      )}
    </div>
  );
}
