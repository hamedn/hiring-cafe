import Steps from "@/admin/components/postJob/Steps";
import { withBoard } from "@/admin/components/withUserCheck";
import Head from "next/head";

const PostAJobPage = () => {
  return (
    <>
      <Head>
        <title>{"Post a Job - Hiring Cafe"}</title>
      </Head>
      <Steps />
    </>
  );
};

export default withBoard(PostAJobPage);
