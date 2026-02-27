import { useRef } from "react";
import { useRouter } from "next/router";
import SelectRole from "./SelectRole";
import {
  presetRoles,
  supportedRolesForSearchRecommendations,
} from "@/utils/constants";
import FeatureSelector from "./FeatureSelector";

export const SelectSuggestedCategory = () => {
  const router = useRouter();
  const { selectedRole } = router.query;
  const scrollContainerRef = useRef(null);

  if (supportedRolesForSearchRecommendations.includes(selectedRole)) {
    return (
      <div className="flex items-center space-x-1 md:space-x-2 mb-2">
        <SelectRole />
        <div className="overflow-x-hidden">
          <FeatureSelector />
        </div>
      </div>
    );
  }

  // Sort presetRoles to bring the selected role to the front
  const sortedPresetRoles = [...presetRoles].sort((a, b) => {
    if (a.value === selectedRole) return -1;
    if (b.value === selectedRole) return 1;
    return 0;
  });

  return (
    <div
      ref={scrollContainerRef}
      className="flex items-center space-x-6 md:space-x-8 overflow-x-auto w-full scrollbar-hide py-2 mb-2 text-sm"
    >
      {sortedPresetRoles.map((presetRole, i) => {
        return (
          <button
            key={presetRole.value || i}
            onClick={() => {
              const newQuery = {
                ...router.query,
              };

              if (presetRole.value) {
                newQuery.selectedRole = presetRole.value;
              } else {
                delete newQuery.selectedRole;
              }

              router
                .replace({
                  query: newQuery,
                })
                .then(() => {
                  // Scroll back to the left after the router updates
                  if (scrollContainerRef.current) {
                    scrollContainerRef.current.scrollTo(0, 0);
                  }
                });
            }}
            className={`flex-none rounded-lg ${
              presetRole.value === (selectedRole || "")
                ? "font-bold text-black text-base"
                : "font-light text-gray-600"
            }`}
          >
            {presetRole.title}
          </button>
        );
      })}
    </div>
  );
};
