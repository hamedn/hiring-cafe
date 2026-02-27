import {
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Switch,
} from "@chakra-ui/react";
import { QuestionMarkCircleIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function SelectRestrictByTitle() {
  const router = useRouter();
  const [restrictByTitle, setRestrictByTitle] = useState(false);

  useEffect(() => {
    const { restrictByTitle } = router.query;
    setRestrictByTitle(restrictByTitle === "true");
  }, [router]);

  return (
    <div className={`flex items-center justify-between space-x-2`}>
      <div className="flex flex-col space-y-1">
        <span className="font-medium">Restrict by Job Title</span>
        <span className="text-sm font-light text-gray-600">
          {`Jobs must contain ${
            `the term '${router.query.searchQuery}'` || "the search term"
          } in the job title.`}
        </span>
      </div>
      <Switch
        colorScheme="green"
        isChecked={restrictByTitle}
        onChange={() => {
          setRestrictByTitle(!restrictByTitle);
          if (restrictByTitle) {
            const { restrictByTitle, ...routerQuery } = router.query;
            router.replace({
              query: { ...routerQuery },
            });
          } else {
            router.replace({
              query: { ...router.query, restrictByTitle: "true" },
            });
          }
        }}
      />
    </div>
  );
}
