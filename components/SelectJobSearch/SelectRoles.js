import { useRouter } from "next/router";
import Select from "react-select";

const jobRoles = [
  { value: "Engineering", label: "Engineering" },
  { value: "Data Science", label: "Data Science" },
  { value: "Sales", label: "Sales" },
  { value: "Marketing", label: "Marketing" },
  { value: "Product", label: "Product" },
  { value: "Design", label: "Design" },
  { value: "Business Operations", label: "Business Operations" },
  { value: "Recruiting & HR", label: "Recruiting & HR" },
  { value: "Finance", label: "Finance" },
  { value: "Customer Support", label: "Customer Support" },
  { value: "Project Management", label: "Project Management" },
  { value: "Legal", label: "Legal" },
  {
    value: "Science",
    label: "Science",
  },
  {
    value: "Administrative Services",
    label: "Administrative",
  },
  {
    value: "Operations Management",
    label: "Operations Management",
  },
];

export default function SelectRoles() {
  const router = useRouter();

  const selectedRoles = (router.query.selectedRoles || "").split(",");

  return (
    <Select
      defaultValue={jobRoles.filter((role) =>
        selectedRoles.includes(role.value)
      )}
      value={jobRoles.filter((role) => selectedRoles.includes(role.value))}
      isMulti
      name="colors"
      options={jobRoles}
      onChange={(selectedOptions) => {
        const selectedRoles = selectedOptions.map((option) => option.value);
        // If selected option includes "Recruiting & HR", add "Human Resources" to the selected roles
        if (selectedRoles.includes("Recruiting & HR")) {
          selectedRoles.push("Human Resources");
        }
        const newQ = { ...router.query };
        if (!selectedRoles.length) {
          delete newQ.selectedRoles;
        } else {
          newQ.selectedRoles = selectedRoles.join(",");
        }
        router.replace({
          query: newQ,
        });
      }}
    />
  );
}
