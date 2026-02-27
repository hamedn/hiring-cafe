import Layout from "@/admin/components/Layout";
import { withAuth } from "@/admin/components/withUserCheck";

const AdminPage = () => {
  return <Layout />;
};

export default withAuth(AdminPage);
