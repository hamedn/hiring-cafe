import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function useBrowseJobsSelectedCompany() {
  const router = useRouter();
  const [company, setCompany] = useState(null);

  useEffect(() => {
    if (router.query["company"]) {
      const [ats, token, name, website] = atob(router.query["company"]).split(
        "___"
      );
      setCompany({
        ats,
        token,
        name: name !== "N/A" ? name : null,
        website: website !== "N/A" ? website : null,
      });
    } else {
      setCompany(null);
    }
  }, [router.query]);

  return { company };
}
