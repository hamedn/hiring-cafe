import {
  jobFilterFields,
  locationJobFilterFields,
  searchJobFilterFields,
} from "@/utils/constants";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export const useJobFiltersCount = () => {
  const router = useRouter();
  const [numFilters, setNumFilters] = useState(0);
  const [locFilters, setLocFilters] = useState(0);
  const [queryFilters, setQueryFilters] = useState(0);

  useEffect(() => {
    const queryFields = router.query;
    const numFilters = jobFilterFields.reduce((count, field) => {
      return count + (queryFields[field] ? 1 : 0);
    }, 0);
    const numLocFilters = locationJobFilterFields.reduce((count, field) => {
      return count + (queryFields[field] ? 1 : 0);
    }, 0);
    let numQFilters = searchJobFilterFields.reduce((count, field) => {
      return count + (queryFields[field] ? 1 : 0);
    }, 0);
    // // Count number of industries selected
    // if (queryFields.selectedIndustries) {
    //   numQFilters += queryFields.selectedIndustries.split("~").length - 1;
    // }
    setNumFilters(numFilters);
    setLocFilters(numLocFilters);
    setQueryFilters(numQFilters);
  }, [router]);

  return {
    numFilters,
    numLocFilters: locFilters,
    numQueryFilters: queryFilters,
  };
};
