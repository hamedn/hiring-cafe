import PostAJob from "@/admin/components/postJob";
import { withBoard } from "@/admin/components/withUserCheck";
import Head from "next/head";

const PostAJobPage = () => {
  return (
    <>
      <Head>
        <title>{"Post a Job - Hiring Cafe"}</title>
      </Head>
      <PostAJob />
    </>
  );
};

export default withBoard(PostAJobPage);
