import {
  BuildingOfficeIcon,
  CakeIcon,
  MagnifyingGlassIcon,
  ShoppingCartIcon,
  WrenchScrewdriverIcon,
} from "@heroicons/react/24/outline";
import { FaGraduationCap, FaPallet, FaRegHospital } from "react-icons/fa";

// Component for individual button items
export const BrowseCategory = ({
  icon: Icon,
  label,
  category,
  onCategorySelect,
  isSelected, // Add an `isSelected` prop to determine if the category is selected
}) => {
  return (
    <button
      className={`flex flex-none items-center space-x-2 rounded font-medium p-2 ${
        isSelected
          ? "bg-yellow-600 text-white shadow-inner" // Changed to a lighter blue color with white text
          : "border shadow-md" // Softened the border color
      } transition-colors`}
      onClick={() => {
        onCategorySelect(category);
      }}
    >
      <Icon className="w-4 h-4" />
      <span>{label}</span>
    </button>
  );
};

// Define your categories and their properties in an array
export const browseCategories = [
  {
    label: "All Jobs",
    category: "all",
    icon: MagnifyingGlassIcon,
  },
  {
    label: "Corporate & Tech",
    category: "corporate",
    icon: BuildingOfficeIcon,
  },
  {
    label: "Healthcare Services",
    category: "healthcare-services",
    icon: FaRegHospital,
  },
  {
    label: "Education Services",
    category: "education-services",
    icon: FaGraduationCap,
  },
  {
    label: "Retail Services",
    category: "retail-services",
    icon: ShoppingCartIcon,
  },
  {
    label: "Transportation & Logistics",
    category: "transportation-and-logistics",
    icon: FaPallet,
  },
  {
    label: "Maintenance and Repair",
    category: "maintenance-and-repair",
    icon: WrenchScrewdriverIcon,
  },
  {
    label: "Food & Beverage",
    category: "food-and-beverage-services",
    icon: CakeIcon,
  },
];
