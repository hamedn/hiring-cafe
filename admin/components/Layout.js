import { useRouter } from "next/router";
import AdminDashboard from "./adminDashboard";
import Inbox from "./Inbox";
import EditJob from "./EditJob";
import { useEffect, useState } from "react";
import CompleteCandidateProfile from "./CompleteCandidateProfile";
import Billing from "./billing";
import JobsDashboard from "./jobsDashboard";
import BoardManagement from "./boardManagement";
import BrowseMenu from "./BrowseMenu";
import BrowseTalent from "./talent-network-search/BrowseTalent";
import Head from "next/head";
import JobPostings from "./JobPostings";
import { CircularProgress } from "@chakra-ui/react";
import BottomTabs from "./BottomTabs";
import Script from "next/script";

const Layout = () => {
  const router = useRouter();

  const [querySlug, setQuerySlug] = useState(null);

  useEffect(() => {
    if (router.isReady) {
      setQuerySlug(router.query.slug || ["browse"]);
    }
  }, [router]);

  const component = () => {
    if (!querySlug)
      return (
        <div className="flex justify-center p-8">
          <CircularProgress isIndeterminate color="gray.600" size={"30px"} />
        </div>
      );

    const [requestComponent, ...param] = querySlug;
    switch (requestComponent) {
      case "browse":
        return <BrowseTalent />;
      case "ats":
        return <AdminDashboard />;
      case "inbox":
        return <Inbox />;
      case "edit-job":
        return <EditJob jobID={param[0]} />;
      case "c":
        return <CompleteCandidateProfile applicantId={param[0]} />;
      case "billing":
        return <Billing />;
      case "jobs":
        return <JobsDashboard />;
      case "settings":
        return <BoardManagement />;
      case "job-postings":
        return <JobPostings />;
      default:
        return null;
    }
  };

  useEffect(() => {
    if (
      router.query.slug &&
      [
        "ats",
        "inbox",
        "edit-job",
        "c",
        "billing",
        "jobs",
        "settings",
        "find-applicants",
        "inbox-find-applicants",
        "job-postings",
      ].includes(router.query.slug[0]) === false
    ) {
      router.push("/404");
    }
  }, [router]);

  return (
    <>
      <Head>
        <title>{"Employers | HiringCafe"}</title>
        <meta name="robots" content="noindex"></meta>
      </Head>
      <Script id="hs-script-loader" src="//js-na1.hs-scripts.com/23987192.js" />
      <BrowseMenu>{component()}</BrowseMenu>
      <BottomTabs />
    </>
  );
};

export default Layout;
