import { useAuth } from "@/admin/hooks/useAuth";
import { useToast } from "@chakra-ui/react";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/router";

export default function PostAJob() {
  const { userData } = useAuth();
  const router = useRouter();
  const toast = useToast();
  if (!userData) return null;

  return (
    <div className="flex flex-col">
      <Link href={"/admin"}>Exit</Link>
      {/* <button
        onClick={async () => {
          try {
            const res = await axios.post("/api/admin/job");
            router.push(`/admin/post-a-job/${res.data.job_id}`);
          } catch (e) {
            console.log(e);
            toast({
              title: "Error",
              description: e.message,
              status: "error",
              duration: 5000,
              isClosable: true,
            });
          }
        }}
      >
        Create job
      </button> */}
      <span>Welcome back, {userData.name}</span>{" "}
    </div>
  );
}
