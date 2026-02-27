import { presetRoles } from "@/utils/constants";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function SelectRole() {
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState("");

  useEffect(() => {
    setSelectedRole(router.query.selectedRole || "");
  }, [router]);

  return (
    <select
      className={`rounded-xl px-1.5 md:px-3 py-1 outline-none appearance-none bg-white text-xs md:text-sm text-center w-26 flex-none truncate md:w-fit ${
        selectedRole ? "font-medium border md:border-2 border-black" : "border"
      }`}
      value={selectedRole}
      onChange={(e) => {
        if (e.target.value && e.target.value.length) {
          const newQuery = {
            ...router.query,
            selectedRole: e.target.value,
          };
          router.replace({
            query: newQuery,
          });
        } else {
          const { selectedRole, ...routerQuery } = router.query;
          router.replace({
            query: { ...routerQuery },
          });
        }
      }}
    >
      {presetRoles.map((role, i) => (
        <option key={role.value || i} value={role.value}>
          {role.title}
        </option>
      ))}
    </select>
  );
}
