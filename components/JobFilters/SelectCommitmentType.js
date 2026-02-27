import { useRouter } from "next/router";
import Select from "react-select";

export default function SelectCommitmentType() {
  const router = useRouter();
  const commitmentOptions = [
    { value: "Full Time", label: "Full Time" },
    { value: "Part Time", label: "Part Time" },
    { value: "Contract", label: "Contract" },
    { value: "Internship", label: "Internship" },
    { value: "Temporary", label: "Temporary" },
    { value: "Other", label: "Other" },
  ];

  const commitmentType = (router.query.commitmentType || "").split(",");

  return (
    <Select
      isMulti
      placeholder="Any..."
      defaultValue={commitmentOptions.filter((option) =>
        commitmentType.includes(option.value)
      )}
      value={commitmentOptions.filter((option) =>
        commitmentType.includes(option.value)
      )}
      options={commitmentOptions}
      onChange={(selectedOptions) => {
        const selectedCommitmentType = selectedOptions.map(
          (option) => option.value
        );
        const newQ = { ...router.query };
        if (!selectedCommitmentType.length) {
          delete newQ.commitmentType;
        } else {
          newQ.commitmentType = selectedCommitmentType.join(",");
        }
        router.replace({
          query: newQ,
        });
      }}
    />
  );
}
